'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { INITIAL_COLUMNS } from '../data/initialData';
import { ColumnItem, CardItem } from '../types/kanban';
import { BoardHeader } from './BoardHeader';
import { KanbanColumn } from './KanbanColumn';
import { AddCardModal } from './AddCardModal';
import styles from './KanbanBoard.module.css';

export const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnItem[]>(INITIAL_COLUMNS);
  const [activeAddColumnId, setActiveAddColumnId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalCards = columns.reduce((acc, col) => acc + col.cards.length, 0);

  const activeColumn = columns.find((c) => c.id === activeAddColumnId);

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      )
    );
  };

  const handleOpenAddCard = (columnId: string) => {
    setActiveAddColumnId(columnId);
  };

  const handleCloseAddCard = () => {
    setActiveAddColumnId(null);
  };

  const handleAddCard = (title: string, details: string) => {
    if (!activeAddColumnId) return;

    const newCard: CardItem = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      details,
    };

    setColumns((prev) =>
      prev.map((col) =>
        col.id === activeAddColumnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      )
    );
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
          : col
      )
    );
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColIndex = columns.findIndex(
      (c) => c.id === source.droppableId
    );
    const destColIndex = columns.findIndex(
      (c) => c.id === destination.droppableId
    );

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const newColumns = [...columns];
    const sourceColumn = { ...newColumns[sourceColIndex] };
    const destColumn =
      sourceColIndex === destColIndex
        ? sourceColumn
        : { ...newColumns[destColIndex] };

    const sourceCards = [...sourceColumn.cards];
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (sourceColIndex === destColIndex) {
      sourceCards.splice(destination.index, 0, movedCard);
      sourceColumn.cards = sourceCards;
      newColumns[sourceColIndex] = sourceColumn;
    } else {
      const destCards = [...destColumn.cards];
      destCards.splice(destination.index, 0, movedCard);
      sourceColumn.cards = sourceCards;
      destColumn.cards = destCards;
      newColumns[sourceColIndex] = sourceColumn;
      newColumns[destColIndex] = destColumn;
    }

    setColumns(newColumns);
  };

  if (!isMounted) {
    return (
      <main>
        <BoardHeader totalCards={totalCards} totalColumns={columns.length} />
        <div className={styles.boardWrapper}>
          <div className={styles.columnsTrack}>
            {columns.map((col) => (
              <div
                key={col.id}
                className={styles.columnContainer}
                data-testid={`column-${col.id}`}
              >
                <div className={styles.columnHeader}>
                  <div className={styles.columnTitleRow}>
                    <h2 className={styles.columnTitle}>{col.title}</h2>
                    <span className={styles.columnCountBadge}>
                      {col.cards.length}
                    </span>
                  </div>
                </div>
                <div className={styles.cardsList}>
                  {col.cards.map((card) => (
                    <div key={card.id} className={styles.cardItem}>
                      <h3 className={styles.cardTitle}>{card.title}</h3>
                      {card.details && (
                        <p className={styles.cardDetails}>{card.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <BoardHeader totalCards={totalCards} totalColumns={columns.length} />
      <div className={styles.boardWrapper}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={styles.columnsTrack}>
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onRename={handleRenameColumn}
                onOpenAddCard={handleOpenAddCard}
                onDeleteCard={handleDeleteCard}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <AddCardModal
        isOpen={activeAddColumnId !== null}
        columnTitle={activeColumn ? activeColumn.title : ''}
        onClose={handleCloseAddCard}
        onSubmit={handleAddCard}
      />
    </main>
  );
};
