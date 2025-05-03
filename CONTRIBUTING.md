# Contributing to Wizarding Code School

Thank you for your interest in contributing to the Wizarding Code School project! This guide will help you get started with the development workflow, coding standards, and process for submitting changes.

## Issue and Pull Request Workflow

### Creating Issues

1. **Check existing issues** first to avoid duplicates
2. **Use issue templates** when available to provide necessary information
3. **Label appropriately** using our labeling system
4. **Be detailed** about what problem needs to be solved or feature to be added
5. **Include steps to reproduce** for bugs, or clear requirements for features

### Working on Issues

1. **Comment on the issue** you want to work on to express interest
2. **Wait for assignment** from a maintainer before starting work
3. **Create a branch** following our naming conventions
4. **Reference the issue number** in commit messages with `#issue-number`

### Pull Request Process

1. Create a new branch from `main` following the naming convention
2. Make your changes with appropriate tests
3. Ensure all tests pass and code meets style guidelines
4. Update documentation if necessary
5. Submit a Pull Request with a clear description
6. Link the PR to related issues using "Resolves #issue-number" in the PR description
7. Wait for code review and address any requested changes

### PR Checklist

- [ ] Tests pass (`pnpm test`)
- [ ] Lint checks pass (`pnpm lint`)
- [ ] Documentation updated (if applicable)
- [ ] Code follows style guidelines in STYLEGUIDE.md
- [ ] Commit messages follow conventional commits format
- [ ] PR has been properly labeled

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

## Coding Standards and Lint Rules

This project uses ESLint and TypeScript for code quality. Our configuration enforces:

### TypeScript Standards
- Strict type checking
- No implicit `any` types
- No unused variables or parameters
- Consistent interface and type definitions

### React Best Practices
- Functional components with hooks
- Proper prop typing with PropTypes or TypeScript interfaces
- No direct DOM manipulation
- Consistent component structure

### Lint Rules
Our ESLint configuration includes:
- JavaScript Standard Style with TypeScript extensions
- React hooks rules (proper dependencies in useEffect, etc.)
- Import sorting and organization
- Accessibility (a11y) guidelines
- No console.log statements in production code

To check your code against lint rules:
```bash
# Run lint check
pnpm lint

# Fix automatic lint issues
pnpm lint:fix
```

See the `eslint.config.js` file for the complete configuration.

## Issue Labels

| Label | Description |
|-------|--------------|
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