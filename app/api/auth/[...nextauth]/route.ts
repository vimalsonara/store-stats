import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

interface Users {
  id: string;
  email: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session }) {
      const userRef = collection(db, "users");
      let users: Users[] = [];

      try {
        const snapshot = await getDocs(userRef);

        snapshot.docs.forEach((doc) => {
          const userData = doc.data();
          const user: Users = {
            id: doc.id,
            email: userData.email,
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
    async signIn({ profile }) {
      const userRef = collection(db, "users");
      const emailCondition = where("email", "==", profile?.email);
      const q = query(userRef, emailCondition);

      try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          const createdAt = serverTimestamp();
          const newUserDoc = await addDoc(userRef, {
            email: profile?.email,
            name: profile?.name,
            createdAt,
          });
        }

        return true;
      } catch (error) {
        console.log("error", error);
        return false;
      }
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
