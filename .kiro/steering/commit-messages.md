# Commit Message Guidelines

When the user asks for a commit message recommendation, always provide a concise English version following these rules:

## Format
Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code refactoring
- `style:` for styling changes
- `docs:` for documentation
- `chore:` for maintenance tasks

## Style
- Keep it concise and under 72 characters when possible
- Use imperative mood (e.g., "Add feature" not "Added feature")
- Be specific but brief
- Focus on what changed, not how it was implemented

## Examples
Good:
- `feat: Add background-00 and remove none option from backgrounds`
- `feat: Render accessories 07, 09, 10 as top layer above capes`
- `feat: Redesign UI with header logo and simplified export button`

Avoid:
- Long detailed descriptions in the title
- Implementation details
- Multiple changes in one message (suggest splitting commits instead)

## Default Behavior
Always provide the concise version first. Only provide detailed version if explicitly requested.
