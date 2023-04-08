import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";

function geGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Google client ID or secret not found. Please add them to your .env.local file."
    );
  }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: geGoogleCredentials().clientId,
      clientSecret: geGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${token.id}`)) as {
        user: User;
      } | null;

      if (!dbUser || !dbUser.user) {
        if (user) {
          token.id = user!.id;
        }

        return token;
      }

      return {
        id: dbUser.user.id || token.id,
        name: dbUser.user.name,
        email: dbUser.user.email,
        image: dbUser.user.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
        };
      }

      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
