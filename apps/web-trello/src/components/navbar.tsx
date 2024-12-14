"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import getSession from "@/lib/getSession";
import { trpc } from "@/server/client";
import { signOut, useSession } from "next-auth/react";

import { LogOut, Settings, User, UserPlus, Users } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { NavigationMenuDemo } from "./nav-menus";
import { CreateBoard } from "./board/add-board";
function Navbar() {
  const session = useSession();
  const user = session.data?.user;
  // console.log("user from session", user);
  return (
    <div className="w-full h-14 flex justify-between items-center  text-white px-10 border-b-[.2px] border-gray-700 bg-gray-950 ">
      <div className="flex items-center justify-between w-1/2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <h2>Rails</h2>
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <NavigationMenuDemo />
            <CreateBoard />
          </div>
        )}
      </div>
      <div>
        {session.status === "loading" && (
          <Skeleton className="h-12 w-12 rounded-full" />
        )}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={user.image || "https://github.com/shadcn.png"}
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Users />
                  <span>Team</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!user && session.status !== "loading" && (
          <Link href="signup">
            <Button className="bg-white text-black hover:bg-gray-300">
              Sign Up
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
