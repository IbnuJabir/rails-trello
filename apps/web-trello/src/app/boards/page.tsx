"use client";
import { CreateBoard } from "@/components/board/add-board";
import { trpc } from "@/server/client";
import React from "react";

function Boards() {
  const { data, isLoading, error } = trpc.board.getBoards.useQuery();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.shape?.message}</p>;
  console.log("boards", data);
  return (
    <div>
      <CreateBoard />
      <h1>Boards</h1>
      <p>This is the boards page</p>
    </div>
  );
}

export default Boards;
