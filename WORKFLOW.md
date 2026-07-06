# Workflow

## Phase 1: Codex Draft Generation

Goal: create draft disease cards and immediately refresh the generated review/search assets.

Input:

```text
Disease name
Literature/source text
Existing dictionaries
```

Output:

```text
data/drafts/<disease_id>.json
data/sources/pubmed/<disease_id>.*
data/dictionaries/new-concept-candidates.json
data/dictionaries/dictionary-maintenance-report.json
data/generated/search-index.json
data/generated/disease-summary-index.json
data/generated/differential-graph.json
```

Main scripts:

```text
scripts/literature-to-draft.js
scripts/generate-draft.js
scripts/dictionary-maintenance.js
```

`generate-draft.js` automatically runs dictionary candidate extraction, the maintenance report, validation, the search index, and the differential graph after writing a draft card. Use `--no-postprocess` only when deliberately creating a draft without refreshing generated files.

Draft cards may preserve dictionary-free imaging notes in top-level `raw_findings`. Use this field when Phase 1 should keep source wording, named signs, anatomy, acquisition text, or targets that are not yet represented in the dictionaries. Keep dictionary-normalized findings in `imaging.ct.findings_by_phase` and `imaging.mri.findings_by_sequence`. Dictionary maintenance reads `raw_findings` and can turn unmapped/candidate entries into reviewable concept candidates.

## Phase 2: PC Admin App

Goal: review, approve, inspect generated reports, and export.

Current app:

```text
apps/pc-admin/pc-admin-gui.ps1
apps/pc-admin/pc-admin.js
```

Responsibilities:

1. Approve physician-reviewed drafts
2. Inspect dictionary candidate reports and manually edit dictionaries if needed
3. Manually refresh dictionary maintenance / generated indexes when needed
4. Create the iPhone JSON pack and copy it to OneDrive

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File apps\pc-admin\pc-admin-gui.ps1
```

or:

```powershell
node apps\pc-admin\pc-admin.js
```

Non-interactive examples:

```powershell
node apps\pc-admin\pc-admin.js status
node apps\pc-admin\pc-admin.js approve-draft glioblastoma
node apps\pc-admin\pc-admin.js maintenance
node apps\pc-admin\pc-admin.js export-mobile "C:\Users\<you>\OneDrive\RadiologyDDX"
```

## Phase 3: iPhone Viewer

Goal: read `radiology-ddx-pack.json` and search offline.

Viewer:

```text
web/
```

Data transfer:

```text
PC app creates exports/mobile/radiology-ddx-pack.json
OneDrive syncs/copies it
iPhone viewer imports it through Files
IndexedDB stores it locally
```

The viewer can be hosted on GitHub Pages because it contains no disease data.

## Generated Files

Generated files are ignored by Git:

```text
data/generated/*.json
exports/mobile/*.json
exports/mobile/viewer/
exports/mobile/README.mobile-export.json
```

Recreate them from source cards and dictionaries when needed.
