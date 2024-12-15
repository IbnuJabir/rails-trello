// "use client";
// import React, { useCallback, useState } from "react";
// import {
//   DndContext,
//   DragOverlay,
//   closestCorners,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   arrayMove,
//   horizontalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { useAtom } from "jotai";
// import { boardAtom } from "@/lib/atoms";
// import { TrelloList } from "./trello-list";
// import { TrelloCard } from "./trello-card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Plus } from "lucide-react";

// export function TrelloBoard() {
//   const [board, setBoard] = useAtom(boardAtom);
//   const [newListTitle, setNewListTitle] = useState("");
//   const [activeId, setActiveId] = useState<string | null>(null);

//   const sensors = useSensors(useSensor(PointerSensor));

//   const handleDragStart = (event: any) => {
//     setActiveId(event.active.id);
//   };

//   const handleDragEnd = (event: any) => {
//     const { active, over } = event;

//     if (!over) return;

//     if (active.id.startsWith("list-") && over.id.startsWith("list-")) {
//       setBoard((board) => {
//         const oldIndex = board.lists.findIndex((list) => list.id === active.id);
//         const newIndex = board.lists.findIndex((list) => list.id === over.id);

//         return {
//           ...board,
//           lists: arrayMove(board.lists, oldIndex, newIndex),
//         };
//       });
//     } else if (active.id.startsWith("card-")) {
//       setBoard((board) => {
//         const activeListId = board.lists.find((list) =>
//           list.cards.some((card) => card.id === active.id)
//         )?.id;
//         const overListId = over.id.startsWith("list-")
//           ? over.id
//           : board.lists.find((list) =>
//               list.cards.some((card) => card.id === over.id)
//             )?.id;

//         if (activeListId === undefined || overListId === undefined)
//           return board;

//         const activeCardIndex = board.lists
//           .find((list) => list.id === activeListId)
//           ?.cards.findIndex((card) => card.id === active.id);

//         if (activeCardIndex === undefined) return board;

//         const updatedLists = board.lists.map((list) => {
//           if (list.id === activeListId) {
//             return {
//               ...list,
//               cards: list.cards.filter((card) => card.id !== active.id),
//             };
//           }
//           if (list.id === overListId) {
//             const overCardIndex = over.id.startsWith("card-")
//               ? list.cards.findIndex((card) => card.id === over.id)
//               : list.cards.length;
//             const newCards = [...list.cards];
//             newCards.splice(
//               overCardIndex,
//               0,
//               board.lists.find((l) => l.id === activeListId)!.cards[
//                 activeCardIndex
//               ]
//             );
//             return {
//               ...list,
//               cards: newCards,
//             };
//           }
//           return list;
//         });

//         return { ...board, lists: updatedLists };
//       });
//     }

//     setActiveId(null);
//   };

//   const handleDragOver = (event: any) => {
//     const { active, over } = event;

//     if (!over) return;

//     if (
//       active.id.startsWith("card-") &&
//       over.id.startsWith("card-") &&
//       active.id !== over.id
//     ) {
//       setBoard((board) => {
//         const activeListId = board.lists.find((list) =>
//           list.cards.some((card) => card.id === active.id)
//         )?.id;
//         const overListId = board.lists.find((list) =>
//           list.cards.some((card) => card.id === over.id)
//         )?.id;

//         if (activeListId === undefined || overListId === undefined)
//           return board;

//         const activeCardIndex = board.lists
//           .find((list) => list.id === activeListId)
//           ?.cards.findIndex((card) => card.id === active.id);
//         const overCardIndex = board.lists
//           .find((list) => list.id === overListId)
//           ?.cards.findIndex((card) => card.id === over.id);

//         if (activeCardIndex === undefined || overCardIndex === undefined)
//           return board;

//         const updatedLists = board.lists.map((list) => {
//           if (list.id === activeListId) {
//             const updatedCards = arrayMove(
//               list.cards,
//               activeCardIndex,
//               overCardIndex
//             );
//             return { ...list, cards: updatedCards };
//           }
//           return list;
//         });

//         return { ...board, lists: updatedLists };
//       });
//     }
//   };

//   const addNewList = () => {
//     if (newListTitle.trim() === "") return;

//     const newList = {
//       id: `list-${1}`,
//       title: newListTitle,
//       cards: [],
//     };

//     setBoard((prevBoard) => ({
//       ...prevBoard,
//       lists: [...prevBoard.lists, newList],
//     }));
//     setNewListTitle("");
//   };
//   const handleDragCancel = useCallback(() => {
//     setActiveId(null);
//   }, []);
//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCorners}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//       onDragOver={handleDragOver}
//       onDragCancel={handleDragCancel}
//     >
//       <div className="flex overflow-x-auto py-4 space-x-4 min-h-[calc(100vh-64px)]">
//         <SortableContext
//           items={board.lists.map((list) => list.id)}
//           strategy={horizontalListSortingStrategy}
//         >
//           {board.lists.map((list) => (
//             <TrelloList key={list.id} list={list} boardId={board.id} />
//           ))}
//         </SortableContext>
//         <div className="bg-gray-100 p-2 rounded-lg shadow-sm min-w-[272px] h-fit">
//           <Input
//             type="text"
//             placeholder="Enter list title..."
//             value={newListTitle}
//             onChange={(e) => setNewListTitle(e.target.value)}
//             className="mb-2"
//           />
//           <Button onClick={addNewList} className="w-full">
//             <Plus className="h-4 w-4 mr-2" /> Add List
//           </Button>
//         </div>
//       </div>
//       <DragOverlay>
//         {activeId && activeId.startsWith("card-") && (
//           <TrelloCard
//             card={
//               board.lists
//                 .flatMap((list) => list.cards)
//                 .find((card) => card.id === activeId)!
//             }
//           />
//         )}
//         {activeId && activeId.startsWith("list-") && (
//           <TrelloList
//             list={board.lists.find((list) => list.id === activeId)!}
//             boardId={board.id}
//             isDragging
//           />
//         )}
//       </DragOverlay>
//     </DndContext>
//   );
// }
