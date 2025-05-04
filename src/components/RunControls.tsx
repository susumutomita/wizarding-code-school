import React, { useState } from 'react';
import { parse, SpellRuntimeError } from '../utils/parse';
import { run, Position, RunnerResult } from '../utils/runner';

/**
 * Props for the RunControls component
 */
interface RunControlsProps {
  /** Current code to execute */
  code: string;
  /** Maze data */
  maze: number[][];
  /** Player position */
  position: Position;
  /** Callback when position changes */
  onPositionChange: (pos: Position) => void;
  /** Optional callback to save progress */
  onSuccess?: (code: string) => void;
  /** Optional callback for showing a hint */
  onShowHint?: () => void;
  /** Optional callback for animation state */
  onAnimationState?: (state: 'success' | 'failure' | 'wall-collision' | null) => void;
}

/**
 * RunControls component that provides execution controls for spells
 */
export const RunControls: React.FC<RunControlsProps> = ({
  code,
  maze,
  position,
  onPositionChange,
  onSuccess,
  onShowHint,
  onAnimationState,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<RunnerResult | null>(null);
  const [stopRunner, setStopRunner] = useState<(() => void) | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const resetPlayerPosition = (): void => {
    // Find the starting position (cell with value 2) in the maze
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 2) {
          onPositionChange({ x, y });
          return;
        }
      }
    }
  };

  const handleRun = (): void => {
    try {
      setIsRunning(true);
      setResult(null);
      setErrorMessage(null);
      setAttempts(prev => prev + 1);

      // Reset animation state
      if (onAnimationState) {
        onAnimationState(null);
      }

      // Reset player to starting position
      resetPlayerPosition();

      // Parse the code to get commands
      const commands = parse(code, maze, position);

      const runner = run(
        commands,
        position,
        maze,
        newPos => {
          onPositionChange(newPos);
        },
        (runResult, error) => {
          setIsRunning(false);
          setResult(runResult);
          setStopRunner(null);

          if (error) {
            setErrorMessage(error.message);

            // If the error is about hitting a wall, show the wall collision animation
            if (error.message.includes('wall')) {
              if (onAnimationState) {
                onAnimationState('wall-collision');
              }
            }
          }

          if (runResult === 'success') {
            // Success animation and feedback
            if (onAnimationState) {
              onAnimationState('success');
            }

            // Wait for the animation to play before showing success dialog
            setTimeout(() => {
              if (onSuccess) {
                onSuccess(code);
              }
            }, 1500);
          } else if (runResult === 'fail') {
            // Failure animation
            if (onAnimationState) {
              onAnimationState('failure');
            }

            // Visual feedback for failure
            const dungeonElement = document.querySelector('.dungeon-container');
            if (dungeonElement) {
              dungeonElement.classList.add('error-flash');
              setTimeout(() => {
                dungeonElement.classList.remove('error-flash');
              }, 500);
            }

            // After multiple attempts, suggest hints
            if (attempts >= 2 && onShowHint) {
              setTimeout(() => {
                onShowHint();
              }, 1500);
            }
          }
        }
      );

      setStopRunner(() => runner.stop);
    } catch (error) {
      // Handle parse errors
      setIsRunning(false);
      setResult('error');
      setStopRunner(null);

      if (error instanceof SyntaxError || error instanceof SpellRuntimeError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(`Spell casting error: ${error.message}`);
      } else {
        setErrorMessage('An unknown error occurred while casting your spell.');
      }

      // After multiple errors, suggest hints
      if (attempts >= 2 && onShowHint) {
        setTimeout(() => {
          onShowHint();
        }, 1500);
      }
    }
  };

  const handleStop = (): void => {
    if (stopRunner) {
      stopRunner();
      setStopRunner(null);
      setIsRunning(false);

      // Reset animation state when stopped
      if (onAnimationState) {
        onAnimationState(null);
      }
    }
  };

  const handleReset = (): void => {
    resetPlayerPosition();
    setResult(null);
    setErrorMessage(null);

    // Reset animation state when reset
    if (onAnimationState) {
      onAnimationState(null);
    }
  };

  return (
    <div className="run-controls">
      <div className="button-container">
        <button onClick={handleRun} disabled={isRunning} className="primary-button">
          {isRunning ? 'Running...' : 'Run Spell'}
        </button>
        {isRunning && (
          <button onClick={handleStop} className="secondary-button">
            Stop
          </button>
        )}
        {!isRunning && result && (
          <button onClick={handleReset} className="secondary-button">
            Reset
          </button>
        )}
        {onShowHint && (
          <button onClick={onShowHint} className="hint-button" disabled={isRunning}>
            Get Hint
          </button>
        )}
      </div>

      <div className="feedback-area">
        {result === 'success' && (
          <div className="success-message">
            <span role="img" aria-label="celebrate">
              🎉
            </span>{' '}
            Spell succeeded! The wizard reached the goal!
          </div>
        )}
        {result === 'fail' && (
          <div className="error-message">
            <span role="img" aria-label="warning">
              ⚠️
            </span>{' '}
            Spell failed! {errorMessage || 'Try again.'}
          </div>
        )}
        {result === 'error' && (
          <div className="syntax-error-message">
            <span role="img" aria-label="error">
              ❌
            </span>{' '}
            {errorMessage || 'Syntax error in your spell.'}
          </div>
        )}
      </div>
    </div>
  );
};
