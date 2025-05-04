import maze01 from './maze-01.json';
import maze02 from './maze-02.json';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  maze: number[][];
  startPosition?: { x: number; y: number };
  hints: string[];
  requiredCommands: string[];
  allowedCommands: string[];
  nextChapterId?: string;
  introductoryText: string;
  sampleSolution?: string;
  successMessage: string;
}

// Function to find the starting position in a maze
const findStartPosition = (maze: number[][]): { x: number; y: number } => {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 2) {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 }; // Default if not found
};

// Chapter definitions
export const chapters: Record<string, Chapter> = {
  chapter1: {
    id: 'chapter1',
    title: 'Chapter 1: Basic Movement',
    description: 'Learn basic movement spells to navigate through a simple dungeon.',
    maze: maze01,
    startPosition: findStartPosition(maze01),
    hints: [
      'Try using moveRight() to navigate through the maze.',
      'If you hit a wall, try a different direction like moveDown().',
      'You can use multiple movement commands in sequence.',
      'The goal is marked with a special tile in the maze.',
      'moveUp(), moveDown(), moveLeft(), and moveRight() are your basic navigation commands.',
    ],
    requiredCommands: ['moveRight', 'moveDown'],
    allowedCommands: ['moveUp', 'moveDown', 'moveLeft', 'moveRight'],
    nextChapterId: 'chapter2',
    introductoryText:
      'Welcome, young wizard! In this first lesson, you will learn basic movement spells to navigate through a simple dungeon. Use moveUp(), moveDown(), moveLeft(), and moveRight() to move your wizard character to the goal.',
    sampleSolution: `// Move right twice
moveRight();
moveRight();

// Move down twice
moveDown();
moveDown();

// Move right and down to reach the goal
moveRight();
moveDown();`,
    successMessage: "Congratulations! You've mastered the basic movement spells!",
  },
  chapter2: {
    id: 'chapter2',
    title: 'Chapter 2: Control Flow',
    description: 'Learn to use loops in your spells for more efficient navigation.',
    maze: maze02, // Custom maze designed for teaching loops
    startPosition: findStartPosition(maze02),
    hints: [
      'Notice the long corridors in this maze. Using individual commands would be tedious.',
      'Try using a while loop with canMoveRight() to move through long corridors efficiently.',
      'The syntax for a while loop is: while (condition) { actions }',
      'You can use while loops with different conditions like canMoveDown() too.',
      'Combine multiple loops to navigate different sections of the maze.',
    ],
    requiredCommands: ['while', 'canMoveRight'],
    allowedCommands: [
      'moveUp',
      'moveDown',
      'moveLeft',
      'moveRight',
      'canMoveUp',
      'canMoveDown',
      'canMoveLeft',
      'canMoveRight',
    ],
    nextChapterId: 'chapter3',
    introductoryText:
      "Well done on completing your first lesson! Now, let's learn about control flow with while loops. These allow you to repeat actions until a certain condition is met. In this maze, you'll encounter long corridors where using individual movement commands would be inefficient. By using while loops with conditions like canMoveRight(), you can write much more efficient spells!",
    sampleSolution: `// Move right until hitting a wall
while (canMoveRight()) {
  moveRight();
}

// Move down one step
moveDown();

while (canMoveLeft()) {
  moveLeft();
}

moveDown();

while (canMoveRight()) {
  moveRight();
}`,
    successMessage: "Excellent work! You've learned to use control flow in your spells!",
  },
  chapter3: {
    id: 'chapter3',
    title: 'Chapter 3: Potions Class',
    description: 'Put your wizarding skills to the test in Potions class.',
    maze: maze01, // Would replace with a different maze for this chapter
    startPosition: findStartPosition(maze01),
    hints: [
      'This potion requires precise navigation.',
      'Try combining what you learned about loops with directional changes.',
      'Sometimes you need to go in one direction, then change course.',
      'Remember to check if you can move in a direction before trying.',
    ],
    requiredCommands: ['while', 'canMoveRight', 'canMoveDown'],
    allowedCommands: [
      'moveUp',
      'moveDown',
      'moveLeft',
      'moveRight',
      'canMoveUp',
      'canMoveDown',
      'canMoveLeft',
      'canMoveRight',
    ],
    introductoryText:
      "Welcome to Potions class! In this advanced lesson, you'll need to navigate a complex path to brew a successful potion. Use all the spells you've learned so far.",
    successMessage: "Incredible! Your potion is perfect! You've become a true wizarding coder!",
  },
};

/**
 * Get a chapter by its ID
 */
export function getChapter(id: string): Chapter | undefined {
  return chapters[id];
}

/**
 * Get all chapters
 */
export function getAllChapters(): Chapter[] {
  return Object.values(chapters);
}

/**
 * Get the first chapter (for initial load)
 */
export function getFirstChapter(): Chapter {
  return chapters['chapter1'];
}

/**
 * Get a chapter by its ID using find
 */
export const getChapterById = (chapterId: string): Chapter | undefined => {
  return Object.values(chapters).find((chapter: Chapter) => chapter.id === chapterId);
};
