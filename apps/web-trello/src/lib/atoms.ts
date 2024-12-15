import { atom } from "jotai";
import { Board, List, Card } from "@prisma/client";

export const boardAtom = atom<Board | null>(null);
export const listsAtom = atom<List[]>([]);
export const cardsAtom = atom<Card[]>([]);
