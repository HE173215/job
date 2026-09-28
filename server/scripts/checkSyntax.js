import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const roots = ["src", "test", "scripts"];

const findJavaScriptFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findJavaScriptFiles(filePath);
    return entry.isFile() && entry.name.endsWith(".js") ? [filePath] : [];
  }));
  return nested.flat();
};

const files = (await Promise.all(roots.map(findJavaScriptFiles))).flat();
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.info(`Syntax check passed for ${files.length} JavaScript files`);
