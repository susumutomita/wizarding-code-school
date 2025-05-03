# Style Guide

This document outlines the coding standards and style guidelines for the Wizarding Code School project.

## TypeScript Naming Conventions

| Type       | Convention                  | Example                                |
| ---------- | --------------------------- | -------------------------------------- |
| Components | PascalCase                  | `DungeonView.tsx`, `EditorPane.tsx`    |
| Hooks      | camelCase with 'use' prefix | `useWalletAuth.ts`, `useProgress.ts`   |
| Interfaces | PascalCase with 'I' prefix  | `IPlayerPosition`, `ISpellCommand`     |
| Types      | PascalCase                  | `Position`, `Command`, `MazeCell`      |
| Constants  | UPPER_SNAKE_CASE            | `MAX_MAZE_SIZE`, `DEFAULT_TIMEOUT_MS`  |
| Functions  | camelCase                   | `parseSpellCode()`, `executeCommand()` |
| Files      | kebab-case                  | `dungeon-view.tsx`, `editor-pane.tsx`  |
| Variables  | camelCase                   | `playerPosition`, `currentLevel`       |

## React Patterns

### Component Structure

```tsx
// Component file structure
import React, { useState, useEffect } from 'react';
import './ComponentName.css'; // If applicable

// Props interface
interface ComponentNameProps {
  propOne: string;
  propTwo?: number;
}

// Component definition
export const ComponentName: React.FC<ComponentNameProps> = ({ propOne, propTwo = 0 }) => {
  // State and hooks
  const [state, setState] = useState(initialState);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };

  // Helper functions
  const helperFunction = () => {
    // Helper logic
  };

  // Render
  return <div className="component-name">{/* JSX content */}</div>;
};
```

### Custom Hook Structure

```tsx
// Hook file structure
import { useState, useEffect } from 'react';

// Hook interface (if applicable)
interface UseHookNameOptions {
  option1: string;
  option2?: number;
}

interface UseHookNameResult {
  result1: string;
  result2: () => void;
}

// Hook definition
export const useHookName = (
  param1: string,
  { option1, option2 = 0 }: UseHookNameOptions
): UseHookNameResult => {
  // State and other hooks
  const [state, setState] = useState(initialState);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Functions
  const result2 = () => {
    // Function logic
  };

  // Return values
  return {
    result1: state,
    result2,
  };
};
```

## Comment Standards

We use TSDoc-style comments for functions and components:

````typescript
/**
 * Short description of function/component
 *
 * @param paramName - Description of parameter
 * @param options - Description of options object
 * @returns Description of return value
 *
 * @example
 * ```ts
 * const result = myFunction('input', { option1: 'value' });
 * ```
 */
function myFunction(paramName: string, options: Options): ReturnType {
  // Implementation
}
````

For inline comments, use `//` with a space after:

```typescript
// This is a good inline comment
const value = calculateSomething(); // This explains the calculation
```

## Code Formatting

We use Prettier with the following configuration:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## ESLint Rules

Our project enforces the following ESLint rules:

- `@typescript-eslint/explicit-function-return-type`: Functions must have explicit return types
- `@typescript-eslint/no-unused-vars`: No unused variables (with \_ prefix exception)
- `react-hooks/rules-of-hooks`: Enforce Rules of Hooks
- `react-hooks/exhaustive-deps`: Check effect dependencies
- `react/prop-types`: Off (TypeScript handles type checking)
- `react/react-in-jsx-scope`: Off (not needed with React 17+)
- `no-console`: Warn (avoid console.log in production)

## File Structure

```
src/
├── components/           # React components
│   ├── DungeonView/      # Component folder (for complex components)
│   │   ├── index.tsx     # Main component file
│   │   ├── types.ts      # Component-specific types
│   │   └── utils.ts      # Component-specific utilities
│   └── EditorPane.tsx    # Simple component (single file)
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
│   ├── parser.ts         # Spell parser
│   └── runner.ts         # Command runner
├── types/                # Shared TypeScript type definitions
├── constants/            # Application constants
└── App.tsx               # Root component
```

## Import Order

1. External libraries
2. Internal modules
3. Type imports
4. CSS/SCSS imports

Example:

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { monaco } from '@monaco-editor/react';

// 2. Internal modules
import { parseSpell } from '../utils/parser';
import { DungeonView } from './DungeonView';

// 3. Type imports
import type { Command, Position } from '../types';

// 4. CSS/SCSS imports
import './EditorPane.css';
```

## Additional Best Practices

- Use functional components with hooks rather than class components
- Prefer immutable state updates (use spread operators or libraries like immer)
- Keep components focused on a single responsibility
- Extract complex logic to custom hooks
- Use TypeScript generics appropriately for reusable code
- Avoid any types except in specific justified cases
- Write unit tests for utility functions and integration tests for components
