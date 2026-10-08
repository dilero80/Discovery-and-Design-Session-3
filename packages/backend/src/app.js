const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

/*
TODO TASK DATA MODEL & ENDPOINT PLAN

Table: tasks
  - id INTEGER PRIMARY KEY AUTOINCREMENT
  - title TEXT NOT NULL
  - description TEXT
  - due_date DATE
  - completed BOOLEAN DEFAULT 0
  - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Endpoints to implement:
  - GET   /api/tasks           (list, filter, search, sort)
  - POST  /api/tasks           (create)
  - GET   /api/tasks/:id       (detail)
  - PUT   /api/tasks/:id       (edit)
  - PATCH /api/tasks/:id       (mark complete/incomplete)
  - DELETE /api/tasks/:id      (delete)

Features:
  - Filtering by completion
  - Search by keyword (title/description)
  - Sort by due date, then creation date
*/

// Create tasks table
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    completed BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);


console.log('In-memory database initialized for TODO tasks');

// --- TASK API ENDPOINTS ---

// Helper: build dynamic WHERE clause for filtering/search
function buildTaskQuery({ completed, search }) {
  let where = [];
  let params = {};
  if (completed === 'true' || completed === 'false') {
    where.push('completed = @completed');
    params.completed = completed === 'true' ? 1 : 0;
  }
  if (search) {
    where.push('(title LIKE @kw OR description LIKE @kw)');
    params.kw = `%${search}%`;
  }
  return {
    where: where.length ? 'WHERE ' + where.join(' AND ') : '',
    params,
  };
}

// GET /api/tasks (list, filter, search, sort)
app.get('/api/tasks', (req, res) => {
  try {
    const { completed, search } = req.query;
    const { where, params } = buildTaskQuery({ completed, search });
    const sql = `SELECT * FROM tasks ${where} ORDER BY due_date IS NULL, due_date ASC, created_at ASC`;
    const tasks = db.prepare(sql).all(params);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks (create)
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }
    const stmt = db.prepare('INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)');
    const result = stmt.run(title, description || '', due_date || null);
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// GET /api/tasks/:id (detail)
app.get('/api/tasks/:id', (req, res) => {
  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// PUT /api/tasks/:id (edit)
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }
    const stmt = db.prepare('UPDATE tasks SET title = ?, description = ?, due_date = ? WHERE id = ?');
    const result = stmt.run(title, description || '', due_date || null, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// PATCH /api/tasks/:id (mark complete/incomplete)
app.patch('/api/tasks/:id', (req, res) => {
  try {
    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be boolean' });
    }
    const stmt = db.prepare('UPDATE tasks SET completed = ? WHERE id = ?');
    const result = stmt.run(completed ? 1 : 0, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task completion:', error);
    res.status(500).json({ error: 'Failed to update task completion' });
  }
});

// DELETE /api/tasks/:id (delete)
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db };
