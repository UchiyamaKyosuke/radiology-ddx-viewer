const fs = require("fs");
const path = require("path");
const { DATA, writeJson, slugify } = require("./lib");

const now = new Date().toISOString();
const draftsDir = path.join(DATA, "drafts");
const sourcesDir = path.join(DATA, "sources", "pubmed");
const shouldFetch = !process.argv.includes("--no-fetch");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

function ensureDictionaryEntries() {
  const anatomyPath = path.join(DATA, "dictionaries", "anatomy-map.json");
  const anatomy = readJson(anatomyPath);
  anatomy.organs = anatomy.organs || {};
  anatomy.subregions = anatomy.subregions || {};
  for (const [id, ja, en] of [
    ["pineal_gland", "松果体", "pineal gland"],
    ["skull_base", "頭蓋底", "skull base"],
    ["choroid_plexus", "脈絡叢", "choroid plexus"],
    ["corpus_callosum", "脳梁", "corpus callosum"],
    ["optic_pathway", "視路", "optic pathway"],
    ["hypothalamus", "視床下部", "hypothalamus"],
    ["basal_ganglia", "基底核", "basal ganglia"]
  ]) {
    if (!anatomy.organs[id]) anatomy.organs[id] = { label: { ja, en }, synonyms: [ja, en] };
  }
  for (const [id, ja, en] of [
    ["frontal_lobe", "前頭葉", "frontal lobe"],
    ["parietal_lobe", "頭頂葉", "parietal lobe"],
    ["occipital_lobe", "後頭葉", "occipital lobe"],
    ["limbic_system", "辺縁系", "limbic system"],
    ["pineal_region", "松果体部", "pineal region"],
    ["foramen_of_monro", "モンロー孔", "foramen of Monro"],
    ["clivus", "斜台", "clivus"],
    ["cavernous_sinus", "海綿静脈洞", "cavernous sinus"],
    ["pituitary_stalk", "下垂体茎", "pituitary stalk"],
    ["optic_chiasm", "視交叉", "optic chiasm"],
    ["basal_cistern", "脳底槽", "basal cistern"],
    ["subependymal", "脳室上衣下", "subependymal"],
    ["periventricular", "脳室周囲", "periventricular"],
    ["symmetric_white_matter", "対称性白質", "symmetric white matter"],
    ["corticospinal_tract", "皮質脊髄路", "corticospinal tract"],
    ["cerebral_convexity", "大脳円蓋部", "cerebral convexity"]
  ]) {
    if (!anatomy.subregions[id]) anatomy.subregions[id] = { label: { ja, en }, synonyms: [ja, en] };
  }
  writeJson(anatomyPath, anatomy);

  const targetPath = path.join(DATA, "dictionaries", "target-map.json");
  const targets = readJson(targetPath);
  for (const [id, ja, en] of [
    ["meninges", "髄膜", "meninges"],
    ["cortex", "皮質", "cortex"],
    ["deep_gray_matter", "深部灰白質", "deep gray matter"],
    ["white_matter", "白質", "white matter"],
    ["pituitary_stalk", "下垂体茎", "pituitary stalk"],
    ["skull_base_mass", "頭蓋底腫瘤", "skull base mass"],
    ["pineal_mass", "松果体部腫瘤", "pineal region mass"],
    ["developmental_anomaly", "形成異常", "developmental anomaly"],
    ["microbleeds", "微小出血", "microbleeds"]
  ]) {
    if (!targets[id]) targets[id] = { label: { ja, en }, synonyms: [ja, en] };
  }
  writeJson(targetPath, targets);

  const conceptsPath = path.join(DATA, "dictionaries", "finding-concepts.json");
  const concepts = readJson(conceptsPath);
  const add = (id, item) => {
    if (concepts[id]) return;
    concepts[id] = {
      canonical_label: { ja: item.ja, en: item.en },
      feature: item.feature || "imaging_pattern",
      allowed_modalities: item.modalities || ["MRI", "CT"],
      allowed_acquisitions: item.acquisitions || ["T1WI", "T2WI", "FLAIR", "contrast_enhanced_T1WI", "non_contrast"],
      default_polarity: "present",
      default_modifiers: item.modifiers || {},
      synonyms: { ja: item.synJa || [item.ja], en: item.synEn || [item.en] },
      tokens: item.tokens || [item.ja, item.en],
      opposites: item.opposites || []
    };
  };
  add("finding:leptomeningeal_enhancement", { ja: "軟髄膜造影", en: "leptomeningeal enhancement", acquisitions: ["contrast_enhanced_T1WI"], tokens: ["軟髄膜造影", "leptomeningeal"] });
  add("finding:pachymeningeal_enhancement", { ja: "硬膜びまん性造影", en: "pachymeningeal enhancement", acquisitions: ["contrast_enhanced_T1WI"], tokens: ["硬膜造影", "pachymeningeal"] });
  add("finding:thin_regular_ring_enhancement", { ja: "薄く平滑なリング状造影", en: "thin smooth ring enhancement", acquisitions: ["contrast_enhanced_T1WI"], tokens: ["薄いリング", "smooth ring"] });
  add("finding:subependymal_nodule", { ja: "脳室上衣下結節", en: "subependymal nodule", acquisitions: ["T1WI", "T2WI", "FLAIR", "non_contrast"], tokens: ["上衣下結節", "subependymal nodule"] });
  add("finding:cortical_subcortical_lesion", { ja: "皮質〜皮質下病変", en: "cortical-subcortical lesion", tokens: ["皮質下", "cortical-subcortical"] });
  add("finding:bilateral_symmetric_white_matter_lesions", { ja: "両側対称性白質病変", en: "bilateral symmetric white matter lesions", acquisitions: ["T2WI", "FLAIR"], tokens: ["対称性白質", "symmetric white matter"] });
  add("finding:basal_ganglia_involvement", { ja: "基底核病変", en: "basal ganglia involvement", acquisitions: ["T2WI", "FLAIR", "DWI", "ADC"], tokens: ["基底核", "basal ganglia"] });
  add("finding:mass_effect", { ja: "mass effect", en: "mass effect", tokens: ["mass effect", "圧排"] });
  add("finding:midline_shift", { ja: "正中偏位", en: "midline shift", tokens: ["正中偏位", "midline shift"] });
  add("finding:ventriculomegaly", { ja: "脳室拡大", en: "ventriculomegaly", tokens: ["脳室拡大", "ventriculomegaly"] });
  add("finding:pituitary_stalk_thickening", { ja: "下垂体茎肥厚", en: "pituitary stalk thickening", acquisitions: ["contrast_enhanced_T1WI"], tokens: ["下垂体茎肥厚", "pituitary stalk"] });
  add("finding:clival_bone_destruction", { ja: "斜台骨破壊", en: "clival bone destruction", acquisitions: ["non_contrast", "contrast_enhanced_T1WI"], tokens: ["斜台骨破壊", "clival destruction"] });
  add("finding:callosal_lesion", { ja: "脳梁病変", en: "corpus callosum lesion", acquisitions: ["T2WI", "FLAIR", "DWI"], tokens: ["脳梁", "corpus callosum"] });
  add("finding:cortical_laminar_necrosis", { ja: "皮質層状壊死", en: "cortical laminar necrosis", acquisitions: ["T1WI", "FLAIR"], tokens: ["皮質層状壊死", "laminar necrosis"] });
  writeJson(conceptsPath, concepts);
}

async function fetchPubMed(spec) {
  const articlesPath = path.join(sourcesDir, `${spec.id}.articles.json`);
  if (!shouldFetch && fs.existsSync(articlesPath)) return readJson(articlesPath).articles || [];
  if (!shouldFetch) return [];
  const query = spec.query || `${spec.en}[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])`;
  const searchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
  searchUrl.searchParams.set("db", "pubmed");
  searchUrl.searchParams.set("retmode", "json");
  searchUrl.searchParams.set("retmax", "3");
  searchUrl.searchParams.set("sort", "relevance");
  searchUrl.searchParams.set("term", query);
  const search = await (await fetch(searchUrl)).json();
  const ids = search.esearchresult?.idlist || [];
  if (!ids.length) {
    writeJson(articlesPath, { disease_id: spec.id, disease_name: { ja: spec.ja, en: spec.en }, query, fetched_at: now, articles: [] });
    return [];
  }
  await sleep(700);
  const fetchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi");
  fetchUrl.searchParams.set("db", "pubmed");
  fetchUrl.searchParams.set("retmode", "xml");
  fetchUrl.searchParams.set("id", ids.join(","));
  const xml = await (await fetch(fetchUrl)).text();
  const articles = parsePubMedXml(xml);
  writeJson(articlesPath, { disease_id: spec.id, disease_name: { ja: spec.ja, en: spec.en }, query, fetched_at: now, articles });
  const sourcePath = path.join(sourcesDir, `${spec.id}.source.json`);
  writeJson(sourcePath, {
    disease_id: spec.id,
    disease_name: { ja: spec.ja, en: spec.en },
    disease_aliases: spec.aliases,
    clinical: spec.clinical,
    demographics: spec.demographics,
    frequency: spec.frequency,
    imaging: {},
    findings: [],
    references: []
  });
  fs.writeFileSync(path.join(sourcesDir, `${spec.id}.codex-review.md`), `# ${spec.en}\n\nPubMed query: ${query}\n\n${articles.map((a) => `- PMID ${a.pmid}: ${a.title}`).join("\n")}\n`, "utf8");
  await sleep(900);
  return articles;
}

function parsePubMedXml(xml) {
  const articleBlocks = xml.match(/<PubmedArticle[\s\S]*?<\/PubmedArticle>/g) || [];
  return articleBlocks.map((block) => {
    const textOf = (tag) => decodeXml((block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)) || [])[1] || "");
    const doi = decodeXml((block.match(/<ArticleId[^>]*IdType="doi"[^>]*>([\s\S]*?)<\/ArticleId>/) || [])[1] || "");
    return {
      pmid: textOf("PMID").replace(/<[^>]+>/g, "").trim(),
      title: textOf("ArticleTitle").replace(/<[^>]+>/g, " ").trim(),
      journal: textOf("Title").replace(/<[^>]+>/g, " ").trim(),
      year: textOf("Year").replace(/<[^>]+>/g, "").trim() || textOf("MedlineDate").replace(/<[^>]+>/g, "").trim(),
      doi: doi.replace(/<[^>]+>/g, "").trim(),
      url: "",
      abstract: ""
    };
  }).map((a) => ({ ...a, url: a.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${a.pmid}/` : "" }));
}

function decodeXml(value) {
  return String(value || "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

const A = (organ = "brain", subregion = "cerebral_hemisphere") => ({ body_region: "brain", organ, subregion, laterality: "unknown" });
const ct = (code, findings) => ({ phase: { code }, findings });
const mri = (code, findings) => ({ sequence: { code }, findings });
function f(id, code, modality, acq, text, opts = {}) {
  return {
    finding_id: opts.findingId || "",
    finding_code: code,
    modality,
    acquisition: { type: modality === "CT" ? "phase" : "sequence", code: acq },
    anatomy: A(opts.organ, opts.subregion),
    target: opts.target || "whole_lesion",
    modifiers: opts.modifiers || {},
    keywords: opts.keywords || [],
    finding_text: text,
    typicality: opts.typicality || "common",
    diagnostic_weight: opts.weight ?? 2,
    review_status: "draft",
    mapping: { status: "matched", confidence: 0.9, matched_concept_id: code, alternatives: [] }
  };
}

function makeCard(spec, articles) {
  let index = 1;
  for (const group of [...spec.ctGroups, ...spec.mriGroups]) {
    for (const finding of group.findings) {
      if (!finding.finding_id) finding.finding_id = `${spec.id}_${finding.modality.toLowerCase()}_${String(index++).padStart(3, "0")}`;
    }
  }
  const references = articles.map((a) => ({
    source_id: `pmid_${a.pmid}`,
    type: "journal_article",
    title: a.title || "",
    authors: [],
    journal: a.journal || "",
    year: a.year || "",
    pmid: a.pmid || "",
    doi: a.doi || "",
    url: a.url || (a.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${a.pmid}/` : ""),
    license: ""
  }));
  const findings = [...spec.ctGroups, ...spec.mriGroups].flatMap((g) => g.findings);
  return {
    schema_version: "0.8",
    disease_id: spec.id,
    disease_name: { ja: spec.ja, en: spec.en },
    disease_aliases: spec.aliases || { ja: [], en: [spec.en] },
    clinical: spec.clinical,
    demographics: spec.demographics,
    keywords: spec.keywords || [],
    frequency: spec.frequency,
    imaging: { ct: { summary: spec.ctSummary, findings_by_phase: spec.ctGroups }, mri: { summary: spec.mriSummary, findings_by_sequence: spec.mriGroups } },
    evidence: {
      summary: references.length ? `PubMedから取得しました（PMID: ${references.map((r) => r.pmid).join(", ")}）。` : "PubMedから取得しました。",
      claim_map: [{ claim_type: "imaging_findings", finding_ids: findings.map((x) => x.finding_id), claim_scope: ["finding_text", "typicality", "diagnostic_weight"], source_ids: references.map((r) => r.source_id), confidence: "low" }]
    },
    image_examples: [],
    references,
    review: { status: "draft", reviewed_by: "", reviewed_at: "", confidence: "low", notes: "PubMed metadata and Codex-curated draft; requires physician review before approval." },
    updated_at: now
  };
}

const demoAdult = { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 20, typical_max: 80, peak_decade: "成人", summary: "成人で重要。" } };
const demoPeds = { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 0, typical_max: 18, peak_decade: "小児", summary: "小児で重要。" } };
const freqUncommon = (setting) => ({ label: "uncommon", prevalence_rank: 2, basis: "clinical_context", evidence_level: "review", context: { population: "any", body_region: "brain", clinical_setting: setting }, summary: "該当する画像パターンで重要な鑑別。" });
const freqRare = (setting) => ({ label: "rare", prevalence_rank: 1, basis: "clinical_context", evidence_level: "review", context: { population: "any", body_region: "brain", clinical_setting: setting }, summary: "頻度は高くないが、画像パターンから拾うべき鑑別。" });
const C = (overview, treatment = "臨床状況と病理・原因疾患に応じて治療方針を決定する。", epidemiology = "画像パターンと臨床背景を合わせて鑑別する。") => ({ overview, treatment, epidemiology });

const specs = [
  {
    id: "astrocytoma_idh_mutant", ja: "IDH変異型星細胞腫", en: "Astrocytoma IDH-mutant", query: '"IDH-mutant astrocytoma" AND (MRI OR imaging)',
    aliases: { ja: ["IDH変異星細胞腫"], en: ["IDH-mutant astrocytoma"] }, clinical: C("成人のびまん性神経膠腫。T2/FLAIR高信号の浸潤性白質〜皮質下病変として見え、グレード上昇で造影や拡散制限が目立つ。"), demographics: demoAdult, frequency: freqUncommon("infiltrative_glioma"), keywords: ["IDH", "infiltrative glioma"],
    ctSummary: "低吸収の浸潤性腫瘤として見えることがある。", mriSummary: "T2/FLAIR高信号、T1低信号。造影や拡散制限はグレードにより変動。",
    ctGroups: [ct("non_contrast", [f("astrocytoma_idh_mutant", "finding:ct_hypoattenuation", "CT", "non_contrast", "低吸収の浸潤性病変として見えることがある。", { weight: 1 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "浸潤性のFLAIR高信号を示す。", { weight: 3 })]), mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "T2高信号を示す。", { weight: 3 })]), mri("T1WI", [f("", "finding:t1_hypointensity", "MRI", "T1WI", "T1低信号を示す。", { weight: 2 })]), mri("contrast_enhanced_T1WI", [f("", "finding:mild_enhancement", "MRI", "contrast_enhanced_T1WI", "造影効果はなし〜軽度のことがある。", { typicality: "variable", weight: 2 })])]
  },
  {
    id: "ganglioglioma", ja: "神経節膠腫", en: "Ganglioglioma", query: 'ganglioglioma AND (MRI OR CT OR imaging)',
    aliases: { ja: ["神経節膠腫"], en: ["Ganglioglioma"] }, clinical: C("小児〜若年成人のてんかん関連腫瘍。側頭葉皮質〜皮質下の嚢胞性/充実性病変、石灰化、壁在結節が手掛かり。"), demographics: { ...demoPeds, age: { typical_min: 5, typical_max: 35, peak_decade: "小児〜若年成人", summary: "小児から若年成人に多い。" } }, frequency: freqRare("epilepsy_associated_cortical_tumor"), keywords: ["temporal lobe", "epilepsy", "calcification"],
    ctSummary: "石灰化や低吸収嚢胞成分を伴うことがある。", mriSummary: "皮質〜皮質下病変。T2/FLAIR高信号、嚢胞性変化、壁在結節、造影は可変。",
    ctGroups: [ct("non_contrast", [f("", "finding:calcification_present", "CT", "non_contrast", "腫瘍内石灰化を伴うことがある。", { subregion: "temporal_lobe", weight: 3 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:cortical_subcortical_lesion", "MRI", "FLAIR", "皮質〜皮質下のてんかん関連病変として認められる。", { subregion: "temporal_lobe", weight: 4 })]), mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "T2高信号の嚢胞性/充実性病変。", { subregion: "temporal_lobe", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:mild_enhancement", "MRI", "contrast_enhanced_T1WI", "造影効果は可変で、結節状増強を示すことがある。", { subregion: "temporal_lobe", typicality: "variable", weight: 2 })])]
  },
  {
    id: "dysembryoplastic_neuroepithelial_tumor", ja: "胚芽異形成性神経上皮腫瘍", en: "Dysembryoplastic neuroepithelial tumor", query: '"dysembryoplastic neuroepithelial tumor" AND (MRI OR imaging)',
    aliases: { ja: ["DNET", "DNT"], en: ["DNET", "DNT"] }, clinical: C("小児〜若年成人の難治性てんかんに関連する皮質性腫瘍。側頭葉皮質の多結節状/嚢胞様T2高信号病変が典型。"), demographics: { ...demoPeds, age: { typical_min: 5, typical_max: 30, peak_decade: "小児〜若年成人", summary: "若年のてんかん関連病変で重要。" } }, frequency: freqRare("epilepsy_associated_cortical_tumor"), keywords: ["epilepsy", "bubbly", "cortical"],
    ctSummary: "低吸収皮質病変として見えることがある。", mriSummary: "皮質性T2高信号、FLAIRで一部抑制、造影や浮腫は乏しい。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "皮質の低吸収病変として見えることがある。", { subregion: "temporal_lobe", weight: 1 })])],
    mriGroups: [mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "皮質性の嚢胞様T2高信号病変。", { subregion: "temporal_lobe", weight: 4, keywords: ["bubbly"] })]), mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "FLAIR高信号を示すが、嚢胞様成分は抑制されることがある。", { subregion: "temporal_lobe", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:enhancement_absent", "MRI", "contrast_enhanced_T1WI", "造影効果は乏しいことが多い。", { subregion: "temporal_lobe", weight: 3 })])]
  },
  {
    id: "pleomorphic_xanthoastrocytoma", ja: "多形黄色星細胞腫", en: "Pleomorphic xanthoastrocytoma", query: '"pleomorphic xanthoastrocytoma" AND (MRI OR CT OR imaging)',
    aliases: { ja: ["PXA"], en: ["PXA"] }, clinical: C("若年者に多い表在性星細胞系腫瘍。側頭葉など皮質表在に嚢胞と造影壁在結節、髄膜接触を示す。"), demographics: { ...demoPeds, age: { typical_min: 5, typical_max: 35, peak_decade: "小児〜若年成人", summary: "若年者に多い。" } }, frequency: freqRare("superficial_cystic_tumor"), keywords: ["superficial", "cyst with mural nodule"],
    ctSummary: "表在性嚢胞性腫瘤として見えることがある。", mriSummary: "嚢胞+造影壁在結節、表在性、T2/FLAIR高信号。髄膜接触を伴う。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "嚢胞成分が低吸収として見える。", { subregion: "temporal_lobe", target: "cystic_component", weight: 1 })])],
    mriGroups: [mri("contrast_enhanced_T1WI", [f("", "finding:cyst_with_enhancing_mural_nodule", "MRI", "contrast_enhanced_T1WI", "嚢胞に接する造影壁在結節を伴う表在性腫瘤。", { subregion: "temporal_lobe", weight: 5 })]), mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "嚢胞成分はT2高信号を示す。", { subregion: "temporal_lobe", weight: 2 })]), mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "周囲皮質〜皮質下にFLAIR高信号を伴うことがある。", { subregion: "temporal_lobe", typicality: "variable", weight: 2 })])]
  },
  {
    id: "central_neurocytoma", ja: "中枢性神経細胞腫", en: "Central neurocytoma", query: '"central neurocytoma" AND (MRI OR CT OR imaging)',
    aliases: { ja: ["中枢神経細胞腫"], en: ["Central neurocytoma"] }, clinical: C("若年成人の側脳室内腫瘍。モンロー孔近傍に発生し、嚢胞様変化や石灰化を伴う脳室内腫瘤として見える。"), demographics: { ...demoAdult, age: { typical_min: 15, typical_max: 45, peak_decade: "20-30歳代", summary: "若年成人に多い。" } }, frequency: freqRare("intraventricular_mass"), keywords: ["lateral ventricle", "foramen of Monro", "bubbly"],
    ctSummary: "側脳室内腫瘤。石灰化や水頭症を伴うことがある。", mriSummary: "脳室内の不均一腫瘤。T2高信号、嚢胞様変化、造影は可変。",
    ctGroups: [ct("non_contrast", [f("", "finding:calcification_present", "CT", "non_contrast", "脳室内腫瘤内に石灰化を伴うことがある。", { organ: "ventricle", subregion: "intraventricular", target: "calcified_component", weight: 3 })])],
    mriGroups: [mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "側脳室内の不均一なT2高信号腫瘤。", { organ: "ventricle", subregion: "intraventricular", target: "ventricular_mass", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:mild_enhancement", "MRI", "contrast_enhanced_T1WI", "造影効果は軽度〜中等度で可変。", { organ: "ventricle", subregion: "foramen_of_monro", target: "ventricular_mass", weight: 2 })]), mri("FLAIR", [f("", "finding:hydrocephalus", "MRI", "FLAIR", "モンロー孔近傍病変では水頭症を伴うことがある。", { organ: "ventricle", subregion: "foramen_of_monro", typicality: "variable", weight: 2 })])]
  },
  {
    id: "choroid_plexus_papilloma", ja: "脈絡叢乳頭腫", en: "Choroid plexus papilloma", query: '"choroid plexus papilloma" AND (MRI OR CT OR imaging)',
    aliases: { ja: ["脈絡叢乳頭腫"], en: ["Choroid plexus papilloma"] }, clinical: C("脈絡叢由来の脳室内腫瘍。小児では側脳室、成人では第4脳室に多く、強い造影と水頭症が手掛かり。"), demographics: demoPeds, frequency: freqRare("enhancing_intraventricular_mass"), keywords: ["choroid plexus", "intraventricular", "hydrocephalus"],
    ctSummary: "脳室内の造影性腫瘤。水頭症や石灰化を伴うことがある。", mriSummary: "脈絡叢部の強く造影される脳室内腫瘤。T2高信号、flow voidを伴うことがある。",
    ctGroups: [ct("non_contrast", [f("", "finding:hydrocephalus", "CT", "non_contrast", "髄液産生増加や閉塞により水頭症を伴うことがある。", { organ: "ventricle", subregion: "intraventricular", weight: 3 })])],
    mriGroups: [mri("contrast_enhanced_T1WI", [f("", "finding:avid_homogeneous_enhancement", "MRI", "contrast_enhanced_T1WI", "脈絡叢部の腫瘤が強く造影される。", { organ: "choroid_plexus", subregion: "intraventricular", target: "ventricular_mass", weight: 4 })]), mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "T2高信号の脳室内腫瘤として見える。", { organ: "choroid_plexus", subregion: "intraventricular", weight: 2 })]), mri("T2WI", [f("", "finding:flow_void", "MRI", "T2WI", "血管性flow voidを伴うことがある。", { organ: "choroid_plexus", subregion: "intraventricular", typicality: "variable", weight: 2 })])]
  },
  {
    id: "pineal_germinoma", ja: "松果体部胚腫", en: "Pineal germinoma", query: '"pineal germinoma" AND (MRI OR CT OR imaging)',
    aliases: { ja: ["松果体部ジャーミノーマ"], en: ["Pineal germinoma"] }, clinical: C("若年男性に多い松果体部胚細胞腫瘍。松果体部充実性腫瘤、水頭症、石灰化の取り込み・偏位が手掛かり。"), demographics: { sex: { applicable: ["any"], predominance: "male", predilection: "male_predominant", summary: "男性に多い。" }, age: { typical_min: 10, typical_max: 30, peak_decade: "10-20歳代", summary: "思春期〜若年成人に多い。" } }, frequency: freqRare("pineal_region_mass"), keywords: ["pineal", "germinoma", "hydrocephalus"],
    ctSummary: "松果体部高吸収〜等吸収腫瘤。石灰化を取り込む/偏位させ、水頭症を伴うことがある。", mriSummary: "造影される松果体部充実性腫瘤。DWI高信号を伴うことがある。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hyperattenuation", "CT", "non_contrast", "高細胞性によりCT高吸収を示すことがある。", { organ: "pineal_gland", subregion: "pineal_region", target: "pineal_mass", weight: 3 }), f("", "finding:hydrocephalus", "CT", "non_contrast", "中脳水道圧排により水頭症を伴うことがある。", { organ: "pineal_gland", subregion: "pineal_region", weight: 2 })])],
    mriGroups: [mri("contrast_enhanced_T1WI", [f("", "finding:avid_homogeneous_enhancement", "MRI", "contrast_enhanced_T1WI", "松果体部腫瘤が比較的均一に造影される。", { organ: "pineal_gland", subregion: "pineal_region", target: "pineal_mass", weight: 4 })]), mri("DWI", [f("", "finding:dwi_hyperintensity", "MRI", "DWI", "高細胞性によりDWI高信号を示すことがある。", { organ: "pineal_gland", subregion: "pineal_region", typicality: "variable", weight: 2 })])]
  },
  {
    id: "pineoblastoma", ja: "松果体芽腫", en: "Pineoblastoma", query: 'pineoblastoma AND (MRI OR CT OR imaging)',
    aliases: { ja: ["松果体芽腫"], en: ["Pineoblastoma"] }, clinical: C("小児に多い悪性松果体部腫瘍。高細胞性充実性腫瘤としてDWI高信号/ADC低値、水頭症、播種を伴いやすい。"), demographics: demoPeds, frequency: freqRare("pineal_region_mass"), keywords: ["pineal", "high cellularity", "CSF dissemination"],
    ctSummary: "高吸収松果体部腫瘤と水頭症。", mriSummary: "DWI高信号/ADC低値、造影性松果体部腫瘤。髄液播種評価が必要。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hyperattenuation", "CT", "non_contrast", "高細胞性によりCT高吸収を示す。", { organ: "pineal_gland", subregion: "pineal_region", target: "pineal_mass", weight: 3 })])],
    mriGroups: [mri("DWI", [f("", "finding:dwi_hyperintensity", "MRI", "DWI", "DWI高信号を示す。", { organ: "pineal_gland", subregion: "pineal_region", weight: 4 })]), mri("ADC", [f("", "finding:adc_low", "MRI", "ADC", "ADC低値を伴う。", { organ: "pineal_gland", subregion: "pineal_region", weight: 4 })]), mri("contrast_enhanced_T1WI", [f("", "finding:enhancing_solid_component", "MRI", "contrast_enhanced_T1WI", "充実部に造影効果を伴う。", { organ: "pineal_gland", subregion: "pineal_region", target: "pineal_mass", weight: 3 })])]
  },
  {
    id: "rathke_cleft_cyst", ja: "ラトケ嚢胞", en: "Rathke cleft cyst", query: '"Rathke cleft cyst" AND (MRI OR CT OR imaging)',
    aliases: { ja: ["Rathke嚢胞"], en: ["Rathke cleft cyst"] }, clinical: C("鞍内〜鞍上部の良性嚢胞性病変。嚢胞内容の蛋白濃度によりT1/T2信号が変化し、通常は充実性造影を欠く。"), demographics: demoAdult, frequency: freqUncommon("sellar_cystic_lesion"), keywords: ["sellar cyst", "intracystic nodule"],
    ctSummary: "鞍内嚢胞性病変として見えることがある。", mriSummary: "T1/T2信号は内容で変化。造影は壁が薄く、充実性造影は乏しい。",
    ctGroups: [ct("non_contrast", [f("", "finding:sellar_suprasellar_mass", "CT", "non_contrast", "鞍内〜鞍上部嚢胞性病変として見える。", { organ: "pituitary", subregion: "sellar", target: "sellar_mass", weight: 2 })])],
    mriGroups: [mri("T1WI", [f("", "finding:t1_hyperintensity", "MRI", "T1WI", "蛋白濃度の高い内容ではT1高信号を示すことがある。", { organ: "pituitary", subregion: "sellar", target: "cyst_content", typicality: "variable", weight: 3 })]), mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "嚢胞内容はT2高信号を示すことが多い。", { organ: "pituitary", subregion: "sellar", target: "cyst_content", weight: 2 })]), mri("contrast_enhanced_T1WI", [f("", "finding:enhancement_absent", "MRI", "contrast_enhanced_T1WI", "充実性造影効果を欠くことが多い。", { organ: "pituitary", subregion: "sellar", target: "cyst_content", weight: 3 })])]
  },
  {
    id: "pituitary_apoplexy", ja: "下垂体卒中", en: "Pituitary apoplexy", query: '"pituitary apoplexy" AND (MRI OR CT OR imaging)',
    aliases: { ja: ["下垂体腺腫内出血"], en: ["Pituitary apoplexy"] }, clinical: C("下垂体腺腫などの急性出血/梗塞。急な頭痛、視機能障害、眼筋麻痺で発症し、鞍内腫瘤内出血を示す。"), demographics: demoAdult, frequency: freqRare("acute_sellarmass_headache"), keywords: ["sellar hemorrhage", "acute headache"],
    ctSummary: "鞍内腫瘤内の高吸収出血を示すことがある。", mriSummary: "血腫時相に応じたT1高信号、T2低信号/SWI blooming、造影不良域。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hyperattenuation", "CT", "non_contrast", "鞍内腫瘤内出血が高吸収として認められることがある。", { organ: "pituitary", subregion: "sellar", target: "hemorrhagic_component", weight: 4 })])],
    mriGroups: [mri("T1WI", [f("", "finding:t1_hyperintensity", "MRI", "T1WI", "亜急性出血によりT1高信号を示す。", { organ: "pituitary", subregion: "sellar", target: "hemorrhagic_component", weight: 4 })]), mri("SWI", [f("", "finding:susceptibility_blooming", "MRI", "SWI", "血液分解産物により磁化率低信号を伴う。", { organ: "pituitary", subregion: "sellar", target: "hemorrhagic_component", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:sellar_suprasellar_mass", "MRI", "contrast_enhanced_T1WI", "鞍内〜鞍上部腫瘤として認められる。", { organ: "pituitary", subregion: "sellar", target: "sellar_mass", weight: 3 })])]
  },
  {
    id: "hypophysitis", ja: "下垂体炎", en: "Hypophysitis", query: 'hypophysitis AND (MRI OR imaging)',
    aliases: { ja: ["リンパ球性下垂体炎", "免疫関連下垂体炎"], en: ["Lymphocytic hypophysitis", "Immune-related hypophysitis"] }, clinical: C("下垂体・下垂体茎の炎症性疾患。下垂体腫大、均一造影、下垂体茎肥厚、後葉高信号消失などが手掛かり。"), demographics: { sex: { applicable: ["any"], predominance: "female", predilection: "female_predominant", summary: "リンパ球性下垂体炎は女性に多い。" }, age: { typical_min: 20, typical_max: 70, peak_decade: "成人", summary: "成人で重要。" } }, frequency: freqRare("pituitary_stalk_thickening"), keywords: ["pituitary stalk", "homogeneous enhancement"],
    ctSummary: "CTでの評価は限定的。鞍内病変として見えることがある。", mriSummary: "下垂体腫大と下垂体茎肥厚、均一造影が特徴。",
    ctGroups: [ct("non_contrast", [f("", "finding:sellar_suprasellar_mass", "CT", "non_contrast", "鞍内腫大として見えることがある。", { organ: "pituitary", subregion: "sellar", target: "sellar_mass", weight: 1 })])],
    mriGroups: [mri("contrast_enhanced_T1WI", [f("", "finding:pituitary_stalk_thickening", "MRI", "contrast_enhanced_T1WI", "下垂体茎肥厚と造影を伴うことがある。", { organ: "pituitary", subregion: "pituitary_stalk", target: "pituitary_stalk", weight: 5 })]), mri("contrast_enhanced_T1WI", [f("", "finding:avid_homogeneous_enhancement", "MRI", "contrast_enhanced_T1WI", "下垂体が比較的均一に造影される。", { organ: "pituitary", subregion: "sellar", target: "sellar_mass", weight: 3 })])]
  },
  {
    id: "chordoma", ja: "脊索腫", en: "Chordoma", query: 'clival chordoma AND (MRI OR CT OR imaging)',
    aliases: { ja: ["斜台脊索腫"], en: ["Clival chordoma"] }, clinical: C("脊索遺残由来の頭蓋底腫瘍。斜台正中に発生し、骨破壊、T2著明高信号、分葉状造影腫瘤を示す。"), demographics: demoAdult, frequency: freqRare("clival_mass"), keywords: ["clivus", "bone destruction", "T2 bright"],
    ctSummary: "斜台骨破壊を伴う頭蓋底腫瘤。", mriSummary: "斜台正中のT2高信号腫瘤。造影は不均一。",
    ctGroups: [ct("non_contrast", [f("", "finding:clival_bone_destruction", "CT", "non_contrast", "斜台骨破壊を伴う正中性腫瘤。", { organ: "skull_base", subregion: "clivus", target: "skull_base_mass", weight: 5 })])],
    mriGroups: [mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "粘液様基質によりT2著明高信号を示す。", { organ: "skull_base", subregion: "clivus", target: "skull_base_mass", weight: 4 })]), mri("contrast_enhanced_T1WI", [f("", "finding:enhancing_solid_component", "MRI", "contrast_enhanced_T1WI", "分葉状腫瘤に不均一な造影効果を伴う。", { organ: "skull_base", subregion: "clivus", target: "skull_base_mass", weight: 3 })])]
  },
  {
    id: "chondrosarcoma_skull_base", ja: "頭蓋底軟骨肉腫", en: "Skull base chondrosarcoma", query: '"skull base chondrosarcoma" AND (MRI OR CT OR imaging)',
    aliases: { ja: ["斜台傍軟骨肉腫"], en: ["Skull base chondrosarcoma"] }, clinical: C("頭蓋底軟骨性腫瘍。斜台傍正中や錐体尖部に多く、石灰化、T2高信号、骨破壊を示す。"), demographics: demoAdult, frequency: freqRare("skull_base_mass"), keywords: ["off-midline", "chondroid calcification", "skull base"],
    ctSummary: "頭蓋底骨破壊と軟骨性石灰化を伴うことがある。", mriSummary: "T2高信号の頭蓋底腫瘤。不均一造影。",
    ctGroups: [ct("non_contrast", [f("", "finding:calcification_present", "CT", "non_contrast", "軟骨性石灰化を伴うことがある。", { organ: "skull_base", subregion: "clivus", target: "calcified_component", weight: 3 }), f("", "finding:clival_bone_destruction", "CT", "non_contrast", "頭蓋底骨破壊を伴う。", { organ: "skull_base", subregion: "clivus", target: "skull_base_mass", weight: 4 })])],
    mriGroups: [mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "軟骨性基質によりT2高信号を示す。", { organ: "skull_base", subregion: "clivus", target: "skull_base_mass", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:enhancing_solid_component", "MRI", "contrast_enhanced_T1WI", "不均一な造影効果を伴う。", { organ: "skull_base", subregion: "clivus", target: "skull_base_mass", weight: 2 })])]
  },
  {
    id: "dermoid_cyst", ja: "類皮嚢胞", en: "Dermoid cyst", query: 'intracranial dermoid cyst AND (MRI OR CT OR imaging)',
    aliases: { ja: ["頭蓋内類皮嚢胞"], en: ["Intracranial dermoid cyst"] }, clinical: C("脂肪成分を含む先天性嚢胞。破裂時は脂肪滴がくも膜下腔や脳室内に散在する。"), demographics: { ...demoAdult, age: { typical_min: 0, typical_max: 50, peak_decade: "小児〜若年成人", summary: "先天性で若年発見もある。" } }, frequency: freqRare("fat_containing_intracranial_lesion"), keywords: ["fat", "rupture", "subarachnoid fat droplets"],
    ctSummary: "脂肪吸収値の嚢胞性病変。破裂時は脂肪滴が散在。", mriSummary: "T1高信号、脂肪抑制で信号低下、DWIは類表皮ほど強くない。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_fat_attenuation", "CT", "non_contrast", "脂肪吸収値の嚢胞性病変として認められる。", { target: "cyst_content", weight: 5 })])],
    mriGroups: [mri("T1WI", [f("", "finding:t1_hyperintensity", "MRI", "T1WI", "脂肪成分によりT1高信号を示す。", { target: "cyst_content", weight: 4 })]), mri("T1WI_fat_suppressed", [f("", "finding:fat_suppression_signal_drop", "MRI", "T1WI_fat_suppressed", "脂肪抑制で信号低下する。", { target: "cyst_content", weight: 5 })]), mri("contrast_enhanced_T1WI", [f("", "finding:enhancement_absent", "MRI", "contrast_enhanced_T1WI", "通常は明らかな造影効果を欠く。", { target: "cyst_content", weight: 2 })])]
  },
  {
    id: "colloid_cyst", ja: "コロイド嚢胞", en: "Colloid cyst", query: '"colloid cyst" AND (third ventricle OR foramen of Monro) AND (MRI OR CT OR imaging)',
    aliases: { ja: ["第三脳室コロイド嚢胞"], en: ["Third ventricular colloid cyst"] }, clinical: C("モンロー孔付近の第三脳室前方に発生する嚢胞。急性閉塞性水頭症の原因になる。"), demographics: demoAdult, frequency: freqRare("foramen_of_monro_cyst"), keywords: ["foramen of Monro", "third ventricle", "obstructive hydrocephalus"],
    ctSummary: "モンロー孔付近の高吸収嚢胞として見えることがある。", mriSummary: "内容によりT1/T2信号は可変。モンロー孔閉塞による水頭症を評価する。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hyperattenuation", "CT", "non_contrast", "第三脳室前方に高吸収嚢胞として見えることがある。", { organ: "ventricle", subregion: "foramen_of_monro", target: "cyst_content", weight: 4 }), f("", "finding:hydrocephalus", "CT", "non_contrast", "モンロー孔閉塞により側脳室拡大を伴うことがある。", { organ: "ventricle", subregion: "foramen_of_monro", weight: 3 })])],
    mriGroups: [mri("T1WI", [f("", "finding:t1_hyperintensity", "MRI", "T1WI", "内容によりT1高信号を示すことがある。", { organ: "ventricle", subregion: "foramen_of_monro", target: "cyst_content", weight: 3 })]), mri("T2WI", [f("", "finding:t2_hypointensity", "MRI", "T2WI", "粘稠な内容ではT2低信号を示すことがある。", { organ: "ventricle", subregion: "foramen_of_monro", target: "cyst_content", typicality: "variable", weight: 2 })])]
  },
  {
    id: "neurocysticercosis", ja: "神経嚢虫症", en: "Neurocysticercosis", query: 'neurocysticercosis AND (MRI OR CT OR imaging)',
    aliases: { ja: ["脳嚢虫症"], en: ["Neurocysticercosis"] }, clinical: C("Taenia soliumによる中枢神経寄生虫感染。嚢胞、壁在結節、リング状造影、石灰化など病期により所見が変化する。"), demographics: demoAdult, frequency: freqRare("multiple_cystic_or_calcified_lesions"), keywords: ["scolex", "calcified nodules", "ring enhancement"],
    ctSummary: "石灰化結節、多発嚢胞、リング状造影を病期に応じて示す。", mriSummary: "嚢胞内scolex、リング状造影、周囲浮腫。石灰化期はCTが有用。",
    ctGroups: [ct("non_contrast", [f("", "finding:calcification_present", "CT", "non_contrast", "慢性期には多発石灰化結節を示す。", { target: "calcified_component", weight: 4 })])],
    mriGroups: [mri("T2WI", [f("", "finding:csf_like_signal", "MRI", "T2WI", "嚢胞期には髄液様信号の嚢胞として見える。", { target: "cystic_component", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:ring_enhancement", "MRI", "contrast_enhanced_T1WI", "変性期にはリング状造影を伴う。", { target: "lesion_margin", weight: 3 })]), mri("FLAIR", [f("", "finding:vasogenic_edema", "MRI", "FLAIR", "周囲浮腫を伴うことがある。", { target: "perilesional_edema", weight: 2 })])]
  },
  {
    id: "tuberculoma", ja: "脳結核腫", en: "Intracranial tuberculoma", query: 'intracranial tuberculoma AND (MRI OR CT OR imaging)',
    aliases: { ja: ["結核腫"], en: ["Tuberculoma"] }, clinical: C("結核感染に伴う肉芽腫性病変。リング状または結節状造影、多発病変、髄膜炎合併を評価する。"), demographics: demoAdult, frequency: freqRare("ring_enhancing_infectious_lesion"), keywords: ["tuberculosis", "ring enhancement", "basal meningitis"],
    ctSummary: "等〜低吸収腫瘤、石灰化、リング状造影を示すことがある。", mriSummary: "T2低信号中心を伴うリング状造影や周囲浮腫。髄膜造影を伴うことがある。",
    ctGroups: [ct("non_contrast", [f("", "finding:calcification_present", "CT", "non_contrast", "陳旧性病変では石灰化を伴うことがある。", { target: "calcified_component", typicality: "variable", weight: 2 })])],
    mriGroups: [mri("T2WI", [f("", "finding:t2_hypointensity", "MRI", "T2WI", "乾酪壊死成分がT2低信号を示すことがある。", { target: "lesion_core", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:ring_enhancement", "MRI", "contrast_enhanced_T1WI", "リング状または結節状造影を示す。", { target: "lesion_margin", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:leptomeningeal_enhancement", "MRI", "contrast_enhanced_T1WI", "結核性髄膜炎では脳底槽優位の軟髄膜造影を伴う。", { subregion: "basal_cistern", target: "meninges", typicality: "variable", weight: 3 })])]
  },
  {
    id: "cerebral_toxoplasmosis", ja: "脳トキソプラズマ症", en: "Cerebral toxoplasmosis", query: 'cerebral toxoplasmosis AND (MRI OR CT OR imaging)',
    aliases: { ja: ["トキソプラズマ脳症"], en: ["Toxoplasma encephalitis"] }, clinical: C("免疫不全患者に多い日和見感染。基底核や皮髄境界の多発リング状造影病変としてPCNSLと鑑別する。"), demographics: demoAdult, frequency: freqRare("immunocompromised_ring_enhancing_lesions"), keywords: ["AIDS", "basal ganglia", "multiple ring enhancement"],
    ctSummary: "多発低吸収病変とリング状造影、浮腫を伴う。", mriSummary: "基底核を含む多発リング状造影、DWIは可変、周囲浮腫を伴う。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "低吸収病変として見える。", { subregion: "basal_ganglia", weight: 2 })])],
    mriGroups: [mri("contrast_enhanced_T1WI", [f("", "finding:ring_enhancement", "MRI", "contrast_enhanced_T1WI", "多発リング状造影病変を示す。", { subregion: "basal_ganglia", weight: 4 })]), mri("FLAIR", [f("", "finding:vasogenic_edema", "MRI", "FLAIR", "病変周囲浮腫を伴う。", { target: "perilesional_edema", weight: 3 })]), mri("T2WI", [f("", "finding:basal_ganglia_involvement", "MRI", "T2WI", "基底核病変として認められることが多い。", { subregion: "basal_ganglia", weight: 3 })])]
  },
  {
    id: "cryptococcal_meningitis", ja: "クリプトコッカス髄膜炎", en: "Cryptococcal meningitis", query: 'cryptococcal meningitis AND (MRI OR CT OR imaging)',
    aliases: { ja: ["クリプトコッカス髄膜脳炎"], en: ["Cryptococcal meningoencephalitis"] }, clinical: C("免疫不全患者で重要な真菌性髄膜炎。髄膜造影、Virchow-Robin腔拡大様のゼラチン様偽嚢胞、水頭症を示すことがある。"), demographics: demoAdult, frequency: freqRare("meningitis_immunocompromised"), keywords: ["gelatinous pseudocyst", "meningitis", "hydrocephalus"],
    ctSummary: "CTは正常のこともあるが水頭症を示すことがある。", mriSummary: "髄膜造影、基底核周囲の嚢胞様病変、水頭症を評価する。",
    ctGroups: [ct("non_contrast", [f("", "finding:hydrocephalus", "CT", "non_contrast", "髄液循環障害により水頭症を伴うことがある。", { weight: 2 })])],
    mriGroups: [mri("contrast_enhanced_T1WI", [f("", "finding:leptomeningeal_enhancement", "MRI", "contrast_enhanced_T1WI", "軟髄膜造影を伴うことがある。", { target: "meninges", weight: 3 })]), mri("T2WI", [f("", "finding:csf_like_signal", "MRI", "T2WI", "基底核周囲に嚢胞様高信号病変を示すことがある。", { subregion: "basal_ganglia", target: "cystic_component", typicality: "variable", weight: 2 })])]
  },
  {
    id: "progressive_multifocal_leukoencephalopathy", ja: "進行性多巣性白質脳症", en: "Progressive multifocal leukoencephalopathy", query: 'progressive multifocal leukoencephalopathy AND (MRI OR imaging)',
    aliases: { ja: ["PML"], en: ["PML"] }, clinical: C("JCウイルスによる脱髄性白質脳症。免疫不全や免疫調整薬使用時に、非対称性白質FLAIR高信号として進行する。"), demographics: demoAdult, frequency: freqRare("immunocompromised_white_matter_lesions"), keywords: ["JC virus", "subcortical U-fibers", "no mass effect"],
    ctSummary: "白質低吸収病変として見えることがある。", mriSummary: "非対称性白質FLAIR/T2高信号、造影やmass effectは乏しい。辺縁DWI高信号を伴うことがある。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "白質低吸収病変として見えることがある。", { subregion: "white_matter", target: "white_matter", weight: 1 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "非対称性の白質FLAIR高信号を示す。", { subregion: "white_matter", target: "white_matter", weight: 4 })]), mri("contrast_enhanced_T1WI", [f("", "finding:enhancement_absent", "MRI", "contrast_enhanced_T1WI", "造影効果は乏しいことが多い。", { subregion: "white_matter", weight: 3 })]), mri("DWI", [f("", "finding:dwi_hyperintensity", "MRI", "DWI", "活動性辺縁でDWI高信号を伴うことがある。", { subregion: "white_matter", target: "lesion_margin", typicality: "variable", weight: 2 })])]
  },
  {
    id: "acute_disseminated_encephalomyelitis", ja: "急性散在性脳脊髄炎", en: "Acute disseminated encephalomyelitis", query: 'acute disseminated encephalomyelitis AND (MRI OR imaging)',
    aliases: { ja: ["ADEM"], en: ["ADEM"] }, clinical: C("感染後・ワクチン後などに生じる急性脱髄性疾患。小児に多く、多発・両側非対称の白質/深部灰白質病変を示す。"), demographics: demoPeds, frequency: freqUncommon("acute_multifocal_demyelination"), keywords: ["post-infectious", "deep gray matter", "multifocal"],
    ctSummary: "CTは正常または低吸収病変。MRIが有用。", mriSummary: "多発T2/FLAIR高信号、深部灰白質病変、造影は可変。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "低吸収病変として見えることがある。", { typicality: "variable", weight: 1 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "多発性の白質FLAIR高信号を示す。", { subregion: "white_matter", target: "white_matter", weight: 3 })]), mri("T2WI", [f("", "finding:basal_ganglia_involvement", "MRI", "T2WI", "視床や基底核など深部灰白質病変を伴うことがある。", { subregion: "basal_ganglia", target: "deep_gray_matter", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:mild_enhancement", "MRI", "contrast_enhanced_T1WI", "造影効果は可変。", { typicality: "variable", weight: 1 })])]
  },
  {
    id: "neuromyelitis_optica_spectrum_disorder", ja: "視神経脊髄炎スペクトラム障害", en: "Neuromyelitis optica spectrum disorder", query: 'neuromyelitis optica spectrum disorder brain MRI imaging',
    aliases: { ja: ["NMOSD", "視神経脊髄炎"], en: ["NMOSD"] }, clinical: C("AQP4抗体関連の炎症性脱髄疾患。視神経、脊髄に加え、延髄最後野、視床下部、脳梁周囲などに病変を示す。"), demographics: { sex: { applicable: ["any"], predominance: "female", predilection: "female_predominant", summary: "女性に多い。" }, age: { typical_min: 15, typical_max: 70, peak_decade: "成人", summary: "成人女性で重要。" } }, frequency: freqRare("inflammatory_demyelination"), keywords: ["AQP4", "area postrema", "hypothalamus"],
    ctSummary: "CTでの評価は限定的。", mriSummary: "FLAIR/T2高信号の視床下部・脳幹・脳梁周囲病変。造影は可変。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "病変が低吸収として見えることはあるが感度は低い。", { typicality: "rare", weight: 1 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "視床下部や脳幹周囲にFLAIR高信号を示すことがある。", { organ: "hypothalamus", subregion: "suprasellar", weight: 3 })]), mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "T2高信号の炎症性病変を示す。", { weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:mild_enhancement", "MRI", "contrast_enhanced_T1WI", "活動性病変では造影効果を伴うことがある。", { typicality: "variable", weight: 2 })])]
  },
  {
    id: "mog_antibody_associated_disease", ja: "MOG抗体関連疾患", en: "MOG antibody-associated disease", query: 'MOG antibody-associated disease brain MRI imaging',
    aliases: { ja: ["MOGAD"], en: ["MOGAD"] }, clinical: C("MOG抗体関連の炎症性脱髄疾患。ADEM様病変、皮質性脳炎、視神経炎など多彩な脳MRI所見を示す。"), demographics: { ...demoPeds, age: { typical_min: 0, typical_max: 60, peak_decade: "小児〜成人", summary: "小児から成人までみられる。" } }, frequency: freqRare("inflammatory_demyelination"), keywords: ["MOG", "cortical encephalitis", "ADEM-like"],
    ctSummary: "CTは正常または低吸収。MRIが主役。", mriSummary: "皮質/皮質下や白質にFLAIR高信号。造影やDWIは可変。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "低吸収病変として見えることがある。", { typicality: "rare", weight: 1 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "皮質・皮質下または白質にFLAIR高信号を示す。", { target: "white_matter", weight: 3 })]), mri("T2WI", [f("", "finding:cortical_subcortical_lesion", "MRI", "T2WI", "皮質〜皮質下病変として見えることがある。", { target: "cortex", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:mild_enhancement", "MRI", "contrast_enhanced_T1WI", "活動性病変では造影効果を伴うことがある。", { typicality: "variable", weight: 1 })])]
  },
  {
    id: "marchiafava_bignami_disease", ja: "Marchiafava-Bignami病", en: "Marchiafava-Bignami disease", query: 'Marchiafava Bignami disease MRI imaging',
    aliases: { ja: ["マルキアファーヴァ・ビニャミ病"], en: ["Marchiafava-Bignami disease"] }, clinical: C("慢性アルコール多飲や栄養障害に関連する脳梁変性。脳梁体部を中心としたDWI/FLAIR異常が特徴。"), demographics: { ...demoAdult, age: { typical_min: 30, typical_max: 75, peak_decade: "中年以降", summary: "慢性アルコール多飲背景で重要。" } }, frequency: freqRare("callosal_lesion"), keywords: ["corpus callosum", "alcohol", "DWI"],
    ctSummary: "脳梁低吸収として見えることがあるがMRIが有用。", mriSummary: "脳梁DWI高信号/ADC低値、T2/FLAIR高信号。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "脳梁低吸収として見えることがある。", { organ: "corpus_callosum", subregion: "periventricular", target: "white_matter", weight: 1 })])],
    mriGroups: [mri("DWI", [f("", "finding:dwi_hyperintensity", "MRI", "DWI", "脳梁にDWI高信号を示す。", { organ: "corpus_callosum", subregion: "periventricular", target: "white_matter", weight: 5 })]), mri("ADC", [f("", "finding:adc_low", "MRI", "ADC", "急性期にはADC低値を伴う。", { organ: "corpus_callosum", subregion: "periventricular", target: "white_matter", weight: 4 })]), mri("FLAIR", [f("", "finding:callosal_lesion", "MRI", "FLAIR", "脳梁病変としてFLAIR高信号を示す。", { organ: "corpus_callosum", subregion: "periventricular", target: "white_matter", weight: 4 })])]
  },
  {
    id: "wernicke_encephalopathy", ja: "Wernicke脳症", en: "Wernicke encephalopathy", query: 'Wernicke encephalopathy MRI imaging',
    aliases: { ja: ["ウェルニッケ脳症"], en: ["Wernicke encephalopathy"] }, clinical: C("チアミン欠乏による急性脳症。内側視床、中脳水道周囲、乳頭体などの対称性T2/FLAIR高信号が典型。"), demographics: demoAdult, frequency: freqUncommon("metabolic_encephalopathy"), keywords: ["thiamine", "medial thalami", "mammillary bodies"],
    ctSummary: "CTは正常のことが多い。", mriSummary: "内側視床・中脳水道周囲・乳頭体の対称性FLAIR/T2高信号と造影。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_isoattenuation", "CT", "non_contrast", "CTは正常または目立たないことが多い。", { typicality: "variable", weight: 1 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "内側視床や中脳水道周囲に対称性FLAIR高信号を示す。", { target: "deep_gray_matter", weight: 4 })]), mri("T2WI", [f("", "finding:bilateral_symmetric_white_matter_lesions", "MRI", "T2WI", "両側対称性病変パターンが診断の手掛かり。", { target: "deep_gray_matter", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:mild_enhancement", "MRI", "contrast_enhanced_T1WI", "乳頭体などに造影効果を伴うことがある。", { typicality: "variable", weight: 2 })])]
  },
  {
    id: "osmotic_demyelination_syndrome", ja: "浸透圧性脱髄症候群", en: "Osmotic demyelination syndrome", query: 'osmotic demyelination syndrome MRI imaging',
    aliases: { ja: ["中心橋髄鞘崩壊症", "ODS"], en: ["ODS", "Central pontine myelinolysis"] }, clinical: C("急速な電解質補正などに関連する脱髄。橋中央や橋外病変に対称性T2/FLAIR高信号、DWI異常を示す。"), demographics: demoAdult, frequency: freqRare("metabolic_demyelination"), keywords: ["pons", "hyponatremia", "symmetric"],
    ctSummary: "CTは正常または橋低吸収。", mriSummary: "橋中央の対称性T2/FLAIR高信号、急性期DWI高信号。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "橋病変が低吸収として見えることがある。", { subregion: "brainstem", weight: 1 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "橋中央に対称性FLAIR高信号を示す。", { subregion: "brainstem", weight: 4 })]), mri("DWI", [f("", "finding:dwi_hyperintensity", "MRI", "DWI", "急性期にDWI高信号を示すことがある。", { subregion: "brainstem", weight: 3 })]), mri("ADC", [f("", "finding:adc_low", "MRI", "ADC", "急性期にADC低値を伴うことがある。", { subregion: "brainstem", typicality: "variable", weight: 2 })])]
  },
  {
    id: "creutzfeldt_jakob_disease", ja: "Creutzfeldt-Jakob病", en: "Creutzfeldt-Jakob disease", query: 'Creutzfeldt Jakob disease MRI DWI imaging',
    aliases: { ja: ["CJD"], en: ["CJD"] }, clinical: C("プリオン病。急速進行性認知症で、皮質リボン状DWI高信号や基底核DWI高信号が診断に重要。"), demographics: { ...demoAdult, age: { typical_min: 50, typical_max: 85, peak_decade: "60-70歳代", summary: "中高年以降に多い。" } }, frequency: freqRare("rapidly_progressive_dementia"), keywords: ["cortical ribboning", "basal ganglia", "DWI"],
    ctSummary: "CTは正常のことが多い。", mriSummary: "DWIで皮質リボン状高信号、基底核高信号。FLAIRでも異常を示す。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_isoattenuation", "CT", "non_contrast", "CTは目立たないことが多い。", { weight: 1 })])],
    mriGroups: [mri("DWI", [f("", "finding:dwi_hyperintensity", "MRI", "DWI", "皮質リボン状または基底核にDWI高信号を示す。", { target: "cortex", weight: 5, keywords: ["cortical ribboning"] })]), mri("ADC", [f("", "finding:adc_low", "MRI", "ADC", "ADC低値を伴うことがある。", { target: "cortex", weight: 3 })]), mri("FLAIR", [f("", "finding:basal_ganglia_involvement", "MRI", "FLAIR", "基底核病変を伴うことがある。", { subregion: "basal_ganglia", target: "deep_gray_matter", weight: 3 })])]
  },
  {
    id: "hypertensive_intracerebral_hemorrhage", ja: "高血圧性脳出血", en: "Hypertensive intracerebral hemorrhage", query: 'hypertensive intracerebral hemorrhage CT MRI imaging',
    aliases: { ja: ["高血圧性脳内出血"], en: ["Hypertensive ICH"] }, clinical: C("高血圧性細動脈硬化に伴う脳内出血。被殻、視床、橋、小脳に好発し、急性期CT高吸収が基本。"), demographics: { ...demoAdult, age: { typical_min: 45, typical_max: 90, peak_decade: "中高年以降", summary: "中高年以降で多い。" } }, frequency: { label: "common", prevalence_rank: 4, basis: "clinical_context", evidence_level: "review", context: { population: "hypertensive", body_region: "brain", clinical_setting: "acute_intracerebral_hemorrhage" }, summary: "急性脳内出血では頻度の高い鑑別。" }, keywords: ["basal ganglia", "thalamus", "pons"],
    ctSummary: "急性期は高吸収血腫、浮腫、mass effect、脳室穿破を評価する。", mriSummary: "血腫時相によりT1/T2信号が変化し、SWIで出血性低信号を示す。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hyperattenuation", "CT", "non_contrast", "急性血腫は高吸収として認められる。", { subregion: "basal_ganglia", target: "hemorrhagic_component", weight: 5 }), f("", "finding:mass_effect", "CT", "non_contrast", "大きな血腫では周囲圧排を伴う。", { target: "whole_lesion", weight: 2 })])],
    mriGroups: [mri("SWI", [f("", "finding:susceptibility_blooming", "MRI", "SWI", "血腫は磁化率低信号/bloomingを示す。", { subregion: "basal_ganglia", target: "hemorrhagic_component", weight: 5 })]), mri("T1WI", [f("", "finding:t1_hyperintensity", "MRI", "T1WI", "亜急性期にはT1高信号を示す。", { target: "hemorrhagic_component", typicality: "variable", weight: 2 })])]
  },
  {
    id: "cerebral_amyloid_angiopathy", ja: "脳アミロイドアンギオパチー", en: "Cerebral amyloid angiopathy", query: 'cerebral amyloid angiopathy MRI SWI imaging',
    aliases: { ja: ["CAA"], en: ["CAA"] }, clinical: C("高齢者の皮質・皮質下出血や微小出血、皮質表在性鉄沈着を来す血管症。SWI/T2*が重要。"), demographics: { ...demoAdult, age: { typical_min: 60, typical_max: 95, peak_decade: "高齢者", summary: "高齢者に多い。" } }, frequency: freqUncommon("lobar_hemorrhage_microbleeds"), keywords: ["lobar hemorrhage", "microbleeds", "superficial siderosis"],
    ctSummary: "皮質下〜葉性脳出血として見える。", mriSummary: "SWI/T2*で葉性微小出血や皮質表在性鉄沈着を示す。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hyperattenuation", "CT", "non_contrast", "急性葉性出血は高吸収として認められる。", { target: "hemorrhagic_component", weight: 3 })])],
    mriGroups: [mri("SWI", [f("", "finding:susceptibility_blooming", "MRI", "SWI", "葉性微小出血や皮質表在性鉄沈着を示す。", { target: "microbleeds", typicality: "typical", weight: 5 })]), mri("FLAIR", [f("", "finding:vasogenic_edema", "MRI", "FLAIR", "CAA関連炎症では白質浮腫を伴うことがある。", { target: "white_matter", typicality: "variable", weight: 2 })])]
  },
  {
    id: "moyamoya_disease", ja: "もやもや病", en: "Moyamoya disease", query: 'moyamoya disease MRI MRA imaging',
    aliases: { ja: ["もやもや病"], en: ["Moyamoya disease"] }, clinical: C("内頚動脈終末部狭窄・閉塞と基底部異常血管網を特徴とする血管疾患。MRAで狭窄/閉塞と側副血行を評価する。"), demographics: { ...demoAdult, age: { typical_min: 5, typical_max: 60, peak_decade: "小児と成人に二峰性", summary: "小児と成人に二峰性。" } }, frequency: freqUncommon("arterial_stenosis_collateral_vessels"), keywords: ["ICA terminus", "collateral vessels", "ivy sign"],
    ctSummary: "梗塞や出血を伴うことがある。", mriSummary: "MRAで内頚動脈終末部狭窄/閉塞、flow void、FLAIR ivy signを評価する。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "虚血性変化が低吸収として見えることがある。", { typicality: "variable", weight: 1 })])],
    mriGroups: [mri("MRA_TOF", [f("", "finding:arterial_stenosis_or_occlusion", "MRI", "MRA_TOF", "内頚動脈終末部〜中大脳動脈近位部の狭窄/閉塞を示す。", { organ: "cerebral_vessel", weight: 5 })]), mri("T2WI", [f("", "finding:flow_void", "MRI", "T2WI", "基底核周囲の側副血管flow voidを伴う。", { organ: "cerebral_vessel", subregion: "basal_ganglia", weight: 4 })]), mri("FLAIR", [f("", "finding:leptomeningeal_enhancement", "MRI", "FLAIR", "FLAIRで皮質溝高信号/ivy signを示すことがある。", { target: "meninges", typicality: "variable", weight: 2 })])]
  },
  {
    id: "intracranial_aneurysm", ja: "脳動脈瘤", en: "Intracranial aneurysm", query: 'intracranial aneurysm CTA MRA MRI imaging',
    aliases: { ja: ["脳動脈瘤"], en: ["Cerebral aneurysm"] }, clinical: C("頭蓋内動脈の嚢状または紡錘状拡張。破裂時はくも膜下出血を来し、CTA/MRAで瘤を評価する。"), demographics: demoAdult, frequency: freqUncommon("subarachnoid_hemorrhage_or_vascular_outpouching"), keywords: ["SAH", "CTA", "MRA"],
    ctSummary: "破裂例ではくも膜下出血が高吸収として見える。", mriSummary: "MRA/CTAで血管瘤を確認。血栓化瘤では壁在血栓やflow voidを伴う。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hyperattenuation", "CT", "non_contrast", "くも膜下出血は脳槽・脳溝の高吸収として認められる。", { subregion: "basal_cistern", target: "hemorrhagic_component", weight: 4 })])],
    mriGroups: [mri("MRA_TOF", [f("", "finding:flow_void", "MRI", "MRA_TOF", "MRAで嚢状血管拡張として認められる。", { organ: "cerebral_vessel", target: "vascular_nidus", weight: 5 })]), mri("SWI", [f("", "finding:susceptibility_blooming", "MRI", "SWI", "血栓化部分や出血に磁化率低信号を伴うことがある。", { organ: "cerebral_vessel", typicality: "variable", weight: 2 })])]
  },
  {
    id: "reversible_cerebral_vasoconstriction_syndrome", ja: "可逆性脳血管攣縮症候群", en: "Reversible cerebral vasoconstriction syndrome", query: 'reversible cerebral vasoconstriction syndrome MRI MRA imaging',
    aliases: { ja: ["RCVS"], en: ["RCVS"] }, clinical: C("雷鳴頭痛を特徴とする可逆性多発脳血管攣縮。MRA/CTAで数珠状狭窄、合併するSAHやPRESを評価する。"), demographics: { sex: { applicable: ["any"], predominance: "female", predilection: "female_predominant", summary: "女性に多い傾向がある。" }, age: { typical_min: 20, typical_max: 60, peak_decade: "若年〜中年", summary: "若年〜中年成人で重要。" } }, frequency: freqRare("thunderclap_headache_vasoconstriction"), keywords: ["thunderclap headache", "beading", "vasoconstriction"],
    ctSummary: "円蓋部くも膜下出血や脳出血を伴うことがある。", mriSummary: "MRAで多発分節状狭窄。PRES様FLAIR高信号を伴うことがある。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hyperattenuation", "CT", "non_contrast", "円蓋部くも膜下出血を伴うことがある。", { subregion: "cerebral_convexity", target: "hemorrhagic_component", typicality: "variable", weight: 2 })])],
    mriGroups: [mri("MRA_TOF", [f("", "finding:arterial_stenosis_or_occlusion", "MRI", "MRA_TOF", "多発分節状の血管狭窄を示す。", { organ: "cerebral_vessel", weight: 5, keywords: ["beading"] })]), mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "PRES様の浮腫性FLAIR高信号を伴うことがある。", { typicality: "variable", weight: 2 })])]
  },
  {
    id: "dural_arteriovenous_fistula", ja: "硬膜動静脈瘻", en: "Dural arteriovenous fistula", query: 'dural arteriovenous fistula MRI MRA imaging',
    aliases: { ja: ["dAVF", "硬膜AVF"], en: ["dAVF"] }, clinical: C("硬膜動脈と静脈洞/皮質静脈の短絡。静脈逆流があると出血や静脈性浮腫のリスクが高い。"), demographics: demoAdult, frequency: freqRare("vascular_flow_void_or_venous_congestion"), keywords: ["dAVF", "cortical venous reflux", "flow void"],
    ctSummary: "出血や静脈性浮腫を示すことがある。", mriSummary: "異常flow void、静脈性うっ滞によるFLAIR高信号、MRAで早期静脈描出を評価する。",
    ctGroups: [ct("non_contrast", [f("", "finding:hemorrhage_present", "CT", "non_contrast", "皮質静脈逆流例では出血を伴うことがある。", { target: "hemorrhagic_component", typicality: "variable", weight: 2 })])],
    mriGroups: [mri("T2WI", [f("", "finding:flow_void", "MRI", "T2WI", "硬膜静脈洞周囲や皮質表面に異常flow voidを認める。", { organ: "cerebral_vessel", target: "vascular_nidus", weight: 4 })]), mri("FLAIR", [f("", "finding:vasogenic_edema", "MRI", "FLAIR", "静脈性うっ滞による白質浮腫を伴うことがある。", { target: "perilesional_edema", weight: 3 })]), mri("MRA_TOF", [f("", "finding:vascular_nidus", "MRI", "MRA_TOF", "MRAで短絡血流や早期静脈描出を示すことがある。", { organ: "cerebral_vessel", target: "vascular_nidus", weight: 3 })])]
  },
  {
    id: "carotid_cavernous_fistula", ja: "頚動脈海綿静脈洞瘻", en: "Carotid-cavernous fistula", query: 'carotid cavernous fistula MRI CT imaging',
    aliases: { ja: ["CCF"], en: ["CCF"] }, clinical: C("頚動脈系と海綿静脈洞の短絡。眼球突出、結膜充血、外眼筋腫大、上眼静脈拡張を画像で評価する。"), demographics: demoAdult, frequency: freqRare("cavernous_sinus_vascular_lesion"), keywords: ["superior ophthalmic vein", "cavernous sinus", "proptosis"],
    ctSummary: "海綿静脈洞拡大、上眼静脈拡張、外眼筋腫大を示す。", mriSummary: "海綿静脈洞flow void、上眼静脈拡張、MRAで短絡を評価する。",
    ctGroups: [ct("arterial", [f("", "finding:flow_void", "CT", "arterial", "造影CT/CTAで海綿静脈洞や上眼静脈の早期濃染を示す。", { subregion: "cavernous_sinus", target: "venous_sinus", weight: 4 })])],
    mriGroups: [mri("MRA_TOF", [f("", "finding:vascular_nidus", "MRI", "MRA_TOF", "海綿静脈洞部の短絡血流を示す。", { organ: "cerebral_vessel", subregion: "cavernous_sinus", target: "vascular_nidus", weight: 4 })]), mri("T2WI", [f("", "finding:flow_void", "MRI", "T2WI", "海綿静脈洞内や上眼静脈のflow voidを伴う。", { subregion: "cavernous_sinus", target: "venous_sinus", weight: 3 })])]
  },
  {
    id: "normal_pressure_hydrocephalus", ja: "正常圧水頭症", en: "Normal pressure hydrocephalus", query: 'normal pressure hydrocephalus MRI CT imaging DESH',
    aliases: { ja: ["NPH", "特発性正常圧水頭症"], en: ["NPH", "iNPH"] }, clinical: C("歩行障害、認知障害、尿失禁を来す交通性水頭症。DESH、脳室拡大、シルビウス裂拡大、高位円蓋部脳溝狭小化を評価する。"), demographics: { ...demoAdult, age: { typical_min: 65, typical_max: 90, peak_decade: "高齢者", summary: "高齢者に多い。" } }, frequency: freqUncommon("ventriculomegaly_gait_disturbance"), keywords: ["DESH", "Evans index", "tight high convexity"],
    ctSummary: "脳室拡大とDESHパターンを評価する。", mriSummary: "脳室拡大、シルビウス裂拡大、高位円蓋部脳溝狭小化。",
    ctGroups: [ct("non_contrast", [f("", "finding:ventriculomegaly", "CT", "non_contrast", "脳室拡大を示す。", { organ: "ventricle", target: "whole_lesion", weight: 4 })])],
    mriGroups: [mri("T2WI", [f("", "finding:ventriculomegaly", "MRI", "T2WI", "側脳室拡大を示す。", { organ: "ventricle", weight: 4 })]), mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "脳室周囲高信号を伴うことがある。", { subregion: "periventricular", target: "white_matter", typicality: "variable", weight: 1 })])]
  },
  {
    id: "idiopathic_intracranial_hypertension", ja: "特発性頭蓋内圧亢進症", en: "Idiopathic intracranial hypertension", query: 'idiopathic intracranial hypertension MRI MRV imaging',
    aliases: { ja: ["IIH"], en: ["IIH"] }, clinical: C("明らかな占拠性病変なしに頭蓋内圧亢進を来す。視神経鞘拡大、後部強膜扁平化、empty sella、横静脈洞狭窄を評価する。"), demographics: { sex: { applicable: ["any"], predominance: "female", predilection: "female_predominant", summary: "若年〜中年女性に多い。" }, age: { typical_min: 15, typical_max: 50, peak_decade: "若年〜中年女性", summary: "若年〜中年女性で重要。" } }, frequency: freqUncommon("papilledema_headache"), keywords: ["empty sella", "transverse sinus stenosis", "optic nerve sheath"],
    ctSummary: "CTは正常のことが多い。", mriSummary: "empty sella、視神経鞘拡大、MRVで横静脈洞狭窄。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_isoattenuation", "CT", "non_contrast", "頭部CTは正常のことが多い。", { weight: 1 })])],
    mriGroups: [mri("T1WI", [f("", "finding:sellar_suprasellar_mass", "MRI", "T1WI", "empty sella様の鞍内変化を示すことがある。", { organ: "pituitary", subregion: "sellar", target: "sellar_mass", typicality: "variable", weight: 2 })]), mri("MRV", [f("", "finding:venous_sinus_thrombosis", "MRI", "MRV", "横静脈洞狭窄を示すことがある。血栓との鑑別が必要。", { organ: "dural_venous_sinus", subregion: "dural_venous_sinus", target: "venous_sinus", typicality: "variable", weight: 2 })])]
  },
  {
    id: "spontaneous_intracranial_hypotension", ja: "特発性低髄液圧症候群", en: "Spontaneous intracranial hypotension", query: 'spontaneous intracranial hypotension MRI pachymeningeal enhancement',
    aliases: { ja: ["SIH", "低髄液圧症候群"], en: ["SIH"] }, clinical: C("脊髄髄液漏により起立性頭痛を来す。びまん性硬膜造影、脳下垂、硬膜下液体貯留、静脈洞拡張を示す。"), demographics: demoAdult, frequency: freqRare("orthostatic_headache_pachymeningeal_enhancement"), keywords: ["brain sagging", "pachymeningeal enhancement", "subdural collection"],
    ctSummary: "硬膜下液体貯留を示すことがある。", mriSummary: "びまん性硬膜造影、脳下垂、硬膜下液体貯留が特徴。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "硬膜下液体貯留が低吸収として見えることがある。", { organ: "meninges", subregion: "extra_axial", target: "extra_axial_collection", weight: 2 })])],
    mriGroups: [mri("contrast_enhanced_T1WI", [f("", "finding:pachymeningeal_enhancement", "MRI", "contrast_enhanced_T1WI", "びまん性硬膜造影を示す。", { organ: "meninges", subregion: "extra_axial", target: "meninges", weight: 5 })]), mri("T2WI", [f("", "finding:csf_like_signal", "MRI", "T2WI", "硬膜下液体貯留を伴うことがある。", { organ: "meninges", subregion: "extra_axial", target: "extra_axial_collection", weight: 3 })])]
  },
  {
    id: "chiari_1_malformation", ja: "Chiari I奇形", en: "Chiari I malformation", query: 'Chiari I malformation MRI imaging',
    aliases: { ja: ["キアリI型奇形"], en: ["Chiari type I malformation"] }, clinical: C("小脳扁桃が大後頭孔以下へ下垂する先天性/発達性異常。脊髄空洞症や後頭蓋窩狭小を評価する。"), demographics: { ...demoPeds, age: { typical_min: 5, typical_max: 50, peak_decade: "小児〜成人", summary: "小児から成人で見つかる。" } }, frequency: freqUncommon("tonsillar_ectopia"), keywords: ["tonsillar ectopia", "syringomyelia", "foramen magnum"],
    ctSummary: "骨構造評価に有用だがMRIが基本。", mriSummary: "小脳扁桃下垂、髄液腔狭小、脊髄空洞症を評価する。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_isoattenuation", "CT", "non_contrast", "CT単独では評価が限られる。", { subregion: "posterior_fossa", weight: 1 })])],
    mriGroups: [mri("T2WI", [f("", "finding:mass_effect", "MRI", "T2WI", "小脳扁桃下垂により大後頭孔部の髄液腔が狭小化する。", { subregion: "posterior_fossa", target: "developmental_anomaly", weight: 4 })]), mri("CISS_FIESTA", [f("", "finding:heavily_t2_fluid_signal", "MRI", "CISS_FIESTA", "大後頭孔部の髄液腔と圧排を評価する。", { subregion: "posterior_fossa", weight: 2 })])]
  },
  {
    id: "dandy_walker_malformation", ja: "Dandy-Walker奇形", en: "Dandy-Walker malformation", query: 'Dandy-Walker malformation MRI CT imaging',
    aliases: { ja: ["ダンディ・ウォーカー奇形"], en: ["Dandy-Walker malformation"] }, clinical: C("後頭蓋窩嚢胞性拡大、小脳虫部形成異常、第4脳室拡大を特徴とする先天奇形。"), demographics: demoPeds, frequency: freqRare("posterior_fossa_developmental_anomaly"), keywords: ["posterior fossa cyst", "vermian hypoplasia", "fourth ventricle"],
    ctSummary: "後頭蓋窩嚢胞性拡大と水頭症を示す。", mriSummary: "第4脳室拡大、虫部低形成、後頭蓋窩嚢胞を評価する。",
    ctGroups: [ct("non_contrast", [f("", "finding:csf_like_signal", "CT", "non_contrast", "後頭蓋窩に髄液濃度の嚢胞性拡大を認める。", { subregion: "posterior_fossa", target: "developmental_anomaly", weight: 4 })])],
    mriGroups: [mri("T2WI", [f("", "finding:csf_like_signal", "MRI", "T2WI", "第4脳室と連続する後頭蓋窩嚢胞を示す。", { subregion: "posterior_fossa", target: "developmental_anomaly", weight: 4 })]), mri("T2WI", [f("", "finding:hydrocephalus", "MRI", "T2WI", "水頭症を伴うことがある。", { organ: "ventricle", weight: 2 })])]
  },
  {
    id: "agenesis_of_corpus_callosum", ja: "脳梁欠損", en: "Agenesis of the corpus callosum", query: 'agenesis corpus callosum MRI imaging',
    aliases: { ja: ["脳梁形成不全"], en: ["Corpus callosum agenesis"] }, clinical: C("脳梁の完全または部分欠損。側脳室形態異常、放射状脳溝、Probst bundleなどを評価する。"), demographics: demoPeds, frequency: freqUncommon("developmental_anomaly"), keywords: ["corpus callosum", "colpocephaly", "Probst bundles"],
    ctSummary: "側脳室形態異常や脳梁欠損を示す。", mriSummary: "脳梁欠損、側脳室平行化、後角拡大、放射状脳溝を評価する。",
    ctGroups: [ct("non_contrast", [f("", "finding:ventriculomegaly", "CT", "non_contrast", "側脳室後角拡大を伴うことがある。", { organ: "ventricle", target: "developmental_anomaly", weight: 2 })])],
    mriGroups: [mri("T1WI", [f("", "finding:callosal_lesion", "MRI", "T1WI", "脳梁の欠損または形成不全を示す。", { organ: "corpus_callosum", target: "developmental_anomaly", weight: 5 })]), mri("T2WI", [f("", "finding:ventriculomegaly", "MRI", "T2WI", "側脳室形態異常や後角拡大を伴う。", { organ: "ventricle", target: "developmental_anomaly", weight: 2 })])]
  },
  {
    id: "tuberous_sclerosis_complex", ja: "結節性硬化症", en: "Tuberous sclerosis complex", query: 'tuberous sclerosis complex brain MRI CT imaging',
    aliases: { ja: ["TSC"], en: ["TSC"] }, clinical: C("mTOR経路異常による神経皮膚症候群。皮質結節、上衣下結節、SEGAを評価する。"), demographics: demoPeds, frequency: freqRare("neurocutaneous_syndrome"), keywords: ["cortical tubers", "subependymal nodules", "SEGA"],
    ctSummary: "石灰化した上衣下結節を認めることがある。", mriSummary: "皮質結節と上衣下結節、モンロー孔近傍SEGAを評価する。",
    ctGroups: [ct("non_contrast", [f("", "finding:calcification_present", "CT", "non_contrast", "上衣下結節が石灰化することがある。", { subregion: "subependymal", target: "calcified_component", weight: 4 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:cortical_subcortical_lesion", "MRI", "FLAIR", "皮質結節が皮質〜皮質下FLAIR高信号として見える。", { target: "cortex", weight: 4 })]), mri("T1WI", [f("", "finding:subependymal_nodule", "MRI", "T1WI", "脳室上衣下結節を認める。", { subregion: "subependymal", target: "ventricular_mass", weight: 4 })]), mri("contrast_enhanced_T1WI", [f("", "finding:enhancing_solid_component", "MRI", "contrast_enhanced_T1WI", "SEGAではモンロー孔近傍の造影性腫瘤を示す。", { subregion: "foramen_of_monro", target: "ventricular_mass", typicality: "variable", weight: 3 })])]
  },
  {
    id: "sturge_weber_syndrome", ja: "Sturge-Weber症候群", en: "Sturge-Weber syndrome", query: 'Sturge-Weber syndrome brain MRI CT imaging',
    aliases: { ja: ["スタージ・ウェーバー症候群"], en: ["Sturge-Weber syndrome"] }, clinical: C("顔面毛細血管奇形に伴う軟膜血管腫症。皮質石灰化、脳萎縮、軟髄膜造影を示す。"), demographics: demoPeds, frequency: freqRare("neurocutaneous_syndrome"), keywords: ["tram-track calcification", "leptomeningeal angiomatosis"],
    ctSummary: "皮質下のtram-track様石灰化と脳萎縮が特徴。", mriSummary: "軟髄膜造影、皮質下白質変化、脈絡叢拡大を伴う。",
    ctGroups: [ct("non_contrast", [f("", "finding:calcification_present", "CT", "non_contrast", "皮質下にtram-track様石灰化を認める。", { target: "calcified_component", weight: 5, keywords: ["tram-track"] })])],
    mriGroups: [mri("contrast_enhanced_T1WI", [f("", "finding:leptomeningeal_enhancement", "MRI", "contrast_enhanced_T1WI", "患側大脳半球に軟髄膜造影を示す。", { target: "meninges", weight: 5 })]), mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "患側白質変化や萎縮を伴う。", { target: "white_matter", weight: 2 })])]
  },
  {
    id: "nf1_optic_pathway_glioma", ja: "NF1関連視路神経膠腫", en: "NF1-associated optic pathway glioma", query: 'NF1 optic pathway glioma MRI imaging',
    aliases: { ja: ["視路神経膠腫", "NF1関連視神経膠腫"], en: ["Optic pathway glioma"] }, clinical: C("NF1に合併しやすい低悪性度視路神経膠腫。視神経、視交叉、視索の腫大とT2高信号、造影を評価する。"), demographics: demoPeds, frequency: freqUncommon("optic_pathway_mass_child"), keywords: ["NF1", "optic chiasm", "optic nerve"],
    ctSummary: "CTは限定的。視路腫大として見えることがある。", mriSummary: "視神経〜視交叉の腫大、T2高信号、造影効果を示す。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_isoattenuation", "CT", "non_contrast", "CTでの評価は限定的。", { organ: "optic_pathway", subregion: "optic_chiasm", target: "whole_lesion", weight: 1 })])],
    mriGroups: [mri("T2WI", [f("", "finding:t2_hyperintensity", "MRI", "T2WI", "視神経〜視交叉の腫大とT2高信号を示す。", { organ: "optic_pathway", subregion: "optic_chiasm", weight: 4 })]), mri("contrast_enhanced_T1WI", [f("", "finding:mild_enhancement", "MRI", "contrast_enhanced_T1WI", "造影効果は可変。", { organ: "optic_pathway", subregion: "optic_chiasm", typicality: "variable", weight: 2 })])]
  },
  {
    id: "x_linked_adrenoleukodystrophy", ja: "X連鎖副腎白質ジストロフィー", en: "X-linked adrenoleukodystrophy", query: 'X-linked adrenoleukodystrophy brain MRI imaging',
    aliases: { ja: ["ALD", "副腎白質ジストロフィー"], en: ["X-ALD", "Adrenoleukodystrophy"] }, clinical: C("ペルオキシソーム病による白質ジストロフィー。小児大脳型では後頭頭頂葉白質から脳梁膨大部に対称性病変を示し、活動性辺縁が造影される。"), demographics: { sex: { applicable: ["male"], predominance: "male", predilection: "male_only", summary: "X連鎖性で男性に発症する。" }, age: { typical_min: 3, typical_max: 15, peak_decade: "小児男児", summary: "小児男児で重要。" } }, frequency: freqRare("symmetric_white_matter_disease"), keywords: ["posterior white matter", "splenium", "enhancing leading edge"],
    ctSummary: "後頭頭頂白質低吸収として見えることがある。", mriSummary: "後方優位の対称性白質T2/FLAIR高信号、活動性辺縁造影。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "後方白質低吸収として見えることがある。", { subregion: "occipital_lobe", target: "white_matter", weight: 1 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:bilateral_symmetric_white_matter_lesions", "MRI", "FLAIR", "後頭頭頂葉白質から脳梁膨大部に対称性FLAIR高信号を示す。", { subregion: "symmetric_white_matter", target: "white_matter", weight: 5 })]), mri("contrast_enhanced_T1WI", [f("", "finding:ring_enhancement", "MRI", "contrast_enhanced_T1WI", "活動性脱髄辺縁が造影されることがある。", { subregion: "symmetric_white_matter", target: "lesion_margin", typicality: "variable", weight: 3 })])]
  },
  {
    id: "metachromatic_leukodystrophy", ja: "異染性白質ジストロフィー", en: "Metachromatic leukodystrophy", query: 'metachromatic leukodystrophy brain MRI imaging',
    aliases: { ja: ["MLD"], en: ["MLD"] }, clinical: C("アリルスルファターゼA欠損による白質ジストロフィー。両側対称性白質病変とtigroid patternが手掛かり。"), demographics: demoPeds, frequency: freqRare("symmetric_white_matter_disease"), keywords: ["tigroid pattern", "symmetric white matter"],
    ctSummary: "白質低吸収として見えることがある。", mriSummary: "両側対称性白質T2/FLAIR高信号。tigroid pattern、造影は通常乏しい。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "白質低吸収として見えることがある。", { subregion: "symmetric_white_matter", target: "white_matter", weight: 1 })])],
    mriGroups: [mri("T2WI", [f("", "finding:bilateral_symmetric_white_matter_lesions", "MRI", "T2WI", "両側対称性白質T2高信号を示す。", { subregion: "symmetric_white_matter", target: "white_matter", weight: 5, keywords: ["tigroid"] })]), mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "白質FLAIR高信号を示す。", { subregion: "symmetric_white_matter", target: "white_matter", weight: 3 })]), mri("contrast_enhanced_T1WI", [f("", "finding:enhancement_absent", "MRI", "contrast_enhanced_T1WI", "通常は明らかな造影効果を欠く。", { subregion: "symmetric_white_matter", weight: 2 })])]
  },
  {
    id: "alexander_disease", ja: "Alexander病", en: "Alexander disease", query: 'Alexander disease brain MRI imaging',
    aliases: { ja: ["アレキサンダー病"], en: ["Alexander disease"] }, clinical: C("GFAP関連白質疾患。前頭葉優位白質病変、基底核/視床病変、脳幹病変、造影を示すことがある。"), demographics: { ...demoPeds, age: { typical_min: 0, typical_max: 60, peak_decade: "小児〜成人", summary: "小児型から成人型まである。" } }, frequency: freqRare("frontal_predominant_white_matter_disease"), keywords: ["frontal predominance", "GFAP"],
    ctSummary: "前頭葉白質低吸収として見えることがある。", mriSummary: "前頭葉優位白質T2/FLAIR高信号、造影、脳幹病変を伴うことがある。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "前頭葉白質低吸収として見えることがある。", { subregion: "frontal_lobe", target: "white_matter", weight: 1 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:bilateral_symmetric_white_matter_lesions", "MRI", "FLAIR", "前頭葉優位の白質FLAIR高信号を示す。", { subregion: "frontal_lobe", target: "white_matter", weight: 4 })]), mri("contrast_enhanced_T1WI", [f("", "finding:mild_enhancement", "MRI", "contrast_enhanced_T1WI", "病変辺縁や脳室周囲に造影効果を伴うことがある。", { subregion: "frontal_lobe", typicality: "variable", weight: 2 })])]
  },
  {
    id: "canavan_disease", ja: "Canavan病", en: "Canavan disease", query: 'Canavan disease MRI brain imaging',
    aliases: { ja: ["カナバン病"], en: ["Canavan disease"] }, clinical: C("NAA代謝異常による白質変性疾患。乳児期発症でびまん性対称性白質病変、MRSでNAA上昇が特徴。"), demographics: demoPeds, frequency: freqRare("infantile_symmetric_white_matter_disease"), keywords: ["NAA", "MRS", "symmetric white matter"],
    ctSummary: "びまん性白質低吸収として見えることがある。", mriSummary: "びまん性対称性T2/FLAIR高信号、MRSでNAA上昇。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "びまん性白質低吸収として見えることがある。", { subregion: "symmetric_white_matter", target: "white_matter", weight: 1 })])],
    mriGroups: [mri("T2WI", [f("", "finding:bilateral_symmetric_white_matter_lesions", "MRI", "T2WI", "びまん性両側対称性白質T2高信号を示す。", { subregion: "symmetric_white_matter", target: "white_matter", weight: 5 })]), mri("MRS", [f("", "finding:elevated_choline_peak", "MRI", "MRS", "MRS異常を伴う。NAA上昇が特徴だが、現辞書では代謝ピーク異常として保持。", { subregion: "symmetric_white_matter", target: "white_matter", typicality: "variable", weight: 2, keywords: ["NAA elevated"] })])]
  },
  {
    id: "glutaric_aciduria_type_1", ja: "グルタル酸尿症1型", en: "Glutaric aciduria type 1", query: 'glutaric aciduria type 1 brain MRI imaging',
    aliases: { ja: ["GA1"], en: ["GA1"] }, clinical: C("リジン/トリプトファン代謝異常。前頭側頭葉萎縮、シルビウス裂開大、基底核障害を示す。"), demographics: demoPeds, frequency: freqRare("metabolic_basal_ganglia_disease"), keywords: ["wide Sylvian fissures", "basal ganglia", "macrocephaly"],
    ctSummary: "シルビウス裂拡大、前頭側頭葉萎縮、基底核低吸収を示すことがある。", mriSummary: "シルビウス裂開大、基底核T2高信号、白質変化。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "基底核障害が低吸収として見えることがある。", { subregion: "basal_ganglia", target: "deep_gray_matter", weight: 2 })])],
    mriGroups: [mri("T2WI", [f("", "finding:basal_ganglia_involvement", "MRI", "T2WI", "線条体を中心とする基底核病変を示す。", { subregion: "basal_ganglia", target: "deep_gray_matter", weight: 4 })]), mri("FLAIR", [f("", "finding:flair_hyperintensity", "MRI", "FLAIR", "白質や基底核にFLAIR高信号を伴うことがある。", { subregion: "basal_ganglia", weight: 2 })])]
  },
  {
    id: "leigh_syndrome", ja: "Leigh症候群", en: "Leigh syndrome", query: 'Leigh syndrome brain MRI imaging',
    aliases: { ja: ["リー症候群"], en: ["Leigh disease"] }, clinical: C("ミトコンドリア病による亜急性壊死性脳症。基底核、脳幹に対称性T2/FLAIR高信号、DWI異常を示す。"), demographics: demoPeds, frequency: freqRare("mitochondrial_basal_ganglia_disease"), keywords: ["mitochondrial", "basal ganglia", "brainstem"],
    ctSummary: "基底核低吸収として見えることがある。", mriSummary: "基底核・脳幹の対称性T2/FLAIR高信号、DWI異常、乳酸ピーク。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "基底核低吸収として見えることがある。", { subregion: "basal_ganglia", target: "deep_gray_matter", weight: 1 })])],
    mriGroups: [mri("T2WI", [f("", "finding:basal_ganglia_involvement", "MRI", "T2WI", "基底核や脳幹に対称性T2高信号を示す。", { subregion: "basal_ganglia", target: "deep_gray_matter", weight: 5 })]), mri("DWI", [f("", "finding:dwi_hyperintensity", "MRI", "DWI", "活動性病変でDWI高信号を示すことがある。", { subregion: "basal_ganglia", weight: 3 })]), mri("MRS", [f("", "finding:lactate_peak", "MRI", "MRS", "MRSで乳酸ピークを示すことがある。", { subregion: "basal_ganglia", weight: 3 })])]
  },
  {
    id: "melas", ja: "MELAS", en: "MELAS", query: 'MELAS brain MRI imaging stroke-like lesions',
    aliases: { ja: ["ミトコンドリア脳筋症・乳酸アシドーシス・脳卒中様発作"], en: ["Mitochondrial encephalomyopathy lactic acidosis and stroke-like episodes"] }, clinical: C("ミトコンドリア病。血管支配に一致しない皮質/皮質下の脳卒中様病変、乳酸ピーク、DWI/ADCの混在が特徴。"), demographics: { ...demoPeds, age: { typical_min: 5, typical_max: 40, peak_decade: "小児〜若年成人", summary: "小児から若年成人で重要。" } }, frequency: freqRare("stroke_like_nonvascular_lesions"), keywords: ["stroke-like", "nonvascular territory", "lactate"],
    ctSummary: "血管支配と一致しない低吸収病変として見えることがある。", mriSummary: "皮質〜皮質下FLAIR高信号、DWI高信号、MRS乳酸ピーク。血管支配域に一致しない。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_hypoattenuation", "CT", "non_contrast", "血管支配に一致しない低吸収病変として見えることがある。", { target: "cortex", weight: 1 })])],
    mriGroups: [mri("FLAIR", [f("", "finding:cortical_subcortical_lesion", "MRI", "FLAIR", "皮質〜皮質下の脳卒中様FLAIR高信号を示す。", { target: "cortex", weight: 4 })]), mri("DWI", [f("", "finding:dwi_hyperintensity", "MRI", "DWI", "DWI高信号を伴うことがあるが血管支配域に一致しない。", { target: "cortex", weight: 3 })]), mri("MRS", [f("", "finding:lactate_peak", "MRI", "MRS", "乳酸ピークを示すことがある。", { target: "cortex", weight: 3 })])]
  },
  {
    id: "posterior_fossa_juvenile_xanthogranuloma", ja: "中枢神経若年性黄色肉芽腫", en: "CNS juvenile xanthogranuloma", query: 'central nervous system juvenile xanthogranuloma MRI imaging',
    aliases: { ja: ["CNS JXG"], en: ["CNS JXG"] }, clinical: C("稀な組織球性病変。硬膜、脈絡叢、脳実質などに造影性腫瘤として出現しうる。"), demographics: demoPeds, frequency: freqRare("enhancing_pediatric_mass"), keywords: ["histiocytic", "enhancing mass"],
    ctSummary: "造影性腫瘤として見えることがある。", mriSummary: "T2信号可変の造影性腫瘤。硬膜病変では髄膜腫様に見えることがある。",
    ctGroups: [ct("non_contrast", [f("", "finding:ct_isoattenuation", "CT", "non_contrast", "等〜軽度高吸収腫瘤として見えることがある。", { typicality: "variable", weight: 1 })])],
    mriGroups: [mri("contrast_enhanced_T1WI", [f("", "finding:enhancing_solid_component", "MRI", "contrast_enhanced_T1WI", "充実性造影腫瘤として認められる。", { weight: 3 })]), mri("T2WI", [f("", "finding:t2_hypointensity", "MRI", "T2WI", "線維性/細胞性成分によりT2低信号を示すことがある。", { typicality: "variable", weight: 2 })])]
  }
];

if (specs.length < 50) throw new Error(`Expected at least 50 specs, got ${specs.length}`);

async function main() {
  ensureDictionaryEntries();
  for (const [i, spec] of specs.entries()) {
    spec.id = spec.id || slugify(spec.en);
    console.log(`[${i + 1}/${specs.length}] ${spec.id}`);
    const articles = await fetchPubMed(spec);
    writeJson(path.join(draftsDir, `${spec.id}.json`), makeCard(spec, articles));
  }
  const candidatePath = path.join(DATA, "dictionaries", "new-concept-candidates.json");
  if (fs.existsSync(candidatePath)) {
    const candidates = readJson(candidatePath);
    candidates.candidates = (candidates.candidates || []).filter((c) => c.candidate_id !== "candidate:unknown" && c.proposed_concept_id !== "finding:unknown");
    writeJson(candidatePath, candidates);
  }
  console.log(`Curated ${specs.length} additional brain draft cards.`);
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
