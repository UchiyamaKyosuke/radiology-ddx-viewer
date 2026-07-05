const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BACKUP_ROOT = path.join(ROOT, "backups");

function stamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate())
  ].join("") + "-" + [
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join("");
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function writeManifest(dest, copied) {
  const manifest = {
    backup_type: "radiology-ddx-local-data-backup",
    created_at: new Date().toISOString(),
    copied,
    note: "Restore manually by copying the desired files back into the project."
  };
  fs.writeFileSync(path.join(dest, "backup-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
}

function uniqueBackupPath() {
  const base = path.join(BACKUP_ROOT, stamp());
  if (!fs.existsSync(base)) return base;
  for (let i = 2; i < 1000; i += 1) {
    const candidate = `${base}-${String(i).padStart(2, "0")}`;
    if (!fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`Could not find a unique backup path under: ${BACKUP_ROOT}`);
}

const dest = uniqueBackupPath();
const targets = [
  "data/drafts",
  "data/diseases",
  "data/dictionaries",
  "data/generated",
  "data/sources",
  "exports/mobile/README.mobile-export.json"
];

fs.mkdirSync(dest, { recursive: true });
const copied = [];
for (const rel of targets) {
  const src = path.join(ROOT, rel);
  if (fs.existsSync(src)) {
    copyRecursive(src, path.join(dest, rel));
    copied.push(rel);
  }
}
writeManifest(dest, copied);

console.log(`Backup created: ${dest}`);
console.log(`Copied targets: ${copied.length ? copied.join(", ") : "(none)"}`);
