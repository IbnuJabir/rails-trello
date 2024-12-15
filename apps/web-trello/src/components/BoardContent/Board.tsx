"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAtom } from "jotai";
import { boardAtom, listsAtom, cardsAtom } from "@/lib/atoms";
import { trpc } from "@/server/client";
import List from "./List";
import Card from "./Card";
import { coordinateGetter as multipleContainersCoordinateGetter } from "./multipleContainersKeyboardCoordinates";

export default function Board({ boardId }) {
  const [board, setBoard] = useAtom(boardAtom);
  const [lists, setLists] = useAtom(listsAtom);
  const [cards, setCards] = useAtom(cardsAtom);
  const [activeId, setActiveId] = useState(null);
  console.log("board from jotai:", board);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: multipleContainersCoordinateGetter,
    })
  );
  const { data, error, isLoading } = trpc.board.getBoard.useQuery({ boardId });
  // const List = trpc.list.getAll.useQuery({ boardId: board?.id });
  // const listId = List.data;
  // console.log("listId", listId);
  // Update card in the database
  const card = trpc.card.update.useMutation();
  // const getCard = trpc.card.
  const utils = trpc.useUtils();
  // ca;
  useEffect(() => {
    utils.board.getBoard.fetch({ boardId }).then(setBoard);
    utils.list.getAll.fetch({ boardId }).then(setLists);
    utils.card.getAll.fetch({ boardId }).then(setCards);
  }, [boardId]);

  function handleDragStart(event) {
    const { active } = event;
    setActiveId(active.id);
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeListId = active.data.current.sortable.containerId;
    const overListId = over.data.current?.sortable.containerId || over.id;

    if (activeListId !== overListId) {
      setLists((lists) => {
        const activeIndex = lists.findIndex((l) => l.id === activeListId);
        const overIndex = lists.findIndex((l) => l.id === overListId);

        return arrayMove(lists, activeIndex, overIndex);
      });
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const activeListId = active.data.current.sortable.containerId;
    const overListId = over.data.current?.sortable.containerId || over.id;

    if (activeListId !== overListId) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((c) => c.id === active.id);
        const overIndex = cards.findIndex((c) => c.id === over.id);

        return arrayMove(cards, activeIndex, overIndex).map((card, index) => {
          if (card.id === active.id) {
            return { ...card, listId: overListId, position: overIndex };
          }
          return card;
        });
      });

      card.mutate({
        id: active.id,
        listId: overListId,
        position: cards.filter((c) => c.listId === overListId).length,
      });
    }

    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex overflow-x-auto p-4 space-x-4">
        <SortableContext
          items={lists.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {lists.map((list) => (
            <List
              key={list.id}
              list={list}
              cards={cards.filter((c) => c.id === list.id)}
            />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeId ? (
          <Card card={cards.find((c) => c.id === activeId)} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
