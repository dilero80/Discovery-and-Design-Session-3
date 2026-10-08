# Step 3-4: Implement the Priority Field using Story Requirements and UI Sketch

## Goal

Implement the Priority field from the story and UI sketch across frontend and backend (form, display, model, API).

## Instructions

1. Open the **Copilot** chat panel and switch to **Agent** mode using the dropdown menu.
2. Switch to the latest model of `Claude Sonnet`.
3. In the Copilot chat input field, ask Copilot to implement the story in `docs/stories/priority-field-story.md`. Attach the image `docs/stories/priority-field-ui-sketch.png` as a reference to what the UI should look like. Make sure it follows the color code requirements in the sketch image.
4. When Copilot finishes making the changes, review what was modified.
5. If it's not already running, run the application with `npm run start` in the root directory to test the new functionality.
6. Try creating some items to verify everything works as expected. Modify existing item priorities and refresh the browser to verify they are updated. If you find any issues, ask Copilot to resolve them.
7. Keep the changes that Copilot implemented.
8. Commit and push your changes.

### Success Criteria

- `packages/frontend/src/App.css` contains the color requirements from the `priority-field-ui-sketch.png` sketch
- `packages/backend/src/app.js` contains a PUT request to update priorities for tasks
- `packages/frontend/src/App.js` references the PUT request to update priorities for tasks

If you encounter any issues, you can:

- If the png sketch isn't read by Copilot, click `Add Context...` and select the image
- Review that `packages/frontend/src/App.css` contains the color requirements from the `priority-field-ui-sketch.png` sketch
- Review that `packages/backend/src/app.js` contains a PUT request to update priorities for tasks
- Review that `packages/frontend/src/App.js` references the PUT request to update priorities for tasks
- Double-check that your changes were pushed to the `feature/requirements-and-documentation` branch
- Ask Copilot to fix specific problems
