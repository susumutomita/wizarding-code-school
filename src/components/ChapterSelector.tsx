import React from 'react';
import { getAllChapters } from '../data/chapters';

interface ChapterSelectorProps {
  currentChapterId: string;
  completedChapters: string[];
  onSelectChapter: (chapterId: string) => void;
}

export const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  currentChapterId,
  completedChapters,
  onSelectChapter,
}) => {
  const chapters = getAllChapters();

  return (
    <div className="chapter-selector">
      <h3>Chapters</h3>
      <div className="chapter-list">
        {chapters.map((chapter, index) => {
          const isCompleted = completedChapters.includes(chapter.id);
          const isCurrent = chapter.id === currentChapterId;
          const isAvailable =
            isCompleted || isCurrent || completedChapters.includes(chapters[index - 1]?.id || '');

          return (
            <div
              key={chapter.id}
              className={`chapter-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!isAvailable ? 'locked' : ''}`}
              onClick={() => isAvailable && onSelectChapter(chapter.id)}
            >
              <div className="chapter-number">{isCompleted ? '✓' : index + 1}</div>
              <div className="chapter-info">
                <div className="chapter-title">{chapter.title}</div>
                <div className="chapter-desc">{chapter.description}</div>
              </div>
              {!isAvailable && <div className="chapter-lock">🔒</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
