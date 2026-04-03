import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { initKey, encrypt } from "../crypto.js";
import { getVaultPath, readEnvFile } from "../env.js";

export function runInit(baseDir: string): void {
  const envPath = join(baseDir, ".env");

  if (!existsSync(envPath)) {
    writeFileSync(envPath, "");
    console.log("Created empty .env file");
  }

  const key = initKey();
  const entries = readEnvFile(envPath);
  const content = entries.length > 0
    ? entries.map(({ key, value }) => `${key}=${value}`).join("\n") + "\n"
    : "";

  const encrypted = encrypt(content, key);
  const vaultPath = getVaultPath(baseDir);
  writeFileSync(vaultPath, encrypted);

  console.log("Encrypted .env → .env.lock");
  console.log("Key saved to ~/.envcrypt.json");
  console.log("Do NOT commit .env or .env.lock to git.");
}
