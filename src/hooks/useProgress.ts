import { useState, useEffect } from 'react';
import { getFirstChapter, getChapter, Chapter } from '../data/chapters';

interface ChapterProgress {
  completed: boolean;
  code?: string;
  achievements?: {
    noHints?: boolean;
    attemptsCount?: number;
    stars?: number;
  };
}

export interface Progress {
  currentChapterId: string;
  chapters: Record<string, ChapterProgress>;
}

/**
 * Hook for managing chapter progress
 *
 * @param userId - Optional user identifier for saving progress (wallet address)
 * @returns Object with chapter management methods and current chapter data
 */
export const useProgress = (
  userId?: string
): {
  currentChapter: Chapter;
  completeChapter: (
    chapterId: string,
    code?: string,
    achievementData?: { noHints: boolean; attemptsCount: number }
  ) => void;
  navigateToChapter: (chapterId: string) => void;
  isChapterCompleted: (chapterId: string) => boolean;
  getSavedCode: (chapterId: string) => string | undefined;
  saveCodeProgress: (chapterId: string, code: string) => void;
  progress: Progress;
} => {
  const [currentChapter, setCurrentChapter] = useState<Chapter>(getFirstChapter());
  const [progress, setProgress] = useState<Progress>(() => {
    // Initialize with empty progress or load from storage
    const savedProgress = userId
      ? localStorage.getItem(`wizarding-progress-${userId}`)
      : localStorage.getItem('wizarding-progress');

    if (savedProgress) {
      try {
        return JSON.parse(savedProgress) as Progress;
      } catch (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _e
      ) {
        // Remove console.log and replace with quiet fallback
        return {
          currentChapterId: 'chapter1',
          chapters: { chapter1: { completed: false } },
        };
      }
    }

    // Default progress
    return {
      currentChapterId: 'chapter1',
      chapters: { chapter1: { completed: false } },
    };
  });

  // When userId changes, load the correct progress data
  useEffect(() => {
    const savedProgress = userId
      ? localStorage.getItem(`wizarding-progress-${userId}`)
      : localStorage.getItem('wizarding-progress');

    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress) as Progress;
        setProgress(parsed);

        // Set the current chapter based on saved progress
        const chapter = getChapter(parsed.currentChapterId);
        if (chapter) {
          setCurrentChapter(chapter);
        }
      } catch (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _e
      ) {
        // Remove console.log and handle silently
      }
    }
  }, [userId]);

  // Save progress when it changes
  useEffect(() => {
    const storageKey = userId ? `wizarding-progress-${userId}` : 'wizarding-progress';

    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, userId]);

  /**
   * Save code changes for current chapter
   */
  const saveCodeProgress = (chapterId: string, code: string): void => {
    setProgress(currentProgress => {
      const newProgress = { ...currentProgress };

      if (!newProgress.chapters) {
        newProgress.chapters = {};
      }

      if (!newProgress.chapters[chapterId]) {
        newProgress.chapters[chapterId] = { completed: false };
      }

      newProgress.chapters[chapterId].code = code;

      localStorage.setItem(
        userId ? `wizarding-progress-${userId}` : 'wizarding-progress',
        JSON.stringify(newProgress)
      );

      return newProgress;
    });
  };

  /**
   * Mark a chapter as completed and optionally save the solution code and achievements
   */
  const completeChapter = (
    chapterId: string,
    code?: string,
    achievementData?: {
      noHints: boolean;
      attemptsCount: number;
    }
  ): void => {
    setProgress(prev => {
      let stars = 1; // At least 1 star for completion
      if (achievementData) {
        if (achievementData.noHints) stars++;
        if (achievementData.attemptsCount <= 3) stars++;
      }

      const updatedProgress = {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: {
            completed: true,
            code: code || prev.chapters[chapterId]?.code,
            achievements: {
              ...prev.chapters[chapterId]?.achievements,
              ...(achievementData && {
                noHints: achievementData.noHints,
                attemptsCount: achievementData.attemptsCount,
                stars,
              }),
            },
          },
        },
      };

      // If there's a next chapter, update current chapter
      const currentChapter = getChapter(chapterId);
      if (currentChapter?.nextChapterId) {
        const nextChapter = getChapter(currentChapter.nextChapterId);
        if (nextChapter) {
          updatedProgress.currentChapterId = nextChapter.id;
          // Initialize next chapter progress if not exists
          if (!updatedProgress.chapters[nextChapter.id]) {
            updatedProgress.chapters[nextChapter.id] = { completed: false };
          }
        }
      }

      return updatedProgress;
    });
  };

  /**
   * Navigate to a specific chapter if it's available
   */
  const navigateToChapter = (chapterId: string): void => {
    const chapter = getChapter(chapterId);
    if (chapter) {
      setCurrentChapter(chapter);
      setProgress(prev => ({
        ...prev,
        currentChapterId: chapterId,
        // Initialize chapter progress if not exists
        chapters: {
          ...prev.chapters,
          [chapterId]: prev.chapters[chapterId] || { completed: false },
        },
      }));
    }
  };

  /**
   * Check if a specific chapter is completed
   */
  const isChapterCompleted = (chapterId: string): boolean => {
    return !!progress.chapters[chapterId]?.completed;
  };

  /**
   * Get saved code for a chapter if it exists
   */
  const getSavedCode = (chapterId: string): string | undefined => {
    return progress.chapters[chapterId]?.code;
  };

  return {
    currentChapter,
    completeChapter,
    navigateToChapter,
    isChapterCompleted,
    getSavedCode,
    saveCodeProgress,
    progress,
  };
};
