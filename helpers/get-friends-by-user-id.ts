import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  const friendsIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];

  const friends: User[] = await Promise.all(
    friendsIds.map(async (friendId) => {
      const friend = (await fetchRedis("get", `user:${friendId}`)) as string;

      return JSON.parse(friend);
    })
  );

  return friends;
};
