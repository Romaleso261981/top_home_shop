#!/usr/bin/env node
// Запускає next start з PORT=3000, ігноруючи аргументи панелі (--host тощо)
import { spawnSync } from "child_process";

process.env.PORT = process.env.PORT || "3000";
const result = spawnSync("npx", ["next", "start"], {
  stdio: "inherit",
  env: process.env,
});
process.exit(result.status ?? 1);
