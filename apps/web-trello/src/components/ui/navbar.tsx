"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut, useSession } from "next-auth/react";

import { LogOut, Settings, User, Users } from "lucide-react";

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
import { CreateBoard } from "./boardComponent/add-board";
import Account from "./account";

function Navbar() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="w-full h-14 flex justify-between items-center text-white px-4 sm:px-10 border-b-[.2px] border-gray-700 bg-gray-950 z-[99999999] sticky">
      <div className="flex items-center justify-between w-full md:w-1/2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <h2 className="hidden sm:block">Rails</h2>
        </Link>
        {/* {user && ( */}
        <div className="flex items-center gap-4">
          <NavigationMenuDemo />
          {/* <CreateBoard /> */}
        </div>
        {/* )} */}
      </div>
      <div className="hidden md:flex items-center gap-4">
        <Account />
      </div>
    </div>
  );
}

export default Navbar;
