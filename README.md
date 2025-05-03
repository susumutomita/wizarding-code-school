# Wizarding Code School

![CI](https://github.com/susumutomita/wizarding-code-school/actions/workflows/ci.yml/badge.svg)

A gamified coding education mini-app that teaches programming concepts through
interactive spell-casting challenges. Students write "spells" (JavaScript code) to
navigate through magical dungeons and solve puzzles.

## Why This Exists

Wizarding Code School bridges the gap between traditional coding tutorials and
engaging game experiences. Built as a World Mini-App, it demonstrates how educational
content can be delivered in an immersive, interactive format.

## Project Overview

Wizarding Code School transforms learning to code into a magical adventure where:

- Students write JavaScript "spells" to navigate through dungeons
- Real-time feedback helps learners understand programming concepts
- Progressive challenges introduce variables, loops, conditionals, and functions
- Authentication via SIWE (Sign-In With Ethereum) saves learning progress
- Mini-App format makes it accessible across compatible worlds

The project uses React with TypeScript, Monaco Editor for code editing, and Vite
for blazing-fast development.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/susumutomita/wizarding-code-school.git
cd wizarding-code-school

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

After running `pnpm dev`, the application will be available at `http://localhost:5173`.

### System Requirements

- Node.js 18+
- pnpm 8+

## Step-by-Step Development Guide

1. **Set up your environment**

   ```bash
   # Install dependencies
   pnpm install
   ```

2. **Start the development server**

   ```bash
   pnpm dev
   ```

3. **Create or modify components**

   - Components are located in `src/components/`
   - Hooks can be found in `src/hooks/`
   - Maze data is defined in `src/data/`

4. **Test your changes**

   ```bash
   pnpm test
   ```

5. **Lint your code**

   ```bash
   pnpm lint
   ```

## Mini-App Build Instructions

To package the application as a World Mini-App:

```bash
# Development mode with hot reloading
pnpm world dev

# Build for production
pnpm world pack
```

The packaged Mini-App will be available in the `dist/` directory, ready for deployment.

## Architecture

```mermaid
flowchart LR
    Editor["Monaco Editor"] --> Parser["Command Parser"]
    Parser --> Runner["Spell Runner"]
    Runner --> DungeonView["Dungeon View"]
    Runner --> Feedback["Success Fail Feedback"]
```

## Glossary

| Term        | Definition                                                            |
| ----------- | --------------------------------------------------------------------- |
| Spell       | JavaScript-like code snippets that control player movement            |
| DungeonView | Grid-based visualization of the maze and player position              |
| Runner      | Execution engine that processes parsed commands and animates movement |
| SIWE        | Sign-In With Ethereum (EIP-4361) - authentication method for tracking |

## Project Structure

```typescript
wizarding-code-school/
├── src/
│   ├── components/      # React components (DungeonView, EditorPane, etc.)
│   ├── hooks/           # React hooks (useWalletAuth, useProgress, etc.)
│   ├── data/            # Maze definitions and hint data
│   ├── utils/           # Parser, runner, and other utilities
│   └── App.tsx          # Main application component
├── world-app.manifest.json  # World Mini-App manifest
└── docs/                # Additional documentation
```

## Contributing

Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to
contribute to this project. We welcome contributions from all skill levels!

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file
for details.
