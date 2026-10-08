# Step 3-2: Generate Epics and Stories

## Goal

Create a single markdown file `docs/epics-and-stories.md` that translates the confirmed PRD into MVP and Post-MVP epics with their user stories, each enriched with acceptance criteria and technical requirements. This prepares structured, implementation-ready work before moving items into an issue tracking platform.

## Strategy

As you work through this lab, notice how we use Copilot to first create the titles for our Epics and Stories before adding acceptance criteria and technical requirements.

This approach provides several advantages:

- It makes it easier to review each step and confirm alignment with the PRD
- It helps identify which tasks can be delegated to other team members

For example, your solution owner might focus on defining epic and story titles along with acceptance criteria, while your role as an architect or developer lead would involve adding the technical details based on those criteria.

## Instructions

### :keyboard: Activity: Ask Copilot to create epics and stories

1. Open the **Copilot** chat panel and switch to **Agent** mode using the dropdown menu.
2. Switch to the latest model of `GPT-5`.
3. In the Copilot chat input field, clearly state that you want a new file created at `docs/epics-and-stories.md`. The file should break down the MVP and Post-MVP into epics with story titles only (omit acceptance criteria and technical details). Indicate that the content should be based on the requirements in `docs/prd-todo.md` and follow the structure in `docs/templates/epic-and-stories-template.md`. Make sure your request communicates this intent unambiguously.
4. Review the epic and story titles and make sure they align with your PRD.
5. Ask Copilot to define all the acceptance criteria based on `docs/prd-todo.md` and add it to the stories defined in `docs/epics-and-stories.md`.
6. Since Copilot already understands your codebase, instruct it to update `docs/epics-and-stories.md` by adding technical requirements derived from the acceptance criteria in that file. You can explicitly tell it to reference the current frontend and backend implementation in your codebase to define the technical requirements.
7. Commit and push your changes.

## Success Criteria

- `docs/epics-and-stories.md` exists and contains the titles for the epics and stories along with their technical requirements and acceptance criteria.

If you encounter any issues, you can:

- Review that `docs/epics-and-stories.md` was created and updated with the epics and stories
- Double-check that your changes were pushed to the `feature/requirements-and-documentation` branch
- Ask Copilot to fix specific problems

## Why?

Documenting epics and stories beforehand in a markdown file can help you refine the overall PRD scope and define the acceptance criteria and technical requirements before you are ready to push them into an issue tracking platform.
