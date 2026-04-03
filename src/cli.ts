#!/usr/bin/env node
import { Command } from "commander";
import { runInit } from "./commands/init.js";
import { runRun } from "./commands/run.js";
import { runSync } from "./commands/sync.js";
import { runList } from "./commands/list.js";

const program = new Command();

program
  .name("envlock")
  .description("Encrypt, sync, and inject .env files")
  .version("1.0.0");

program
  .command("init")
  .description("Encrypt current .env → .env.lock")
  .action(() => {
    runInit(process.cwd());
  });

program
  .command("run")
  .description("Inject decrypted values and run a command")
  .argument("<command>", "command to run")
  .allowUnknownOption()
  .action((command: string) => {
    const args = program.args.slice(1);
    runRun(process.cwd(), command, args);
  });

program
  .command("sync")
  .description("Save current env or switch to a saved environment")
  .argument("<env>", "environment name (e.g. staging, production)")
  .action((env: string) => {
    runSync(process.cwd(), env);
  });

program
  .command("list")
  .description("Show available environments")
  .action(() => {
    runList(process.cwd());
  });

program.parse();
