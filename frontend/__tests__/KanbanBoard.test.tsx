import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KanbanBoard } from '../components/KanbanBoard';

// Mock @hello-pangea/dnd to avoid DOM measurements in jsdom
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Droppable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) =>
    children(
      {
        draggableProps: {},
        innerRef: vi.fn(),
        placeholder: null,
      },
      { isDraggingOver: false }
    ),
  Draggable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) =>
    children(
      {
        draggableProps: {},
        dragHandleProps: {},
        innerRef: vi.fn(),
      },
      { isDragging: false }
    ),
}));

describe('KanbanBoard Unit Tests', () => {
  it('renders the header and initial 5 columns', () => {
    render(<KanbanBoard />);

    expect(screen.getByText('Kanban Project Manager')).toBeInTheDocument();
    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('populates initial dummy cards', () => {
    render(<KanbanBoard />);

    expect(screen.getByText('Audit third-party dependencies')).toBeInTheDocument();
    expect(screen.getByText('Design token standardization')).toBeInTheDocument();
    expect(screen.getByText('Kanban board drag and drop')).toBeInTheDocument();
    expect(screen.getByText('Card creation modal experience')).toBeInTheDocument();
    expect(screen.getByText('Next.js project setup')).toBeInTheDocument();
  });

  it('allows renaming a column', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const renameButtons = screen.getAllByTitle('Rename column');
    await user.click(renameButtons[0]);

    const titleInput = screen.getByLabelText('Edit column title');
    expect(titleInput).toBeInTheDocument();

    await user.clear(titleInput);
    await user.type(titleInput, 'Priorities');
    await user.keyboard('{Enter}');

    expect(screen.getByText('Priorities')).toBeInTheDocument();
  });

  it('adds a new card to a column via the Add Card modal', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const addCardButtons = screen.getAllByRole('button', { name: /Add card to Backlog/i });
    await user.click(addCardButtons[0]);

    expect(screen.getByText('Add New Card')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Card Title/i);
    const detailsInput = screen.getByLabelText(/Details/i);

    await user.type(titleInput, 'New Test Task');
    await user.type(detailsInput, 'Comprehensive details for this task');

    const modal = screen.getByRole('dialog');
    const submitButton = within(modal).getByRole('button', { name: /Add Card/i });
    await user.click(submitButton);

    expect(screen.getByText('New Test Task')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive details for this task')).toBeInTheDocument();
  });

  it('deletes an existing card', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    expect(screen.getByText('Audit third-party dependencies')).toBeInTheDocument();

    const deleteBtn = screen.getByLabelText('Delete card: Audit third-party dependencies');
    await user.click(deleteBtn);

    expect(screen.queryByText('Audit third-party dependencies')).not.toBeInTheDocument();
  });
});
