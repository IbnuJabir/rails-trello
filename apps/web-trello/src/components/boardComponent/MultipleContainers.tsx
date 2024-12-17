"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CancelDrop,
  closestCenter,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  Modifiers,
  // useDroppable,
  UniqueIdentifier,
  useSensors,
  useSensor,
  // MeasuringStrategy,
  KeyboardCoordinateGetter,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  AnimateLayoutChanges,
  SortableContext,
  useSortable,
  arrayMove,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
  SortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { coordinateGetter as multipleContainersCoordinateGetter } from "./multipleContainersKeyboardCoordinates";

import { Item } from "../Item";
import { Container, ContainerProps } from "../Container";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Plus } from "lucide-react";
import { useAtom } from "jotai";
import { boardAtom, listsAtom, cardsAtom } from "@/lib/atoms";
import { trpc } from "@/server/client";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { Edit, Edit2, Edit2Icon, TrashIcon } from "lucide-react";

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

function DroppableContainer({
  children,
  columns = 1,
  disabled,
  id,
  items,
  style,
  ...props
}: ContainerProps & {
  disabled?: boolean;
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  style?: React.CSSProperties;
}) {
  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: "container",
      children: items,
    },
    animateLayoutChanges,
  });
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== "container") ||
      items.includes(over.id)
    : false;

  return (
    <Container
      ref={disabled ? undefined : setNodeRef}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      hover={isOverContainer}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      columns={columns}
      {...props}
    >
      {children}
    </Container>
  );
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

interface Props {
  boardId?: string;
  adjustScale?: boolean;
  cancelDrop?: CancelDrop;
  columns?: number;
  containerStyle?: React.CSSProperties;
  coordinateGetter?: KeyboardCoordinateGetter;
  getItemStyles?(args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }): React.CSSProperties;
  wrapperStyle?(args: { index: number }): React.CSSProperties;
  minimal?: boolean;
  modifiers?: Modifiers;
  // renderItem?: any;
  strategy?: SortingStrategy;
  vertical?: boolean;
}

export const TRASH_ID = "void";
const PLACEHOLDER_ID = "placeholder";
const empty: UniqueIdentifier[] = [];

export function MultipleContainers({
  adjustScale = false,
  cancelDrop,
  columns,
  containerStyle,
  coordinateGetter = multipleContainersCoordinateGetter,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  minimal = false,
  modifiers,
  // renderItem,
  strategy = verticalListSortingStrategy,
  vertical = false,
}: Props) {
  const [, setBoard] = useAtom(boardAtom);
  const [lists, setLists] = useAtom(listsAtom);
  const [cards, setCards] = useAtom(cardsAtom);

  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId;
  console.log("board ID from the child", params.boardId);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const [items, setItems] = useState<Items>({});
  const [containers, setContainers] = useState<UniqueIdentifier[]>([]);
  const utils = trpc.useUtils();
  const createList = trpc.list.create.useMutation({
    onSuccess: () => {
      utils.list.getAll.invalidate({ boardId });
      // trpc.list.getAll.invalidate({ boardId });
    },
  });
  // const updateList = trpc.list.update.useMutation({
  //   onSuccess: () => {
  //     utils.list.getAll.invalidate({ boardId });
  //     // trpc.list.getAll.invalidate({ boardId });
  //   },
  // });
  const createCard = trpc.card.create.useMutation({
    onSuccess: () => {
      // trpc.card.getAll.invalidate({ boardId });
      utils.list.getAll.invalidate({ boardId });
    },
  });
  // const updateCard = trpc.card.update.useMutation({
  //   onSuccess: () => {
  //     // trpc.card.getAll.invalidate({ boardId });
  //     utils.list.getAll.invalidate({ boardId });
  //   },
  // });

  const updateCardPosition = trpc.card.updatePosition.useMutation();
  const updateListPositions = trpc.list.updateListPositions.useMutation();
  useEffect(() => {
    // Fetch board details and update state
    utils.board.getBoard.fetch({ boardId }).then(setBoard);
    utils.list.getAll.fetch({ boardId }).then(setLists);
    utils.card.getAll.fetch({ boardId }).then(setCards);
  }, [boardId]);

  useEffect(() => {
    const newItems: Items = {};
    const newContainers: UniqueIdentifier[] = [];

    lists.forEach((list) => {
      newContainers.push(list.id);
      newItems[list.id] = cards
        .filter((card) => card.listId === list.id)
        .map((card) => card.id);
    });

    setItems(newItems);
    setContainers(newContainers);
  }, [lists, cards]);

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (overId === TRASH_ID) {
          return intersections;
        }

        if (overId in items) {
          const containerItems = items[overId];

          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );

  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    const index = items[container].indexOf(id);

    return index;
  };

  const onDragCancel = () => {
    if (clonedItems) {
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  const [listName, setListName] = useState("");
  const handleAddList = async (name: string) => {
    if (name.trim() !== "") {
      const newList = await createList.mutateAsync({
        boardId,
        name,
        position: lists.length,
      });
      setLists((prev) => [...prev, newList]);
    }
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (listName.trim()) {
      handleAddList(listName);
      setListName(""); // Clear input after submission
    }
  };
  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && listName.trim()) {
      handleAddList(listName);
      setListName(""); // Clear input after pressing Enter
    }
  };

  const handleAddCard = async (listId: string, title: string) => {
    if (title.trim() !== "") {
      const newCard = await createCard.mutateAsync({
        listId,
        title,
        position: items[listId].length,
      });
      setCards((prev) => [...prev, newCard]);
    }
  };
  const updateAllList = trpc.list.updateAll.useMutation();
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editCardTitle, setEditCardTitle] = useState("");

  const handleEditCard = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      setEditingCardId(cardId);
      setEditCardTitle(card.title);
    }
  };

  const handleUpdateCard = (cardId: string) => {
    // Implement your update logic here
    // For example: updateCard(cardId, editCardTitle);
    setEditingCardId(null);
  };

  const handleDeleteCard = (cardId: string) => {
    // Implement your delete logic here
    // For example: deleteCard(cardId);
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        setClonedItems(items);
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id;

        if (overId == null || overId === TRASH_ID || active.id in items) {
          return;
        }

        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        if (!overContainer || !activeContainer) {
          return;
        }

        if (activeContainer !== overContainer) {
          setItems((items) => {
            const activeItems = items[activeContainer];
            const overItems = items[overContainer];
            const overIndex = overItems.indexOf(overId);
            const activeIndex = activeItems.indexOf(active.id);

            let newIndex: number;

            if (overId in items) {
              newIndex = overItems.length + 1;
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                  over.rect.top + over.rect.height;

              const modifier = isBelowOverItem ? 1 : 0;

              newIndex =
                overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            recentlyMovedToNewContainer.current = true;

            const data = {
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (item) => item !== active.id
              ),
              [overContainer]: [
                ...items[overContainer].slice(0, newIndex),
                items[activeContainer][activeIndex],
                ...items[overContainer].slice(
                  newIndex,
                  items[overContainer].length
                ),
              ],
            };
            console.log("Drag End data", data);
            updateAllList.mutate(data);
            return data;
          });
        }
      }}
      onDragEnd={async ({ active, over }) => {
        if (active.id in items && over?.id) {
          setContainers((containers) => {
            const activeIndex = containers.indexOf(active.id);
            const overIndex = containers.indexOf(over.id);

            // return arrayMove(containers, activeIndex, overIndex);
            if (activeIndex !== -1 && overIndex !== -1) {
              const newContainers = arrayMove(
                containers,
                activeIndex,
                overIndex
              );

              // Update list positions
              // const newLists = arrayMove(lists, activeIndex, overIndex);
              // for (let i = 0; i < newLists.length; i++) {
              //   updateList.mutate({
              //     id: newLists[i].id,
              //     position: i,
              //   });
              // }
              updateListPositions.mutate(newContainers);
              console.log("newContainers", newContainers);
              return newContainers;
            }

            return containers;
          });
        }

        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
          setActiveId(null);
          return;
        }

        const overId = over?.id;

        if (overId == null) {
          setActiveId(null);
          return;
        }

        if (overId === TRASH_ID) {
          // Handle card deletion
          setItems((items) => ({
            ...items,
            [activeContainer]: items[activeContainer].filter(
              (id) => id !== activeId
            ),
          }));
          setActiveId(null);
          return;
        }

        if (overId === PLACEHOLDER_ID) {
          // Handle moving to a new list (not implemented in this example)
          setActiveId(null);
          return;
        }

        const overContainer = findContainer(overId);

        if (overContainer) {
          const activeIndex = items[activeContainer].indexOf(active.id);
          const overIndex = items[overContainer].indexOf(overId);

          if (activeIndex !== overIndex) {
            setItems((items) => ({
              ...items,
              [overContainer]: arrayMove(
                items[overContainer],
                activeIndex,
                overIndex
              ),
            }));

            // Update card positions
            const newCards = arrayMove(
              cards.filter((card) => card.listId === overContainer),
              activeIndex,
              overIndex
            );
            for (let i = 0; i < newCards.length; i++) {
              await updateCardPosition.mutateAsync({
                id: newCards[i].id,
                position: i,
                listId: overContainer,
              });
            }
          }
        }

        setActiveId(null);
      }}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <div
        style={{
          display: "grid",
          boxSizing: "border-box",
          padding: 20,
          gridAutoFlow: vertical ? "row" : "column",
        }}
      >
        <SortableContext
          items={[...containers, PLACEHOLDER_ID]}
          strategy={
            vertical
              ? verticalListSortingStrategy
              : horizontalListSortingStrategy
          }
        >
          {containers.map((containerId) => (
            <DroppableContainer
              key={containerId}
              id={containerId}
              label={
                minimal
                  ? undefined
                  : lists.find((list) => list.id === containerId)?.name ||
                    `List ${containerId}`
              }
              columns={columns}
              items={items[containerId]}
              style={containerStyle}
              unstyled={minimal}
            >
              <SortableContext items={items[containerId]} strategy={strategy}>
                {items[containerId].map((value, index) => {
                  const card = cards.find((card) => card.id === value);
                  return (
                    <div className="w-full mb-2" key={value}>
                      <SortableItem
                        disabled={false}
                        key={value}
                        id={value}
                        index={index}
                        handle={true}
                        wrapperStyle={wrapperStyle}
                        renderItem={() => (
                          <div className="w-full p-2 bg-white rounded shadow group">
                            <div className="flex items-center justify-between">
                              <div className="flex-grow cursor-grab">
                                {card?.title}
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditCard(card?.id)}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  <Edit2Icon className="size-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCard(card?.id)}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  <TrashIcon className="size-4" />
                                </button>
                              </div>
                            </div>
                            {editingCardId === card?.id && (
                              <div className="mt-2">
                                <input
                                  type="text"
                                  value={editCardTitle}
                                  onChange={(e) =>
                                    setEditCardTitle(e.target.value)
                                  }
                                  className="w-full p-1 border rounded"
                                />
                                <div className="flex justify-end mt-1 space-x-2">
                                  <button
                                    onClick={() => handleUpdateCard(card?.id)}
                                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                  >
                                    Update
                                  </button>
                                  <button
                                    onClick={() => setEditingCardId(null)}
                                    className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        containerId={containerId}
                        getIndex={getIndex}
                      />
                    </div>
                  );
                })}
              </SortableContext>

              <div className="p-2 flex items-center justify-center gap-2">
                <Input
                  placeholder="Add a card..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddCard(containerId, e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                {/* <Button type="submit">Add Card</Button> */}
              </div>
            </DroppableContainer>
          ))}
          {minimal ? undefined : (
            <DroppableContainer
              id={PLACEHOLDER_ID}
              disabled={activeId in items}
              items={empty}
              placeholder
            >
              <form
                onSubmit={onSubmit}
                className="p-2 flex items-center justify-center gap-2"
              >
                <Input
                  value={listName}
                  onChange={(e) => setListName(e.target.value)} // Update input value in state
                  placeholder="Add a list..."
                  onKeyPress={onKeyPress}
                />
                <Button type="submit">Add List</Button>
              </form>
            </DroppableContainer>
          )}
        </SortableContext>
      </div>
      <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
        {activeId
          ? containers.includes(activeId)
            ? renderContainerDragOverlay(activeId)
            : renderSortableItemDragOverlay(activeId)
          : null}
      </DragOverlay>
    </DndContext>
  );

  function renderSortableItemDragOverlay(id: UniqueIdentifier) {
    const card = cards.find((card) => card.id === id);
    return (
      <Item
        value={id}
        handle={false}
        style={getItemStyles({
          containerId: findContainer(id) as UniqueIdentifier,
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        wrapperStyle={wrapperStyle({ index: 0 })}
        renderItem={() => (
          <div className="p-2 bg-white rounded shadow">{card?.title}</div>
        )}
        dragOverlay
      />
    );
  }

  function renderContainerDragOverlay(containerId: UniqueIdentifier) {
    const list = lists.find((list) => list.id === containerId);
    return (
      <Container
        label={list?.name || `List ${containerId}`}
        columns={columns}
        style={{
          height: "100%",
        }}
        shadow
        unstyled={false}
      >
        {items[containerId].map((item, index) => {
          const card = cards.find((card) => card.id === item);
          return (
            <Item
              key={item}
              value={item}
              handle={false}
              style={getItemStyles({
                containerId,
                overIndex: -1,
                index: getIndex(item),
                value: item,
                isDragging: false,
                isSorting: false,
                isDragOverlay: false,
              })}
              wrapperStyle={wrapperStyle({ index })}
              renderItem={() => (
                <div className="p-2 bg-white rounded shadow">{card?.title}</div>
              )}
            />
          );
        })}
      </Container>
    );
  }
}

function SortableItem({
  disabled,
  id,
  index,
  handle,
  renderItem,
  // style,
  // containerId,
  // getIndex,
  wrapperStyle,
}: {
  containerId: UniqueIdentifier;
  disabled?: boolean;
  id: UniqueIdentifier;
  index: number;
  handle: boolean;
  renderItem(): React.ReactElement;
  // style(args: any): React.CSSProperties;
  getIndex(id: UniqueIdentifier): number;
  wrapperStyle({ index }: { index: number }): React.CSSProperties;
}) {
  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    // over,
    // overIndex,
    transform,
    transition,
    attributes,
  } = useSortable({
    id,
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;
  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };
  return (
    <div className="flex items-center">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="w-full"
      >
        <Item
          ref={disabled ? undefined : setNodeRef}
          value={id}
          dragging={isDragging}
          sorting={isSorting}
          handle={handle}
          handleProps={handle ? listeners : undefined}
          index={index}
          wrapperStyle={wrapperStyle({ index })}
          style={style}
          transition={transition}
          transform={transform}
          fadeIn={mountedWhileDragging}
          listeners={handle ? undefined : listeners}
          renderItem={renderItem}
        />
      </div>
    </div>
  );
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
