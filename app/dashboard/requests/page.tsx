import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface RequestsProps {}

const Requests = async ({}: RequestsProps) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const incomingSendersIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFrienddRequests = await Promise.all(
    incomingSendersIds.map(async (senderId) => {
      const senderResult = (await fetchRedis(
        "get",
        `user:${senderId}`
      )) as string;
      const sender = JSON.parse(senderResult) as User;

      return {
        senderId,
        senderEmail: sender.email,
      };
    })
  );
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFrienddRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default Requests;
