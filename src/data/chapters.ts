import maze01 from './maze-01.json';
import maze02 from './maze-02.json';
import mazeChapter3 from './maze-chapter3.json';
import mazeChapter4 from './maze-chapter4.json';

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
    title: 'Chapter 3: Potions Class - Decision Making',
    description: 'Learn to make decisions in your spells using conditional logic.',
    maze: mazeChapter3,
    startPosition: findStartPosition(mazeChapter3),
    hints: [
      'This maze has multiple paths and dead ends.',
      'Use if statements to check which direction you can move.',
      'Try using if (canMoveRight()) { moveRight(); } else { moveDown(); }',
      'You can combine if/else with while loops for more complex navigation.',
      'Remember to check all possible directions before deciding which way to go.',
    ],
    requiredCommands: ['if', 'canMoveRight', 'canMoveDown', 'canMoveLeft', 'canMoveUp'],
    allowedCommands: [
      'moveUp',
      'moveDown',
      'moveLeft',
      'moveRight',
      'canMoveUp',
      'canMoveDown',
      'canMoveLeft',
      'canMoveRight',
      'if',
      'else',
    ],
    nextChapterId: 'chapter4',
    introductoryText:
      "Welcome to Potions class! In this advanced lesson, you'll need to make decisions based on the maze layout. Unlike previous mazes, this one has multiple paths and dead ends. You'll need to use conditional logic (if/else statements) to check which direction you can move and choose the correct path. For example, you might need to write code like: if (canMoveRight()) { moveRight(); } else { moveDown(); }",
    sampleSolution: `// Example of using if/else for decision making
if (canMoveRight()) {
  moveRight();
} else if (canMoveDown()) {
  moveDown();
}

while (canMoveDown()) {
  moveDown();
}

if (canMoveRight()) {
  moveRight();
} else if (canMoveLeft()) {
  moveLeft();
} else {
  moveUp();
}`,
    successMessage:
      "Incredible! Your potion is perfect! You've mastered the art of decision making in your spells!",
  },
  chapter4: {
    id: 'chapter4',
    title: 'Chapter 4: Enchantment Workshop - Variables and Functions',
    description:
      'Learn to create and use variables and functions in your spells for more powerful magic.',
    maze: mazeChapter4,
    startPosition: findStartPosition(mazeChapter4),
    hints: [
      'Variables can store values that you want to use multiple times.',
      'Try using "let steps = 3;" to create a variable.',
      'Functions let you create reusable blocks of code.',
      'Define a function with "function moveInSquare() { ... }"',
      'Call your function by name with parentheses: "moveInSquare()"',
      'Functions can take parameters: "function moveSteps(count) { ... }"',
      'You can use variables inside functions to track state.',
    ],
    requiredCommands: ['function', 'let', 'var', 'const'],
    allowedCommands: [
      'moveUp',
      'moveDown',
      'moveLeft',
      'moveRight',
      'canMoveUp',
      'canMoveDown',
      'canMoveLeft',
      'canMoveRight',
      'if',
      'else',
      'while',
      'function',
      'let',
      'var',
      'const',
    ],
    introductoryText:
      "Welcome to the Enchantment Workshop! In this advanced lesson, you'll learn to create more powerful and efficient spells using variables and functions. Variables allow you to store and reuse values, while functions let you create reusable blocks of code. These concepts are essential for any wizard who wants to create complex and elegant spells without repeating themselves. For example, instead of writing the same movement pattern multiple times, you can define it once as a function and call it whenever needed.",
    sampleSolution: `// Define a function to move in a specific pattern
function moveRight3Times() {
  moveRight();
  moveRight();
  moveRight();
}

let moveCount = 0;

function moveDownAndCount(steps) {
  for (let i = 0; i < steps; i++) {
    moveDown();
    moveCount++;
  }
}

moveRight3Times();
moveDownAndCount(2);

if (moveCount >= 2) {
  moveRight();
  moveDown();
}`,
    successMessage:
      "Magnificent! You've mastered the art of creating variables and functions in your spells. Your magic is becoming more powerful and elegant!",
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
