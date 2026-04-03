import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { decrypt } from "../crypto.js";
import { getVaultPath, parseEnv } from "../env.js";

export function runRun(baseDir: string, command: string, args: string[]): void {
  const vaultPath = getVaultPath(baseDir);

  if (!existsSync(vaultPath)) {
    console.error("No .env.lock found. Run `envlock init` first.");
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

  const envEntries = parseEnv(decrypted);
  const env = { ...process.env };
  for (const { key, value } of envEntries) {
    env[key] = value;
  }

  const child = spawn(command, args, {
    env,
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });

  child.on("error", (err) => {
    console.error(`Failed to run command: ${err.message}`);
    process.exit(1);
  });
}
