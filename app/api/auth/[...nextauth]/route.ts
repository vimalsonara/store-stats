import db from "@/config/db";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }
        const { id, email, name, password } = user;
        return { id: id.toString(), email, name, password };
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        const sessionUser = await db.user.findUnique({
          where: { email: session.user.email },
        });

        if (sessionUser) {
          session.user.id = sessionUser.id.toString();
        }
      } catch (error: any) {
        console.log(error.message);
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
