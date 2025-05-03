# Contributing to Wizarding Code School

Thank you for your interest in contributing to the Wizarding Code School project! This guide will help you get started with the development workflow, coding standards, and process for submitting changes.

## Branch Strategy

We follow a simple branching model:

| Branch Type | Naming Convention | Purpose |
|-------------|-------------------|---------|
| `main` | `main` | Production-ready code |
| Feature Branch | `feat/feature-name` | New features or enhancements |
| Documentation Branch | `docs/topic-name` | Documentation updates |
| Bug Fix Branch | `fix/bug-description` | Fixing issues |

Always branch off from `main` when starting new work.

## Commit Message Style

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or correcting tests
- `chore`: Changes to the build process, tools, etc.

### Examples

```
feat(parser): add support for while loops
fix(dungeonview): prevent movement through walls
docs(readme): update installation instructions
```

## Pull Request Process

1. Create a new branch from `main` following the naming convention
2. Make your changes with appropriate tests
3. Ensure all tests pass and code meets style guidelines
4. Update documentation if necessary
5. Submit a Pull Request with a clear description

### PR Checklist

- [ ] Tests pass (`pnpm test`)
- [ ] Lint checks pass (`pnpm lint`)
- [ ] Documentation updated (if applicable)
- [ ] Code follows style guidelines in STYLEGUIDE.md
- [ ] Commit messages follow conventional commits format
- [ ] PR has been properly labeled

## Issue Labels

| Label | Description |
|-------|-------------|
| `type:feature` | New feature requests or implementations |
| `type:bug` | Something isn't working |
| `type:docs` | Documentation improvements |
| `type:chore` | Repository maintenance tasks |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |

## Development Setup

```bash
# Clone the repository
git clone https://github.com/susumutomita/wizarding-code-school.git
cd wizarding-code-school

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## Testing

```bash
# Run unit tests
pnpm test
```

## AI Prompt Block

### Prompt for AI Contributors

You are a senior developer contributing to the Wizarding Code School mini-app. Follow these guidelines:

1. Branch from `main` with appropriate prefix (`feat/`, `docs/`, `fix/`)
2. Implement changes following TypeScript/React best practices in STYLEGUIDE.md
3. Ensure all tests pass and add new tests for new functionality
4. Use conventional commit messages
5. Update documentation affected by changes
6. Open a PR with a detailed description of changes

When modifying UI components, check for responsive behavior and accessibility.
