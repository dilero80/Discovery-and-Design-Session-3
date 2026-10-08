import { DEFAULT_PRIORITY, applyStoredPriorities, storePriority } from '../priority';

const STORAGE_KEY = 'taskPriorities';
const task = { id: 1, created_at: '2025-09-01 10:00:00' };
const taskKey = `1:${task.created_at}`;

beforeEach(() => {
  localStorage.clear();
});

describe('priority storage', () => {
  test('defaults tasks without a stored priority to P3 and stores it', () => {
    const [prioritized] = applyStoredPriorities([task]);

    expect(prioritized.priority).toBe(DEFAULT_PRIORITY);
    expect(DEFAULT_PRIORITY).toBe('P3');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual({ [taskKey]: 'P3' });
  });

  test.each(['P1', 'P2', 'P3'])('keeps a stored %s priority', priority => {
    expect(storePriority(task, priority)).toBe(true);

    expect(applyStoredPriorities([task])[0].priority).toBe(priority);
  });

  test.each(['P0', 'P4', 'p1', '', null, undefined, 1])('rejects %p as a priority', value => {
    expect(storePriority(task, value)).toBe(false);

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  test.each([
    ['an unsupported value', JSON.stringify({ [taskKey]: 'P9' })],
    ['unreadable data', 'not json'],
    ['a non-object value', '["P1"]'],
  ])('falls back to P3 for %s in storage', (name, stored) => {
    localStorage.setItem(STORAGE_KEY, stored);

    expect(applyStoredPriorities([task])[0].priority).toBe('P3');
  });

  test('keeps the other task fields', () => {
    const full = { ...task, title: 'Write report', completed: 1 };

    expect(applyStoredPriorities([full])[0]).toEqual({ ...full, priority: 'P3' });
  });

  test('does not reuse a priority for a different task with the same id', () => {
    storePriority(task, 'P1');
    const recreated = { id: 1, created_at: '2025-09-02 08:00:00' };

    expect(applyStoredPriorities([recreated])[0].priority).toBe('P3');
  });

  test('drops stored priorities for tasks that are no longer returned', () => {
    const other = { id: 2, created_at: '2025-09-01 10:00:05' };
    storePriority(task, 'P1');
    storePriority(other, 'P2');

    applyStoredPriorities([other]);

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual({
      [`2:${other.created_at}`]: 'P2',
    });
  });
});
