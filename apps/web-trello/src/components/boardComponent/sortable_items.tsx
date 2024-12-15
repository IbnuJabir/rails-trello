"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { DraggableSyntheticListeners } from "@dnd-kit/core";

// Define prop types
interface ItemProps {
  id: string | number;
}

export function Item({ id }: ItemProps) {
  const style: React.CSSProperties = {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    margin: "10px 0",
    background: "white",
  };

  return <div style={style}>{id}</div>;
}

interface SortableItemProps {
  id: string | number;
}

export default function SortableItem({ id }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item id={id} />
    </div>
  );
}
