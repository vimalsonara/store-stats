import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

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

        const userRef = collection(db, "users");
        let users: User[] = [];

        const snapshot = await getDocs(userRef);

        snapshot.docs.forEach((doc) => {
          const userData = doc.data();
          const user: User = {
            id: doc.id,
            email: userData.email,
            password: userData.password,
            name: userData.name,
          };
          users.push(user);
        });

        const user = users.find((user) => user.email === credentials.email);

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
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const userRef = collection(db, "users");
      let users: User[] = [];

      try {
        const snapshot = await getDocs(userRef);

        snapshot.docs.forEach((doc) => {
          const userData = doc.data();
          const user: User = {
            id: doc.id,
            email: userData.email,
            name: userData.name,
            password: userData.password,
          };
          users.push(user);
        });

        const sessionUser = users.find(
          (user) => user.email === session.user.email
        );

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
