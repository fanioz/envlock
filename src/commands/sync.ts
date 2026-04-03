import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { decrypt, encrypt } from "../crypto.js";
import { getVaultPath, getEnvsDir, getEnvPath, parseEnv } from "../env.js";

export function runSync(baseDir: string, env: string): void {
  const vaultPath = getVaultPath(baseDir);

  if (!existsSync(vaultPath)) {
    console.error("No .env.lock found. Run `envcrypt init` first.");
    process.exit(1);
  }

  const encrypted = readFileSync(vaultPath, "utf-8");
  let decrypted: string;
  try {
    decrypted = decrypt(encrypted);
  } catch {
    console.error("Failed to decrypt .env.lock. Key may be wrong or file corrupted.");
    process.exit(1);
  }

  const envsDir = getEnvsDir(baseDir);
  if (!existsSync(envsDir)) {
    mkdirSync(envsDir, { recursive: true });
  }

  const envPath = getEnvPath(envsDir, env);
  writeFileSync(envPath, decrypted);
  copyFileSync(envPath, join(baseDir, ".env"));

  console.log(`Switched to "${env}" environment. .env updated.`);
}
