export interface Card {
  id: string;
  content: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  lists: List[];
}
