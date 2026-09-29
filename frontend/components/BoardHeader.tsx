'use client';

import React from 'react';
import { Kanban } from 'lucide-react';
import styles from './KanbanBoard.module.css';

interface BoardHeaderProps {
  totalCards: number;
  totalColumns: number;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  totalCards,
  totalColumns,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerAccentBar} />
      <div className={styles.headerContainer}>
        <div className={styles.headerBranding}>
          <div className={styles.logoIconWrapper}>
            <Kanban className={styles.logoIcon} size={26} />
          </div>
          <div>
            <h1 className={styles.headerTitle}>Kanban Project Manager</h1>
            <p className={styles.headerSubtitle}>
              Interactive Project Board &bull; {totalColumns} Columns &bull; {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
            </p>
          </div>
        </div>
        <div className={styles.headerBadge}>
          <span className={styles.statusIndicator} />
          <span className={styles.statusText}>Single Board Workspace</span>
        </div>
      </div>
    </header>
  );
};
