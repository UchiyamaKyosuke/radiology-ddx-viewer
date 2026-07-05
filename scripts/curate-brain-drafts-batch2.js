const fs = require("fs");
const path = require("path");

const { DATA, writeJson } = require("./lib");

const now = new Date().toISOString();
const draftsDir = path.join(DATA, "drafts");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function refsFor(diseaseId, keepPmids) {
  const articlePath = path.join(DATA, "sources", "pubmed", `${diseaseId}.articles.json`);
  const articles = fs.existsSync(articlePath) ? readJson(articlePath).articles || [] : [];
  const filtered = keepPmids?.length ? articles.filter((article) => keepPmids.includes(String(article.pmid))) : articles;
  return filtered.map((article) => ({
    source_id: `pmid_${article.pmid}`,
    type: "journal_article",
    title: article.title || "",
    authors: [],
    journal: article.journal || "",
    year: article.year || "",
    pmid: String(article.pmid || ""),
    doi: article.doi || "",
    url: article.url || (article.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/` : ""),
    license: ""
  }));
}

function ensureDictionaryEntries() {
  const anatomyPath = path.join(DATA, "dictionaries", "anatomy-map.json");
  const anatomy = readJson(anatomyPath);
  anatomy.organs = anatomy.organs || {};
  anatomy.subregions = anatomy.subregions || {};
  for (const [id, ja, en] of [
    ["pituitary", "下垂体", "pituitary gland"],
    ["cranial_nerve", "脳神経", "cranial nerve"],
    ["ventricle", "脳室", "ventricle"],
    ["dural_venous_sinus", "硬膜静脈洞", "dural venous sinus"],
    ["cerebral_vessel", "脳血管", "cerebral vessel"]
  ]) {
    if (!anatomy.organs[id]) anatomy.organs[id] = { label: { ja, en }, synonyms: [ja, en] };
  }
  for (const [id, ja, en] of [
    ["posterior_fossa", "後頭蓋窩", "posterior fossa"],
    ["cerebellum", "小脳", "cerebellum"],
    ["brainstem", "脳幹", "brainstem"],
    ["fourth_ventricle", "第4脳室", "fourth ventricle"],
    ["intraventricular", "脳室内", "intraventricular"],
    ["cerebellopontine_angle", "小脳橋角部", "cerebellopontine angle"],
    ["internal_auditory_canal", "内耳道", "internal auditory canal"],
    ["sellar", "鞍内", "sellar"],
    ["suprasellar", "鞍上部", "suprasellar"],
    ["temporal_lobe", "側頭葉", "temporal lobe"],
    ["insula", "島皮質", "insula"],
    ["dural_venous_sinus", "硬膜静脈洞", "dural venous sinus"]
  ]) {
    if (!anatomy.subregions[id]) anatomy.subregions[id] = { label: { ja, en }, synonyms: [ja, en] };
  }
  writeJson(anatomyPath, anatomy);

  const targetPath = path.join(DATA, "dictionaries", "target-map.json");
  const targets = readJson(targetPath);
  for (const [id, ja, en] of [
    ["extra_axial_collection", "脳外液体貯留", "extra-axial collection"],
    ["cystic_component", "嚢胞成分", "cystic component"],
    ["calcified_component", "石灰化成分", "calcified component"],
    ["hemorrhagic_component", "出血成分", "hemorrhagic component"],
    ["vascular_nidus", "血管nidus", "vascular nidus"],
    ["venous_sinus", "静脈洞", "venous sinus"],
    ["sellar_mass", "鞍内腫瘤", "sellar mass"],
    ["cranial_nerve_mass", "脳神経腫瘤", "cranial nerve mass"],
    ["ventricular_mass", "脳室内腫瘤", "ventricular mass"]
  ]) {
    if (!targets[id]) targets[id] = { label: { ja, en }, synonyms: [ja, en] };
  }
  writeJson(targetPath, targets);

  const conceptsPath = path.join(DATA, "dictionaries", "finding-concepts.json");
  const concepts = readJson(conceptsPath);
  const addConcept = (id, item) => {
    if (concepts[id]) return;
    concepts[id] = {
      canonical_label: { ja: item.ja, en: item.en },
      feature: item.feature,
      allowed_modalities: item.modalities,
      allowed_acquisitions: item.acquisitions,
      default_polarity: "present",
      default_modifiers: item.modifiers || {},
      synonyms: { ja: item.synJa || [item.ja], en: item.synEn || [item.en] },
      tokens: item.tokens || [item.ja, item.en],
      opposites: item.opposites || []
    };
  };
  addConcept("finding:csf_like_signal", {
    ja: "髄液様信号/吸収",
    en: "CSF-like signal or attenuation",
    feature: "signal_intensity",
    modalities: ["MRI", "CT"],
    acquisitions: ["T1WI", "T2WI", "FLAIR", "non_contrast"],
    synJa: ["髄液様信号", "CSF様信号", "髄液濃度"],
    synEn: ["CSF-like signal", "CSF attenuation"],
    tokens: ["髄液様", "CSF-like", "CSF"]
  });
  addConcept("finding:flair_suppression", {
    ja: "FLAIRで抑制される",
    en: "suppressed on FLAIR",
    feature: "signal_suppression",
    modalities: ["MRI"],
    acquisitions: ["FLAIR"],
    synJa: ["FLAIRで抑制", "FLAIR低信号"],
    synEn: ["FLAIR suppression", "suppressed on FLAIR"],
    tokens: ["FLAIR", "抑制", "suppression"]
  });
  addConcept("finding:hydrocephalus", {
    ja: "水頭症",
    en: "hydrocephalus",
    feature: "secondary_effect",
    modalities: ["MRI", "CT"],
    acquisitions: ["T2WI", "FLAIR", "non_contrast"],
    synJa: ["水頭症", "脳室拡大"],
    synEn: ["hydrocephalus", "ventriculomegaly"],
    tokens: ["水頭症", "脳室拡大", "hydrocephalus"]
  });
  addConcept("finding:internal_auditory_canal_extension", {
    ja: "内耳道進展",
    en: "internal auditory canal extension",
    feature: "location_pattern",
    modalities: ["MRI", "CT"],
    acquisitions: ["contrast_enhanced_T1WI", "T2WI", "non_contrast"],
    synJa: ["内耳道進展", "内耳道拡大"],
    synEn: ["IAC extension", "internal auditory canal extension"],
    tokens: ["内耳道", "IAC", "internal auditory canal"]
  });
  addConcept("finding:vascular_nidus", {
    ja: "血管nidus",
    en: "vascular nidus",
    feature: "vascular_pattern",
    modalities: ["MRI", "CT"],
    acquisitions: ["MRA_TOF", "MRA_contrast_enhanced", "arterial"],
    synJa: ["血管nidus", "nidus"],
    synEn: ["vascular nidus", "AVM nidus"],
    tokens: ["nidus", "AVM", "血管"]
  });
  addConcept("finding:empty_delta_sign", {
    ja: "empty delta sign",
    en: "empty delta sign",
    feature: "enhancement_pattern",
    modalities: ["MRI", "CT"],
    acquisitions: ["contrast_enhanced_T1WI", "portal_venous"],
    synJa: ["empty delta sign", "デルタサイン"],
    synEn: ["empty delta sign"],
    tokens: ["empty delta", "デルタ"]
  });
  addConcept("finding:cyst_with_enhancing_mural_nodule", {
    ja: "造影壁在結節を伴う嚢胞",
    en: "cyst with enhancing mural nodule",
    feature: "morphology",
    modalities: ["MRI", "CT"],
    acquisitions: ["contrast_enhanced_T1WI", "portal_venous"],
    synJa: ["造影壁在結節", "嚢胞性腫瘤と壁在結節"],
    synEn: ["enhancing mural nodule", "cyst with mural nodule"],
    tokens: ["壁在結節", "mural nodule", "cyst"]
  });
  addConcept("finding:sellar_suprasellar_mass", {
    ja: "鞍内〜鞍上部腫瘤",
    en: "sellar-suprasellar mass",
    feature: "location_pattern",
    modalities: ["MRI", "CT"],
    acquisitions: ["T1WI", "T2WI", "contrast_enhanced_T1WI", "non_contrast"],
    synJa: ["鞍内腫瘤", "鞍上部腫瘤", "鞍内〜鞍上部腫瘤"],
    synEn: ["sellar mass", "suprasellar mass", "sellar-suprasellar mass"],
    tokens: ["鞍内", "鞍上部", "sellar", "suprasellar"]
  });
  writeJson(conceptsPath, concepts);
}

function anatomy(organ = "brain", subregion = "cerebral_hemisphere") {
  return { body_region: "brain", organ, subregion, laterality: "unknown" };
}

function finding(diseaseId, suffix, findingCode, modality, acqCode, findingText, opts = {}) {
  return {
    finding_id: `${diseaseId}_${suffix}`,
    finding_code: findingCode,
    modality,
    acquisition: { type: modality === "CT" ? "phase" : "sequence", code: acqCode },
    anatomy: anatomy(opts.organ || "brain", opts.subregion || "cerebral_hemisphere"),
    target: opts.target || "whole_lesion",
    modifiers: opts.modifiers || {},
    keywords: opts.keywords || [],
    finding_text: findingText,
    typicality: opts.typicality || "common",
    diagnostic_weight: opts.weight ?? 2,
    review_status: "draft",
    mapping: { status: "matched", confidence: 0.9, matched_concept_id: findingCode, alternatives: [] }
  };
}

function ct(code, findings) {
  return { phase: { code }, findings };
}

function mri(code, findings) {
  return { sequence: { code }, findings };
}

function allFindings(spec) {
  return [...spec.ctGroups, ...spec.mriGroups].flatMap((group) => group.findings || []);
}

function card(spec) {
  const references = refsFor(spec.id, spec.keepPmids);
  const findings = allFindings(spec);
  return {
    schema_version: "0.8",
    disease_id: spec.id,
    disease_name: { ja: spec.ja, en: spec.en },
    disease_aliases: spec.aliases,
    clinical: spec.clinical,
    demographics: spec.demographics,
    keywords: spec.keywords,
    frequency: spec.frequency,
    imaging: {
      ct: { summary: spec.ctSummary, findings_by_phase: spec.ctGroups },
      mri: { summary: spec.mriSummary, findings_by_sequence: spec.mriGroups }
    },
    evidence: {
      summary: references.length ? `PubMedから取得しました（PMID: ${references.map((ref) => ref.pmid).join(", ")}）。` : "PubMedから取得しました。",
      claim_map: [{
        claim_type: "imaging_findings",
        finding_ids: findings.map((item) => item.finding_id),
        claim_scope: ["finding_text", "typicality", "diagnostic_weight"],
        source_ids: references.map((ref) => ref.source_id),
        confidence: "low"
      }]
    },
    image_examples: [],
    references,
    review: { status: "draft", reviewed_by: "", reviewed_at: "", confidence: "low", notes: "PubMed metadata and Codex-curated draft; requires physician review before approval." },
    updated_at: now
  };
}

const specs = [
  {
    id: "oligodendroglioma",
    ja: "乏突起膠腫",
    en: "Oligodendroglioma",
    aliases: { ja: ["乏突起神経膠腫"], en: ["Oligodendroglial tumor"] },
    keepPmids: ["26849038", "21725645"],
    clinical: { overview: "成人の大脳皮質〜皮質下に発生しやすいIDH変異・1p/19q共欠失を特徴とする神経膠腫。前頭葉優位、石灰化、皮質を巻き込むT2/FLAIR高信号が手掛かりになる。", treatment: "手術による組織診断・最大安全切除を基本に、グレードや分子診断に応じて放射線治療、PCV療法などを検討する。", epidemiology: "若年〜中年成人に多く、けいれん発症が多い。" },
    demographics: { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 25, typical_max: 60, peak_decade: "30-50歳代", summary: "若年成人から中年に多い。" } },
    frequency: { label: "uncommon", prevalence_rank: 2, basis: "epidemiology", evidence_level: "review", context: { population: "adult", body_region: "brain", clinical_setting: "calcified_cortical_subcortical_mass" }, summary: "石灰化を伴う皮質下神経膠腫では重要な鑑別。" },
    keywords: ["frontal lobe", "cortical-subcortical", "calcification", "IDH mutant", "1p/19q codeleted"],
    ctSummary: "単純CTで石灰化を高頻度に認め、低吸収の皮質下腫瘤として見えることがある。",
    mriSummary: "T2/FLAIR高信号、T1低信号、造影効果なし〜軽度が多い。高悪性度化では造影や拡散制限が増える。",
    ctGroups: [ct("non_contrast", [
      finding("oligodendroglioma", "ct_nc_001", "finding:calcification_present", "CT", "non_contrast", "皮質〜皮質下病変内に粗大または点状石灰化を伴うことが多い。", { target: "calcified_component", weight: 4, keywords: ["calcification"] }),
      finding("oligodendroglioma", "ct_nc_002", "finding:ct_hypoattenuation", "CT", "non_contrast", "腫瘍本体は低吸収として認められることがある。", { weight: 2 })
    ])],
    mriGroups: [
      mri("T2WI", [finding("oligodendroglioma", "mri_t2_001", "finding:t2_hyperintensity", "MRI", "T2WI", "皮質下優位のT2高信号腫瘤として認められる。", { weight: 3, keywords: ["cortical-subcortical"] })]),
      mri("FLAIR", [finding("oligodendroglioma", "mri_flair_001", "finding:flair_hyperintensity", "MRI", "FLAIR", "FLAIR高信号の浸潤性病変として認められる。", { weight: 3 })]),
      mri("T1WI", [finding("oligodendroglioma", "mri_t1_001", "finding:t1_hypointensity", "MRI", "T1WI", "T1低信号を示すことが多い。", { weight: 2 })]),
      mri("contrast_enhanced_T1WI", [finding("oligodendroglioma", "mri_ce_001", "finding:mild_enhancement", "MRI", "contrast_enhanced_T1WI", "造影効果はなし〜軽度のことが多いが、高悪性度化では増強が目立つ。", { typicality: "variable", weight: 2 })])
    ]
  },
  {
    id: "pilocytic_astrocytoma",
    ja: "毛様細胞性星細胞腫",
    en: "Pilocytic astrocytoma",
    aliases: { ja: ["毛様細胞性星細胞腫"], en: ["Juvenile pilocytic astrocytoma"] },
    keepPmids: ["27889018", "37306749", "37743340"],
    clinical: { overview: "小児〜若年者に多い限局性星細胞系腫瘍。小脳に多く、嚢胞と造影される壁在結節の組み合わせが典型。", treatment: "可能であれば外科的全摘を目指す。部位や残存・再発に応じて経過観察、薬物療法、放射線治療を検討する。", epidemiology: "小児後頭蓋窩腫瘍の重要な鑑別。" },
    demographics: { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 3, typical_max: 25, peak_decade: "小児〜若年者", summary: "小児から若年者に多い。" } },
    frequency: { label: "uncommon", prevalence_rank: 2, basis: "epidemiology", evidence_level: "review", context: { population: "pediatric", body_region: "brain", clinical_setting: "posterior_fossa_cystic_mass" }, summary: "小児の嚢胞性後頭蓋窩腫瘤では重要。" },
    keywords: ["cyst with mural nodule", "cerebellar", "posterior fossa"],
    ctSummary: "嚢胞性低吸収腫瘤として見え、壁在結節が造影されることがある。閉塞性水頭症を伴う場合がある。",
    mriSummary: "嚢胞性腫瘤と強く造影される壁在結節が典型。DWI強い制限は通常目立たない。",
    ctGroups: [ct("non_contrast", [finding("pilocytic_astrocytoma", "ct_nc_001", "finding:ct_hypoattenuation", "CT", "non_contrast", "嚢胞成分が低吸収として認められる。", { subregion: "cerebellum", target: "cystic_component", weight: 2 })])],
    mriGroups: [
      mri("contrast_enhanced_T1WI", [finding("pilocytic_astrocytoma", "mri_ce_001", "finding:cyst_with_enhancing_mural_nodule", "MRI", "contrast_enhanced_T1WI", "嚢胞に接する壁在結節が強く造影される形態が典型。", { subregion: "cerebellum", target: "mural_nodule", typicality: "typical", weight: 5, keywords: ["mural nodule"] })]),
      mri("T2WI", [finding("pilocytic_astrocytoma", "mri_t2_001", "finding:t2_hyperintensity", "MRI", "T2WI", "嚢胞成分はT2高信号を示す。", { subregion: "cerebellum", target: "cystic_component", weight: 3 })]),
      mri("DWI", [finding("pilocytic_astrocytoma", "mri_dwi_001", "finding:diffusion_restriction_absent", "MRI", "DWI", "高細胞性腫瘍ほどの強い拡散制限は目立たないことが多い。", { subregion: "cerebellum", typicality: "common", weight: 2 })]),
      mri("FLAIR", [finding("pilocytic_astrocytoma", "mri_flair_001", "finding:hydrocephalus", "MRI", "FLAIR", "後頭蓋窩病変では第4脳室圧排により水頭症を伴うことがある。", { subregion: "posterior_fossa", target: "whole_lesion", typicality: "variable", weight: 1 })])
    ]
  },
  {
    id: "ependymoma",
    ja: "上衣腫",
    en: "Ependymoma",
    aliases: { ja: ["脳室上衣腫"], en: ["Intracranial ependymoma"] },
    keepPmids: ["27889018", "12691623", "39287805"],
    clinical: { overview: "小児では後頭蓋窩、とくに第4脳室由来が多い腫瘍。石灰化、出血、嚢胞変性を伴う不均一な脳室内腫瘤として見えることが多い。", treatment: "最大安全切除と病理・分子分類に応じた放射線治療が中心。髄液播種評価が重要。", epidemiology: "小児後頭蓋窩腫瘍の重要な鑑別。成人では脊髄やテント上にも生じる。" },
    demographics: { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 1, typical_max: 15, peak_decade: "小児", summary: "小児に多いが成人例もある。" } },
    frequency: { label: "uncommon", prevalence_rank: 2, basis: "epidemiology", evidence_level: "review", context: { population: "pediatric", body_region: "brain", clinical_setting: "fourth_ventricle_mass" }, summary: "小児第4脳室腫瘤では重要。" },
    keywords: ["fourth ventricle", "foramen of Luschka", "plastic ependymoma", "calcification"],
    ctSummary: "第4脳室周囲の不均一腫瘤として見え、石灰化や水頭症を伴うことがある。",
    mriSummary: "T2高信号主体の不均一腫瘤。造影は不均一で、DWIは髄芽腫ほど強くないことが多い。",
    ctGroups: [ct("non_contrast", [
      finding("ependymoma", "ct_nc_001", "finding:calcification_present", "CT", "non_contrast", "腫瘤内石灰化を伴うことがある。", { organ: "ventricle", subregion: "fourth_ventricle", target: "calcified_component", weight: 3 }),
      finding("ependymoma", "ct_nc_002", "finding:hydrocephalus", "CT", "non_contrast", "第4脳室閉塞により水頭症を伴うことがある。", { organ: "ventricle", subregion: "fourth_ventricle", weight: 2 })
    ])],
    mriGroups: [
      mri("T2WI", [finding("ependymoma", "mri_t2_001", "finding:t2_hyperintensity", "MRI", "T2WI", "第4脳室内を中心に不均一なT2高信号腫瘤として認められる。", { organ: "ventricle", subregion: "fourth_ventricle", target: "ventricular_mass", weight: 3 })]),
      mri("contrast_enhanced_T1WI", [finding("ependymoma", "mri_ce_001", "finding:enhancing_solid_component", "MRI", "contrast_enhanced_T1WI", "充実成分に不均一な造影効果を伴うことが多い。", { organ: "ventricle", subregion: "fourth_ventricle", target: "solid_component", weight: 3 })]),
      mri("DWI", [finding("ependymoma", "mri_dwi_001", "finding:diffusion_restriction_present", "MRI", "DWI", "充実部に拡散制限を示すことがあるが、髄芽腫ほど均一に強くないことが多い。", { organ: "ventricle", subregion: "fourth_ventricle", typicality: "variable", weight: 2 })])
    ]
  },
  {
    id: "medulloblastoma",
    ja: "髄芽腫",
    en: "Medulloblastoma",
    aliases: { ja: ["髄芽腫"], en: ["Medulloblastoma"] },
    keepPmids: ["27375228", "27889018", "30516696", "18995998"],
    clinical: { overview: "小児に多い後頭蓋窩の胎児性腫瘍。高細胞性を反映してCT高吸収、DWI高信号/ADC低値を示しやすい。", treatment: "手術、放射線治療、化学療法をリスク分類に応じて組み合わせる。髄液播種評価が重要。", epidemiology: "小児悪性脳腫瘍として重要。小脳虫部〜第4脳室近傍に多い。" },
    demographics: { sex: { applicable: ["any"], predominance: "male", predilection: "male_predominant", summary: "男性にやや多い。" }, age: { typical_min: 3, typical_max: 15, peak_decade: "小児", summary: "小児に多い。" } },
    frequency: { label: "uncommon", prevalence_rank: 3, basis: "epidemiology", evidence_level: "review", context: { population: "pediatric", body_region: "brain", clinical_setting: "posterior_fossa_solid_mass" }, summary: "小児後頭蓋窩充実性腫瘤では上位鑑別。" },
    keywords: ["posterior fossa", "vermis", "high cellularity", "CSF dissemination"],
    ctSummary: "単純CTで高吸収の充実性後頭蓋窩腫瘤として認められ、水頭症を伴いやすい。",
    mriSummary: "DWI高信号/ADC低値が重要。T2は等〜低信号寄り、不均一造影を示す。",
    ctGroups: [ct("non_contrast", [
      finding("medulloblastoma", "ct_nc_001", "finding:ct_hyperattenuation", "CT", "non_contrast", "高細胞性を反映して単純CTで高吸収を示すことが多い。", { subregion: "posterior_fossa", weight: 4 }),
      finding("medulloblastoma", "ct_nc_002", "finding:hydrocephalus", "CT", "non_contrast", "第4脳室閉塞による水頭症を伴いやすい。", { subregion: "posterior_fossa", weight: 2 })
    ])],
    mriGroups: [
      mri("DWI", [finding("medulloblastoma", "mri_dwi_001", "finding:dwi_hyperintensity", "MRI", "DWI", "高細胞性によりDWI高信号を示す。", { subregion: "posterior_fossa", weight: 4 })]),
      mri("ADC", [finding("medulloblastoma", "mri_adc_001", "finding:adc_low", "MRI", "ADC", "ADC低値を伴う拡散制限が重要。", { subregion: "posterior_fossa", weight: 4 })]),
      mri("T2WI", [finding("medulloblastoma", "mri_t2_001", "finding:t2_mild_hypointensity", "MRI", "T2WI", "T2で等〜軽度低信号寄りに見えることがある。", { subregion: "posterior_fossa", weight: 2 })]),
      mri("contrast_enhanced_T1WI", [finding("medulloblastoma", "mri_ce_001", "finding:enhancing_solid_component", "MRI", "contrast_enhanced_T1WI", "充実部に造影効果を伴う。", { subregion: "posterior_fossa", target: "solid_component", weight: 3 })])
    ]
  },
  {
    id: "vestibular_schwannoma",
    ja: "前庭神経鞘腫",
    en: "Vestibular schwannoma",
    aliases: { ja: ["聴神経腫瘍"], en: ["Acoustic neuroma"] },
    keepPmids: ["31504802", "41052870", "38252395", "32690241"],
    clinical: { overview: "第8脳神経由来の良性腫瘍。内耳道から小脳橋角部へ進展する造影性腫瘤として認められる。", treatment: "腫瘍サイズ、症状、聴力、増大傾向に応じて経過観察、定位放射線治療、手術を選択する。", epidemiology: "成人の小脳橋角部腫瘤で頻度の高い鑑別。" },
    demographics: { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 30, typical_max: 75, peak_decade: "40-60歳代", summary: "成人に多い。" } },
    frequency: { label: "common", prevalence_rank: 4, basis: "clinical_context", evidence_level: "guideline", context: { population: "adult", body_region: "brain", clinical_setting: "cerebellopontine_angle_mass" }, summary: "小脳橋角部造影性腫瘤では頻度の高い鑑別。" },
    keywords: ["cerebellopontine angle", "internal auditory canal", "ice-cream cone"],
    ctSummary: "内耳道拡大や小脳橋角部腫瘤として見えることがあるが、MRIが主役。",
    mriSummary: "内耳道内から小脳橋角部へ伸びる強く造影される腫瘤。T2高信号、嚢胞変性を伴うことがある。",
    ctGroups: [ct("non_contrast", [finding("vestibular_schwannoma", "ct_nc_001", "finding:internal_auditory_canal_extension", "CT", "non_contrast", "内耳道拡大を伴うことがある。", { organ: "cranial_nerve", subregion: "internal_auditory_canal", target: "cranial_nerve_mass", typicality: "variable", weight: 2 })])],
    mriGroups: [
      mri("contrast_enhanced_T1WI", [finding("vestibular_schwannoma", "mri_ce_001", "finding:avid_homogeneous_enhancement", "MRI", "contrast_enhanced_T1WI", "内耳道〜小脳橋角部の腫瘤が強く造影される。", { organ: "cranial_nerve", subregion: "cerebellopontine_angle", target: "cranial_nerve_mass", weight: 5 })]),
      mri("contrast_enhanced_T1WI", [finding("vestibular_schwannoma", "mri_ce_002", "finding:internal_auditory_canal_extension", "MRI", "contrast_enhanced_T1WI", "内耳道内進展を伴うことが診断の手掛かりになる。", { organ: "cranial_nerve", subregion: "internal_auditory_canal", target: "cranial_nerve_mass", weight: 5, keywords: ["IAC extension"] })]),
      mri("T2WI", [finding("vestibular_schwannoma", "mri_t2_001", "finding:t2_hyperintensity", "MRI", "T2WI", "腫瘤はT2高信号を示すことが多い。", { organ: "cranial_nerve", subregion: "cerebellopontine_angle", target: "cranial_nerve_mass", weight: 2 })])
    ]
  },
  {
    id: "pituitary_macroadenoma",
    ja: "下垂体腺腫",
    en: "Pituitary macroadenoma",
    aliases: { ja: ["下垂体神経内分泌腫瘍", "PitNET"], en: ["Pituitary adenoma", "PitNET"] },
    keepPmids: ["36826759", "42307852", "25732655", "31745969"],
    clinical: { overview: "下垂体前葉由来の腫瘍。10 mm以上ではmacroadenomaとされ、鞍内から鞍上部へ進展し視交叉圧排や海綿静脈洞浸潤を評価する。", treatment: "機能性の有無、サイズ、視機能、浸潤に応じて薬物療法、経蝶形骨洞手術、放射線治療、経過観察を選択する。", epidemiology: "成人の鞍内〜鞍上部腫瘤で頻度が高い。" },
    demographics: { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "機能性腫瘍の種類により性差は変わる。" }, age: { typical_min: 20, typical_max: 75, peak_decade: "30-60歳代", summary: "成人に多い。" } },
    frequency: { label: "common", prevalence_rank: 4, basis: "clinical_context", evidence_level: "review", context: { population: "adult", body_region: "brain", clinical_setting: "sellar_mass" }, summary: "成人の鞍内腫瘤では頻度の高い鑑別。" },
    keywords: ["sellar mass", "suprasellar extension", "cavernous sinus invasion", "pituitary apoplexy"],
    ctSummary: "鞍内拡大や鞍上部腫瘤として見え、出血性卒中では高吸収を伴うことがある。",
    mriSummary: "鞍内〜鞍上部腫瘤。T1等〜低信号、T2可変、造影効果を示し、出血・壊死で不均一になる。",
    ctGroups: [ct("non_contrast", [finding("pituitary_macroadenoma", "ct_nc_001", "finding:sellar_suprasellar_mass", "CT", "non_contrast", "鞍内〜鞍上部腫瘤として認められる。", { organ: "pituitary", subregion: "sellar", target: "sellar_mass", weight: 3 })])],
    mriGroups: [
      mri("T1WI", [finding("pituitary_macroadenoma", "mri_t1_001", "finding:t1_isointensity", "MRI", "T1WI", "腫瘤はT1で脳実質と等〜軽度低信号を示すことが多い。", { organ: "pituitary", subregion: "sellar", target: "sellar_mass", weight: 2 })]),
      mri("contrast_enhanced_T1WI", [finding("pituitary_macroadenoma", "mri_ce_001", "finding:sellar_suprasellar_mass", "MRI", "contrast_enhanced_T1WI", "鞍内から鞍上部へ進展する造影性腫瘤として評価される。", { organ: "pituitary", subregion: "sellar", target: "sellar_mass", weight: 4 })]),
      mri("contrast_enhanced_T1WI", [finding("pituitary_macroadenoma", "mri_ce_002", "finding:enhancing_solid_component", "MRI", "contrast_enhanced_T1WI", "充実部は造影され、壊死や出血があると不均一になる。", { organ: "pituitary", subregion: "sellar", target: "solid_component", weight: 3 })]),
      mri("T1WI", [finding("pituitary_macroadenoma", "mri_t1_002", "finding:t1_hyperintensity", "MRI", "T1WI", "下垂体卒中では出血成分によりT1高信号を示すことがある。", { organ: "pituitary", subregion: "sellar", target: "hemorrhagic_component", typicality: "variable", weight: 2, keywords: ["pituitary apoplexy"] })])
    ]
  },
  {
    id: "craniopharyngioma",
    ja: "頭蓋咽頭腫",
    en: "Craniopharyngioma",
    aliases: { ja: ["頭蓋咽頭腫"], en: ["Craniopharyngioma"] },
    keepPmids: ["31699993", "33040852", "32389269"],
    clinical: { overview: "鞍上部に発生する上皮性腫瘍。嚢胞・充実成分・石灰化の組み合わせが典型で、小児のadamantinomatous型では石灰化が目立つ。", treatment: "手術、放射線治療、嚢胞治療などを病変範囲と内分泌・視機能リスクに応じて選択する。", epidemiology: "小児と成人に二峰性。鞍上部嚢胞性腫瘤の重要な鑑別。" },
    demographics: { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 5, typical_max: 70, peak_decade: "小児と成人に二峰性", summary: "小児と成人に二峰性分布を示す。" } },
    frequency: { label: "uncommon", prevalence_rank: 2, basis: "epidemiology", evidence_level: "review", context: { population: "any", body_region: "brain", clinical_setting: "suprasellar_cystic_solid_mass" }, summary: "鞍上部嚢胞性充実性腫瘤では重要。" },
    keywords: ["suprasellar", "calcification", "cystic-solid", "machine oil cyst"],
    ctSummary: "鞍上部嚢胞性充実性腫瘤として見え、石灰化が診断に有用。",
    mriSummary: "嚢胞内容は蛋白濃度によりT1高信号を示すことがあり、壁や充実部が造影される。",
    ctGroups: [ct("non_contrast", [
      finding("craniopharyngioma", "ct_nc_001", "finding:calcification_present", "CT", "non_contrast", "鞍上部病変内石灰化を伴うことが多い。", { subregion: "suprasellar", target: "calcified_component", weight: 4 }),
      finding("craniopharyngioma", "ct_nc_002", "finding:sellar_suprasellar_mass", "CT", "non_contrast", "鞍上部中心の嚢胞性充実性腫瘤として見える。", { organ: "pituitary", subregion: "suprasellar", target: "sellar_mass", weight: 3 })
    ])],
    mriGroups: [
      mri("T1WI", [finding("craniopharyngioma", "mri_t1_001", "finding:t1_hyperintensity", "MRI", "T1WI", "蛋白濃度やコレステロールに富む嚢胞内容がT1高信号を示すことがある。", { subregion: "suprasellar", target: "cyst_content", typicality: "variable", weight: 3 })]),
      mri("T2WI", [finding("craniopharyngioma", "mri_t2_001", "finding:t2_hyperintensity", "MRI", "T2WI", "嚢胞成分はT2高信号を示すことが多い。", { subregion: "suprasellar", target: "cystic_component", weight: 2 })]),
      mri("contrast_enhanced_T1WI", [finding("craniopharyngioma", "mri_ce_001", "finding:enhancing_solid_component", "MRI", "contrast_enhanced_T1WI", "嚢胞壁や充実成分に造影効果を伴う。", { subregion: "suprasellar", target: "solid_component", weight: 3 })])
    ]
  },
  {
    id: "epidermoid_cyst",
    ja: "類表皮嚢胞",
    en: "Epidermoid cyst",
    aliases: { ja: ["頭蓋内類表皮嚢胞"], en: ["Intracranial epidermoid cyst"] },
    keepPmids: ["27366244", "29930917", "38472390"],
    clinical: { overview: "胎生期迷入上皮由来の良性嚢胞性病変。小脳橋角部や傍鞍部に多く、髄液様信号ながらFLAIRで完全抑制されずDWI高信号を示す点がくも膜嚢胞との鑑別に重要。", treatment: "症状や増大に応じて外科的切除を検討する。被膜残存では再発に注意する。", epidemiology: "成人で偶発発見または脳神経症状で見つかることがある。" },
    demographics: { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 20, typical_max: 70, peak_decade: "20-50歳代", summary: "成人に多い。" } },
    frequency: { label: "rare", prevalence_rank: 1, basis: "epidemiology", evidence_level: "review", context: { population: "adult", body_region: "brain", clinical_setting: "extra_axial_csf_like_lesion" }, summary: "髄液様脳外嚢胞性病変では重要な鑑別。" },
    keywords: ["restricted diffusion", "CPA", "extra-axial", "incomplete FLAIR suppression"],
    ctSummary: "髄液に近い低吸収の脳外病変として見えることが多い。",
    mriSummary: "T1低信号、T2高信号で髄液様だが、FLAIRで不完全抑制、DWI高信号を示す。",
    ctGroups: [ct("non_contrast", [finding("epidermoid_cyst", "ct_nc_001", "finding:ct_hypoattenuation", "CT", "non_contrast", "髄液に近い低吸収の脳外嚢胞性病変として認められる。", { subregion: "cerebellopontine_angle", target: "extra_axial_collection", weight: 2 })])],
    mriGroups: [
      mri("DWI", [finding("epidermoid_cyst", "mri_dwi_001", "finding:dwi_hyperintensity", "MRI", "DWI", "DWI高信号を示すことが、くも膜嚢胞との鑑別に重要。", { subregion: "cerebellopontine_angle", target: "cyst_content", typicality: "typical", weight: 5 })]),
      mri("ADC", [finding("epidermoid_cyst", "mri_adc_001", "finding:adc_low", "MRI", "ADC", "ADCは髄液より低く、拡散制限として評価される。", { subregion: "cerebellopontine_angle", target: "cyst_content", weight: 4 })]),
      mri("FLAIR", [finding("epidermoid_cyst", "mri_flair_001", "finding:flair_hyperintensity", "MRI", "FLAIR", "FLAIRで髄液のようには完全に抑制されず高信号を示す。", { subregion: "cerebellopontine_angle", target: "cyst_content", weight: 4, keywords: ["incomplete suppression"] })]),
      mri("contrast_enhanced_T1WI", [finding("epidermoid_cyst", "mri_ce_001", "finding:enhancement_absent", "MRI", "contrast_enhanced_T1WI", "通常は明らかな造影効果を示さない。", { subregion: "cerebellopontine_angle", target: "cyst_content", weight: 2 })])
    ]
  },
  {
    id: "arachnoid_cyst",
    ja: "くも膜嚢胞",
    en: "Arachnoid cyst",
    aliases: { ja: ["頭蓋内くも膜嚢胞"], en: ["Intracranial arachnoid cyst"] },
    keepPmids: ["25866381", "38228110", "26636254"],
    clinical: { overview: "くも膜に囲まれた髄液様嚢胞。中頭蓋窩などに多く、全シーケンスで髄液と同等、DWI制限なし、FLAIRで抑制されることが類表皮嚢胞との鑑別点。", treatment: "無症候例は経過観察。症状、増大、出血、圧排がある場合は手術を検討する。", epidemiology: "小児から成人まで偶発発見されることが多い。" },
    demographics: { sex: { applicable: ["any"], predominance: "male", predilection: "male_predominant", summary: "男性にやや多いとされる。" }, age: { typical_min: 0, typical_max: 80, peak_decade: "小児〜若年で発見されやすい", summary: "先天性病変で小児から成人まで見つかる。" } },
    frequency: { label: "common", prevalence_rank: 3, basis: "incidental", evidence_level: "review", context: { population: "any", body_region: "brain", clinical_setting: "extra_axial_csf_like_lesion" }, summary: "髄液様脳外嚢胞では頻度の高い鑑別。" },
    keywords: ["CSF signal", "FLAIR suppression", "no diffusion restriction", "middle cranial fossa"],
    ctSummary: "髄液濃度の境界明瞭な脳外嚢胞として見える。",
    mriSummary: "T1/T2/FLAIR/DWIで髄液と同様。FLAIR抑制、拡散制限なし、造影効果なし。",
    ctGroups: [ct("non_contrast", [finding("arachnoid_cyst", "ct_nc_001", "finding:csf_like_signal", "CT", "non_contrast", "髄液と同等の低吸収を示す境界明瞭な脳外嚢胞。", { subregion: "extra_axial", target: "extra_axial_collection", weight: 4 })])],
    mriGroups: [
      mri("T2WI", [finding("arachnoid_cyst", "mri_t2_001", "finding:csf_like_signal", "MRI", "T2WI", "T2で髄液と同等の高信号を示す。", { subregion: "extra_axial", target: "extra_axial_collection", weight: 3 })]),
      mri("FLAIR", [finding("arachnoid_cyst", "mri_flair_001", "finding:flair_suppression", "MRI", "FLAIR", "FLAIRで髄液同様に抑制される。", { subregion: "extra_axial", target: "extra_axial_collection", typicality: "typical", weight: 5 })]),
      mri("DWI", [finding("arachnoid_cyst", "mri_dwi_001", "finding:diffusion_restriction_absent", "MRI", "DWI", "拡散制限を示さない。", { subregion: "extra_axial", target: "extra_axial_collection", weight: 4 })]),
      mri("contrast_enhanced_T1WI", [finding("arachnoid_cyst", "mri_ce_001", "finding:enhancement_absent", "MRI", "contrast_enhanced_T1WI", "造影効果を示さない。", { subregion: "extra_axial", target: "extra_axial_collection", weight: 2 })])
    ]
  },
  {
    id: "hemangioblastoma",
    ja: "血管芽腫",
    en: "Hemangioblastoma",
    aliases: { ja: ["中枢神経血管芽腫"], en: ["CNS hemangioblastoma"] },
    keepPmids: ["20301636", "35242478", "10547017"],
    clinical: { overview: "成人の小脳に多い血管性腫瘍。嚢胞と強く造影される壁在結節、flow voidが典型で、von Hippel-Lindau病との関連を確認する。", treatment: "症候性・増大例では手術を検討する。VHLでは多発病変と全身検索が重要。", epidemiology: "成人後頭蓋窩腫瘍の鑑別。VHL関連では若年・多発。" },
    demographics: { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 25, typical_max: 65, peak_decade: "30-50歳代", summary: "成人に多い。VHL関連では若年にもみられる。" } },
    frequency: { label: "rare", prevalence_rank: 1, basis: "epidemiology", evidence_level: "review", context: { population: "adult", body_region: "brain", clinical_setting: "cerebellar_cyst_with_mural_nodule" }, summary: "成人小脳の嚢胞+壁在結節では重要。" },
    keywords: ["cyst with mural nodule", "flow void", "VHL", "cerebellar"],
    ctSummary: "嚢胞性低吸収病変と造影される壁在結節として見えることがある。",
    mriSummary: "嚢胞と強く造影される壁在結節、周囲flow void、灌流高値が特徴。",
    ctGroups: [ct("non_contrast", [finding("hemangioblastoma", "ct_nc_001", "finding:ct_hypoattenuation", "CT", "non_contrast", "嚢胞成分が低吸収として認められる。", { subregion: "cerebellum", target: "cystic_component", weight: 2 })])],
    mriGroups: [
      mri("contrast_enhanced_T1WI", [finding("hemangioblastoma", "mri_ce_001", "finding:cyst_with_enhancing_mural_nodule", "MRI", "contrast_enhanced_T1WI", "嚢胞に接する壁在結節が強く造影される。", { subregion: "cerebellum", target: "mural_nodule", typicality: "typical", weight: 5 })]),
      mri("T2WI", [finding("hemangioblastoma", "mri_t2_001", "finding:flow_void", "MRI", "T2WI", "壁在結節周囲に血管性flow voidを伴うことがある。", { subregion: "cerebellum", target: "solid_component", weight: 4 })]),
      mri("DSC_perfusion", [finding("hemangioblastoma", "mri_perf_001", "finding:hyperperfusion", "MRI", "DSC_perfusion", "血管性腫瘍として灌流高値を示すことがある。", { subregion: "cerebellum", target: "solid_component", typicality: "variable", weight: 2 })])
    ]
  },
  {
    id: "brain_arteriovenous_malformation",
    ja: "脳動静脈奇形",
    en: "Brain arteriovenous malformation",
    aliases: { ja: ["脳AVM", "脳動静脈奇形"], en: ["Brain AVM", "Cerebral arteriovenous malformation"] },
    keepPmids: ["28267351", "40274404", "41584770", "37253407"],
    clinical: { overview: "動脈から静脈へ毛細血管床を介さず短絡する血管奇形。nidus、流入動脈、流出静脈、出血の有無を評価する。", treatment: "出血リスク、部位、Spetzler-Martin分類などを踏まえ、経過観察、塞栓術、定位放射線治療、手術を組み合わせる。", epidemiology: "若年の脳内出血やけいれんの原因として重要。" },
    demographics: { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 10, typical_max: 50, peak_decade: "若年〜中年", summary: "若年から中年で出血やけいれんを契機に見つかることがある。" } },
    frequency: { label: "rare", prevalence_rank: 1, basis: "epidemiology", evidence_level: "review", context: { population: "young_or_middle_aged", body_region: "brain", clinical_setting: "vascular_nidus_or_hemorrhage" }, summary: "若年出血やflow void集簇では重要。" },
    keywords: ["nidus", "flow void", "feeding artery", "draining vein"],
    ctSummary: "出血で発見されることがあり、造影CT/CTAで血管nidusを評価する。",
    mriSummary: "T1/T2で蛇行するflow void集簇、MRAでnidusと流入・流出血管を認める。",
    ctGroups: [ct("non_contrast", [finding("brain_arteriovenous_malformation", "ct_nc_001", "finding:hemorrhage_present", "CT", "non_contrast", "破裂例では脳内出血やくも膜下出血を伴う。", { target: "hemorrhagic_component", typicality: "variable", weight: 3 })])],
    mriGroups: [
      mri("T2WI", [finding("brain_arteriovenous_malformation", "mri_t2_001", "finding:flow_void", "MRI", "T2WI", "蛇行するflow voidの集簇として認められる。", { organ: "cerebral_vessel", target: "vascular_nidus", typicality: "typical", weight: 5 })]),
      mri("MRA_TOF", [finding("brain_arteriovenous_malformation", "mri_mra_001", "finding:vascular_nidus", "MRI", "MRA_TOF", "MRAでnidus、流入動脈、流出静脈を確認できる。", { organ: "cerebral_vessel", target: "vascular_nidus", typicality: "typical", weight: 5 })]),
      mri("SWI", [finding("brain_arteriovenous_malformation", "mri_swi_001", "finding:susceptibility_blooming", "MRI", "SWI", "陳旧性出血や血管内デオキシヘモグロビンにより磁化率低信号を伴うことがある。", { organ: "cerebral_vessel", target: "vascular_nidus", typicality: "variable", weight: 2 })])
    ]
  },
  {
    id: "cerebral_venous_sinus_thrombosis",
    ja: "脳静脈洞血栓症",
    en: "Cerebral venous sinus thrombosis",
    aliases: { ja: ["CVST", "脳静脈血栓症"], en: ["CVST", "Cerebral venous thrombosis"] },
    keepPmids: ["38428733", "31440838", "32958591", "38050259"],
    clinical: { overview: "硬膜静脈洞または脳静脈の血栓閉塞。頭痛、けいれん、出血性静脈梗塞などで発症し、MRV/CTVで静脈洞閉塞を評価する。", treatment: "抗凝固療法が基本。重症例や悪化例では血管内治療を検討することがある。基礎疾患検索も重要。", epidemiology: "若年〜中年、妊娠産褥、凝固異常、感染、脱水などで重要。" },
    demographics: { sex: { applicable: ["any"], predominance: "female", predilection: "female_predominant", summary: "妊娠産褥や経口避妊薬関連を含め女性に多い傾向がある。" }, age: { typical_min: 15, typical_max: 60, peak_decade: "若年〜中年", summary: "若年から中年で重要。" } },
    frequency: { label: "rare", prevalence_rank: 1, basis: "clinical_context", evidence_level: "review", context: { population: "risk_factor_present", body_region: "brain", clinical_setting: "headache_seizure_venous_infarct" }, summary: "頭痛・けいれん・出血性梗塞では見逃せない鑑別。" },
    keywords: ["MRV", "empty delta sign", "hemorrhagic venous infarct", "hyperdense sinus"],
    ctSummary: "単純CTで高吸収静脈洞、造影CTでempty delta sign、出血性静脈梗塞を伴うことがある。",
    mriSummary: "MRVで静脈洞閉塞、造影T1で血栓/empty delta sign、T2/FLAIRで静脈性浮腫や出血を評価する。",
    ctGroups: [ct("non_contrast", [
      finding("cerebral_venous_sinus_thrombosis", "ct_nc_001", "finding:ct_hyperattenuation", "CT", "non_contrast", "急性血栓により静脈洞が高吸収に見えることがある。", { organ: "dural_venous_sinus", subregion: "dural_venous_sinus", target: "venous_sinus", weight: 3, keywords: ["hyperdense sinus"] }),
      finding("cerebral_venous_sinus_thrombosis", "ct_nc_002", "finding:hemorrhage_present", "CT", "non_contrast", "出血性静脈梗塞を伴うことがある。", { target: "hemorrhagic_component", typicality: "variable", weight: 3 })
    ])],
    mriGroups: [
      mri("MRV", [finding("cerebral_venous_sinus_thrombosis", "mri_mrv_001", "finding:venous_sinus_thrombosis", "MRI", "MRV", "MRVで静脈洞の血流欠損・閉塞を確認する。", { organ: "dural_venous_sinus", subregion: "dural_venous_sinus", target: "venous_sinus", typicality: "typical", weight: 5 })]),
      mri("contrast_enhanced_T1WI", [finding("cerebral_venous_sinus_thrombosis", "mri_ce_001", "finding:empty_delta_sign", "MRI", "contrast_enhanced_T1WI", "造影で血栓周囲が増強しempty delta signを示すことがある。", { organ: "dural_venous_sinus", subregion: "dural_venous_sinus", target: "venous_sinus", typicality: "variable", weight: 4 })]),
      mri("FLAIR", [finding("cerebral_venous_sinus_thrombosis", "mri_flair_001", "finding:vasogenic_edema", "MRI", "FLAIR", "静脈性うっ滞により皮質下浮腫を伴うことがある。", { target: "perilesional_edema", typicality: "variable", weight: 2 })]),
      mri("SWI", [finding("cerebral_venous_sinus_thrombosis", "mri_swi_001", "finding:susceptibility_blooming", "MRI", "SWI", "出血性静脈梗塞や血栓に磁化率低信号を伴うことがある。", { target: "hemorrhagic_component", typicality: "variable", weight: 2 })])
    ]
  },
  {
    id: "herpes_simplex_encephalitis",
    ja: "単純ヘルペス脳炎",
    en: "Herpes simplex encephalitis",
    aliases: { ja: ["HSV脳炎", "ヘルペス脳炎"], en: ["HSV encephalitis"] },
    keepPmids: ["28074766", "9163027", "10481538", "39322393"],
    clinical: { overview: "HSV-1による急性壊死性脳炎。側頭葉内側、島皮質、眼窩前頭葉に好発し、DWI/FLAIR異常が早期診断に重要。", treatment: "疑った時点でアシクロビルを速やかに開始する。PCR、髄液、脳波、MRIで評価する。", epidemiology: "全年齢で発症しうるが成人散発性脳炎の重要疾患。" },
    demographics: { sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" }, age: { typical_min: 0, typical_max: 90, peak_decade: "全年齢", summary: "全年齢で発症しうる。" } },
    frequency: { label: "uncommon", prevalence_rank: 2, basis: "clinical_context", evidence_level: "review", context: { population: "encephalitis", body_region: "brain", clinical_setting: "acute_fever_altered_mental_status" }, summary: "急性脳炎では治療可能で重要な鑑別。" },
    keywords: ["medial temporal lobe", "insula", "hemorrhagic encephalitis", "acyclovir"],
    ctSummary: "早期CTは正常または側頭葉低吸収。進行例では浮腫や出血を伴う。",
    mriSummary: "側頭葉内側・島皮質優位のFLAIR/T2高信号、DWI高信号/ADC低値、出血性変化が重要。",
    ctGroups: [ct("non_contrast", [finding("herpes_simplex_encephalitis", "ct_nc_001", "finding:ct_hypoattenuation", "CT", "non_contrast", "側頭葉や島皮質に低吸収域を示すことがあるが早期CTは正常のこともある。", { subregion: "temporal_lobe", target: "whole_lesion", typicality: "variable", weight: 1 })])],
    mriGroups: [
      mri("FLAIR", [finding("herpes_simplex_encephalitis", "mri_flair_001", "finding:flair_hyperintensity", "MRI", "FLAIR", "側頭葉内側や島皮質優位のFLAIR高信号を示す。", { subregion: "temporal_lobe", typicality: "typical", weight: 5, keywords: ["medial temporal lobe", "insula"] })]),
      mri("DWI", [finding("herpes_simplex_encephalitis", "mri_dwi_001", "finding:dwi_hyperintensity", "MRI", "DWI", "急性期にDWI高信号を示すことが多い。", { subregion: "temporal_lobe", weight: 4 })]),
      mri("ADC", [finding("herpes_simplex_encephalitis", "mri_adc_001", "finding:adc_low", "MRI", "ADC", "細胞性浮腫によりADC低下を伴うことがある。", { subregion: "temporal_lobe", weight: 3 })]),
      mri("SWI", [finding("herpes_simplex_encephalitis", "mri_swi_001", "finding:susceptibility_blooming", "MRI", "SWI", "壊死性・出血性変化により磁化率低信号を伴うことがある。", { subregion: "temporal_lobe", target: "hemorrhagic_component", typicality: "variable", weight: 2 })])
    ]
  },
  {
    id: "tumefactive_demyelinating_lesion",
    ja: "腫瘤形成性脱髄病変",
    en: "Tumefactive demyelinating lesion",
    aliases: { ja: ["腫瘤性脱髄病変", "TDL"], en: ["TDL", "Tumefactive demyelination"] },
    keepPmids: ["33762460", "28619436", "42071194", "31857550"],
    clinical: { overview: "腫瘤様に見える大型脱髄病変。膠芽腫やリンパ腫との鑑別が問題になり、open-ring enhancement、相対的に軽いmass effect、低灌流が手掛かり。", treatment: "ステロイド反応性を評価し、必要に応じて生検、疾患修飾薬、再発予防治療を検討する。", epidemiology: "若年〜中年成人で多発性硬化症関連または孤発性にみられる。" },
    demographics: { sex: { applicable: ["any"], predominance: "female", predilection: "female_predominant", summary: "脱髄疾患全体として女性に多い傾向がある。" }, age: { typical_min: 15, typical_max: 55, peak_decade: "20-40歳代", summary: "若年成人から中年に多い。" } },
    frequency: { label: "rare", prevalence_rank: 1, basis: "clinical_context", evidence_level: "review", context: { population: "young_adult", body_region: "brain", clinical_setting: "ring_enhancing_mass" }, summary: "リング状造影病変では腫瘍との鑑別に重要。" },
    keywords: ["open-ring enhancement", "low perfusion", "demyelination", "less mass effect"],
    ctSummary: "低吸収白質病変として見えることがあるが、MRIでの評価が重要。",
    mriSummary: "T2/FLAIR高信号の大型白質病変。open-ring enhancement、周辺部拡散制限、低CBVが鑑別に役立つ。",
    ctGroups: [ct("non_contrast", [finding("tumefactive_demyelinating_lesion", "ct_nc_001", "finding:ct_hypoattenuation", "CT", "non_contrast", "白質低吸収病変として見えることがある。", { subregion: "white_matter", target: "white_matter_lesion", typicality: "variable", weight: 1 })])],
    mriGroups: [
      mri("FLAIR", [finding("tumefactive_demyelinating_lesion", "mri_flair_001", "finding:flair_hyperintensity", "MRI", "FLAIR", "大型白質病変としてFLAIR高信号を示す。", { subregion: "white_matter", target: "white_matter_lesion", weight: 3 })]),
      mri("contrast_enhanced_T1WI", [finding("tumefactive_demyelinating_lesion", "mri_ce_001", "finding:open_ring_enhancement", "MRI", "contrast_enhanced_T1WI", "白質側に開いたopen-ring enhancementを示すことがある。", { subregion: "white_matter", target: "lesion_margin", typicality: "typical", weight: 5, keywords: ["open-ring enhancement"] })]),
      mri("DWI", [finding("tumefactive_demyelinating_lesion", "mri_dwi_001", "finding:diffusion_restriction_present", "MRI", "DWI", "病変辺縁に拡散制限を伴うことがある。", { subregion: "white_matter", target: "lesion_margin", typicality: "variable", weight: 2 })]),
      mri("DSC_perfusion", [finding("tumefactive_demyelinating_lesion", "mri_perf_001", "finding:reduced_cbv", "MRI", "DSC_perfusion", "高悪性度腫瘍に比べCBV低下〜低灌流を示すことがある。", { subregion: "white_matter", target: "whole_lesion", typicality: "variable", weight: 3 })])
    ]
  }
];

ensureDictionaryEntries();
for (const spec of specs) {
  writeJson(path.join(draftsDir, `${spec.id}.json`), card(spec));
}

const candidatePath = path.join(DATA, "dictionaries", "new-concept-candidates.json");
if (fs.existsSync(candidatePath)) {
  const candidates = readJson(candidatePath);
  candidates.candidates = (candidates.candidates || []).filter(
    (candidate) => candidate.candidate_id !== "candidate:unknown" && candidate.proposed_concept_id !== "finding:unknown"
  );
  writeJson(candidatePath, candidates);
}

console.log(`Curated ${specs.length} additional brain draft cards.`);
