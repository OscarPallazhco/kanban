import { describe, it, expect } from 'vitest';
import { ColumnItem, CardItem } from '../types/kanban';

// Pure helper function representing the reorder & transfer logic used in handleDragEnd
export function reorderCards(
  columns: ColumnItem[],
  sourceColId: string,
  destColId: string,
  sourceIndex: number,
  destIndex: number
): ColumnItem[] {
  const sourceColIndex = columns.findIndex((c) => c.id === sourceColId);
  const destColIndex = columns.findIndex((c) => c.id === destColId);

  if (sourceColIndex === -1 || destColIndex === -1) return columns;

  const newColumns = [...columns];
  const sourceColumn = { ...newColumns[sourceColIndex] };
  const destColumn =
    sourceColIndex === destColIndex
      ? sourceColumn
      : { ...newColumns[destColIndex] };

  const sourceCards = [...sourceColumn.cards];
  const [movedCard] = sourceCards.splice(sourceIndex, 1);

  if (sourceColIndex === destColIndex) {
    sourceCards.splice(destIndex, 0, movedCard);
    sourceColumn.cards = sourceCards;
    newColumns[sourceColIndex] = sourceColumn;
  } else {
    const destCards = [...destColumn.cards];
    destCards.splice(destIndex, 0, movedCard);
    sourceColumn.cards = sourceCards;
    destColumn.cards = destCards;
    newColumns[sourceColIndex] = sourceColumn;
    newColumns[destColIndex] = destColumn;
  }

  return newColumns;
}

describe('Kanban Reorder and Transfer Logic', () => {
  const sampleColumns: ColumnItem[] = [
    {
      id: 'col-1',
      title: 'Col 1',
      cards: [
        { id: 'c-1', title: 'Task 1', details: 'D1' },
        { id: 'c-2', title: 'Task 2', details: 'D2' },
      ],
    },
    {
      id: 'col-2',
      title: 'Col 2',
      cards: [
        { id: 'c-3', title: 'Task 3', details: 'D3' },
      ],
    },
  ];

  it('reorders cards within the same column', () => {
    const updated = reorderCards(sampleColumns, 'col-1', 'col-1', 0, 1);
    expect(updated[0].cards[0].id).toBe('c-2');
    expect(updated[0].cards[1].id).toBe('c-1');
  });

  it('moves a card between different columns', () => {
    const updated = reorderCards(sampleColumns, 'col-1', 'col-2', 0, 1);
    expect(updated[0].cards).toHaveLength(1);
    expect(updated[0].cards[0].id).toBe('c-2');
    expect(updated[1].cards).toHaveLength(2);
    expect(updated[1].cards[0].id).toBe('c-3');
    expect(updated[1].cards[1].id).toBe('c-1');
  });
});
