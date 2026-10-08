import React, { act } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests for tasks
const server = setupServer(
  // GET /api/tasks handler
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, title: 'Test Task 1', description: 'Desc 1', due_date: '2025-09-30', completed: 0 },
        { id: 2, title: 'Test Task 2', description: 'Desc 2', due_date: '2025-10-01', completed: 1 },
      ])
    );
  }),

  // POST /api/tasks handler
  rest.post('/api/tasks', (req, res, ctx) => {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Task title is required' })
      );
    }
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title,
        description: req.body.description || '',
        due_date: req.body.due_date || null,
        completed: 0,
      })
    );
  }),

  // PUT /api/tasks/:id handler
  rest.put('/api/tasks/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ ...req.body, id: Number(req.params.id), completed: 0 })
    );
  }),

  // PATCH /api/tasks/:id handler
  rest.patch('/api/tasks/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ id: Number(req.params.id), completed: req.body.completed ? 1 : 0 })
    );
  }),

  // DELETE /api/tasks/:id handler
  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
beforeEach(() => localStorage.clear());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TODO App', () => {
  test('renders the main UI', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('TODO App')).toBeInTheDocument();
    expect(screen.getByTestId('submit-task')).toBeInTheDocument();
      // Removed 'Tasks' assertion, as the header is 'TODO App'
  });

  test('loads and displays tasks', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('adds a new task', async () => {
    let tasks = [
      { id: 1, title: 'Test Task 1', description: 'Desc 1', due_date: '2025-09-30', completed: 0 },
      { id: 2, title: 'Test Task 2', description: 'Desc 2', due_date: '2025-10-01', completed: 1 },
    ];
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(tasks));
      }),
      rest.post('/api/tasks', (req, res, ctx) => {
        const { title, description } = req.body;
        const newTask = {
          id: 3,
          title,
          description: description || '',
          due_date: req.body.due_date || null,
          completed: 0,
        };
        tasks = [...tasks, newTask];
        return res(ctx.status(201), ctx.json(newTask));
      })
    );
    const user = userEvent.setup();
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    await user.type(screen.getByTestId('title-input'), 'New Test Task');
    await user.type(screen.getByTestId('description-input'), 'Task description');
    await user.click(screen.getByTestId('submit-task'));
    await waitFor(() => {
      expect(screen.getByText(/New Test Task/i)).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no tasks', async () => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText('No tasks found.')).toBeInTheDocument();
    });
  });
});

describe('Task priority', () => {
  const STORAGE_KEY = 'taskPriorities';
  const createdAt = '2025-09-01 10:00:00';
  const tasks = [
    { id: 1, title: 'Task A', description: '', due_date: null, completed: 0, created_at: createdAt },
    { id: 2, title: 'Task B', description: '', due_date: null, completed: 0, created_at: createdAt },
  ];

  const renderApp = async (list = tasks) => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => res(ctx.status(200), ctx.json(list)))
    );
    const view = render(<App />);
    await screen.findByText(list[0].title);
    return view;
  };

  const priorityButton = (title, priority) =>
    within(screen.getByRole('group', { name: `Priority for ${title}` })).getByRole('button', {
      name: priority,
    });

  const expectSelected = (title, selected) => {
    ['P1', 'P2', 'P3'].forEach(priority => {
      expect(priorityButton(title, priority)).toHaveAttribute(
        'aria-pressed',
        String(priority === selected)
      );
    });
  };

  test('selects P3 for tasks without a stored priority', async () => {
    await renderApp();

    expectSelected('Task A', 'P3');
    expectSelected('Task B', 'P3');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual({
      [`1:${createdAt}`]: 'P3',
      [`2:${createdAt}`]: 'P3',
    });
  });

  test('selects one priority at a time and keeps it after a reload', async () => {
    const user = userEvent.setup();
    const view = await renderApp();

    await user.click(priorityButton('Task A', 'P1'));
    expectSelected('Task A', 'P1');
    await user.click(priorityButton('Task A', 'P2'));
    expectSelected('Task A', 'P2');
    expectSelected('Task B', 'P3');

    view.unmount();
    await renderApp();

    expectSelected('Task A', 'P2');
    expectSelected('Task B', 'P3');
  });

  test('keeps the priority selected when it is clicked again', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(priorityButton('Task A', 'P1'));
    await user.click(priorityButton('Task A', 'P1'));

    expectSelected('Task A', 'P1');
  });

  test('shows unselected buttons in gray and the selected button in blue', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(priorityButton('Task A', 'P2'));

    expect(priorityButton('Task A', 'P2')).toHaveStyle({ backgroundColor: '#07F2E6' });
    expect(priorityButton('Task A', 'P1')).toHaveStyle({ backgroundColor: '#7A7A7A' });
    expect(priorityButton('Task A', 'P3')).toHaveStyle({ backgroundColor: '#7A7A7A' });
  });

  test('gives a newly created task priority P3', async () => {
    let list = [...tasks];
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => res(ctx.status(200), ctx.json(list))),
      rest.post('/api/tasks', (req, res, ctx) => {
        const newTask = {
          id: 3,
          title: req.body.title,
          description: '',
          due_date: null,
          completed: 0,
          created_at: '2025-09-02 08:00:00',
        };
        list = [...list, newTask];
        return res(ctx.status(201), ctx.json(newTask));
      })
    );
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Task A');

    await user.type(screen.getByTestId('title-input'), 'New Task');
    await user.click(screen.getByTestId('submit-task'));
    await screen.findByText('New Task');

    expectSelected('New Task', 'P3');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))['3:2025-09-02 08:00:00']).toBe('P3');
  });
});
