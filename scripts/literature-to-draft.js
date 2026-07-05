const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const {
  ROOT,
  DATA,
  writeJson,
  loadDictionaries,
  normalizeText,
  slugify,
  conceptTokens
} = require("./lib");

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.disease) {
  console.log(`Usage:
node scripts/literature-to-draft.js --disease "Ovarian mucinous cystadenoma" --ja "卵巣粘液性嚢胞腺腫"

Options:
  --disease <en>       English disease name, required
  --ja <ja>            Japanese disease name, optional
  --query <query>      PubMed query override
  --max <n>            Number of PubMed records, default 8
  --organ <code>       Anatomy organ code, default ovary
  --subregion <code>   Anatomy subregion code, default adnexa
  --body-region <code> Anatomy body region code, default pelvis

This script never calls the OpenAI API. It fetches PubMed metadata, creates a
Codex review packet, performs lightweight dictionary extraction, and writes a
draft card. Ask Codex to refine the generated source JSON from the review packet.
`);
  process.exit(args.help ? 0 : 1);
}

const dictionaries = loadDictionaries();
const maxRecords = Number(args.max || 8);
const diseaseId = slugify(args.disease);
const pubmedQuery = args.query || `${args.disease} AND (MRI OR magnetic resonance OR CT OR computed tomography OR imaging OR radiology)`;

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});

async function main() {
  const articles = await fetchPubMed(pubmedQuery, maxRecords);
  if (!articles.length) throw new Error("No PubMed articles found.");

  const source = extractWithDictionary(articles);
  const sourcePath = path.join(DATA, "sources", "pubmed", `${source.disease_id}.source.json`);
  const packetPath = path.join(DATA, "sources", "pubmed", `${source.disease_id}.codex-review.md`);
  const articlesPath = path.join(DATA, "sources", "pubmed", `${source.disease_id}.articles.json`);

  writeJson(articlesPath, {
    disease_id: source.disease_id,
    disease_name: source.disease_name,
    query: pubmedQuery,
    fetched_at: new Date().toISOString(),
    articles
  });
  writeJson(sourcePath, source);
  fs.writeFileSync(packetPath, buildCodexPacket(source, articles, sourcePath), "utf8");

  console.log(`Articles written: ${path.relative(ROOT, articlesPath)}`);
  console.log(`Source written: ${path.relative(ROOT, sourcePath)}`);
  console.log(`Codex packet written: ${path.relative(ROOT, packetPath)}`);

  execFileSync(process.execPath, [path.join(ROOT, "scripts", "generate-draft.js"), path.relative(ROOT, sourcePath)], {
    cwd: ROOT,
    stdio: "inherit"
  });
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") out.help = true;
    else if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      const key = eq > 2 ? arg.slice(2, eq) : arg.slice(2);
      const firstValue = eq > 2 ? arg.slice(eq + 1) : argv[++i];
      if (key === "query") {
        const parts = [firstValue].filter(Boolean);
        while (i + 1 < argv.length && !String(argv[i + 1]).startsWith("--")) parts.push(argv[++i]);
        out[key] = parts.join(" ");
      } else {
        out[key] = firstValue;
      }
    }
  }
  return out;
}

async function fetchPubMed(query, max) {
  const searchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
  searchUrl.searchParams.set("db", "pubmed");
  searchUrl.searchParams.set("retmode", "json");
  searchUrl.searchParams.set("retmax", String(max));
  searchUrl.searchParams.set("sort", "relevance");
  searchUrl.searchParams.set("term", query);

  const search = await fetchJson(searchUrl);
  const ids = search.esearchresult?.idlist || [];
  if (!ids.length) return [];

  const fetchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi");
  fetchUrl.searchParams.set("db", "pubmed");
  fetchUrl.searchParams.set("retmode", "xml");
  fetchUrl.searchParams.set("id", ids.join(","));

  const xml = await fetchText(fetchUrl);
  return parsePubMedXml(xml);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

function parsePubMedXml(xml) {
  const articles = [];
  const articleBlocks = xml.match(/<PubmedArticle[\s\S]*?<\/PubmedArticle>/g) || [];
  for (const block of articleBlocks) {
    const pmid = textOf(block, "PMID");
    const title = decodeXml(textOf(block, "ArticleTitle"));
    const journal = decodeXml(textOf(block, "Title"));
    const year = textOf(block, "Year") || textOf(block, "MedlineDate");
    const doi = attrText(block, /<ArticleId[^>]*IdType="doi"[^>]*>([\s\S]*?)<\/ArticleId>/);
    const abstractParts = [...block.matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)]
      .map((match) => decodeXml(stripTags(match[1])))
      .filter(Boolean);
    const abstract = abstractParts.join("\n");
    articles.push({
      pmid,
      title,
      journal,
      year,
      doi,
      url: pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : "",
      abstract
    });
  }
  return articles.filter((item) => item.pmid || item.title || item.abstract);
}

function textOf(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? decodeXml(stripTags(match[1])).trim() : "";
}

function attrText(xml, regex) {
  const match = xml.match(regex);
  return match ? decodeXml(stripTags(match[1])).trim() : "";
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]+>/g, " ");
}

function decodeXml(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractWithDictionary(articles) {
  const combined = normalizeText(articles.map((item) => `${item.title}\n${item.abstract}`).join("\n\n"));
  const findings = [];
  for (const [conceptId, concept] of Object.entries(dictionaries.findingConcepts)) {
    const tokens = conceptTokens(concept).map(normalizeText).filter((token) => token.length >= 3);
    if (!tokens.some((token) => combined.includes(token))) continue;
    findings.push(findingFromConcept(conceptId, concept));
  }

  return normalizeSource({
    disease_id: diseaseId,
    disease_name: {
      ja: args.ja || args.disease,
      en: args.disease
    },
    disease_aliases: { ja: [], en: [args.disease] },
    clinical: {
      overview: `${args.disease} literature draft generated from PubMed abstracts. Codex review is required.`,
      treatment: "Not extracted. Codex review is required.",
      epidemiology: "Not extracted. Codex review is required."
    },
    demographics: {
      sex: {
        applicable: ["unknown"],
        predominance: "unknown",
        predilection: "unknown",
        summary: "Not extracted."
      },
      age: {
        typical_min: null,
        typical_max: null,
        peak_decade: "未確認",
        summary: "好発年齢は未確認。"
      }
    },
    keywords: [],
    frequency: {
      label: "unknown",
      summary: "Not extracted."
    },
    findings,
    references: []
  }, articles);
}

function findingFromConcept(conceptId, concept) {
  const modality = concept.allowed_modalities?.[0] || "MRI";
  const acquisitionCode = concept.allowed_acquisitions?.[0] || (modality === "CT" ? "portal_venous" : "T2WI");
  return {
    finding_text: concept.canonical_label?.ja || concept.canonical_label?.en || conceptId,
    modality,
    acquisition_type: modality === "CT" ? "phase" : "sequence",
    acquisition_code: acquisitionCode,
    anatomy: {
      body_region: args["body-region"] || "pelvis",
      organ: args.organ || "ovary",
      subregion: args.subregion || "adnexa",
      laterality: "unknown"
    },
    target: defaultTarget(conceptId),
    modifiers: concept.default_modifiers || {},
    keywords: [],
    typicality: "variable",
    diagnostic_weight: 1
  };
}

function defaultTarget(conceptId) {
  if (conceptId.includes("wall")) return "cyst_wall";
  if (conceptId.includes("papillary")) return "mural_nodule";
  if (conceptId.includes("cyst") || conceptId.includes("shading") || conceptId.includes("hemorrhage")) return "cyst_content";
  return "whole_lesion";
}

function normalizeSource(source, articles) {
  const references = articles.map((article, index) => ({
    source_id: `pmid_${article.pmid || index + 1}`,
    type: "journal_article",
    title: article.title || "",
    authors: [],
    journal: article.journal || "",
    year: article.year || "",
    pmid: article.pmid || "",
    doi: article.doi || "",
    url: article.url || "",
    license: ""
  }));

  return {
    disease_id: source.disease_id || diseaseId,
    disease_name: source.disease_name || { ja: args.ja || args.disease, en: args.disease },
    disease_aliases: source.disease_aliases || { ja: [], en: [args.disease] },
    clinical: source.clinical || {
      overview: "",
      treatment: "",
      epidemiology: ""
    },
    demographics: source.demographics,
    keywords: source.keywords || [],
    frequency: source.frequency || { label: "unknown", summary: "" },
    imaging: source.imaging || {},
    findings: source.findings || [],
    references,
    source_query: pubmedQuery,
    source_articles: articles
  };
}

function buildCodexPacket(source, articles, sourcePath) {
  const articleText = articles.map((article, index) => `## Article ${index + 1}

PMID: ${article.pmid || ""}
Title: ${article.title || ""}
Journal: ${article.journal || ""}
Year: ${article.year || ""}
DOI: ${article.doi || ""}
URL: ${article.url || ""}

Abstract:
${article.abstract || "(no abstract)"}
`).join("\n\n");

  return `# Codex Literature Extraction Packet

Disease: ${source.disease_name.en}
Japanese name: ${source.disease_name.ja}
PubMed query: ${pubmedQuery}

## Task For Codex

Read the abstracts below and edit this source JSON:

\`\`\`text
${path.relative(ROOT, sourcePath)}
\`\`\`

Goals:

1. Fill clinical overview, treatment, epidemiology, demographics, and frequency.
2. Extract CT/MRI findings into the source JSON shape used by scripts/generate-draft.js.
3. Prefer existing finding concepts. If a finding does not map, leave it descriptive; generate-draft.js will mark it as needs_mapping.
4. Keep uncertain statements conservative.
5. Do not use external APIs. Edit files directly in this workspace.

## Current Dictionary Concepts

${Object.entries(dictionaries.findingConcepts).map(([id, concept]) => `- ${id}: ${concept.canonical_label?.ja || ""} / ${concept.canonical_label?.en || ""}`).join("\n")}

## PubMed Abstracts

${articleText}
`;
}
