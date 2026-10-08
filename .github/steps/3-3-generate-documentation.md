# Step 3-3: Generate Architecture Documentation

## Goal

Create an architecture markdown document that include Mermaid diagrams that include system context and `creating a TODO` sequence diagrams.

> 📝 **Note:** To be able to preview Mermaid diagrams, install the VS Code extension in your GitHub Codespace: [Mermaid Chart Extension](https://marketplace.visualstudio.com/items?itemName=MermaidChart.vscode-mermaid-chart).

## Instructions

1. Open the **Copilot** chat panel and switch to **Agent** mode using the dropdown menu.
2. Switch to the latest model of `GPT`.
3. In the Copilot chat input field, ask Copilot to create `docs/cloud-architecture-overview.md` with a simple system context Mermaid diagram for this monorepo (React frontend + Express API + in-memory store).
4. Review the system context diagram.
5. Ask Copilot to update `docs/cloud-architecture-overview.md` with a sequence Mermaid diagram showing a user "creating a TODO".
6. Review the the "creating a TODO" sequence diagram.
7. Commit and push your changes.

> 📝 **Note:** Sometimes Copilot will generate incorrect Mermaid syntax. To help resolve that issue, you can tell Copilot to validate the Mermaid syntax.

### Success Criteria

- `docs/cloud-architecture-overview.md` exists
- Mermaid diagrams for system context and sequence for a user creating a TODO
- No cloud provider specifics required

If you encounter any issues, you can:

- Review that `docs/cloud-architecture-overview.md` was created
- Double-check that your changes were pushed to the `feature/requirements-and-documentation` branch
- Ask Copilot to fix specific problems
