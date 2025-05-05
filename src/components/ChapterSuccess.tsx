import React from 'react';
import { Chapter, getChapter } from '../data/chapters';

interface ChapterSuccessProps {
  chapter: Chapter;
  onContinue: () => void;
  validationResult?: {
    allRequirementsMet: boolean;
    missingCommands: string[];
  };
}

export const ChapterSuccess: React.FC<ChapterSuccessProps> = ({
  chapter,
  onContinue,
  validationResult,
}) => {
  // Check if there's a next chapter
  const hasNextChapter = !!chapter.nextChapterId;
  const nextChapter = chapter.nextChapterId ? getChapter(chapter.nextChapterId) : undefined;

  return (
    <div className="chapter-success">
      <div className="success-header">
        <h2 className="success-title">
          <span role="img" aria-label="celebrate">
            🎉
          </span>{' '}
          Chapter Complete!
        </h2>
      </div>

      <div className="success-content">
        <p className="success-message">{chapter.successMessage}</p>

        {/* Show feedback about missing required commands */}
        {validationResult && !validationResult.allRequirementsMet && (
          <div className="concept-feedback-warning">
            <h3>
              <span role="img" aria-label="warning">
                ⚠️
              </span>{' '}
              Learning Opportunity
            </h3>
            <p>
              Great job solving the puzzle! However, you didn't use all the programming concepts
              this chapter was designed to teach. Try solving it again using these concepts:
            </p>
            <ul className="missing-commands-list">
              {validationResult.missingCommands.map((command, index) => (
                <li key={index}>
                  <code>{command}</code>
                </li>
              ))}
            </ul>
            <p>Using these concepts will help you become a more skilled wizard programmer!</p>
          </div>
        )}

        {validationResult &&
          validationResult.allRequirementsMet &&
          chapter.requiredCommands &&
          chapter.requiredCommands.length > 0 && (
            <div className="concept-feedback-success">
              <h3>
                <span role="img" aria-label="star">
                  ⭐
                </span>{' '}
                Perfect Spell!
              </h3>
              <p>
                Amazing! You used all the required programming concepts for this chapter. Your
                mastery of these magical concepts will serve you well in future challenges!
              </p>
            </div>
          )}

        {hasNextChapter && nextChapter && (
          <div className="next-chapter-preview">
            <h3>Next Chapter:</h3>
            <div className="next-chapter-info">
              <h4>{nextChapter.title}</h4>
              <p>{nextChapter.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="success-footer">
        <button className="continue-button" onClick={onContinue}>
          {hasNextChapter ? 'Continue to Next Chapter' : 'Back to Chapter Select'}
        </button>
      </div>
    </div>
  );
};
