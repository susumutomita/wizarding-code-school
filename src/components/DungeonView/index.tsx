import React, { useRef, useEffect, useState } from 'react';
import { TileType, TorchState } from '../../types';
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
  /** 2D array representing the maze (0=empty, 1=wall, 2=start, 3=goal, 4=torch) */
  maze: number[][];
  /** Current position of the player */
  pos: Position;
  /** Optional callback when position changes */
  onPosChange?: (newPos: Position) => void;
  /** Whether to enable debug mode with WASD controls */
  debugMode?: boolean;
  /** Animation state for success/failure/wall-collision */
  animationState?: 'success' | 'failure' | 'wall-collision' | null;
  /** Array of torch states for tracking lit torches */
  torches?: TorchState[];
  /** Optional callback when a torch is lit */
  onTorchUpdate?: (torches: TorchState[]) => void;
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
  torches = [],
  onTorchUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pathTraces, setPathTraces] = useState<Position[]>([]);
  const [localPos, setLocalPos] = useState<Position>(pos);
  const [localTorches, setLocalTorches] = useState<TorchState[]>(torches);

  // Initialize torches if none provided
  useEffect(() => {
    if (torches.length === 0) {
      const initialTorches: TorchState[] = [];

      // Scan maze for torch tiles and initialize them as unlit
      for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
          if (maze[y][x] === TileType.TORCH) {
            initialTorches.push({ position: { x, y }, isLit: false });
          }
        }
      }

      setLocalTorches(initialTorches);
      if (onTorchUpdate) {
        onTorchUpdate(initialTorches);
      }
    } else {
      setLocalTorches(torches);
    }
  }, [maze, torches, onTorchUpdate]);

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
        maze[newY][newX] !== TileType.WALL // Not a wall
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
        case 't': // Debug key to light torch
          if (maze[localPos.y][localPos.x] === TileType.TORCH) {
            const updatedTorches = [...localTorches];
            const torchIndex = updatedTorches.findIndex(
              torch => torch.position.x === localPos.x && torch.position.y === localPos.y
            );

            if (torchIndex !== -1) {
              updatedTorches[torchIndex].isLit = true;
              setLocalTorches(updatedTorches);
              if (onTorchUpdate) {
                onTorchUpdate(updatedTorches);
              }
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [debugMode, localPos, maze, onPosChange, localTorches, onTorchUpdate]);

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

  const isTorchLit = (rowIdx: number, colIdx: number): boolean => {
    return localTorches.some(
      torch => torch.position.x === colIdx && torch.position.y === rowIdx && torch.isLit
    );
  };

  const getCellClass = (cellValue: number, rowIdx: number, colIdx: number): string => {
    if (rowIdx === localPos.y && colIdx === localPos.x) {
      return 'cell player';
    }

    switch (cellValue) {
      case TileType.EMPTY:
        return 'cell floor';
      case TileType.WALL:
        return 'cell wall';
      case TileType.START:
        return 'cell start';
      case TileType.GOAL:
        return 'cell goal';
      case TileType.TORCH:
        return isTorchLit(rowIdx, colIdx) ? 'cell torch lit' : 'cell torch unlit';
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
          <p>Debug Mode: Use WASD keys to move, T to light torch</p>
          <p>
            Position: ({localPos.x}, {localPos.y})
          </p>
          <p>
            Lit Torches: {localTorches.filter(t => t.isLit).length} / {localTorches.length}
          </p>
          {animationState && <div>Animation: {animationState}</div>}
        </div>
      )}
    </div>
  );
};
