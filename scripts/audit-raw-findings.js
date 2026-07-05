const fs = require("fs");
const path = require("path");
const {
  DATA,
  readJson,
  writeJson,
  listJsonFiles,
  iterFindings,
  normalizeText,
  slugify
} = require("./lib");

const cardFiles = [
  ...listJsonFiles(path.join(DATA, "diseases")),
  ...listJsonFiles(path.join(DATA, "drafts"))
];

const now = new Date().toISOString();
const SOURCE_ID = "public_raw_findings_audit_20260705";
const SOURCE_REFERENCE = {
  source_id: SOURCE_ID,
  type: "public_source_packet",
  title: "Public neuroradiology raw-finding audit packet",
  authors: [],
  journal: "",
  year: "2026",
  url: "https://www.ncbi.nlm.nih.gov/books/",
  license: "Public web source index: NCBI Bookshelf/StatPearls, NINDS, MedlinePlus, Radiopaedia-style named-sign review targets, and open-access review articles where applicable"
};

function raw(id, text, options = {}) {
  return {
    key: id,
    modality_text: options.modality || "MRI",
    acquisition_text: options.acquisition || "",
    anatomy_text: options.anatomy || "",
    target_text: options.target || "",
    finding_text: text,
    interpretation: options.interpretation || "",
    source_ids: [SOURCE_ID],
    mapping: {
      status: options.status || "candidate",
      candidate_finding_code: options.candidateCode || `finding:${slugify(text)}`,
      candidate_acquisition_code: options.candidateAcquisition || "",
      candidate_target: options.candidateTarget || "",
      notes: options.notes || "Added during raw_findings audit to preserve information that may be lost by dictionary-only structured fields."
    },
    review_status: "needs_mapping"
  };
}

const CURATED = {
  focal_cortical_dysplasia: [
    raw("transmantle_sign", "transmantle sign: 皮質から側脳室へ向かう漏斗状/帯状のT2/FLAIR高信号。", { acquisition: "T2WI/FLAIR", anatomy: "皮質-皮質下白質", target: "white matter tract", interpretation: "限局性皮質異形成、特にFCD type IIを示唆する重要所見。" }),
    raw("cortical_thickening_blurring", "皮質肥厚と灰白質白質境界の不明瞭化。", { acquisition: "T1WI/T2WI/FLAIR", anatomy: "皮質", interpretation: "てんかん焦点検索で重要。" })
  ],
  joubert_syndrome: [
    raw("molar_tooth_sign", "molar tooth sign: 小脳虫部低形成、上小脳脚肥厚・水平化、深い脚間窩。", { acquisition: "axial MRI", anatomy: "後頭蓋窩/中脳", interpretation: "Joubert症候群を示唆する中核所見。" })
  ],
  multiple_system_atrophy: [
    raw("hot_cross_bun_sign", "hot cross bun sign: 橋横断T2高信号による十字状高信号。", { acquisition: "T2WI", anatomy: "橋", interpretation: "MSA-Cなどの鑑別に有用。" }),
    raw("putaminal_rim", "被殻外側縁のT2高信号 rim と被殻萎縮/低信号。", { acquisition: "T2WI/SWI", anatomy: "被殻", interpretation: "MSA-Pを支持する所見。" })
  ],
  progressive_supranuclear_palsy: [
    raw("hummingbird_sign", "hummingbird sign / penguin sign: 中脳被蓋萎縮と橋の相対的温存。", { acquisition: "sagittal T1WI/T2WI", anatomy: "中脳", interpretation: "PSPを支持する形態所見。" }),
    raw("morning_glory_sign", "morning glory sign: 軸位像での中脳被蓋萎縮。", { acquisition: "axial MRI", anatomy: "中脳", interpretation: "PSPの補助所見。" })
  ],
  susac_syndrome: [
    raw("snowball_lesions", "snowball lesions: 脳梁中央部の小円形T2/FLAIR高信号。", { acquisition: "FLAIR/T2WI", anatomy: "脳梁", interpretation: "Susac症候群に特徴的。" }),
    raw("spoke_lesions", "spoke lesions / icicle lesions: 脳梁に垂直方向へ伸びる線状病変。", { acquisition: "FLAIR/T2WI", anatomy: "脳梁", interpretation: "脱髄疾患との鑑別に有用。" })
  ],
  balo_concentric_sclerosis: [
    raw("concentric_rings", "同心円状のT2/FLAIR高信号・低信号層状パターン。", { acquisition: "T2WI/FLAIR", anatomy: "白質", interpretation: "Balo concentric sclerosisを示唆。" })
  ],
  gfap_astrocytopathy: [
    raw("radial_perivascular_enhancement", "脳室周囲から放射状に伸びる線状血管周囲造影。", { acquisition: "contrast-enhanced T1WI", anatomy: "脳室周囲白質", interpretation: "GFAP astrocytopathyの代表的造影パターン。" })
  ],
  clippers: [
    raw("peppering_pons_enhancement", "橋を中心とする点状・斑状のpeppering enhancement。", { acquisition: "contrast-enhanced T1WI", anatomy: "橋/小脳脚", interpretation: "CLIPPERSを支持する造影パターン。" })
  ],
  japanese_encephalitis: [
    raw("bilateral_thalamic_lesions", "両側視床のT2/FLAIR高信号、DWI異常、出血性変化。", { acquisition: "FLAIR/DWI/SWI", anatomy: "視床", interpretation: "日本脳炎を含むウイルス性脳炎で重要。" })
  ],
  west_nile_encephalitis: [
    raw("deep_gray_brainstem_involvement", "基底核、視床、脳幹、前角細胞領域のT2/FLAIR高信号。", { acquisition: "FLAIR/T2WI", anatomy: "深部灰白質/脳幹", interpretation: "West Nile encephalitisの分布として保持。" })
  ],
  cmv_encephalitis: [
    raw("ventriculoencephalitis", "脳室上衣周囲のFLAIR高信号・造影、ventriculoencephalitisパターン。", { acquisition: "FLAIR/contrast-enhanced T1WI", anatomy: "脳室周囲", interpretation: "免疫不全患者のCMV脳炎で重要。" })
  ],
  cns_tuberculous_meningitis: [
    raw("basal_meningeal_enhancement", "脳底槽優位の髄膜造影と水頭症、穿通枝梗塞。", { acquisition: "contrast-enhanced T1WI/MRA", anatomy: "脳底槽", interpretation: "結核性髄膜炎の代表的分布。" })
  ],
  hiv_encephalopathy: [
    raw("diffuse_symmetric_white_matter", "萎縮を伴う両側対称性びまん性白質T2/FLAIR高信号、mass effectや造影は乏しい。", { acquisition: "FLAIR/T2WI", anatomy: "白質", interpretation: "HIV脳症のパターン。" })
  ],
  subacute_sclerosing_panencephalitis: [
    raw("posterior_cortical_subcortical_progression", "後方優位の皮質・皮質下白質T2/FLAIR高信号から進行性萎縮へ移行。", { acquisition: "FLAIR/T2WI", anatomy: "後頭葉/頭頂葉", interpretation: "SSPEの進行パターン。" })
  ],
  caa_related_inflammation: [
    raw("asymmetric_vasogenic_edema_microbleeds", "非対称性の血管原性浮腫と皮質・皮質下微小出血/皮質表在鉄沈着。", { acquisition: "FLAIR/SWI", anatomy: "皮質-皮質下", interpretation: "CAA-related inflammationを支持。" })
  ],
  primary_cns_vasculitis: [
    raw("multifocal_infarcts_vessel_irregularity", "多時相・多血管領域の梗塞、血管狭窄/拡張の不整、髄膜造影。", { acquisition: "DWI/MRA/contrast-enhanced T1WI", anatomy: "脳血管", interpretation: "原発性CNS血管炎の鑑別に重要。" })
  ],
  fabry_disease_cns: [
    raw("pulvinar_sign", "pulvinar sign: 視床枕のT1高信号。", { acquisition: "T1WI", anatomy: "視床枕", interpretation: "Fabry病で古典的に記載される補助所見。" })
  ],
  fahr_disease: [
    raw("symmetric_basal_ganglia_calcification", "両側対称性の基底核、歯状核、視床、白質石灰化。", { modality: "CT", acquisition: "non-contrast CT", anatomy: "基底核/歯状核", interpretation: "Fahr病/石灰化症の中核所見。" })
  ],
  wilson_disease_cns: [
    raw("face_of_giant_panda", "face of the giant panda sign: 中脳T2信号変化の特徴的パターン。", { acquisition: "T2WI", anatomy: "中脳", interpretation: "Wilson病の補助所見。" }),
    raw("basal_ganglia_thalamus_brainstem", "被殻、淡蒼球、視床、脳幹のT2高信号や萎縮。", { acquisition: "T2WI/FLAIR", anatomy: "基底核/脳幹", interpretation: "Wilson病の分布として保持。" })
  ],
  maple_syrup_urine_disease: [
    raw("myelinated_white_matter_edema", "髄鞘化白質、内包後脚、脳幹、小脳白質の浮腫性DWI高信号。", { acquisition: "DWI/ADC", anatomy: "髄鞘化白質", interpretation: "MSUD急性期の分布。" })
  ],
  urea_cycle_disorder_encephalopathy: [
    raw("insular_cingulate_cortical_involvement", "島皮質、帯状回を含む皮質優位の拡散制限。", { acquisition: "DWI/ADC", anatomy: "皮質", interpretation: "高アンモニア脳症で重要な分布。" })
  ],
  kernicterus: [
    raw("globus_pallidus_t1_t2_signal", "淡蒼球優位のT1高信号または慢性期T2高信号。", { acquisition: "T1WI/T2WI", anatomy: "淡蒼球", interpretation: "核黄疸の代表的分布。" })
  ],
  huntington_disease: [
    raw("caudate_atrophy_boxcar_ventricles", "尾状核萎縮と前角拡大によるboxcar ventricles。", { acquisition: "T1WI", anatomy: "尾状核/側脳室", interpretation: "Huntington病の形態所見。" })
  ],
  alzheimer_disease_mri_pattern: [
    raw("medial_temporal_atrophy", "海馬・内側側頭葉萎縮。", { acquisition: "T1WI", anatomy: "海馬/内側側頭葉", interpretation: "Alzheimer病パターン評価の中核。" })
  ],
  frontotemporal_lobar_degeneration: [
    raw("frontal_anterior_temporal_atrophy", "前頭葉・前側頭葉優位萎縮、左右差を伴うことがある。", { acquisition: "T1WI", anatomy: "前頭葉/前側頭葉", interpretation: "FTLDパターン評価に重要。" })
  ],
  amyotrophic_lateral_sclerosis_mri_support: [
    raw("corticospinal_tract_hyperintensity", "皮質脊髄路T2/FLAIR高信号、運動皮質低信号。", { acquisition: "T2WI/FLAIR/SWI", anatomy: "皮質脊髄路", interpretation: "ALSの補助所見。" })
  ],
  lhermitte_duclos_disease: [
    raw("tiger_stripe_cerebellar_pattern", "小脳半球の層状 striated/tiger-striped T2高信号パターン。", { acquisition: "T2WI", anatomy: "小脳", interpretation: "Lhermitte-Duclos diseaseを示唆。" })
  ],
  hypothalamic_hamartoma: [
    raw("nonenhancing_tuber_cinereum_mass", "灰白隆起/視床下部に連続する非造影性、非進行性の結節。", { acquisition: "T1WI/T2WI/contrast-enhanced T1WI", anatomy: "視床下部", interpretation: "笑い発作の原因検索で重要。" })
  ],
  ectopic_posterior_pituitary: [
    raw("ectopic_bright_spot_absent_stalk", "異所性後葉bright spot、下垂体柄低形成/欠損、前葉低形成。", { acquisition: "sagittal T1WI", anatomy: "下垂体/下垂体柄", interpretation: "下垂体形成異常として保持。" })
  ],
  empty_sella: [
    raw("csf_filled_sella_flattened_pituitary", "トルコ鞍内が髄液信号で満たされ、下垂体が菲薄化する。", { acquisition: "T1WI/T2WI", anatomy: "トルコ鞍", interpretation: "空虚トルコ鞍の定義的所見。" })
  ],
  intracranial_hypotension_subdural_collection: [
    raw("brain_sag_venous_engorgement", "brain sag、硬膜びまん性造影、静脈洞拡張、硬膜下液体貯留。", { acquisition: "contrast-enhanced T1WI", anatomy: "硬膜/頭蓋内", interpretation: "低髄液圧症候群のSEEPS所見。" })
  ],
  radiation_induced_cavernous_malformation: [
    raw("post_radiation_popcorn_blooming", "照射野内に遅発性のpopcorn様混在信号とSWI bloomingを示す。", { acquisition: "T2WI/SWI", anatomy: "照射野内脳実質", interpretation: "放射線誘発海綿状血管奇形を示唆。" })
  ],
  rosette_forming_glioneuronal_tumor: [
    raw("fourth_ventricle_t2_bright_multicystic", "第4脳室周囲/中線後頭蓋窩のT2高信号、多嚢胞性、軽度造影病変。", { acquisition: "T2WI/contrast-enhanced T1WI", anatomy: "第4脳室/後頭蓋窩", interpretation: "RGNTの好発部位と形態。" })
  ],
  polymorphous_low_grade_neuroepithelial_tumor_young: [
    raw("calcified_cortical_temporal_epilepsy_tumor", "側頭葉皮質・皮質下の石灰化を伴うてんかん関連低悪性度腫瘍。", { modality: "CT/MRI", acquisition: "CT/FLAIR", anatomy: "側頭葉皮質", interpretation: "PLNTYの代表的文脈。" })
  ],
  papillary_tumor_of_pineal_region: [
    raw("pineal_papillary_mass_hydrocephalus", "松果体部の造影性腫瘤と中脳水道閉塞性水頭症。", { acquisition: "contrast-enhanced T1WI/T2WI", anatomy: "松果体部", interpretation: "松果体部乳頭状腫瘍の評価点。" })
  ],
  choroid_plexus_carcinoma: [
    raw("invasive_heterogeneous_choroid_plexus_mass", "不均一造影、出血/壊死、周囲浸潤を伴う脈絡叢腫瘤。", { acquisition: "contrast-enhanced T1WI/SWI", anatomy: "脈絡叢", interpretation: "脈絡叢乳頭腫との鑑別に重要。" })
  ],
  leptomeningeal_carcinomatosis: [
    raw("sugar_coating_enhancement", "脳溝、脳神経、脳底槽、脊髄表面に沿うsugar-coating様軟膜造影。", { acquisition: "contrast-enhanced T1WI/FLAIR", anatomy: "くも膜下腔", interpretation: "癌性髄膜症の代表的所見。" })
  ],
  neurocutaneous_melanosis: [
    raw("melanin_t1_hyperintense_leptomeninges", "メラニンにより軟膜病変がT1高信号を示すことがある。", { acquisition: "T1WI/contrast-enhanced T1WI", anatomy: "軟膜", interpretation: "神経皮膚黒色症で保持すべき信号特徴。" })
  ],
  periventricular_nodular_heterotopia: [
    raw("gray_matter_signal_periventricular_nodules", "側脳室壁に沿う灰白質等信号の結節、造影や浮腫は通常乏しい。", { acquisition: "T1WI/T2WI", anatomy: "脳室周囲", interpretation: "異所性灰白質の定義的所見。" })
  ],
  lissencephaly: [
    raw("smooth_brain_thick_cortex", "脳溝形成不全、平滑な脳表、皮質肥厚、浅いSylvian裂。", { acquisition: "T1WI/T2WI", anatomy: "大脳皮質", interpretation: "滑脳症の形態評価。" })
  ],
  polymicrogyria: [
    raw("irregular_cortical_surface_stippled_gray_white", "不整な皮質表面、過剰小脳回、灰白質白質境界の鋸歯状/不整。", { acquisition: "T1WI/T2WI", anatomy: "大脳皮質", interpretation: "多小脳回の形態評価。" })
  ],
  schizencephaly: [
    raw("gray_matter_lined_cleft", "脳室から脳表へ連続する灰白質に裏打ちされた裂隙。", { acquisition: "T1WI/T2WI", anatomy: "大脳半球", interpretation: "裂脳症の定義的所見。" })
  ],
  holoprosencephaly: [
    raw("failed_forebrain_separation", "前脳分離不全、単一脳室、正中顔面/脳構造異常。", { acquisition: "fetal MRI/T1WI/T2WI", anatomy: "前脳/正中構造", interpretation: "全前脳胞症の分類に必要。" })
  ],
  septo_optic_dysplasia: [
    raw("absent_septum_pellucidum_optic_hypoplasia", "透明中隔欠損、視神経/視交叉低形成、下垂体形成異常。", { acquisition: "T1WI/T2WI", anatomy: "正中構造/視路", interpretation: "SODの三徴候評価。" })
  ],
  rhombencephalosynapsis: [
    raw("vermian_agenesis_fused_cerebellar_hemispheres", "小脳虫部欠損と小脳半球・歯状核・上小脳脚の癒合。", { acquisition: "T1WI/T2WI", anatomy: "小脳", interpretation: "菱脳癒合症の定義的所見。" })
  ]
};

function referenceIds(card) {
  const ids = (card.references || []).map((ref) => ref.source_id).filter(Boolean);
  return ids.length ? ids : [SOURCE_ID];
}

function normalizeJoined(values) {
  return normalizeText(values.filter(Boolean).join(" "));
}

function structuredText(card) {
  return normalizeJoined(iterFindings(card).flatMap(({ finding }) => [
    finding.finding_code,
    finding.finding_text,
    finding.modality,
    finding.acquisition?.code,
    finding.anatomy?.organ,
    finding.anatomy?.subregion,
    finding.target,
    ...(finding.keywords || [])
  ]));
}

function existingRawText(card) {
  return normalizeJoined((card.raw_findings || []).flatMap((item) => [
    item.raw_finding_id,
    item.finding_text,
    item.modality_text,
    item.acquisition_text,
    item.anatomy_text,
    item.target_text,
    item.interpretation
  ]));
}

function ensureDraft(card) {
  card.review = card.review || {};
  card.review.status = "draft";
  card.review.reviewed_by = "";
  card.review.reviewed_at = "";
  card.review.confidence = "low";
  for (const { finding } of iterFindings(card)) {
    finding.review_status = "draft";
  }
}

function addRawFinding(card, entry, index) {
  card.raw_findings = card.raw_findings || [];
  const rawFindingId = `${card.disease_id}_raw_${entry.key || String(index).padStart(3, "0")}`;
  if (card.raw_findings.some((item) => item.raw_finding_id === rawFindingId)) return false;
  card.raw_findings.push({
    raw_finding_id: rawFindingId,
    modality_text: entry.modality_text,
    acquisition_text: entry.acquisition_text,
    anatomy_text: entry.anatomy_text,
    target_text: entry.target_text,
    finding_text: entry.finding_text,
    interpretation: entry.interpretation,
    source_ids: entry.source_ids?.length ? entry.source_ids : referenceIds(card),
    mapping: entry.mapping,
    review_status: entry.review_status
  });
  return true;
}

function keywordRawFinding(keyword) {
  return raw(`keyword_${slugify(keyword)}`, `キーワード/所見として "${keyword}" を保持。`, {
    modality: "",
    acquisition: "",
    anatomy: "",
    target: "",
    interpretation: "辞書対応済み構造化欄から漏れる可能性があるため、Phase1自由記載として保存。",
    status: "unmapped",
    candidateCode: ""
  });
}

function shouldPreserveKeyword(keyword, existingText) {
  const text = normalizeText(keyword);
  if (!text || text.length < 4) return false;
  if (existingText.includes(text)) return false;
  if (/^(unknown|mri|ct|dwi|adc|flair|t1|t2|t1wi|t2wi|swi|mrs|mra|mrv|nf1|vhl|idh|ald|mld|melas|pcnsl|gbm)$/i.test(keyword)) return false;
  if (/^(cystic|solid|multiple|temporal|sylvian|dwi|t1|t2|t2\/flair)$/i.test(keyword)) return false;
  return /sign|pattern|atrophy|calcification|enhancement|edema|cyst with|syndrome|tract|junction|snowball|molar|bun|hummingbird|tigroid|starfield|tram|flow void|gray-white|corpus callosum|basal ganglia|white matter|microbleed|hemorrhage|radial|peppering|pulvinar|panda|boxcar|sugar-coating/i.test(keyword);
}

let statusChanged = 0;
let rawAdded = 0;
let cardsWithRawAdded = 0;

fs.mkdirSync(path.join(DATA, "sources", "public"), { recursive: true });
writeJson(path.join(DATA, "sources", "public", "raw_findings_audit_20260705.json"), {
  source_packet_id: SOURCE_ID,
  created_at: now,
  purpose: "Audit disease cards for imaging details likely lost when only dictionary-backed structured findings were retained.",
  sources: [
    { title: "NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/" },
    { title: "NINDS Disorders", url: "https://www.ninds.nih.gov/health-information/disorders" },
    { title: "MedlinePlus", url: "https://medlineplus.gov/" },
    { title: "PubMed Central open-access reviews", url: "https://pmc.ncbi.nlm.nih.gov/" }
  ],
  limitations: ["Raw findings are draft-level preservation notes and require physician review before promotion to dictionary concepts."]
});

for (const filePath of cardFiles) {
  const card = readJson(filePath);
  const oldStatus = card.review?.status;
  ensureDraft(card);
  if (oldStatus !== "draft") statusChanged += 1;

  card.raw_findings = (card.raw_findings || []).filter((item) => {
    if (!/_raw_keyword_/.test(item.raw_finding_id || "")) return true;
    return !/unknown|^t1$|^t2$|^dwi$|^t2\/flair$|sylvian|temporal_lobe|cystic_solid|multiple_lesions/i.test(
      `${item.finding_text || ""} ${item.mapping?.candidate_finding_code || ""}`
    );
  });

  card.references = card.references || [];
  if (!card.references.some((ref) => ref.source_id === SOURCE_ID)) card.references.push(SOURCE_REFERENCE);

  let addedForCard = 0;
  const existingTextBefore = `${structuredText(card)} ${existingRawText(card)}`;
  const entries = CURATED[card.disease_id] || [];
  entries.forEach((entry, index) => {
    if (addRawFinding(card, entry, index + 1)) {
      rawAdded += 1;
      addedForCard += 1;
    }
  });

  const existingAfterCurated = `${structuredText(card)} ${existingRawText(card)}`;
  for (const keyword of card.keywords || []) {
    if (!shouldPreserveKeyword(keyword, existingAfterCurated)) continue;
    if (addRawFinding(card, keywordRawFinding(keyword), 0)) {
      rawAdded += 1;
      addedForCard += 1;
    }
  }

  if (addedForCard > 0) cardsWithRawAdded += 1;
  card.updated_at = now;
  writeJson(filePath, card);
}

console.log(`Cards set to draft from non-draft: ${statusChanged}`);
console.log(`Raw findings added: ${rawAdded}`);
console.log(`Cards with raw additions: ${cardsWithRawAdded}`);
