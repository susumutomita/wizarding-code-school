# UI Components Storybook

This directory contains documentation for the UI components used in Wizarding Code
School. Storybook provides interactive examples and documentation for each component.

## Running Storybook Locally

To view the component documentation:

```bash
# Navigate to project root
cd /path/to/wizarding-code-school

# Start Storybook development server
pnpm storybook
```

This will open Storybook in your browser at `http://localhost:6006`.

## Component Documentation Structure

Each component's documentation includes:

1. Interactive examples with various prop combinations
2. Auto-generated props tables from TypeScript interfaces
3. Source code view
4. Controls to modify props in real-time
5. Usage examples for common scenarios

## Adding New Component Documentation

To add documentation for a new component:

1. Create a `.stories.tsx` file alongside your component:

```tsx
// MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  title: 'Components/MyComponent',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Description of what this component does',
      },
    },
  },
  argTypes: {
    // Define control types for props
  },
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

// Default story
export const Default: Story = {
  args: {
    // Default prop values
  },
};

// Additional stories for different states/variations
export const AnotherVariant: Story = {
  args: {
    // Different prop values
  },
};
```

2. Ensure your component has proper JSDoc comments for all props
3. Run Storybook to verify your documentation

## Core Components

The following core components have Storybook documentation:

- **EditorPane**: Monaco-based code editor for writing spells
- **DungeonView**: Grid-based maze visualization
- **HintBox**: Component for displaying hints and guidance
- **RunControls**: Control panel for running/stopping code execution

## Exported Static Documentation

When a new version is released, static documentation is generated with:

```bash
pnpm storybook:build
```

The output is saved to this directory for reference by both developers and AI
assistants.
