import React from 'react';
import { getAllChapters } from '../data/chapters';
import { Progress } from '../hooks/useProgress';
import './achievements.css';

interface ChapterSelectorProps {
  currentChapterId: string;
  completedChapters: string[];
  onSelectChapter: (chapterId: string) => void;
  progress?: Progress;
}

export const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  currentChapterId,
  completedChapters,
  onSelectChapter,
  progress,
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
                {isCompleted && completedChapters.includes(chapter.id) && (
                  <div className="chapter-achievements">
                    {[...Array(3)].map((_, i) => {
                      const chapterAchievements = progress?.chapters[chapter.id]?.achievements;
                      const stars = chapterAchievements?.stars || 0;
                      return (
                        <span
                          key={i}
                          className={`achievement-star-small ${i < stars ? 'earned' : 'unearned'}`}
                        >
                          {i < stars ? '⭐' : '☆'}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              {!isAvailable && <div className="chapter-lock">🔒</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
