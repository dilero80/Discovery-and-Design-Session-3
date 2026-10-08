# Story: Add priority field with default P3

## Acceptance Criteria

- New tasks created without an explicit priority are stored with priority value "P3".
- Priority field supports only values "P1", "P2", "P3".

## Technical Requirements

- Extend in-memory task object shape in frontend state to include `priority`.
- When mapping backend `/api/items` (which returns `{id,name}`) to tasks, set `priority: 'P3'`.
- Update local storage serialization to persist `priority`.
- Add UI control (e.g., select dropdown) constrained to P1/P2/P3.
