import React from 'react';
import { Chapter, getChapter } from '../data/chapters';

interface ChapterSuccessProps {
  chapter: Chapter;
  onContinue: () => void;
}

export const ChapterSuccess: React.FC<ChapterSuccessProps> = ({ chapter, onContinue }) => {
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
