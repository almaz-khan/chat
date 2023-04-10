import { fetchRedis } from "@/helpers/redis";
import { toPusherKey } from "@/helpers/to-pusher-key";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { addFriendValidator } from "@/lib/validators/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body);

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    if (!idToAdd) {
      return new Response("User not found", {
        status: 404,
      });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    if (idToAdd === session.user.id) {
      return new Response("You can't add yourself", {
        status: 400,
      });
    }

    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response("You have already sent a friend request", {
        status: 400,
      });
    }

    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:friends`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyFriend) {
      return new Response("You are already friends", {
        status: 400,
      });
    }

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    console.log(toPusherKey(`user:${idToAdd}:incoming_friend_requests`));

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_request",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, {
        status: 422,
      });
    }
  }
}
