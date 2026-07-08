# Radiology DDX Starter

Offline-first radiology differential diagnosis database for personal use.

The system has three phases:

```text
Phase 1: Codex draft generation
Phase 2: PC admin app
Phase 3: iPhone viewer
```

## Phase 1: Codex Draft Generation

Codex generates draft disease cards from literature/source JSON. After a draft is written, the workflow automatically refreshes dictionary candidates, the maintenance report, validation, the search index, and the differential graph.

Key files:

```text
scripts/literature-to-draft.js
scripts/generate-draft.js
scripts/dictionary-maintenance.js
scripts/prompts/disease-card-extraction.md
data/drafts/
data/sources/
data/dictionaries/new-concept-candidates.json
data/dictionaries/dictionary-maintenance-report.json
data/generated/
```

Example:

```powershell
node scripts/literature-to-draft.js --disease "Glioblastoma" --ja "膠芽腫" --query "glioblastoma MRI CT imaging findings" --max 5
```

## Phase 2: PC Admin App

The PC app handles local review and release operations:

1. Approve physician-reviewed draft disease cards
2. Inspect dictionary candidate reports and manually edit dictionaries if needed
3. Manually refresh dictionary maintenance / generated indexes when needed
4. Create the iPhone ZIP pack and copy it to OneDrive
5. Run a full doctor check and create local backups when needed

Current implementation:

```text
apps/pc-admin/pc-admin-gui.ps1
apps/pc-admin/pc-admin.js
```

Run the GUI:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File apps\pc-admin\pc-admin-gui.ps1
```

or double-click:

```text
apps\pc-admin\Start-PC-Admin-GUI.bat
```

Run the CLI:

```powershell
node apps\pc-admin\pc-admin.js
```

With the Codex-bundled Node.js:

```powershell
& 'C:\Users\Kyouu\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' apps\pc-admin\pc-admin.js
```

Common maintenance commands:

```powershell
node apps\pc-admin\pc-admin.js backup
node apps\pc-admin\pc-admin.js doctor
node apps\pc-admin\pc-admin.js export-mobile "C:\Users\<you>\OneDrive\RadiologyDDX"
```

## Phase 3: iPhone Viewer

The iPhone viewer contains no disease data. It imports `radiology-ddx-pack.zip` from Files/OneDrive, stores it in IndexedDB, and searches offline.

## Doctor Check

Run the end-to-end Phase 1-3 smoke check:

```powershell
node scripts\doctor.js
```

This validates disease cards, rebuilds the search index and differential graph, exports and validates the mobile ZIP pack, checks the iPhone viewer JavaScript, and smoke-tests the PC admin GUI script.

## Backup

Create a timestamped local data backup:

```powershell
node scripts\backup-data.js
```

Backups are written under `backups/YYYYMMDD-HHMMSS/`.

Key files:

```text
web/
scripts/export-mobile-pack.js
scripts/validate-mobile-pack.js
```

The `web/` folder is suitable for GitHub Pages because disease data is not included.

## Layout

```text
apps/
  pc-admin/       Phase 2 PC admin app
data/
  diseases/       Approved disease cards
  drafts/         Draft disease cards
  dictionaries/   Finding concepts, synonyms, anatomy, sequences, phases
  generated/      Generated indexes, ignored by Git
  sources/        Literature/source packets
exports/mobile/   Generated iPhone packs, ignored by Git
schemas/          Disease card JSON Schema
scripts/          Workflow scripts
web/              Phase 3 data-free iPhone viewer
```

## Release To iPhone

```powershell
node apps\pc-admin\pc-admin.js export-mobile "C:\Users\<you>\OneDrive\RadiologyDDX"
```

Or:

```powershell
npm run release:mobile
```

Then upload/copy `exports/mobile/radiology-ddx-pack.zip` to OneDrive and import it in the iPhone viewer.
