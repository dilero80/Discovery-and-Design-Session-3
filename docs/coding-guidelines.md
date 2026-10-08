
# Coding Guidelines for TODO App

## General Formatting

- Use consistent indentation (2 spaces for JavaScript/JSX, no tabs).
- Limit lines to 100 characters where possible.
- Use semicolons at the end of statements.
- Prefer single quotes for strings, except when using template literals.
- Add trailing commas in multi-line objects and arrays.

## Import Organization

- Group imports by library, then by relative path.
- Place external dependencies before internal modules.
- Avoid unused imports; remove them promptly.

## Linter Usage

- Use ESLint to enforce code quality and style rules.
- Fix all linter errors and warnings before committing code.
- Use Prettier for automatic code formatting where possible.

## Best Practices

- Follow the DRY (Don't Repeat Yourself) principle: extract reusable logic into functions or components.
- Use clear, descriptive names for variables, functions, and components.
- Write small, focused functions and components.
- Prefer const and let over var for variable declarations.
- Avoid deeply nested code; refactor for readability.
- Add comments to explain complex logic, but avoid obvious comments.
- Write tests for all new features and bug fixes.

## Code Reviews

- Submit pull requests for all changes.
- Review code for clarity, maintainability, and adherence to guidelines.
- Address review feedback promptly and respectfully.
