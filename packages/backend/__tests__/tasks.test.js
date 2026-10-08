const request = require('supertest');
const { app, db } = require('../src/app');

afterAll(() => {
  if (db) db.close();
});

describe('Tasks API', () => {
  let taskId;

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'A test task', due_date: '2025-09-30' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Task');
    expect(res.body.description).toBe('A test task');
    expect(res.body.due_date).toBe('2025-09-30');
    expect(res.body.completed).toBe(0);
    taskId = res.body.id;
  });

  it('should get all tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a single task by id', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(taskId);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Updated Task', description: 'Updated', due_date: '2025-10-01' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Task');
    expect(res.body.description).toBe('Updated');
    expect(res.body.due_date).toBe('2025-10-01');
  });

  it('should mark a task as completed', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(1);
  });

  it('should delete a task', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.status).toBe(204);
  });
});

describe('Task priority', () => {
  const createTask = (body = {}) =>
    request(app).post('/api/tasks').send({ title: 'Priority task', ...body });

  it('defaults new tasks to P3', async () => {
    const res = await createTask();
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('P3');
  });

  it('accepts an explicit priority when creating a task', async () => {
    const res = await createTask({ priority: 'P1' });
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('P1');
  });

  it('rejects an unsupported priority when creating a task', async () => {
    const res = await createTask({ priority: 'P4' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Priority must be one of P1, P2, P3');
  });

  it.each(['P1', 'P2', 'P3'])('updates a task priority to %s with PUT', async priority => {
    const { body: task } = await createTask({ priority: priority === 'P1' ? 'P2' : 'P1' });
    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: task.title, priority });
    expect(res.status).toBe(200);
    expect(res.body.priority).toBe(priority);
    const stored = await request(app).get(`/api/tasks/${task.id}`);
    expect(stored.body.priority).toBe(priority);
  });

  it('keeps the priority when PUT does not send one', async () => {
    const { body: task } = await createTask({ priority: 'P2' });
    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: 'Renamed task', due_date: '2025-10-01' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Renamed task');
    expect(res.body.priority).toBe('P2');
  });

  it.each(['P0', 'p1', 'P4', '', null, 1])('rejects %p as a priority with PUT', async priority => {
    const { body: task } = await createTask({ priority: 'P2' });
    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: task.title, priority });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Priority must be one of P1, P2, P3');
    const stored = await request(app).get(`/api/tasks/${task.id}`);
    expect(stored.body.priority).toBe('P2');
  });

  it('returns 404 when updating the priority of a missing task', async () => {
    const res = await request(app)
      .put('/api/tasks/999999')
      .send({ title: 'Missing task', priority: 'P1' });
    expect(res.status).toBe(404);
  });
});
