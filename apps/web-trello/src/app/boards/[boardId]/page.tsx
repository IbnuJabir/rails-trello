"use client";
import { trpc } from "@/server/client";
import { redirect, useParams } from "next/navigation";
import React from "react";
import defaultBgImage from "@/assets/bg1.jpg";
import { TrelloBoardBar } from "@/components/boardComponent/boardNav";
import { MultipleContainers } from "@/components/boardComponent/MultipleContainers";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import LoadingPage from "@/app/loading";
import { useSession } from "next-auth/react";
function BoardDetail() {
  const session = useSession();

  const params = useParams<{ boardId: string }>();

  const { data, isLoading, error } = trpc.board.getBoard.useQuery({
    boardId: params.boardId,
  });

  // Resolve the background image
  const bgImage = data?.bgImage
    ? `${process.env.NEXT_PUBLIC_TRPC_BASE_URL}${data.bgImage}`
    : defaultBgImage;

  if (isLoading || session.status === "loading") return <LoadingPage />;

  if (!session.data) return redirect("/login");

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }} // Dynamically set the background image
    >
      <TrelloBoardBar
        boardTitle={data?.name}
        isStarred={false}
        visibility={"private"}
      />
      <div className="w-full">
        <main className="py-4 overflow-x-scroll">
          <MultipleContainers
            // itemCount={5}
            strategy={rectSortingStrategy}
            vertical={false}
            boardId={params.boardId}
          />
        </main>
      </div>
    </div>
  );
}

export default BoardDetail;
