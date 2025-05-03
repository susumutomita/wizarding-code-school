import { useState, useEffect } from 'react';

interface Progress {
  completedLevels: number[];
  currentCode: Record<number, string>;
}

const STORAGE_KEY_PREFIX = 'wcs_';

/**
 * Hook for managing user progress
 * @param address Wallet address to associate with progress
 */
export const useProgress = (address: string | null) => {
  const [completed, setCompleted] = useState<number[]>([]);
  const [savedCode, setSavedCode] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!address) return;
    
    const storageKey = `${STORAGE_KEY_PREFIX}${address}`;
    const savedProgress = localStorage.getItem(storageKey);
    
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress) as Progress;
        setCompleted(parsed.completedLevels || []);
        setSavedCode(parsed.currentCode || {});
      } catch (e) {
        console.error('Failed to parse saved progress:', e);
      }
    }
  }, [address]);

  const saveProgress = (levelId: number, completed: boolean, code?: string) => {
    if (!address) return false;
    
    const storageKey = `${STORAGE_KEY_PREFIX}${address}`;
    
    let newCompleted = [...completed];
    let newSavedCode = { ...savedCode };
    
    if (completed && !newCompleted.includes(levelId)) {
      newCompleted.push(levelId);
    }
    
    if (code) {
      newSavedCode[levelId] = code;
    }
    
    setCompleted(newCompleted);
    setSavedCode(newSavedCode);
    
    const progressData: Progress = {
      completedLevels: newCompleted,
      currentCode: newSavedCode
    };
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(progressData));
      return true;
    } catch (e) {
      console.error('Failed to save progress:', e);
      return false;
    }
  };

  const getSavedCode = (levelId: number): string | null => {
    return savedCode[levelId] || null;
  };

  const isLevelCompleted = (levelId: number): boolean => {
    return completed.includes(levelId);
  };

  return {
    completed,
    saveProgress,
    getSavedCode,
    isLevelCompleted
  };
};
