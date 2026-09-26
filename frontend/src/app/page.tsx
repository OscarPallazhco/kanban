"use client";

import { FormEvent, useState } from "react";
import { BoardHeader } from "@/components/BoardHeader";
import { KanbanColumn } from "@/components/KanbanColumn";
import { Column, initialColumns, moveCard } from "@/lib/board";
import styles from "./page.module.css";

export default function Home() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [addingToColumnId, setAddingToColumnId] = useState<string | null>(null);

  const cardCount = columns.reduce((total, column) => total + column.cards.length, 0);

  function renameColumn(columnId: string, name: string) {
    setColumns((currentColumns) => currentColumns.map((column) => (
      column.id === columnId ? { ...column, name } : column
    )));
  }

  function addCard(event: FormEvent<HTMLFormElement>, columnId: string) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const details = String(formData.get("details") ?? "").trim();

    if (!title) return;

    setColumns((currentColumns) => currentColumns.map((column) => (
      column.id === columnId
        ? {
            ...column,
            cards: [...column.cards, { id: `card-${Date.now()}`, title, details }],
          }
        : column
    )));
    setAddingToColumnId(null);
  }

  function deleteCard(cardId: string) {
    setColumns((currentColumns) => currentColumns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    })));
  }

  function moveCardToNextColumn(cardId: string, currentColumnIndex: number) {
    const nextColumnIndex = (currentColumnIndex + 1) % columns.length;
    const nextColumnId = columns[nextColumnIndex].id;
    setColumns((currentColumns) => moveCard(currentColumns, cardId, nextColumnId));
  }

  function dropCard(targetColumnId: string) {
    if (!draggedCardId) return;

    setColumns((currentColumns) => moveCard(currentColumns, draggedCardId, targetColumnId));
    setDraggedCardId(null);
  }

  return (
    <main className={styles.page}>
      <BoardHeader cardCount={cardCount} />

      <section className={styles.board} aria-label="Launch week Kanban board">
        {columns.map((column, index) => (
          <KanbanColumn
            key={column.id}
            column={column}
            position={index}
            isAddingCard={addingToColumnId === column.id}
            onRename={(name) => renameColumn(column.id, name)}
            onAddCard={() => setAddingToColumnId(column.id)}
            onSubmitCard={(event) => addCard(event, column.id)}
            onCancelAdd={() => setAddingToColumnId(null)}
            onDeleteCard={deleteCard}
            onMoveCard={(cardId) => moveCardToNextColumn(cardId, index)}
            onDropCard={() => dropCard(column.id)}
            onDragStart={setDraggedCardId}
            onDragEnd={() => setDraggedCardId(null)}
          />
        ))}
      </section>

      <p className={styles.hint}>
        <span aria-hidden="true">↔</span> Drag cards between stages, or use &quot;Move next&quot; to keep momentum.
      </p>
    </main>
  );
}
