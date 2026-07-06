const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const NODE = process.execPath;

function run(label, command, args) {
  const started = Date.now();
  console.log("");
  console.log(`[doctor] ${label}`);
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "pipe",
    maxBuffer: 30 * 1024 * 1024
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) {
    throw new Error(`${label} failed to start: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
  console.log(`[doctor:ok] ${label} (${Date.now() - started} ms)`);
}

function nodeScript(label, script, args = []) {
  run(label, NODE, [path.join("scripts", script), ...args]);
}

try {
  nodeScript("Validate disease cards", "validate.js");
  nodeScript("Build search index and differential graph", "build-index.js");
  nodeScript("Export mobile .json pack", "export-mobile-pack.js");
  nodeScript("Validate mobile .json pack", "validate-mobile-pack.js", [
    path.join("exports", "mobile", "radiology-ddx-pack.json")
  ]);
  run("Check iPhone viewer JavaScript", NODE, ["--check", path.join("web", "app.js")]);
  run("Smoke test PC admin GUI script", "powershell", [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    path.join("apps", "pc-admin", "pc-admin-gui.ps1"),
    "-SmokeTest"
  ]);
  console.log("");
  console.log("Doctor check passed.");
} catch (error) {
  console.error("");
  console.error("Doctor check failed.");
  console.error(error && error.stack ? error.stack : error.message);
  process.exitCode = 1;
}
