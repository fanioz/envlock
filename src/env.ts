import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

export interface EnvEntry {
  key: string;
  value: string;
}

export function parseEnv(content: string): EnvEntry[] {
  return content
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      if (idx === -1) return null;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      return { key, value };
    })
    .filter(Boolean) as EnvEntry[];
}

export function stringifyEnv(entries: EnvEntry[]): string {
  return entries.map(({ key, value }) => `${key}=${value}`).join("\n") + "\n";
}

export function readEnvFile(filePath: string): EnvEntry[] {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, "utf-8");
  return parseEnv(content);
}

export function writeEnvFile(filePath: string, entries: EnvEntry[]): void {
  const dir = join(filePath, "..");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, stringifyEnv(entries));
}

export function getVaultPath(baseDir: string): string {
  return join(baseDir, ".env.lock");
}

export function getEnvsDir(baseDir: string): string {
  return join(baseDir, ".envs");
}

export function listEnvironments(baseDir: string): string[] {
  const envsDir = getEnvsDir(baseDir);
  if (!existsSync(envsDir)) return [];
  return readdirSync(envsDir).filter((f) => f.endsWith(".env")).map((f) => basename(f, ".env"));
}

export function getEnvPath(envsDir: string, env: string): string {
  return join(envsDir, `${env}.env`);
}
