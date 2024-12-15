import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
  card: {
    id: string;
    title: string;
  };
  isDragging?: boolean;
}

export default function Card({ card, isDragging = false }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!card) return <div>Card is missing</div>;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-2 mb-2 rounded shadow cursor-grab"
    >
      {card.title}
    </div>
  );
}
