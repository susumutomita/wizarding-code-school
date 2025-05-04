import { Command } from '../types';

/**
 * Runner type for execution outcomes
 */
export type RunnerResult = 'success' | 'fail' | 'error';

/**
 * Error information object
 */
export interface RunnerError {
  message: string;
  line?: number;
  column?: number;
}

/**
 * Position interface for player location in maze
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Executes parsed commands to animate player movement
 *
 * @param commands - Array of commands to execute
 * @param initialPos - Starting position of the player
 * @param maze - 2D array representing the maze (0=empty, 1=wall, 2=start, 3=goal)
 * @param onStep - Callback function called on each step with updated position
 * @param onEnd - Callback function called when execution ends with result and optional error
 */
export function run(
  commands: Command[],
  initialPos: Position,
  maze: number[][],
  onStep: (pos: Position) => void,
  onEnd: (result: RunnerResult, error?: RunnerError) => void
): { stop: () => void } {
  const currentPos: Position = { ...initialPos };
  let commandIndex = 0;
  let lastTimestamp = 0;
  let animationFrameId: number | null = null;
  let running = true;

  const isValidPosition = (pos: Position): boolean => {
    return (
      pos.y >= 0 &&
      pos.y < maze.length &&
      pos.x >= 0 &&
      pos.x < maze[0].length &&
      maze[pos.y][pos.x] !== 1 // Not a wall
    );
  };

  const isGoal = (pos: Position): boolean => {
    return maze[pos.y][pos.x] === 3;
  };

  const step = (timestamp: number): void => {
    if (!running) return;

    // Control animation speed (200ms between steps)
    if (timestamp - lastTimestamp < 200) {
      animationFrameId = requestAnimationFrame(step);
      return;
    }

    lastTimestamp = timestamp;

    if (commandIndex >= commands.length) {
      running = false;
      if (isGoal(currentPos)) {
        onEnd('success');
      } else {
        onEnd('fail', {
          message: "Your spell finished, but you didn't reach the goal. Try a different approach!",
        });
      }
      return;
    }

    const command = commands[commandIndex];
    const newPos: Position = {
      x: currentPos.x + command.dx,
      y: currentPos.y + command.dy,
    };

    if (isValidPosition(newPos)) {
      // Valid move, update position
      currentPos.x = newPos.x;
      currentPos.y = newPos.y;
      onStep(currentPos);

      if (isGoal(currentPos)) {
        running = false;
        onEnd('success');
        return;
      }

      commandIndex++;
    } else {
      // Hit a wall or went out of bounds
      running = false;
      onEnd('fail', {
        message: `You hit a wall at position (${newPos.x}, ${newPos.y}). Your spell needs adjusting!`,
      });
      return;
    }

    if (running) {
      animationFrameId = requestAnimationFrame(step);
    }
  };

  animationFrameId = requestAnimationFrame(step);

  return {
    stop: (): void => {
      running = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },
  };
}
