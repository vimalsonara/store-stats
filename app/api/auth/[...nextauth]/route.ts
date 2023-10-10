import connectDB from "@/lib/db";
import User from "@/models/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id;
      return session;
    },
    async signIn({ profile }) {
      console.log(profile);
      try {
        await connectDB();

        const userExist = await User.findOne({ email: profile.email });
        if (!userExist) {
          const user = await User.create({
            email: profile.email,
            name: profile.name,
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
