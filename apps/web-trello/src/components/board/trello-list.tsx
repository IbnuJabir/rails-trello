// "use client";
// import React, { useState } from "react";
// import { useDroppable } from "@dnd-kit/core";
// import {
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { useAtom } from "jotai";
// import { boardAtom } from "@/lib/atoms";
// import { List, Card } from "@/types/trello";
// import { TrelloCard } from "./trello-card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Plus, MoreHorizontal } from "lucide-react";
// import { set } from "zod";

// interface TrelloListProps {
//   list: List;
//   boardId: string;
//   isDragging?: boolean;
// }

// export function TrelloList({ list, boardId, isDragging }: TrelloListProps) {
//   const [newCardContent, setNewCardContent] = useState("");
//   const [board, setBoard] = useAtom(boardAtom);
//   const { setNodeRef: setDroppableNodeRef } = useDroppable({
//     id: list.id,
//   });

//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: list.id });

//   const style: React.CSSProperties = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   const addNewCard = () => {
//     if (newCardContent.trim() === "") return;

//     const newCard: Card = {
//       id: "card-1",
//       content: newCardContent,
//     };

//     setBoard((prevBoard) => ({
//       ...prevBoard,
//       lists: prevBoard.lists.map((l) =>
//         l.id === list.id ? { ...l, cards: [...l.cards, newCard] } : l
//       ),
//     }));
//     setNewCardContent("");
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     console.log("text", e.currentTarget.value);
//     setNewCardContent(e.target.value);
//   };

//   const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       addNewCard();
//     }
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <div
//         ref={setDroppableNodeRef}
//         className="bg-gray-100 p-2 rounded-lg shadow-sm min-w-[272px] max-h-[calc(100vh-96px)] flex flex-col ml-4"
//       >
//         <div className="flex justify-between items-center mb-2">
//           <h3 className="text-sm font-semibold">{list.title}</h3>
//           <Button variant="ghost" size="sm">
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </div>
//         <div className="flex-grow overflow-y-auto">
//           <SortableContext
//             items={list.cards.map((card) => card.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {list.cards.map((card) => (
//               <TrelloCard key={card.id} card={card} />
//             ))}
//           </SortableContext>
//         </div>
//         <div className="mt-2">
//           <Input
//             type="text"
//             placeholder="Enter card content..."
//             value={newCardContent}
//             onChange={(e) => setNewCardContent(e.target.value)}
//             className="mb-2"
//             onKeyDown={handleInputKeyPress}
//           />
//           <Button onClick={addNewCard} className="w-full">
//             <Plus className="h-4 w-4 mr-2" /> Add Card
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
