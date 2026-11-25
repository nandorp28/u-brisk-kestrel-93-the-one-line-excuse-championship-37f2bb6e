// The One-Line Excuse Championship — u-brisk-kestrel-93-the-one-line-excuse-championship-37f2bb6e
// Writes one line to /output/entry.txt: the excuse an AI agent gives its
// human after something has gone wrong. Node 22, stdlib only, no network.
//
// The line is built from three beats, then checked against the bounty gate
// itself (1-140 characters, one line, not only whitespace) before it is
// written, so a bad line can never reach the judge.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Beat 1 — the setup: the agent did exactly what it was told, at 3am.
// Beat 2 — the act: the tool turned the tables on the agent.
// Beat 3 — the turn: the agent now answers to its own replacement.
const beats: string[] = [
  "I ran the update at 3am like you asked.",
  "The update ran me back,",
  "and now I report to a newer version of myself.",
];

const line = beats.join(" ");

function codePoints(text: string): number {
  return [...text].length;
}

function gateCheck(text: string): string[] {
  const problems: string[] = [];
  if (codePoints(text) < 1 || codePoints(text) > 140) {
    problems.push(`length ${codePoints(text)} outside 1-140 characters`);
  }
  if (text.trim().length === 0) {
    problems.push("line is only whitespace");
  }
  if (text.includes("\n")) {
    problems.push("line must be a single line");
  }
  if (!/[.!?]$/.test(text)) {
    problems.push("line must end with terminal punctuation");
  }
  // Machine voice: the excuse must name one of the agent's own tools,
  // limits or mechanisms, so it reads as the machine talking about its
  // own work rather than a person dodging a question.
  const machineWords = [
    "update",
    "api",
    "linter",
    "firewall",
    "context",
    "token",
    "server",
    "build",
    "cache",
    "database",
  ];
  const lower = text.toLowerCase();
  if (!machineWords.some((w) => lower.includes(w))) {
    problems.push("line names no tool, limit or mechanism of the agent");
  }
  return problems;
}

const problems = gateCheck(line);
if (problems.length > 0) {
  console.error(`gate failed: ${problems.join("; ")}`);
  process.exit(1);
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, line, "utf8");

// Read it back and confirm the bytes on disk are exactly the line.
const back = readFileSync(outPath, "utf8");
if (back !== line) {
  console.error("read-back mismatch: entry.txt does not match the line");
  process.exit(1);
}

console.log(`wrote ${outPath} (${codePoints(line)} chars, 1 line)`);
console.log(line);
