"use client";
import { trpc } from "@/server/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import emptyBoard from "@/assets/no-board.webp";
import LoadingPage from "../loading";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
function Boards() {
  const session = useSession();
  console.log("session", session);

  const { data, isLoading, error } = trpc.board.getBoards.useQuery();

  // const use = trpc.user.getUsers.useQuery();
  if (isLoading || session.status === "loading") return <LoadingPage />;

  // console.log("boards", data);
  if (!session.data) return redirect("/login");

  if (data?.length === 0)
    return (
      <div className="w-full h-screen p-4 flex flex-col items-center justify-center relative z-10">
        <Image
          src={emptyBoard}
          alt="background"
          fill
          className="object-cover -z-50 rounded-sm"
        />
      </div>
    );
  if (error) return <p>Error: {error.shape?.message}</p>;
  return (
    <div className="w-full p-4">
      <h1>Boards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full h-full">
        {data?.map((board) => (
          <Link
            href={`/boards/${board.id}`}
            key={board.id}
            className="relative w-full h-32 rounded-sm z-10 cursor-pointer"
          >
            <Image
              src={board.bgImage || "/bg1.jpg"}
              alt="board background "
              fill
              className="object-cover -z-50 rounded-sm hover:bg-slate-500"
            />
            <h2 className="text-white font-ubuntu font-bold m-4">
              {board.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Boards;
