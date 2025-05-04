/**
 * Command interface representing a movement directive
 */
export interface Command {
  /** Horizontal movement (-1 = left, 0 = none, 1 = right) */
  dx: number;
  /** Vertical movement (-1 = up, 0 = none, 1 = down) */
  dy: number;
  /** Special action type (e.g., "light-torch") */
  action?: string;
  /** Position data for action, if applicable */
  actionPosition?: { x: number; y: number };
}

/**
 * Position interface for player or object location
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Torch state tracking
 */
export interface TorchState {
  position: Position;
  isLit: boolean;
}

/**
 * Maze tile values
 */
export enum TileType {
  EMPTY = 0,
  WALL = 1,
  START = 2,
  GOAL = 3,
  TORCH = 4,
}
