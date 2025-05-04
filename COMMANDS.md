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
|                            |                                       | `moveRight();`            |
|                            |                                       | `}`                       |
| `if(condition) { ... }`    | Execute block if condition is true    | `if(canMoveRight()) {`    |
|                            |                                       | `moveRight();`            |
|                            |                                       | `}`                       |
| `else { ... }`             | Execute if previous if was false      | `else {`                  |
|                            |                                       | `moveDown();`             |
|                            |                                       | `}`                       |

## Variables and Functions

| Command                     | Description                       | Example                     |
| --------------------------- | --------------------------------- | --------------------------- |
| `let variable = value;`     | Create a variable                 | `let steps = 3;`            |
| `const variable = value;`   | Create a constant                 | `const dir = 'right';`      |
| `function name() { ... }`   | Define a reusable function        | `function moveSquare(){`    |
|                             |                                   | `moveRight();`              |
|                             |                                   | `moveDown();`               |
|                             |                                   | `}`                         |
| `function name(param){...}` | Define a function with parameters | `function move(steps){`     |
|                             |                                   | `for(let i=0;i<steps;i++){` |
|                             |                                   | `moveRight();`              |
|                             |                                   | `}`                         |
|                             |                                   | `}`                         |

## Formal Grammar

```bnf
<spell>       ::= <statement>*
<statement>   ::= <move-command> | <control-flow> | <variable-decl> | <function-decl> | <function-call>
<move-command> ::= "moveUp()" | "moveDown()" | "moveLeft()" | "moveRight()"
<control-flow> ::= <while-loop> | <if-statement>
<while-loop>  ::= "while" "(" <condition> ")" "{" <statement>* "}"
<if-statement> ::= "if" "(" <condition> ")" "{" <statement>* "}" ["else" "{" <statement>* "}"]
<condition>   ::= "canMoveUp()" | "canMoveDown()" | "canMoveLeft()" | "canMoveRight()" | <expression>
<variable-decl> ::= ("let" | "const" | "var") <identifier> "=" <expression> ";"
<function-decl> ::= "function" <identifier> "(" [<param-list>] ")" "{" <statement>* "}"
<function-call> ::= <identifier> "(" [<arg-list>] ")" ";"
<param-list>  ::= <identifier> ["," <identifier>]*
<arg-list>    ::= <expression> ["," <expression>]*
<expression>  ::= <literal> | <identifier> | <binary-op>
<binary-op>   ::= <expression> <operator> <expression>
<operator>    ::= "+" | "-" | "*" | "/" | ">" | "<" | ">=" | "<=" | "==" | "!="
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

| Error               | Message                                | Fix                            |
| ------------------- | -------------------------------------- | ------------------------------ |
| Unknown command     | `SyntaxError: Unknown command`         | Use defined commands:          |
|                     |                                        | moveUp(), moveDown(), etc.     |
| Missing parentheses | `SyntaxError: Expected '('`            | Include parentheses:           |
|                     |                                        | `moveRight()`                  |
| Unclosed block      | `SyntaxError: Missing '}'`             | Ensure matching braces         |
| Hitting a wall      | `Runtime Error: Cannot move into wall` | Check boundaries before moving |

## Advanced Features

The spell language now supports:

- Variables: `let steps = 3;`
- Functions with parameters: `function move(steps){...}`
- Conditionals: `if(canMoveRight()){moveRight();}`
- Loops: `while(canMoveRight()){moveRight();}`

Future versions may support additional features like:

- Arrays and objects
- More complex expressions
- Custom spell effects
