import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from './Card';
import { trpc } from '@/server/client';
import { useAtom } from 'jotai';
import { cardsAtom } from '@/lib/atoms';
import { Input } from '@/components/ui/input';

export default function List({ list, cards }) {
  const [, setCards] = useAtom(cardsAtom);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: list.id });

  const createCard = trpc.card.create.useMutation({
    onSuccess: (newCard) => {
      setCards((prev) => [...prev, newCard]);
    },
  });

  const handleAddCard = async (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      await createCard.mutateAsync({
        listId: list.id,
        title: e.target.value.trim(),
        position: cards.length,
      });
      e.target.value = '';
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-gray-100 p-4 rounded-lg w-72">
      <h2 className="font-bold mb-4">{list.name}</h2>
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
      <Input
        className="mt-4"
        placeholder="Add a card..."
        onKeyPress={handleAddCard}
      />
    </div>
  );
}

