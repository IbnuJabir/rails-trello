"use client";
import { trpc } from "@/server/client";
import { useParams } from "next/navigation";
import React from "react";
import defaultBgImage from "@/assets/bg1.jpg";
import { TrelloBoardBar } from "@/components/boardComponent/boardNav";
import { MultipleContainers } from "@/components/boardComponent/MultipleContainers";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import LoadingPage from "@/app/loading";
function BoardDetail() {
  const params = useParams<{ boardId: string }>();
  console.log("boardId from params", params.boardId);

  const { data, isLoading, error } = trpc.board.getBoard.useQuery({
    boardId: params.boardId,
  });

  // const [board, setBoard] = useAtom(boardAtom);
  // setBoard(data);

  console.log("current board data", data);

  // Resolve the background image
  const bgImage = data?.bgImage
    ? `${process.env.NEXT_PUBLIC_TRPC_BASE_URL}${data.bgImage}`
    : defaultBgImage;

  // console.log("bgImage", bgImage);
  if (isLoading) {
    return <LoadingPage />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div
      className="w-full bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }} // Dynamically set the background image
    >
      <TrelloBoardBar
        boardTitle={data?.name}
        isStarred={false}
        visibility={"private"}
      />
      <div className="w-full">
        <main className="py-4 overflow-x-scroll">
          {/* <TrelloBoard /> */}
          {/* <MultiContainer /> */}
          <MultipleContainers
            // itemCount={5}
            strategy={rectSortingStrategy}
            vertical={false}
            boardId={params.boardId}
          />
          {/* <BoardContent boardId={data?.id} /> */}
        </main>
      </div>
    </div>
  );
}

export default BoardDetail;
