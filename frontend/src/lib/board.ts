export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  name: string;
  cards: Card[];
};

export const initialColumns: Column[] = [
  {
    id: "ideas",
    name: "Ideas",
    cards: [
      { id: "card-1", title: "Map the first release", details: "Capture the smallest useful version of the product." },
      { id: "card-2", title: "Collect customer signals", details: "Gather three conversations to shape the next decisions." },
    ],
  },
  {
    id: "planned",
    name: "Planned",
    cards: [{ id: "card-3", title: "Write the project brief", details: "Turn the strongest idea into a shared one-page brief." }],
  },
  {
    id: "progress",
    name: "In progress",
    cards: [{ id: "card-4", title: "Build the board", details: "Create a focused workspace for the team to move quickly." }],
  },
  {
    id: "review",
    name: "Review",
    cards: [{ id: "card-5", title: "Check the first flow", details: "Walk through the experience from a fresh perspective." }],
  },
  {
    id: "done",
    name: "Done",
    cards: [{ id: "card-6", title: "Set up the workspace", details: "Give the project a clear home and a simple rhythm." }],
  },
];

export function moveCard(columns: Column[], cardId: string, targetColumnId: string) {
  const sourceColumn = columns.find((column) => column.cards.some((card) => card.id === cardId));
  const targetColumn = columns.find((column) => column.id === targetColumnId);

  if (!sourceColumn || !targetColumn) return columns;

  const card = sourceColumn.cards.find((candidate) => candidate.id === cardId);
  if (!card || sourceColumn.id === targetColumn.id) return columns;

  return columns.map((column) => {
    if (column.id === sourceColumn.id) {
      return { ...column, cards: column.cards.filter((candidate) => candidate.id !== cardId) };
    }

    if (column.id === targetColumn.id) {
      return { ...column, cards: [...column.cards, card] };
    }

    return column;
  });
}