'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, Pencil, Check, X } from 'lucide-react';
import { ColumnItem } from '../types/kanban';
import { KanbanCard } from './KanbanCard';
import styles from './KanbanBoard.module.css';

interface KanbanColumnProps {
  column: ColumnItem;
  onRename: (columnId: string, newTitle: string) => void;
  onOpenAddCard: (columnId: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onRename,
  onOpenAddCard,
  onDeleteCard,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = () => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onRename(column.id, trimmed);
    } else {
      setEditedTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setEditedTitle(column.title);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelTitle();
    }
  };

  return (
    <div className={styles.columnContainer} data-testid={`column-${column.id}`}>
      <div className={styles.columnHeader}>
        {isEditingTitle ? (
          <div className={styles.columnTitleEditWrapper}>
            <input
              ref={titleInputRef}
              type="text"
              className={styles.columnTitleInput}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleSaveTitle}
              maxLength={40}
              aria-label="Edit column title"
            />
            <button
              type="button"
              className={styles.columnTitleSaveBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSaveTitle();
              }}
              title="Save title"
              aria-label="Save title"
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              className={styles.columnTitleCancelBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                handleCancelTitle();
              }}
              title="Cancel editing"
              aria-label="Cancel editing"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className={styles.columnTitleRow}>
            <div
              className={styles.columnTitleClickable}
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename column"
            >
              <h2 className={styles.columnTitle}>{column.title}</h2>
              <button
                type="button"
                className={styles.renameColumnButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                aria-label={`Rename column ${column.title}`}
                title="Rename column"
              >
                <Pencil size={13} />
              </button>
            </div>
            <span className={styles.columnCountBadge} aria-label={`${column.cards.length} cards`}>
              {column.cards.length}
            </span>
          </div>
        )}

        <button
          type="button"
          className={styles.addCardTriggerButton}
          onClick={() => onOpenAddCard(column.id)}
          aria-label={`Add card to ${column.title}`}
        >
          <Plus size={15} />
          <span>Add Card</span>
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.cardsList} ${
              snapshot.isDraggingOver ? styles.cardsListDraggingOver : ''
            }`}
          >
            {column.cards.map((card, index) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                onDelete={(cardId) => onDeleteCard(column.id, cardId)}
              />
            ))}
            {provided.placeholder}
            {column.cards.length === 0 && !snapshot.isDraggingOver && (
              <div className={styles.emptyColumnPlaceholder}>
                <span>No cards in this column</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
