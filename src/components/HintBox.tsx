import React from 'react';
import './HintBox.css';

/**
 * Props for the HintBox component
 */
interface HintBoxProps {
  /** Current hint text to display */
  hint: string | null;
  /** Handler for dismissing the current hint */
  onDismiss: () => void;
  /** Handler for requesting the next hint */
  onNext: () => void;
}

/**
 * HintBox component that displays hints with navigation controls
 */
export const HintBox: React.FC<HintBoxProps> = ({ hint, onDismiss, onNext }) => {
  if (!hint) return null;

  return (
    <div className="hint-box">
      <div className="hint-content">
        <div className="hint-icon">💡</div>
        <p className="hint-text">{hint}</p>
      </div>
      <div className="hint-controls">
        <button onClick={onDismiss} className="hint-button dismiss">
          Dismiss
        </button>
        <button onClick={onNext} className="hint-button next">
          Next Hint
        </button>
      </div>
    </div>
  );
};
