export interface CardItem {
  id: string;
  title: string;
  details: string;
}

export interface ColumnItem {
  id: string;
  title: string;
  cards: CardItem[];
}

export interface BoardData {
  columns: ColumnItem[];
}
