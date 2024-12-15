import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Card } from "@/types/trello";

interface TrelloCardProps {
  card: Card;
}

export function TrelloCard({ card }: TrelloCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-2 mb-2 rounded shadow-sm cursor-move"
    >
      {card.content}
    </div>
  );
}
