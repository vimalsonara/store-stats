"use client";

import { useSession, signIn, signOut } from "next-auth/react";
export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  return <div>Hello</div>;
}
