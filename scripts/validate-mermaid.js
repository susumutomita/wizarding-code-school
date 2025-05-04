#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Markdownファイルからmermaidコードブロックを抽出する関数
 */
function extractMermaidBlocks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const mermaidPattern = /```mermaid\s+([\s\S]*?)```/g;
  const blocks = [];
  let match;

  while ((match = mermaidPattern.exec(content)) !== null) {
    blocks.push({
      filePath,
      content: match[1],
      position: match.index,
    });
  }

  return blocks;
}

/**
 * 再帰的にディレクトリを検索してMarkdownファイルを見つける
 */
function findMarkdownFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(findMarkdownFiles(filePath));
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  }

  return results;
}

/**
 * Mermaid構文を検証する
 */
function validateMermaidSyntax(block) {
  const tempFile = path.join(rootDir, 'temp-mermaid-block.mmd');
  fs.writeFileSync(tempFile, block.content);

  try {
    execSync(
      `npx -p @mermaid-js/mermaid-cli mmdc --input ${tempFile} --outputFormat svg --output ${tempFile}.svg`,
      {
        stdio: ['ignore', 'ignore', 'pipe'],
      }
    );
    return true;
  } catch (error) {
    console.error(`Error in file ${block.filePath}:`);
    console.error(`Mermaid syntax error: ${error.message.split('\n').slice(0, 5).join('\n')}`);
    return false;
  } finally {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    if (fs.existsSync(`${tempFile}.svg`)) {
      fs.unlinkSync(`${tempFile}.svg`);
    }
  }
}

// メイン関数
function main() {
  console.log('Validating Mermaid diagrams in Markdown files...');
  const mdFiles = findMarkdownFiles(rootDir);
  let mermaidBlocks = [];
  let hasErrors = false;

  for (const file of mdFiles) {
    const blocks = extractMermaidBlocks(file);
    if (blocks.length > 0) {
      console.log(`Found ${blocks.length} Mermaid diagram(s) in ${path.relative(rootDir, file)}`);
      mermaidBlocks = mermaidBlocks.concat(blocks);
    }
  }

  if (mermaidBlocks.length === 0) {
    console.log('No Mermaid diagrams found in Markdown files.');
    return 0;
  }

  console.log(`Validating ${mermaidBlocks.length} Mermaid diagrams...`);

  for (const block of mermaidBlocks) {
    const isValid = validateMermaidSyntax(block);
    if (!isValid) {
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('Mermaid validation failed with errors');
    process.exit(1);
  } else {
    console.log('All Mermaid diagrams are valid!');
    process.exit(0);
  }
}

main();
