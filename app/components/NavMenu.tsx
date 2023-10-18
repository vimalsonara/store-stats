"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <ul className="flex gap-2 justify-around border-b-2 p-2">
          <li>
            <Link href={"/"}>Dashboard</Link>
          </li>
          <li>
            <Link href={"/vendor/create"}>Add Vendor</Link>
          </li>
          <li>
            <Link href={"/product/create"}>Add Product</Link>
          </li>
          <li>
            <Link href={"/purchaseEntry/add"}>New Purchase</Link>
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
