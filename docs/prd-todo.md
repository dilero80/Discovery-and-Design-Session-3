# Product Requirements Document (PRD) - TODO App Upgrade

## 1. Overview

Upgrade the basic TODO app, currently centered on task titles and completion status, with optional due dates, three priority levels, and date-based filters. The goal is a simple, teachable MVP that helps users organize tasks and identify urgent work without adding backend changes or external storage.

This PRD is based on:

- [Requirements meeting, September 16, 2025](artifacts/09162025-requirements-meeting.vtt).
- [Slack scope confirmation, September 17, 2025](artifacts/09172025-slack-conversation-export.txt).

The later Slack agreement takes precedence where release scope differs from the meeting. In particular, overdue highlighting and sorting are Post-MVP, not MVP.

---

## 2. MVP Scope

- **Task data and validation:**
  - `title` is required.
  - Retain the existing task completion status.
  - Add optional `dueDate` in ISO `YYYY-MM-DD` format.
  - Ignore invalid due dates and treat them as absent.
  - Add `priority` with allowed values `P1`, `P2`, and `P3`.
  - Default priority to `P3`.
- **Due dates and priorities:**
  - Allow users to assign an optional due date to a task.
  - Allow users to select a task's priority.
- **Date-based filters:**
  - Provide All, Today, and Overdue views; tabs were requested in the meeting.
  - All shows completed tasks as well as incomplete tasks.
  - Today and Overdue show only incomplete tasks.
- **Storage and implementation constraints:**
  - Keep task storage local.
  - Make no backend changes and introduce no external storage.
- **Unresolved details:**
  - The artifacts do not specify date-boundary or timezone rules for Today and Overdue, or how these filters handle tasks without due dates.
  - The meeting requests color-coded priority badges: red for P1, orange for P2, and gray for P3. Slack does not explicitly assign badge styling to MVP or Post-MVP; its release scope is unresolved.

---

## 3. Post-MVP Scope

- **Overdue highlighting:** Visually highlight overdue tasks so they stand out. Red highlighting was suggested in the meeting; the final visual treatment remains to be confirmed.
- **Task sorting:** Apply the agreed ordering: overdue first, then priority from P1 to P3, then due date ascending, with undated tasks last.

---

## 4. Out of Scope

- Notifications.
- Recurring tasks.
- Multi-user functionality.
- Keyboard navigation enhancements.
- Special accessibility features, as excluded in the meeting.
- External storage; storage remains local only.
- Backend changes for this upgrade.