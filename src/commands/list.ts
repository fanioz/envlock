import { listEnvironments } from "../env.js";

export function runList(baseDir: string): void {
  const envs = listEnvironments(baseDir);

  if (envs.length === 0) {
    console.log("No environments found. Use `envcrypt sync <env>` to save environments.");
    return;
  }

  console.log("Available environments:");
  for (const env of envs) {
    console.log(`  ${env}`);
  }
}
