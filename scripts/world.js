#!/usr/bin/env node

/**
 * Simple World CLI replacement script
 * This script handles the basic 'pack' and 'dev' commands for World mini-apps
 * when the actual World CLI tool is not available.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current file and directory paths in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get command argument
const command = process.argv[2];

if (!command) {
  console.error('Please provide a command: "dev" or "pack"');
  process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const manifestPath = path.join(rootDir, 'world-app.manifest.json');

// Ensure the manifest file exists
if (!fs.existsSync(manifestPath)) {
  console.error(`Error: Could not find ${manifestPath}`);
  process.exit(1);
}

// Read the manifest file
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

if (command === 'dev') {
  // For dev command, simply run the Vite dev server
  console.log('Starting development server...');
  execSync('pnpm dev', { stdio: 'inherit' });
} else if (command === 'pack') {
  // For pack command, build the project and create a package
  console.log('Building project...');

  try {
    // Build the project first
    execSync('pnpm build', { stdio: 'inherit' });

    if (!fs.existsSync(distDir)) {
      console.error(`Error: Build failed, ${distDir} directory not found`);
      process.exit(1);
    }

    // Copy the manifest to the dist directory
    fs.copyFileSync(manifestPath, path.join(distDir, 'world-app.manifest.json'));

    console.log('Packaging complete! World Mini-App is available in the dist/ directory');
  } catch (error) {
    console.error(`Error during build: ${error.message}`);
    process.exit(1);
  }
} else {
  console.error(`Unknown command: ${command}. Use "dev" or "pack".`);
  process.exit(1);
}
