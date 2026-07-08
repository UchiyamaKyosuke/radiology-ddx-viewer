const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..");
const DATA = path.join(ROOT, "data");
const NODE = process.execPath;

function script(name, args = []) {
  const scriptPath = path.join(ROOT, "scripts", name);
  console.log(`[run] node scripts/${name}${args.length ? ` ${args.join(" ")}` : ""}`);
  const result = spawnSync(NODE, [scriptPath, ...args], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) {
    const error = new Error(`Failed to start scripts/${name}: ${result.error.message}`);
    error.cause = result.error;
    throw error;
  }
  if (result.status !== 0) {
    throw new Error([
      `Script failed: scripts/${name}`,
      `Exit code: ${result.status}`,
      `Working directory: ${ROOT}`,
      `Node: ${NODE}`,
      `Args: ${JSON.stringify(args)}`
    ].join("\n"));
  }
}

function step(label, fn) {
  const started = Date.now();
  console.log("");
  console.log(`[step] ${label}`);
  try {
    const value = fn();
    console.log(`[ok] ${label} (${Date.now() - started} ms)`);
    return value;
  } catch (error) {
    console.error(`[failed] ${label} (${Date.now() - started} ms)`);
    throw error;
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listJson(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => name.endsWith(".json")).sort();
}

function status() {
  const drafts = listJson(path.join(DATA, "drafts"));
  const diseases = listJson(path.join(DATA, "diseases"));
  const candidatesPath = path.join(DATA, "dictionaries", "new-concept-candidates.json");
  const candidates = fs.existsSync(candidatesPath) ? readJson(candidatesPath).candidates || [] : [];
  const pending = candidates.filter((item) => item.status === "pending");

  console.log("");
  console.log("Radiology DDX PC Admin");
  console.log("----------------------");
  console.log(`Draft cards: ${drafts.length}`);
  console.log(`Approved cards: ${diseases.length}`);
  console.log(`Pending dictionary candidates: ${pending.length}`);
  console.log("");

  if (drafts.length) {
    console.log("Drafts:");
    for (const name of drafts) console.log(`  - ${name.replace(/\.json$/, "")}`);
    console.log("");
  }

  if (pending.length) {
    console.log("Pending candidates:");
    for (const item of pending) {
      console.log(`  - ${item.candidate_id} -> ${item.proposed_concept_id}`);
    }
    console.log("");
  }
}

function approveDraft(diseaseId) {
  script("approve-draft.js", [diseaseId]);
  script("dictionary-maintenance.js");
}

function maintenance() {
  script("dictionary-maintenance.js");
}

function doctor() {
  script("doctor.js");
}

function backup() {
  script("backup-data.js");
}

function exportMobile(oneDriveDir = "") {
  step("Validate disease cards and dictionaries", () => script("validate.js"));
  step("Build search index and differential graph", () => script("build-index.js"));
  step("Create mobile .zip pack and viewer files", () => script("export-mobile-pack.js"));
  step("Validate mobile .zip pack", () => script("validate-mobile-pack.js", [path.join("exports", "mobile", "radiology-ddx-pack.zip")]));

  const packPath = path.join(ROOT, "exports", "mobile", "radiology-ddx-pack.zip");
  const targetDir = oneDriveDir || process.env.MOBILE_PACK_ONEDRIVE_DIR || "";
  if (!targetDir) {
    console.log("");
    console.log(`Pack created: ${packPath}`);
    console.log("Set MOBILE_PACK_ONEDRIVE_DIR or pass a folder path to copy it into OneDrive.");
    return;
  }

  step("Copy .zip pack to OneDrive folder", () => {
    const resolvedTargetDir = path.resolve(targetDir);
    if (!fs.existsSync(packPath)) {
      throw new Error(`Pack file does not exist: ${packPath}`);
    }
    if (fs.existsSync(resolvedTargetDir)) {
      const stat = fs.statSync(resolvedTargetDir);
      if (!stat.isDirectory()) {
        throw new Error(`OneDrive target is not a folder: ${resolvedTargetDir}`);
      }
    } else {
      fs.mkdirSync(resolvedTargetDir, { recursive: true });
    }

    const probePath = path.join(resolvedTargetDir, ".zip-pack-write-test.tmp");
    fs.writeFileSync(probePath, "write-test", "utf8");
    fs.unlinkSync(probePath);

    const dest = path.join(resolvedTargetDir, path.basename(packPath));
    fs.copyFileSync(packPath, dest);
    const sourceSize = fs.statSync(packPath).size;
    const destSize = fs.statSync(dest).size;
    if (sourceSize !== destSize) {
      throw new Error(`Copied file size mismatch: source ${sourceSize} bytes, destination ${destSize} bytes`);
    }
    console.log(`Copied mobile pack to: ${dest}`);
    console.log(`Copied bytes: ${destSize}`);
  });
}

function usage() {
  console.log(`Usage:
  node apps/pc-admin/pc-admin.js
  node apps/pc-admin/pc-admin.js status
  node apps/pc-admin/pc-admin.js approve-draft <disease_id>
  node apps/pc-admin/pc-admin.js maintenance
  node apps/pc-admin/pc-admin.js doctor
  node apps/pc-admin/pc-admin.js backup
  node apps/pc-admin/pc-admin.js export-mobile [onedrive_folder]
`);
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

async function interactive() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    while (true) {
      status();
      console.log("1. Approve draft card");
      console.log("2. Refresh candidate report / graph / index");
      console.log("3. Create mobile pack and optionally copy to OneDrive");
      console.log("4. Run doctor check");
      console.log("5. Backup local data");
      console.log("0. Exit");
      const choice = await ask(rl, "> ");

      if (choice === "0") break;
      if (choice === "1") approveDraft(await ask(rl, "disease_id: "));
      else if (choice === "2") maintenance();
      else if (choice === "3") {
        const dir = await ask(rl, "OneDrive folder path (blank = create only): ");
        exportMobile(dir);
      } else if (choice === "4") {
        doctor();
      } else if (choice === "5") {
        backup();
      } else {
        usage();
      }
    }
  } finally {
    rl.close();
  }
}

const [command, ...args] = process.argv.slice(2);

try {
  if (!command) {
    if (process.stdin.isTTY) {
      interactive();
    } else {
      usage();
      console.error("No command was provided and stdin is not interactive. Pass a command such as export-mobile.");
      process.exitCode = 1;
    }
  } else if (command === "status") {
    status();
  } else if (command === "approve-draft") {
    approveDraft(args[0]);
  } else if (command === "maintenance") {
    maintenance();
  } else if (command === "doctor") {
    doctor();
  } else if (command === "backup") {
    backup();
  } else if (command === "export-mobile") {
    exportMobile(args[0] || "");
  } else {
    usage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error("");
  console.error("PC admin command failed.");
  console.error(error && error.stack ? error.stack : error.message);
  process.exitCode = 1;
}
