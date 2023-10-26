"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "./themeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AuthButton() {
  const { data: session } = useSession();
  if (session) {
    console.log("session", session);
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session?.user.image} />
                  <AvatarFallback>{session?.user.name}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Dark Mode
                  <ThemeToggle />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
