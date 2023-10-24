"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <ul className="flex flex-col md:flex-row md:items-center gap-2 justify-around border-b-2 p-2">
          <li>
            <Link href={"/"}>Dashboard</Link>
          </li>
          <li>
            <Link href={"/vendor/list"}>Vendor</Link>
          </li>
          <li>
            <Link href={"/product/list"}>Product</Link>
          </li>
          <li>
            <Link href={"/purchase/list"}>Purchase</Link>
          </li>
          <li>
            <button onClick={() => signOut()}>Sign out</button>
          </li>
        </ul>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export default function Navmenu() {
  return (
    <div>
      <AuthButton />
    </div>
  );
}
