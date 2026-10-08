export const PRIORITIES = ['P1', 'P2', 'P3'];
export const DEFAULT_PRIORITY = 'P3';

const STORAGE_KEY = 'taskPriorities';

export const isPriority = value => PRIORITIES.includes(value);

// created_at keeps a priority from attaching to a different task after the in-memory
// database restarts and reuses ids.
const priorityKey = task => `${task.id}:${task.created_at}`;

function readStoredPriorities() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  } catch (err) {
    return {};
  }
}

function writeStoredPriorities(priorities) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(priorities));
  } catch (err) {
    // Storage can be unavailable or full; priorities are then lost on the next fetch.
  }
}

// Adds a priority to each task and keeps only these tasks' priorities in storage.
export function applyStoredPriorities(tasks) {
  const stored = readStoredPriorities();
  const prioritized = tasks.map(task => {
    const priority = stored[priorityKey(task)];
    return { ...task, priority: isPriority(priority) ? priority : DEFAULT_PRIORITY };
  });
  writeStoredPriorities(
    Object.fromEntries(prioritized.map(task => [priorityKey(task), task.priority])),
  );
  return prioritized;
}

export function storePriority(task, priority) {
  if (!isPriority(priority)) return false;
  writeStoredPriorities({ ...readStoredPriorities(), [priorityKey(task)]: priority });
  return true;
}
