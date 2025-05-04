import React, { useRef, useEffect, useState } from 'react';
import './styles.css';

/**
 * Interface for the position of the player in the maze
 */
interface Position {
  x: number;
  y: number;
}

/**
 * Props for the DungeonView component
 */
interface DungeonViewProps {
  /** 2D array representing the maze (0=empty, 1=wall, 2=start, 3=goal) */
  maze: number[][];
  /** Current position of the player */
  pos: Position;
  /** Optional callback when position changes */
  onPosChange?: (newPos: Position) => void;
  /** Whether to enable debug mode with WASD controls */
  debugMode?: boolean;
  /** Animation state for success/failure/wall-collision */
  animationState?: 'success' | 'failure' | 'wall-collision' | null;
}

/**
 * DungeonView component that renders a 2D maze with player position
 * In debug mode, allows manual movement with WASD keys
 */
export const DungeonView: React.FC<DungeonViewProps> = ({
  maze,
  pos,
  onPosChange,
  debugMode = false,
  animationState = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pathTraces, setPathTraces] = useState<Position[]>([]);
  const [localPos, setLocalPos] = useState<Position>(pos);

  useEffect(() => {
    setLocalPos(pos);
  }, [pos]);

  useEffect(() => {
    if (!debugMode) return;

    const handleMovement = (dx: number, dy: number): void => {
      const newX = localPos.x + dx;
      const newY = localPos.y + dy;

      if (
        newY >= 0 &&
        newY < maze.length &&
        newX >= 0 &&
        newX < maze[0].length &&
        maze[newY][newX] !== 1 // Not a wall
      ) {
        const newPos = { x: newX, y: newY };
        setLocalPos(newPos);
        if (onPosChange) {
          onPosChange(newPos);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!debugMode) return;

      switch (event.key.toLowerCase()) {
        case 'w':
          handleMovement(0, -1); // Up
          break;
        case 'a':
          handleMovement(-1, 0); // Left
          break;
        case 's':
          handleMovement(0, 1); // Down
          break;
        case 'd':
          handleMovement(1, 0); // Right
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [debugMode, localPos, maze, onPosChange]);

  useEffect(() => {
    // Add current position to path traces
    if (pos.x !== undefined && pos.y !== undefined) {
      // Limit path trace to most recent 10 positions
      setPathTraces(prev => {
        const newTraces = [...prev, { ...pos }];
        return newTraces.slice(-10); // Keep only most recent 10 positions
      });
    }
  }, [pos]);

  useEffect(() => {
    setPathTraces([]);
  }, [maze]);

  const getCellClass = (cellValue: number, rowIdx: number, colIdx: number): string => {
    if (rowIdx === localPos.y && colIdx === localPos.x) {
      return 'cell player';
    }

    switch (cellValue) {
      case 0:
        return 'cell floor';
      case 1:
        return 'cell wall';
      case 2:
        return 'cell start';
      case 3:
        return 'cell goal';
      default:
        return 'cell floor';
    }
  };

  const getTraceStyle = (trace: Position): React.CSSProperties => {
    const cellSize = containerRef.current ? containerRef.current.clientWidth / maze[0].length : 0;

    return {
      left: `${trace.x * cellSize + cellSize / 2}px`,
      top: `${trace.y * cellSize + cellSize / 2}px`,
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <div
      className={`dungeon-container ${animationState ? animationState + '-animation' : ''}`}
      ref={containerRef}
    >
      <div
        className="dungeon-grid"
        style={{
          gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${maze.length}, 1fr)`,
        }}
      >
        {maze.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div key={`${rowIdx}-${colIdx}`} className={getCellClass(cell, rowIdx, colIdx)} />
          ))
        )}
      </div>

      {/* Path traces */}
      {pathTraces.map((trace, idx) => (
        <div
          key={`trace-${idx}`}
          className="path-trace"
          style={{
            ...getTraceStyle(trace),
            opacity: 0.1 + (idx / pathTraces.length) * 0.3, // Fade out older traces
          }}
        />
      ))}

      {debugMode && (
        <div className="debug-info">
          <p>Debug Mode: Use WASD keys to move</p>
          <p>
            Position: ({localPos.x}, {localPos.y})
          </p>
          {animationState && <div>Animation: {animationState}</div>}
        </div>
      )}
    </div>
  );
};
