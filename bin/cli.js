#!/usr/bin/env node
import { spawn } from 'node:child_process';
import readline from 'node:readline';

const GRAY = '\x1b[38;5;244m';
const NEON = '\x1b[38;5;46m';
const RESET = '\x1b[0m';

const args = process.argv.slice(2);
const child = spawn('flutter', ['run', ...args], { stdio: ['inherit', 'pipe', 'pipe'] });

function colorize(stream) {
  const rl = readline.createInterface({ input: stream });
  rl.on('line', (line) => {
    const color = line.includes('flutter (') ? NEON : GRAY;
    process.stdout.write(`${color}${line}${RESET}\n`);
  });
}

colorize(child.stdout);
colorize(child.stderr);

child.on('exit', (code) => process.exit(code ?? 0));
