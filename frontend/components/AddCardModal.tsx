'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import styles from './KanbanBoard.module.css';

interface AddCardModalProps {
  isOpen: boolean;
  columnTitle: string;
  onClose: () => void;
  onSubmit: (title: string, details: string) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  columnTitle,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDetails('');
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onSubmit(trimmedTitle, details.trim());
    onClose();
  };

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="modal-title" className={styles.modalTitle}>
              Add New Card
            </h2>
            <p className={styles.modalSubtitle}>
              Adding to column: <strong>{columnTitle}</strong>
            </p>
          </div>
          <button
            type="button"
            className={styles.modalCloseButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="card-title-input" className={styles.formLabel}>
              Card Title <span className={styles.requiredStar}>*</span>
            </label>
            <input
              id="card-title-input"
              ref={titleInputRef}
              type="text"
              className={styles.textInput}
              placeholder="e.g. Implement drag and drop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="card-details-input" className={styles.formLabel}>
              Details
            </label>
            <textarea
              id="card-details-input"
              className={styles.textAreaInput}
              placeholder="Enter card details, tasks, or specifications..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!title.trim()}
            >
              <Plus size={16} />
              <span>Add Card</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
