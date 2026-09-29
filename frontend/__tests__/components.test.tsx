import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KanbanCard } from '../components/KanbanCard';
import { AddCardModal } from '../components/AddCardModal';

// Mock @hello-pangea/dnd
vi.mock('@hello-pangea/dnd', () => ({
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

describe('KanbanCard Component', () => {
  const mockCard = {
    id: 'test-card-1',
    title: 'Unit Test Card',
    details: 'This is a description for unit test card.',
  };

  it('renders card title and details', () => {
    render(<KanbanCard card={mockCard} index={0} onDelete={vi.fn()} />);

    expect(screen.getByText('Unit Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a description for unit test card.')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const handleDelete = vi.fn();
    const user = userEvent.setup();

    render(<KanbanCard card={mockCard} index={0} onDelete={handleDelete} />);

    const deleteBtn = screen.getByLabelText('Delete card: Unit Test Card');
    await user.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledWith('test-card-1');
  });
});

describe('AddCardModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <AddCardModal
        isOpen={false}
        columnTitle="In Progress"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.queryByText('Add New Card')).not.toBeInTheDocument();
  });

  it('renders correctly and submits valid data', async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <AddCardModal
        isOpen={true}
        columnTitle="In Progress"
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    expect(screen.getByText('Add New Card')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Card Title/i);
    const detailsInput = screen.getByLabelText(/Details/i);

    await user.type(titleInput, 'Implement Feature A');
    await user.type(detailsInput, 'Feature details here');

    const submitBtn = screen.getByRole('button', { name: /Add Card/i });
    await user.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith('Implement Feature A', 'Feature details here');
    expect(handleClose).toHaveBeenCalled();
  });

  it('closes when Cancel is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <AddCardModal
        isOpen={true}
        columnTitle="Ready"
        onClose={handleClose}
        onSubmit={vi.fn()}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelBtn);

    expect(handleClose).toHaveBeenCalled();
  });
});
