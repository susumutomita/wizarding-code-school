import { useEffect, useState } from 'react';

/**
 * A hook that detects when a specific key is pressed
 *
 * @param targetKey - The key to detect
 * @returns Whether the key is currently pressed
 */
export const useKeyPress = (targetKey: string): boolean => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent): void => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent): void => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return (): void => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]); // Only re-run if targetKey changes

  return keyPressed;
};
