"use client";

import React from "react";
import {
  Star,
  Lock,
  Users,
  Sparkles,
  MoreHorizontal,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TrelloBoardBarProps {
  boardTitle?: string;
  isStarred?: boolean;
  visibility?: "private" | "workspace" | "public";
}

export function TrelloBoardBar({
  boardTitle,
  isStarred = false,
  visibility = "private",
}: TrelloBoardBarProps) {
  const [starred, setStarred] = React.useState(isStarred);

  const handleStarClick = () => {
    setStarred(!starred);
    // Here you would typically also update this on the server
  };

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-black bg-opacity-50 text-white">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">{boardTitle}</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStarClick}
          className={`hover:bg-white hover:text-black ${starred ? "text-yellow-400" : "text-white"}`}
        >
          <Star className="h-5 w-5" />
        </Button>
        <div className="hidden sm:flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-white hover:text-black"
          >
            {visibility === "private" && <Lock className="h-4 w-4 mr-2" />}
            {visibility === "workspace" && <Users className="h-4 w-4 mr-2" />}
            {visibility === "public" && <Globe className="h-4 w-4 mr-2" />}
            {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-white hover:text-black"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Automation</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-white hover:text-black"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Board Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              About this board
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Change background
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Copy board
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Close board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
