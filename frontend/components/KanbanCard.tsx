'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, GripVertical } from 'lucide-react';
import { CardItem } from '../types/kanban';
import styles from './KanbanBoard.module.css';

interface KanbanCardProps {
  card: CardItem;
  index: number;
  onDelete: (cardId: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  index,
  onDelete,
}) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${styles.cardItem} ${
            snapshot.isDragging ? styles.cardDragging : ''
          }`}
          data-testid={`card-${card.id}`}
        >
          <div className={styles.cardHeader}>
            <div
              {...provided.dragHandleProps}
              className={styles.dragHandle}
              aria-label="Drag card handle"
            >
              <GripVertical size={16} />
            </div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <button
              type="button"
              className={styles.cardDeleteButton}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              title="Delete card"
              aria-label={`Delete card: ${card.title}`}
            >
              <Trash2 size={15} />
            </button>
          </div>

          {card.details && (
            <p className={styles.cardDetails}>{card.details}</p>
          )}
        </div>
      )}
    </Draggable>
  );
};
