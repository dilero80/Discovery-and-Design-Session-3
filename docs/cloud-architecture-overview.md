# Cloud Architecture Overview

These diagrams describe the monorepo's current application runtime, not a proposed cloud deployment or the PRD's future local-only task flow. No cloud provider or hosting topology is specified here.

## System Context

```mermaid
flowchart LR
    User["User"]

    subgraph Application["TODO application"]
        Frontend["React frontend in browser"]

        subgraph Backend["Node.js backend process"]
            API["Express task API"]
            Store[("In-memory SQLite store")]
        end
    end

    User -->|"Uses task interface"| Frontend
    Frontend <-->|"HTTP / JSON: /api/tasks"| API
    API <-->|"SQL via better-sqlite3"| Store
```

## Creating a TODO

The sequence shows frontend title validation and successful task creation. API failure responses and network errors are not depicted.

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React frontend
    participant API as Express task API
    participant Store as In-memory SQLite

    User->>Frontend: Enter title, optional description and due date
    User->>Frontend: Submit Add Task
    Frontend->>Frontend: Validate nonblank title

    alt Title is blank
        Frontend-->>User: Show required-title validation
        Note over Frontend,API: No task creation request is sent
    else Title is valid and creation succeeds
        Frontend->>API: POST /api/tasks (title, description, due_date)
        API->>API: Validate required title
        API->>Store: INSERT task
        Store-->>API: New task ID (completed defaults to 0)
        API->>Store: SELECT task by new ID
        Store-->>API: Created task record
        API-->>Frontend: 201 Created with task JSON
        Frontend->>Frontend: Schedule list refresh and reset form
        Frontend->>API: GET /api/tasks
        API->>Store: SELECT tasks ordered by due date and creation time
        Store-->>API: Task records
        API-->>Frontend: 200 OK with task list JSON
        Frontend-->>User: Display task list including the new TODO
    end
```

## Runtime Notes

- **Frontend:** [packages/frontend](../packages/frontend) contains the React UI. It calls relative task API endpoints; the development server proxies requests to `http://localhost:3030`.
- **API:** [packages/backend/src/app.js](../packages/backend/src/app.js) defines Express task endpoints. [packages/backend/src/index.js](../packages/backend/src/index.js) starts the server on port `3030` by default, overridable with `PORT`.
- **Store:** SQLite uses `:memory:` within the backend process, not a separate database service. Task data is lost when the backend process restarts; no durable storage is configured.