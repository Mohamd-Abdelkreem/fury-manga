import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const defaultOutputFile = "ALL_PROJECT_CODE.txt";
const targetOutputFile = process.argv[2]
  ? resolve(repositoryRoot, process.argv[2])
  : resolve(repositoryRoot, defaultOutputFile);

const ignoredDirectories = new Set([
  ".git",
  ".github",
  ".next",
  ".turbo",
  ".codex",
  ".vscode",
  ".idea",
  "node_modules",
  "dist",
  "build",
  "out",
  "coverage",
  ".cache",
  "screenshots",
  "docs",
  "generated",
]);

const ignoredExtensions = new Set([
  // Markdown files (strictly excluded as requested)
  ".md",
  ".markdown",
  ".mdx",
  // Image assets
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".ico",
  ".bmp",
  ".tiff",
  ".svg",
  // Video and audio
  ".mp4",
  ".webm",
  ".mov",
  ".avi",
  ".mkv",
  ".mp3",
  ".wav",
  ".ogg",
  ".flac",
  // Fonts
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".otf",
  // Archives and binaries
  ".zip",
  ".tar",
  ".gz",
  ".7z",
  ".rar",
  ".pdf",
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".bin",
  ".map",
  ".lock",
]);

const ignoredFiles = new Set([
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lockb",
  ".env",
  ".env.local",
  ".env.production",
  ".env.test",
]);

/**
 * Normalizes file path to forward slashes relative to repository root
 */
function toRepoRelative(absolutePath) {
  return relative(repositoryRoot, absolutePath).split(sep).join("/");
}

/**
 * Checks if a file is a binary file based on buffer inspection
 */
function isBinaryBuffer(buffer) {
  const checkLength = Math.min(buffer.length, 8000);
  for (let i = 0; i < checkLength; i += 1) {
    if (buffer[i] === 0) {
      return true;
    }
  }
  return false;
}

/**
 * Recursively scans directory and collects matching source files
 */
async function collectSourceFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    const relPath = toRepoRelative(fullPath);

    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        continue;
      }
      const nestedFiles = await collectSourceFiles(fullPath);
      files.push(...nestedFiles);
    } else if (entry.isFile()) {
      if (resolve(fullPath) === targetOutputFile) {
        continue;
      }
      if (ignoredFiles.has(entry.name)) {
        continue;
      }
      const extMatch = entry.name.match(/\.[^.]+$/u);
      const ext = extMatch ? extMatch[0].toLowerCase() : "";

      if (ignoredExtensions.has(ext)) {
        continue;
      }

      // Check if file is inside public static media folders
      if (relPath.startsWith("apps/web/public/")) {
        continue;
      }

      files.push({
        fullPath,
        relPath,
        name: entry.name,
        ext,
      });
    }
  }

  return files;
}

/**
 * Determines file grouping priority for sorting
 */
function getFilePriority(relPath) {
  if (!relPath.includes("/")) {
    return 10; // Root files
  }
  if (relPath.startsWith("scripts/")) {
    return 20;
  }
  if (relPath.startsWith("packages/contracts/")) {
    return 30;
  }
  if (relPath.startsWith("packages/database/")) {
    return 40;
  }
  if (relPath.startsWith("packages/")) {
    return 50;
  }
  if (relPath.startsWith("apps/api/")) {
    return 60;
  }
  if (relPath.startsWith("apps/web/")) {
    return 70;
  }
  return 80;
}

async function main() {
  process.stdout.write("Scanning repository for project source code...\n");

  const candidateFiles = await collectSourceFiles(repositoryRoot);

  candidateFiles.sort((a, b) => {
    const priorityA = getFilePriority(a.relPath);
    const priorityB = getFilePriority(b.relPath);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return a.relPath.localeCompare(b.relPath);
  });

  const processedFiles = [];
  let totalLines = 0;

  for (const file of candidateFiles) {
    const buffer = await readFile(file.fullPath);
    if (isBinaryBuffer(buffer)) {
      continue;
    }

    const content = buffer.toString("utf-8");
    const lines = content.length === 0 ? 0 : content.split("\n").length;
    const fileStat = await stat(file.fullPath);

    totalLines += lines;
    processedFiles.push({
      relPath: file.relPath,
      sizeBytes: fileStat.size,
      lines,
      content,
    });
  }

  const outputParts = [];

  outputParts.push(
    "================================================================================",
  );
  outputParts.push("PROJECT SOURCE CODE BUNDLE");
  outputParts.push(
    "================================================================================",
  );
  outputParts.push(`Generated: ${new Date().toISOString()}`);
  outputParts.push(`Total Files: ${processedFiles.length}`);
  outputParts.push(`Total Lines of Code: ${totalLines}`);
  outputParts.push(
    "Excluded: node_modules, build artifacts, media, lockfiles, and markdown (.md)",
  );
  outputParts.push(
    "================================================================================\n",
  );

  outputParts.push("TABLE OF CONTENTS / FILE INDEX:");
  outputParts.push(
    "--------------------------------------------------------------------------------",
  );
  processedFiles.forEach((file, index) => {
    const indexStr = String(index + 1).padStart(3, " ");
    const lineStr = `${file.lines} lines`.padStart(11, " ");
    const sizeStr = `${(file.sizeBytes / 1024).toFixed(1)} KB`.padStart(9, " ");
    outputParts.push(`${indexStr}. [${lineStr} | ${sizeStr}] ${file.relPath}`);
  });
  outputParts.push(
    "--------------------------------------------------------------------------------\n\n",
  );

  for (const file of processedFiles) {
    outputParts.push(
      "================================================================================",
    );
    outputParts.push(`FILE: ${file.relPath}`);
    outputParts.push(
      "================================================================================",
    );
    outputParts.push(file.content);
    if (!file.content.endsWith("\n")) {
      outputParts.push("");
    }
    outputParts.push("\n");
  }

  const finalOutput = outputParts.join("\n");
  await writeFile(targetOutputFile, finalOutput, "utf-8");

  const outStat = await stat(targetOutputFile);
  const outSizeKb = (outStat.size / 1024).toFixed(2);
  const outSizeMb = (outStat.size / (1024 * 1024)).toFixed(2);

  process.stdout.write(`\nBundle generated successfully!\n`);
  process.stdout.write(`Output path: ${toRepoRelative(targetOutputFile)}\n`);
  process.stdout.write(`Total files included: ${processedFiles.length}\n`);
  process.stdout.write(`Total lines: ${totalLines}\n`);
  process.stdout.write(`Bundle size: ${outSizeKb} KB (${outSizeMb} MB)\n`);
}

main().catch((error) => {
  process.stderr.write(
    `Error bundling project: ${error.stack || error.message}\n`,
  );
  process.exit(1);
});
