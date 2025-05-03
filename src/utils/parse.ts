import { Command } from '../types';

/**
 * Parses spell code text into executable commands
 *
 * @param text - Multiline spell code to parse
 * @returns Array of Command objects with dx/dy movement directives
 * @throws SyntaxError for unknown commands
 */
export function parse(text: string): Command[] {
  const commands: Command[] = [];

  // Split text into lines and process each line
  const lines = text.split('\n');

  for (const line of lines) {
    // Skip empty lines and comment lines
    const trimmedLine = line.trim();
    if (trimmedLine === '' || trimmedLine.startsWith('//')) {
      continue;
    }

    // Check for movement commands
    if (trimmedLine.startsWith('moveUp(') && trimmedLine.endsWith(');')) {
      commands.push({ dx: 0, dy: -1 });
    } else if (trimmedLine.startsWith('moveDown(') && trimmedLine.endsWith(');')) {
      commands.push({ dx: 0, dy: 1 });
    } else if (trimmedLine.startsWith('moveLeft(') && trimmedLine.endsWith(');')) {
      commands.push({ dx: -1, dy: 0 });
    } else if (trimmedLine.startsWith('moveRight(') && trimmedLine.endsWith(');')) {
      commands.push({ dx: 1, dy: 0 });
    } else {
      throw new SyntaxError(`Unknown command: '${trimmedLine}'`);
    }
  }

  return commands;
}
