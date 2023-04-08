const upstashREdisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
): Promise<any> {
  const response = await fetch(
    `${upstashREdisRestUrl}/${command}/${args.join("/")}`,
    {
      headers: {
        Authorization: `Bearer ${upstashRedisRestToken}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status}:}`);
  }

  const data = await response.json();
  return data.result;
}
