import { Command, TorchState, TileType, Position } from '../types';

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
 * Executes parsed commands to animate player movement
 *
 * @param commands - Array of commands to execute
 * @param initialPos - Starting position of the player
 * @param maze - 2D array representing the maze (0=empty, 1=wall, 2=start, 3=goal, 4=torch)
 * @param onStep - Callback function called on each step with updated position
 * @param onEnd - Callback function called when execution ends with result and optional error
 * @param torches - Array of torch states to track lit torches
 * @param onTorchUpdate - Callback function called when a torch is lit
 */
export function run(
  commands: Command[],
  initialPos: Position,
  maze: number[][],
  onStep: (pos: Position) => void,
  onEnd: (result: RunnerResult, error?: RunnerError) => void,
  torches: TorchState[] = [],
  onTorchUpdate?: (torches: TorchState[]) => void
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
      maze[pos.y][pos.x] !== TileType.WALL // Not a wall
    );
  };

  const isGoal = (pos: Position): boolean => {
    return maze[pos.y][pos.x] === TileType.GOAL;
  };

  // Initialize torches if not provided
  const torchStates = torches.length ? torches.map(t => ({ ...t })) : [];

  if (torchStates.length === 0) {
    // Scan maze for torch tiles and initialize them as unlit
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === TileType.TORCH) {
          torchStates.push({ position: { x, y }, isLit: false });
        }
      }
    }
  }

  const areAllTorchesLit = (): boolean => {
    return torchStates.every(torch => torch.isLit);
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
      // Check if goal is reached and all necessary torches are lit
      if (isGoal(currentPos) && (torchStates.length === 0 || areAllTorchesLit())) {
        onEnd('success');
      } else if (isGoal(currentPos) && !areAllTorchesLit()) {
        onEnd('fail', {
          message:
            'You reached the goal, but not all torches are lit. Light all torches to complete the level!',
        });
      } else {
        onEnd('fail', {
          message: "Your spell finished, but you didn't reach the goal. Try a different approach!",
        });
      }
      return;
    }

    const command = commands[commandIndex];

    // Handle torch lighting command
    if (command.action === 'light-torch' && command.actionPosition) {
      const { x, y } = command.actionPosition;
      const torchIndex = torchStates.findIndex(
        torch => torch.position.x === x && torch.position.y === y
      );

      if (torchIndex !== -1 && !torchStates[torchIndex].isLit) {
        torchStates[torchIndex].isLit = true;
        if (onTorchUpdate) {
          onTorchUpdate([...torchStates]);
        }
      }

      commandIndex++;
      if (running) {
        animationFrameId = requestAnimationFrame(step);
      }
      return;
    }

    // Handle movement command
    const newPos: Position = {
      x: currentPos.x + (command.dx || 0),
      y: currentPos.y + (command.dy || 0),
    };

    if (isValidPosition(newPos)) {
      // Valid move, update position
      currentPos.x = newPos.x;
      currentPos.y = newPos.y;
      onStep(currentPos);

      // Check for goal only if all torches are lit
      if (isGoal(currentPos) && areAllTorchesLit()) {
        running = false;
        onEnd('success');
        return;
      } else if (isGoal(currentPos) && !areAllTorchesLit()) {
        // Reached goal but not all torches lit - continue execution
        // We'll check again when commands are complete
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
