/**
 * Command interface representing a movement directive
 */
export interface Command {
  /** Horizontal movement (-1 = left, 0 = none, 1 = right) */
  dx: number;
  /** Vertical movement (-1 = up, 0 = none, 1 = down) */
  dy: number;
}
