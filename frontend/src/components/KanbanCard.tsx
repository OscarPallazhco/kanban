import { Card } from "@/lib/board";
import styles from "@/app/page.module.css";

type KanbanCardProps = {
  card: Card;
  onMoveNext: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

export function KanbanCard({ card, onMoveNext, onDelete, onDragStart, onDragEnd }: KanbanCardProps) {
  return (
    <div className={styles.card} draggable onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className={styles.cardAccent} />
      <div className={styles.cardBody}>
        <p className={styles.cardTitle}>{card.title}</p>
        <p className={styles.cardDetails}>{card.details}</p>
        <div className={styles.cardFooter}>
          <button type="button" className={styles.moveButton} onClick={onMoveNext}>
            Move next <span aria-hidden="true">-&gt;</span>
          </button>
          <button type="button" className={styles.deleteButton} aria-label={`Delete ${card.title}`} onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
