export interface HintData {
  [chapterId: string]: string[];
}

const hints: HintData = {
  chapter1: [
    'Try using moveRight() to navigate through the maze.',
    'If you hit a wall, try a different direction like moveDown().',
    'You can use multiple movement commands in sequence.',
    'The goal is marked with a special tile in the maze.',
    'moveUp(), moveDown(), moveLeft(), and moveRight() are your basic navigation commands.',
  ],
  chapter2: [
    'Remember you can combine different movement commands.',
    'Sometimes you need to take a longer path to reach the goal.',
    "If you're stuck, try mapping out your path on paper first.",
    'Look for patterns in the maze structure.',
  ],
};

export default hints;
