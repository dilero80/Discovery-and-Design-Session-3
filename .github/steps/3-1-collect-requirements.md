# Step 3-1: Collect Requirements

## Goal

Using requirements collected from transcription notes and Slack messages, create a PRD to highlight work that needs to be done during `MVP` and `Post-MVP` for the TODO app. The PRD will also highlight out-of-scope items.

## Instructions

### :keyboard: Activity: Launch a Codespace for this repository and create a new branch

Click the below button to open the **Create Codespace** page in a new tab. Use the default configuration.

   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/{{full_repo_name}}?quickstart=1)

:pencil2: Create a new branch called `feature/requirements-and-documentation`. :pencil2:

#### :keyboard: Activity: Ask Copilot to create a PRD

1. Open the **Copilot** chat panel and switch to **Agent** mode using the dropdown menu.
2. Switch to the latest model of `GPT`.
   1. Copilot chat allows you to reference files in your repo by typing `#` followed by the name of the file, which will show an auto-complete for your files. You can also click `Add Context...` option in the Copilot chat interface.
3. In the Copilot chat input field, ask copilot to summarize the MVP and Post-MVP requirements using `docs/artifacts/09162025-requirements-meeting.vtt` and `docs/artifacts/09172025-slack-conversation-export.txt`.
4. Review how the agent is able to generate all MVP, Post-MVP and out-of-scope requirements in the chat.
5. Ask Copilot to create the PRD using the PRD template in `docs/templates/prd-template.md` based on the requirements defined in `docs/artifacts/09162025-requirements-meeting.vtt` and `docs/artifacts/09172025-slack-conversation-export.txt` and store it in `docs/prd-todo.md`.
6. Commit and push your changes.

> 📝 **Note:** To help Copilot explicitly follow the requirements you can include a phrase like `Do not make assumptions about the requirements` in your prompt.

#### Success Criteria

To complete this exercise successfully, ensure that:

- A new `feature/requirements-and-documentation` branch is pushed
- `docs/prd-todo.md` exists and contains the specified requirements.

If you encounter any issues, you can:

- Double check that the newly pushed branch is called `feature/requirements-and-documentation`
- Review that `docs/prd-todo.md` was created
- Ask Copilot to fix specific problems
