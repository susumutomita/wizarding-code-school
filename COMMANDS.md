# Spell Command Language Specification

## Purpose

This document defines the Domain-Specific Language (DSL) used in Wizarding Code
School. "Spells" are JavaScript-like commands that control player movement through
the maze.

## Input

Text code written by the user in the Monaco editor.

## Output

Parsed `Command[]` array with movement directives that can be executed by the Runner.

## Basic Movement Commands

| Command       | Description                | Result            |
| ------------- | -------------------------- | ----------------- |
| `moveUp()`    | Move player one cell up    | `{dx: 0, dy: -1}` |
| `moveDown()`  | Move player one cell down  | `{dx: 0, dy: 1}`  |
| `moveLeft()`  | Move player one cell left  | `{dx: -1, dy: 0}` |
| `moveRight()` | Move player one cell right | `{dx: 1, dy: 0}`  |

## Control Flow Commands

| Command                    | Description                           | Example                   |
| -------------------------- | ------------------------------------- | ------------------------- |
| `while(condition) { ... }` | Repeat block until condition is false | `while(canMoveRight()) {` |
|                            |                                       | `  moveRight();`          |
|                            |                                       | `}`                       |

## Formal Grammar

```bnf
<spell>       ::= <statement>*
<statement>   ::= <move-command> | <control-flow>
<move-command> ::= "moveUp()" | "moveDown()" | "moveLeft()" | "moveRight()"
<control-flow> ::= <while-loop>
<while-loop>  ::= "while" "(" <condition> ")" "{" <statement>* "}"
<condition>   ::= "canMoveUp()" | "canMoveDown()" | "canMoveLeft()" | "canMoveRight()"
```

## Sample Spells

### Simple Movement Path

```javascript
// Move to the right 3 times
moveRight();
moveRight();
moveRight();

// Then go down twice
moveDown();
moveDown();
```

### Using Control Flow (Advanced Levels)

```javascript
// Follow right wall until you can't anymore
while (canMoveRight()) {
  moveRight();
}

// Then go down and left
moveDown();
moveLeft();
```

## Complete Example: Solving a Basic Maze

```javascript
// Example solution for Maze 1
moveRight();
moveRight();
moveDown();
moveDown();
moveRight();
moveRight();
moveDown();
moveDown();
moveRight();
```

## Common Errors and Fixes

| Error               | Message                                       | Fix                                  |
| ------------------- | --------------------------------------------- | ------------------------------------ |
| Unknown command     | `SyntaxError: Unknown command 'move()'`       | Use one of the defined commands:     |
|                     |                                               | moveUp(), moveDown(), moveLeft(),    |
|                     |                                               | moveRight()                          |
| Missing parentheses | `SyntaxError: Expected '(' after 'moveRight'` | Make sure to include parentheses:    |
|                     |                                               | `moveRight()`                        |
| Unclosed block      | `SyntaxError: Missing closing '}'`            | Ensure all code blocks have matching |
|                     |                                               | braces                               |
| Hitting a wall      | `Runtime Error: Cannot move into wall at      | Check maze boundaries before moving  |
|                     | position (x,y)`                               |                                      |

## Extension Points

Future versions will support:

- Functions with parameters: `move(direction, steps)`
- Conditionals: `if (isGoalAhead()) { moveForward(); }`
- Variables: `let steps = 3;`
