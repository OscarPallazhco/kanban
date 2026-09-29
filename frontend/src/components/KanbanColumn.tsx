import { FormEvent } from "react";
import { Column } from "@/lib/board";
import { AddCardForm } from "./AddCardForm";
import { KanbanCard } from "./KanbanCard";
import styles from "@/app/page.module.css";

type KanbanColumnProps = {
  column: Column;
  position: number;
  isAddingCard: boolean;
  onRename: (name: string) => void;
  onAddCard: () => void;
  onSubmitCard: (event: FormEvent<HTMLFormElement>) => void;
  onCancelAdd: () => void;
  onDeleteCard: (cardId: string) => void;
  onMoveCard: (cardId: string) => void;
  onDropCard: () => void;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
};

export function KanbanColumn({
  column,
  position,
  isAddingCard,
  onRename,
  onAddCard,
  onSubmitCard,
  onCancelAdd,
  onDeleteCard,
  onMoveCard,
  onDropCard,
  onDragStart,
  onDragEnd,
}: KanbanColumnProps) {
  return (
    <article className={styles.column} onDragOver={(event) => event.preventDefault()} onDrop={onDropCard}>
      <div className={styles.columnTop}>
        <span className={styles.columnNumber}>0{position + 1}</span>
        <input
          className={styles.columnName}
          aria-label={`Rename ${column.name} column`}
          value={column.name}
          onChange={(event) => onRename(event.target.value)}
        />
        <span className={styles.count}>{column.cards.length}</span>
      </div>

      <div className={styles.cards}>
        {column.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onMoveNext={() => onMoveCard(card.id)}
            onDelete={() => onDeleteCard(card.id)}
            onDragStart={() => onDragStart(card.id)}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>

      {isAddingCard ? (
        <AddCardForm onSubmit={onSubmitCard} onCancel={onCancelAdd} />
      ) : (
        <button type="button" className={styles.addButton} onClick={onAddCard}>
          <span>+</span> Add card
        </button>
      )}
    </article>
  );
}
