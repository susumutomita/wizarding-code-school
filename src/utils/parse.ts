import { Command, TileType } from '../types';

/**
 * Custom error for spell runtime issues
 */
export class SpellRuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpellRuntimeError';
  }
}

/**
 * Parses spell code text into executable commands
 *
 * @param text - Multiline spell code to parse
 * @returns Array of Command objects with dx/dy movement directives
 * @throws SyntaxError for unknown commands or syntax issues
 * @throws SpellRuntimeError for runtime execution issues
 */
export function parse(
  text: string,
  maze: number[][],
  initialPos: { x: number; y: number }
): Command[] {
  const currentPos = { ...initialPos };

  // These functions will check if a move is possible in a given direction
  const canMoveUp = (): boolean => {
    const newPos = { x: currentPos.x, y: currentPos.y - 1 };
    return (
      newPos.y >= 0 &&
      newPos.y < maze.length &&
      newPos.x >= 0 &&
      newPos.x < maze[0].length &&
      maze[newPos.y][newPos.x] !== TileType.WALL // Not a wall
    );
  };

  const canMoveDown = (): boolean => {
    const newPos = { x: currentPos.x, y: currentPos.y + 1 };
    return (
      newPos.y >= 0 &&
      newPos.y < maze.length &&
      newPos.x >= 0 &&
      newPos.x < maze[0].length &&
      maze[newPos.y][newPos.x] !== TileType.WALL // Not a wall
    );
  };

  const canMoveLeft = (): boolean => {
    const newPos = { x: currentPos.x - 1, y: currentPos.y };
    return (
      newPos.y >= 0 &&
      newPos.y < maze.length &&
      newPos.x >= 0 &&
      newPos.x < maze[0].length &&
      maze[newPos.y][newPos.x] !== TileType.WALL // Not a wall
    );
  };

  const canMoveRight = (): boolean => {
    const newPos = { x: currentPos.x + 1, y: currentPos.y };
    return (
      newPos.y >= 0 &&
      newPos.y < maze.length &&
      newPos.x >= 0 &&
      newPos.x < maze[0].length &&
      maze[newPos.y][newPos.x] !== TileType.WALL // Not a wall
    );
  };

  // Check if the current position is on a torch
  const isOnTorch = (): boolean => {
    return (
      currentPos.y >= 0 &&
      currentPos.y < maze.length &&
      currentPos.x >= 0 &&
      currentPos.x < maze[0].length &&
      maze[currentPos.y][currentPos.x] === TileType.TORCH
    );
  };

  // Create functions that will record movement commands
  const movements: Command[] = [];

  const moveUp = (): void => {
    movements.push({ dx: 0, dy: -1 });
    currentPos.y -= 1;
  };

  const moveDown = (): void => {
    movements.push({ dx: 0, dy: 1 });
    currentPos.y += 1;
  };

  const moveLeft = (): void => {
    movements.push({ dx: -1, dy: 0 });
    currentPos.x -= 1;
  };

  const moveRight = (): void => {
    movements.push({ dx: 1, dy: 0 });
    currentPos.x += 1;
  };

  const lightTorch = (): void => {
    if (!isOnTorch()) {
      throw new SpellRuntimeError(
        'Cannot light a torch here. You must be standing on a torch tile.'
      );
    }
    // Add a special command for lighting a torch
    movements.push({
      dx: 0,
      dy: 0,
      action: 'light-torch',
      actionPosition: { ...currentPos },
    });
  };

  // Create a safe execution context with limited functions
  const safeExecute = (code: string): Command[] => {
    try {
      // Reset movements array
      movements.length = 0;

      // Create a safe function that will execute the code with access to only permitted functions
      const sandbox = new Function(
        'moveUp',
        'moveDown',
        'moveLeft',
        'moveRight',
        'canMoveUp',
        'canMoveDown',
        'canMoveLeft',
        'canMoveRight',
        'lightTorch',
        `"use strict";
        try {
          ${code}
        } catch (e) {
          throw new Error('Runtime error: ' + e.message);
        }`
      );

      // Maximum iterations to prevent infinite loops
      const MAX_COMMANDS = 1000;

      // Execute the sandbox function with our movement recorders
      sandbox(
        moveUp,
        moveDown,
        moveLeft,
        moveRight,
        canMoveUp,
        canMoveDown,
        canMoveLeft,
        canMoveRight,
        lightTorch
      );

      // Check if too many commands were generated (possible infinite loop)
      if (movements.length > MAX_COMMANDS) {
        throw new SpellRuntimeError(`Your spell generated too many steps (${movements.length}).
          There might be an infinite loop in your code.`);
      }

      return [...movements];
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        // Improve error messages for common issues
        if (errorMessage.includes('is not defined')) {
          const match = errorMessage.match(/(\w+) is not defined/);
          const funcName = match ? match[1] : 'A function';
          throw new SyntaxError(
            `${funcName} is not a valid spell command. Check your spelling and use only approved spell commands.`
          );
        }
        throw new SpellRuntimeError(`Spell casting error: ${errorMessage}`);
      }
      throw new SpellRuntimeError('Unknown error in your spell.');
    }
  };

  // Execute the code in our safe environment
  return safeExecute(text);
}
