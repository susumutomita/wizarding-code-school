import React, { useState } from 'react';
import { parse } from '../utils/parse';
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
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<RunnerResult | null>(null);
  const [stopRunner, setStopRunner] = useState<(() => void) | null>(null);

  const handleRun = () => {
    try {
      setIsRunning(true);
      setResult(null);
      
      const commands = parse(code);
      
      const runner = run(
        commands,
        position,
        maze,
        (newPos) => {
          onPositionChange(newPos);
        },
        (runResult) => {
          setIsRunning(false);
          setResult(runResult);
          setStopRunner(null);
          
          if (runResult === 'success') {
            console.log('Success! 🎉');
            
            if (onSuccess) {
              onSuccess(code);
            }
          } else {
            const dungeonElement = document.querySelector('.dungeon-container');
            if (dungeonElement) {
              dungeonElement.classList.add('error-flash');
              setTimeout(() => {
                dungeonElement.classList.remove('error-flash');
              }, 500);
            }
            console.log('Failure! ❌');
          }
        }
      );
      
      setStopRunner(() => runner.stop);
    } catch (error) {
      console.error('Error executing spell:', error);
      setIsRunning(false);
      setResult('fail');
    }
  };

  const handleStop = () => {
    if (stopRunner) {
      stopRunner();
      setStopRunner(null);
      setIsRunning(false);
    }
  };

  return (
    <div className="run-controls">
      <button onClick={handleRun} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Spell'}
      </button>
      {isRunning && (
        <button onClick={handleStop}>Stop</button>
      )}
      {result === 'success' && (
        <div className="success-message">Spell succeeded! 🎉</div>
      )}
      {result === 'fail' && (
        <div className="error-message">Spell failed! Try again.</div>
      )}
    </div>
  );
};
