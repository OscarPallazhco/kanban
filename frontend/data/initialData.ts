import { ColumnItem } from '../types/kanban';

export const INITIAL_COLUMNS: ColumnItem[] = [
  {
    id: 'col-backlog',
    title: 'Backlog',
    cards: [
      {
        id: 'card-1',
        title: 'Audit third-party dependencies',
        details: 'Review licenses and check for outdated packages across the stack.',
      },
      {
        id: 'card-2',
        title: 'Database query optimization',
        details: 'Profile slow index lookups on project activity logs.',
      },
    ],
  },
  {
    id: 'col-ready',
    title: 'Ready',
    cards: [
      {
        id: 'card-3',
        title: 'Design token standardization',
        details: 'Unify primary blue, purple accents, and typography tokens.',
      },
      {
        id: 'card-4',
        title: 'Mobile viewport regression tests',
        details: 'Verify card interaction targets on touch displays.',
      },
    ],
  },
  {
    id: 'col-in-progress',
    title: 'In Progress',
    cards: [
      {
        id: 'card-5',
        title: 'Kanban board drag and drop',
        details: 'Implement drag handling between columns with position feedback.',
      },
      {
        id: 'card-6',
        title: 'Inline column title editor',
        details: 'Allow double-click or edit icon triggers with escape and enter key handling.',
      },
    ],
  },
  {
    id: 'col-review',
    title: 'Review',
    cards: [
      {
        id: 'card-7',
        title: 'Card creation modal experience',
        details: 'Validate required title field and graceful text area resizing.',
      },
    ],
  },
  {
    id: 'col-done',
    title: 'Done',
    cards: [
      {
        id: 'card-8',
        title: 'Next.js project setup',
        details: 'Initialize App Router structure and TypeScript compiler options.',
      },
      {
        id: 'card-9',
        title: 'Color scheme architecture',
        details: 'Establish dark navy headings and supporting gray text palette.',
      },
    ],
  },
];
