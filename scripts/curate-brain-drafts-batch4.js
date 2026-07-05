const fs = require("fs");
const path = require("path");
const { DATA, writeJson } = require("./lib");

const now = new Date().toISOString();
const draftsDir = path.join(DATA, "drafts");
const sourcesDir = path.join(DATA, "sources", "public");

const PUBLIC_SOURCE_ID = "public_brain_batch4_20260625";

const PUBLIC_REFERENCE = {
  source_id: PUBLIC_SOURCE_ID,
  type: "public_source_packet",
  title: "Public neuroradiology source packet for brain draft batch 4",
  authors: [],
  journal: "",
  year: "2026",
  url: "https://www.ncbi.nlm.nih.gov/books/",
  license: "Public web source index: NCBI Bookshelf/StatPearls, NIH/NINDS, MedlinePlus, CDC, and open-access PMC review articles where applicable"
};

const SOURCE_SUMMARY =
  "PubMed以外の公開ソース（NCBI Bookshelf/StatPearls、NIH/NINDS、MedlinePlus、CDC、PMC open-access review等）を参照。";

function anatomy(subregion = "brain", organ = "brain") {
  return { body_region: "brain", organ, subregion, laterality: "unknown" };
}

function f(acq, code, text, options = {}) {
  const modality = options.modality || (options.type === "phase" ? "CT" : "MRI");
  return {
    finding_code: code,
    modality,
    acquisition: { type: modality === "CT" ? "phase" : "sequence", code: acq },
    anatomy: options.anatomy || anatomy(options.subregion, options.organ),
    target: options.target || "lesion",
    modifiers: options.modifiers || {},
    keywords: options.keywords || [],
    finding_text: text,
    typicality: options.typicality || "common",
    diagnostic_weight: options.weight ?? 3,
    review_status: "draft",
    mapping: { status: "matched", confidence: 0.9, matched_concept_id: code, alternatives: [] }
  };
}

const F = {
  ctHypo: (text, opt = {}) => f("non_contrast", "finding:ct_hypoattenuation", text, { ...opt, modality: "CT" }),
  ctMildHypo: (text, opt = {}) => f("non_contrast", "finding:ct_mild_hypoattenuation", text, { ...opt, modality: "CT" }),
  ctIso: (text, opt = {}) => f("non_contrast", "finding:ct_isoattenuation", text, { ...opt, modality: "CT" }),
  ctMildHyper: (text, opt = {}) => f("non_contrast", "finding:ct_mild_hyperattenuation", text, { ...opt, modality: "CT" }),
  ctHyper: (text, opt = {}) => f("non_contrast", "finding:ct_hyperattenuation", text, { ...opt, modality: "CT" }),
  calc: (text, opt = {}) => f("non_contrast", "finding:calcification_present", text, { ...opt, modality: "CT" }),
  t1Low: (text, opt = {}) => f("T1WI", "finding:t1_hypointensity", text, opt),
  t1High: (text, opt = {}) => f("T1WI", "finding:t1_hyperintensity", text, opt),
  t1Iso: (text, opt = {}) => f("T1WI", "finding:t1_isointensity", text, opt),
  t2High: (text, opt = {}) => f("T2WI", "finding:t2_hyperintensity", text, opt),
  t2Low: (text, opt = {}) => f("T2WI", "finding:t2_hypointensity", text, opt),
  flairHigh: (text, opt = {}) => f("FLAIR", "finding:flair_hyperintensity", text, opt),
  dwiHigh: (text, opt = {}) => f("DWI", "finding:dwi_hyperintensity", text, opt),
  dwiIso: (text, opt = {}) => f("DWI", "finding:dwi_isointensity", text, opt),
  adcLow: (text, opt = {}) => f("ADC", "finding:adc_low", text, opt),
  adcHigh: (text, opt = {}) => f("ADC", "finding:adc_high", text, opt),
  restr: (text, opt = {}) => f("DWI", "finding:diffusion_restriction_present", text, opt),
  noRestr: (text, opt = {}) => f("DWI", "finding:diffusion_restriction_absent", text, opt),
  edema: (text, opt = {}) => f("FLAIR", "finding:vasogenic_edema", text, opt),
  ring: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:ring_enhancement", text, opt),
  thickRing: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:thick_irregular_ring_enhancement", text, opt),
  thinRing: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:thin_regular_ring_enhancement", text, opt),
  avid: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:avid_homogeneous_enhancement", text, opt),
  mildEnh: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:mild_enhancement", text, opt),
  noEnh: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:enhancement_absent", text, opt),
  lepto: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:leptomeningeal_enhancement", text, opt),
  pachy: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:pachymeningeal_enhancement", text, opt),
  blooming: (text, opt = {}) => f("SWI", "finding:susceptibility_blooming", text, opt),
  flow: (text, opt = {}) => f("MRA_TOF", "finding:flow_void", text, opt),
  stenosis: (text, opt = {}) => f("MRA_TOF", "finding:arterial_stenosis_or_occlusion", text, opt),
  nidus: (text, opt = {}) => f("MRA_TOF", "finding:vascular_nidus", text, opt),
  sinus: (text, opt = {}) => f("MRV", "finding:venous_sinus_thrombosis", text, opt),
  cbvHigh: (text, opt = {}) => f("DSC_perfusion", "finding:elevated_cbv", text, opt),
  cbvLow: (text, opt = {}) => f("DSC_perfusion", "finding:reduced_cbv", text, opt),
  hyperperfusion: (text, opt = {}) => f("ASL", "finding:hyperperfusion", text, opt),
  hypoperfusion: (text, opt = {}) => f("ASL", "finding:hypoperfusion", text, opt),
  choline: (text, opt = {}) => f("MRS", "finding:elevated_choline_peak", text, opt),
  lactate: (text, opt = {}) => f("MRS", "finding:lactate_peak", text, opt),
  lipid: (text, opt = {}) => f("MRS", "finding:lipid_peak", text, opt),
  csf: (text, opt = {}) => f("T2WI", "finding:csf_like_signal", text, opt),
  flairSupp: (text, opt = {}) => f("FLAIR", "finding:flair_suppression", text, opt),
  hydro: (text, opt = {}) => f("T2WI", "finding:hydrocephalus", text, opt),
  ventricles: (text, opt = {}) => f("T2WI", "finding:ventriculomegaly", text, opt),
  mass: (text, opt = {}) => f("T2WI", "finding:mass_effect", text, opt),
  shift: (text, opt = {}) => f("T2WI", "finding:midline_shift", text, opt),
  cortical: (text, opt = {}) => f("FLAIR", "finding:cortical_subcortical_lesion", text, opt),
  basal: (text, opt = {}) => f("FLAIR", "finding:basal_ganglia_involvement", text, opt),
  callosal: (text, opt = {}) => f("FLAIR", "finding:callosal_lesion", text, opt),
  whiteMatter: (text, opt = {}) => f("FLAIR", "finding:bilateral_symmetric_white_matter_lesions", text, opt),
  periventricular: (text, opt = {}) => f("FLAIR", "finding:periventricular_ovoid_lesions", text, opt),
  laminar: (text, opt = {}) => f("FLAIR", "finding:cortical_laminar_necrosis", text, opt),
  sellar: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:sellar_suprasellar_mass", text, opt),
  stalk: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:pituitary_stalk_thickening", text, opt),
  mural: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:cyst_with_enhancing_mural_nodule", text, opt),
  solidEnh: (text, opt = {}) => f("contrast_enhanced_T1WI", "finding:enhancing_solid_component", text, opt),
  subependymal: (text, opt = {}) => f("T2WI", "finding:subependymal_nodule", text, opt)
};

function groups(findings) {
  const ct = new Map();
  const mr = new Map();
  for (const item of findings) {
    const target = item.modality === "CT" ? ct : mr;
    const key = item.acquisition.code;
    if (!target.has(key)) target.set(key, []);
    target.get(key).push(item);
  }
  return {
    ctGroups: Array.from(ct, ([code, items]) => ({ phase: { code }, findings: items })),
    mriGroups: Array.from(mr, ([code, items]) => ({ sequence: { code }, findings: items }))
  };
}

function demographics(min, max, peak = "", sex = "no_sex_predilection", sexSummary = "明らかな性差は限定的。") {
  return {
    sex: {
      applicable: ["any"],
      predominance: sex === "male_predominant" || sex === "male_only" ? "male" : sex === "female_predominant" || sex === "female_only" ? "female" : "none",
      predilection: sex,
      summary: sexSummary
    },
    age: {
      typical_min: min,
      typical_max: max,
      peak_decade: peak || (min == null ? "不明" : `${min}-${max}歳`),
      summary: min == null ? "年齢分布は原因疾患や臨床背景に依存する。" : `${min}-${max}歳に多い。`
    }
  };
}

function frequency(label, rank, setting) {
  return {
    label,
    prevalence_rank: rank,
    basis: "differential_importance",
    evidence_level: "public_review",
    context: { population: "any", body_region: "brain", clinical_setting: setting },
    summary: `${setting}の鑑別として重要。`
  };
}

function card(spec) {
  const { ctGroups, mriGroups } = groups(spec.findings);
  let i = 1;
  for (const group of [...ctGroups, ...mriGroups]) {
    for (const item of group.findings) {
      item.finding_id = `${spec.id}_${item.modality.toLowerCase()}_${String(i++).padStart(3, "0")}`;
    }
  }
  const allFindings = [...ctGroups, ...mriGroups].flatMap((group) => group.findings);
  return {
    schema_version: "0.8",
    disease_id: spec.id,
    disease_name: { ja: spec.ja, en: spec.en },
    disease_aliases: spec.aliases || { ja: [spec.ja], en: [spec.en] },
    clinical: {
      overview: spec.overview,
      treatment: spec.treatment,
      epidemiology: spec.epidemiology
    },
    demographics: spec.demographics,
    keywords: spec.keywords || [],
    frequency: spec.frequency,
    imaging: {
      ct: { summary: spec.ctSummary, findings_by_phase: ctGroups },
      mri: { summary: spec.mriSummary, findings_by_sequence: mriGroups }
    },
    evidence: {
      summary: SOURCE_SUMMARY,
      claim_map: [{
        claim_type: "imaging_findings",
        finding_ids: allFindings.map((item) => item.finding_id),
        claim_scope: ["finding_text", "typicality", "diagnostic_weight"],
        source_ids: [PUBLIC_SOURCE_ID],
        confidence: "medium"
      }]
    },
    image_examples: [],
    references: [PUBLIC_REFERENCE],
    review: {
      status: "draft",
      reviewed_by: "",
      reviewed_at: "",
      confidence: "low",
      notes: "Brain field Phase1 batch4 draft."
    },
    curation: { auto_update_allowed: true, locked_fields: [], notes: "" },
    provenance: {
      created_by: "codex_public_source_review",
      model: "codex",
      created_at: now,
      prompt_version: "brain_batch4_v0.1",
      source_query: spec.sourceQuery || `${spec.en} CT MRI imaging findings public source`
    },
    updated_at: now,
    content_hash: ""
  };
}

const SPECS = [
  {
    id: "subarachnoid_hemorrhage",
    ja: "くも膜下出血",
    en: "Subarachnoid hemorrhage",
    overview: "くも膜下腔に出血を来す病態。動脈瘤破裂、外傷、血管奇形などが原因となる。",
    treatment: "原因検索、再出血予防、脳血管攣縮・水頭症管理を行う。",
    epidemiology: "急性頭痛や意識障害の重要な救急疾患。",
    demographics: demographics(20, 90, "50-70歳代"),
    frequency: frequency("common", 4, "acute headache or hemorrhage"),
    ctSummary: "非造影CTで脳槽・脳溝内高吸収を確認し、水頭症や脳内血腫を評価する。",
    mriSummary: "FLAIRやSWIでくも膜下腔出血を確認し、MRA/CTAで原因血管病変を検索する。",
    keywords: ["subarachnoid hemorrhage", "basal cistern hyperdensity"],
    findings: [
      F.ctHyper("非造影CTで脳槽・脳溝に沿う高吸収を示す。", { weight: 5, target: "subarachnoid_space" }),
      F.flairHigh("FLAIRで脳溝・脳槽に高信号を示す。", { weight: 4, target: "subarachnoid_space" }),
      F.blooming("SWI/T2*で血液成分による低信号を示すことがある。", { weight: 3 }),
      F.hydro("急性水頭症を伴うことがある。", { weight: 3 }),
      F.flow("MRA/CTAで原因動脈瘤を認めることがある。", { weight: 4, typicality: "variable" })
    ]
  },
  {
    id: "epidural_hematoma",
    ja: "硬膜外血腫",
    en: "Epidural hematoma",
    overview: "頭部外傷に伴う硬膜外腔の血腫。中硬膜動脈損傷が典型。",
    treatment: "血腫量、神経症状、mass effectに応じて緊急開頭血腫除去を検討する。",
    epidemiology: "若年〜成人の頭部外傷で重要。",
    demographics: demographics(5, 70, "若年〜中年", "male_predominant", "外傷背景のため男性に多い傾向。"),
    frequency: frequency("common", 4, "head trauma"),
    ctSummary: "CTで頭蓋骨内板に接する両凸レンズ状高吸収血腫として評価する。",
    mriSummary: "MRIでは血腫時相に応じた信号変化、SWI blooming、mass effectを評価する。",
    keywords: ["biconvex hematoma", "lentiform"],
    findings: [
      F.ctHyper("非造影CTで両凸レンズ状の高吸収硬膜外血腫を示す。", { weight: 5, target: "extra_axial_space" }),
      F.blooming("SWI/T2*で血液成分によるbloomingを示す。", { weight: 4 }),
      F.t1High("亜急性期には血腫がT1高信号を示すことがある。", { weight: 2, typicality: "variable" }),
      F.mass("大きい血腫ではmass effectを伴う。", { weight: 4 }),
      F.shift("正中偏位を伴う場合は緊急性が高い。", { weight: 4 })
    ]
  },
  {
    id: "traumatic_brain_contusion",
    ja: "脳挫傷",
    en: "Traumatic brain contusion",
    overview: "頭部外傷に伴う皮質・皮質下の挫滅性出血性病変。",
    treatment: "神経症状、出血増大、頭蓋内圧に応じて保存的治療または外科的治療を行う。",
    epidemiology: "前頭葉・側頭葉底部に多い外傷性病変。",
    demographics: demographics(5, 90, "外傷年齢に依存", "male_predominant", "外傷背景のため男性に多い傾向。"),
    frequency: frequency("common", 4, "head trauma"),
    ctSummary: "CTで皮質下出血性高吸収、周囲低吸収浮腫、経時的増大を確認する。",
    mriSummary: "MRIではFLAIR高信号、SWI blooming、DWI変化で出血性挫傷を評価する。",
    keywords: ["coup", "contrecoup", "hemorrhagic contusion"],
    findings: [
      F.ctHyper("皮質〜皮質下に点状または斑状高吸収出血を示す。", { weight: 5 }),
      F.edema("周囲血管原性浮腫を伴う。", { weight: 3 }),
      F.cortical("前頭葉・側頭葉底部など皮質〜皮質下病変として見える。", { weight: 4 }),
      F.blooming("SWI/T2*で出血性bloomingを示す。", { weight: 5 }),
      F.restr("急性外傷性細胞障害でDWI高信号を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  {
    id: "diffuse_axonal_injury",
    ja: "びまん性軸索損傷",
    en: "Diffuse axonal injury",
    overview: "回転加速度外傷により白質、脳梁、脳幹などに多発微小損傷を来す。",
    treatment: "支持療法と頭蓋内圧管理が中心。重症度評価にMRIが有用。",
    epidemiology: "重症頭部外傷で重要。",
    demographics: demographics(5, 70, "若年〜中年", "male_predominant", "外傷背景のため男性に多い傾向。"),
    frequency: frequency("common", 4, "traumatic coma"),
    ctSummary: "CTは正常または小出血のみのことがあり、重症度に比して所見が乏しいことがある。",
    mriSummary: "MRIではDWI/FLAIR/SWIで灰白質白質境界、脳梁、脳幹の多発病変を確認する。",
    keywords: ["DAI", "corpus callosum", "gray-white junction"],
    findings: [
      F.ctIso("CTでは明らかな異常を示さないことがある。", { weight: 1, typicality: "variable" }),
      F.callosal("脳梁病変を認めることが多い。", { weight: 5 }),
      F.dwiHigh("急性期にDWI高信号を示す微小損傷を認める。", { weight: 4 }),
      F.blooming("SWI/T2*で多発微小出血を示す。", { weight: 5 }),
      F.flairHigh("FLAIRで白質損傷部が高信号を示す。", { weight: 3 })
    ]
  },
  {
    id: "hypoxic_ischemic_encephalopathy_adult",
    ja: "成人低酸素虚血性脳症",
    en: "Adult hypoxic-ischemic encephalopathy",
    overview: "心停止、窒息、重度低酸素によりびまん性脳障害を来す。",
    treatment: "原疾患治療、全身管理、神経予後評価を行う。",
    epidemiology: "心停止後や重症低酸素イベント後に重要。",
    demographics: demographics(18, 100, "成人"),
    frequency: frequency("common", 4, "post cardiac arrest encephalopathy"),
    ctSummary: "CTで灰白質白質境界不明瞭化、脳浮腫、基底核低吸収を確認する。",
    mriSummary: "MRIでは皮質、基底核、海馬などのDWI高信号/ADC低値が早期評価に重要。",
    keywords: ["global hypoxic injury", "cortical ribbon"],
    findings: [
      F.ctMildHypo("CTで灰白質白質境界不明瞭化やびまん性低吸収を示す。", { weight: 3 }),
      F.dwiHigh("皮質や深部灰白質にびまん性DWI高信号を示す。", { weight: 5 }),
      F.adcLow("急性期にADC低値を伴う。", { weight: 5 }),
      F.basal("基底核病変を伴うことがある。", { weight: 4 }),
      F.laminar("亜急性期に皮質層状壊死を示すことがある。", { weight: 4 })
    ]
  },
  {
    id: "hypoglycemic_encephalopathy",
    ja: "低血糖脳症",
    en: "Hypoglycemic encephalopathy",
    overview: "重度低血糖により皮質、海馬、基底核、白質などに可逆性または不可逆性障害を来す。",
    treatment: "速やかな血糖補正と原因治療を行う。",
    epidemiology: "糖尿病治療中や栄養障害で重要。",
    demographics: demographics(0, 100, "全年齢"),
    frequency: frequency("uncommon", 3, "metabolic encephalopathy"),
    ctSummary: "CTは正常または浮腫性低吸収として見えることがある。",
    mriSummary: "MRIでは皮質、海馬、内包、脳梁などのDWI高信号/ADC低値を確認する。",
    keywords: ["hypoglycemia", "metabolic encephalopathy"],
    findings: [
      F.ctMildHypo("CTでは浮腫性低吸収を示すことがある。", { weight: 1, typicality: "variable" }),
      F.dwiHigh("急性期に皮質・白質・深部構造のDWI高信号を示す。", { weight: 5 }),
      F.adcLow("DWI高信号部はADC低値を伴うことが多い。", { weight: 5 }),
      F.callosal("脳梁病変を伴うことがある。", { weight: 3, typicality: "variable" }),
      F.flairHigh("FLAIR高信号はDWIより遅れて目立つことがある。", { weight: 2 })
    ]
  },
  {
    id: "carbon_monoxide_poisoning",
    ja: "一酸化炭素中毒",
    en: "Carbon monoxide poisoning",
    overview: "一酸化炭素曝露により低酸素性・中毒性脳障害を来す。",
    treatment: "酸素投与、高圧酸素療法の適応評価、遅発性脳症のフォローを行う。",
    epidemiology: "火災、暖房器具、事故曝露で生じる。",
    demographics: demographics(0, 100, "全年齢"),
    frequency: frequency("uncommon", 3, "toxic encephalopathy"),
    ctSummary: "CTでは淡蒼球低吸収やびまん性浮腫を認めることがある。",
    mriSummary: "MRIでは淡蒼球病変、白質病変、DWI/ADC変化を評価する。",
    keywords: ["globus pallidus", "toxic leukoencephalopathy"],
    findings: [
      F.ctHypo("CTで淡蒼球低吸収を示すことがある。", { weight: 3, subregion: "basal_ganglia" }),
      F.basal("淡蒼球を中心とする基底核病変を認める。", { weight: 5 }),
      F.whiteMatter("遅発性白質脳症として両側白質病変を示すことがある。", { weight: 4 }),
      F.dwiHigh("急性期病変でDWI高信号を示すことがある。", { weight: 4 }),
      F.adcLow("急性細胞障害部でADC低値を伴うことがある。", { weight: 3 })
    ]
  },
  {
    id: "limbic_encephalitis",
    ja: "辺縁系脳炎",
    en: "Limbic encephalitis",
    overview: "自己免疫性または傍腫瘍性に辺縁系を中心に炎症を来す。",
    treatment: "原因抗体・腫瘍検索、免疫療法、抗てんかん治療を行う。",
    epidemiology: "亜急性記憶障害、精神症状、発作で重要。",
    demographics: demographics(10, 90, "成人"),
    frequency: frequency("uncommon", 3, "encephalitis or seizure"),
    ctSummary: "CTは正常または側頭葉内側の腫脹/低吸収として見えることがある。",
    mriSummary: "MRIでは側頭葉内側・海馬のT2/FLAIR高信号、腫脹、造影やDWIの有無を確認する。",
    keywords: ["mesial temporal", "hippocampus"],
    findings: [
      F.ctMildHypo("CTでは側頭葉内側の軽度低吸収/腫脹として見えることがある。", { weight: 1, typicality: "variable" }),
      F.flairHigh("側頭葉内側・海馬にFLAIR高信号を示す。", { weight: 5, subregion: "limbic_system" }),
      F.dwiHigh("急性炎症や発作関連変化でDWI高信号を伴うことがある。", { weight: 2, typicality: "variable" }),
      F.mildEnh("造影効果は軽度または欠如することが多い。", { weight: 2, typicality: "variable" }),
      F.noRestr("強いADC低値を伴わないことも多い。", { weight: 1, typicality: "variable" })
    ]
  },
  {
    id: "anti_nmda_receptor_encephalitis",
    ja: "抗NMDA受容体脳炎",
    en: "Anti-NMDA receptor encephalitis",
    overview: "抗NMDA受容体抗体に関連する自己免疫性脳炎。精神症状、痙攣、不随意運動、自律神経症状を呈する。",
    treatment: "免疫療法、腫瘍検索/摘出、集中治療を含む支持療法を行う。",
    epidemiology: "若年女性に多く、卵巣奇形腫関連がある。",
    demographics: demographics(5, 45, "10-30歳代", "female_predominant", "若年女性に多い。"),
    frequency: frequency("uncommon", 3, "autoimmune encephalitis"),
    ctSummary: "CTは正常のことが多い。",
    mriSummary: "MRIは正常または皮質・海馬・基底核・白質のT2/FLAIR高信号を示すことがある。",
    keywords: ["autoimmune encephalitis", "NMDA"],
    findings: [
      F.ctIso("CTで明らかな異常を示さないことが多い。", { weight: 1, typicality: "variable" }),
      F.flairHigh("皮質、海馬、基底核、白質などにFLAIR高信号を示すことがある。", { weight: 3, typicality: "variable" }),
      F.cortical("皮質〜皮質下病変を認めることがある。", { weight: 2, typicality: "variable" }),
      F.basal("基底核病変を伴うことがある。", { weight: 2, typicality: "variable" }),
      F.mildEnh("造影効果は可変的。", { weight: 1, typicality: "variable" })
    ]
  },
  {
    id: "bacterial_meningitis",
    ja: "細菌性髄膜炎",
    en: "Bacterial meningitis",
    overview: "細菌感染による髄膜炎。合併症として脳炎、血管炎、梗塞、膿瘍、水頭症を来す。",
    treatment: "迅速な抗菌薬治療、原因菌同定、合併症管理を行う。",
    epidemiology: "全年齢で発症しうる救急疾患。",
    demographics: demographics(0, 100, "全年齢"),
    frequency: frequency("common", 4, "meningitis"),
    ctSummary: "CTは合併症評価、乳突蜂巣炎/副鼻腔炎や水頭症評価に用いる。",
    mriSummary: "造影MRIで軟髄膜造影、FLAIRくも膜下高信号、DWI膿性滲出液や梗塞を評価する。",
    keywords: ["meningitis", "leptomeningeal enhancement"],
    findings: [
      F.lepto("造影T1WIで軟髄膜造影を示す。", { weight: 5 }),
      F.flairHigh("FLAIRでくも膜下腔高信号を示すことがある。", { weight: 4 }),
      F.restr("膿性滲出液や合併梗塞で拡散制限を示すことがある。", { weight: 3, typicality: "variable" }),
      F.hydro("水頭症を合併することがある。", { weight: 3 }),
      F.ctHypo("合併脳炎や梗塞でCT低吸収を示すことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  {
    id: "neurosarcoidosis",
    ja: "神経サルコイドーシス",
    en: "Neurosarcoidosis",
    overview: "サルコイドーシスが中枢神経、髄膜、脳神経、下垂体・視床下部に病変を来す。",
    treatment: "ステロイドや免疫抑制療法を行い、全身病変評価を行う。",
    epidemiology: "サルコイドーシス患者の一部に神経病変を生じる。",
    demographics: demographics(20, 70, "30-50歳代"),
    frequency: frequency("uncommon", 3, "meningeal or cranial nerve enhancement"),
    ctSummary: "CTは水頭症や石灰化、全身病変評価の一部として使われる。",
    mriSummary: "MRIでは軟髄膜/硬膜造影、脳神経造影、下垂体茎肥厚、実質内結節を評価する。",
    keywords: ["basal meningitis", "cranial nerve enhancement"],
    findings: [
      F.lepto("基底槽優位の軟髄膜造影を示すことがある。", { weight: 5 }),
      F.pachy("硬膜肥厚・硬膜造影を伴うことがある。", { weight: 3 }),
      F.stalk("下垂体茎肥厚を伴うことがある。", { weight: 4 }),
      F.mildEnh("実質内肉芽腫性結節が造影されることがある。", { weight: 3 }),
      F.flairHigh("炎症性実質病変がFLAIR高信号を示すことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  {
    id: "listeria_rhombencephalitis",
    ja: "リステリア菱脳炎",
    en: "Listeria rhombencephalitis",
    overview: "Listeria monocytogenesによる脳幹・小脳優位の感染性脳炎。",
    treatment: "アンピシリンなど適切な抗菌薬治療を行う。",
    epidemiology: "高齢者、妊婦、免疫不全で重要。",
    demographics: demographics(20, 100, "高齢者/免疫不全"),
    frequency: frequency("rare", 2, "brainstem encephalitis"),
    ctSummary: "CTは正常または脳幹病変が不明瞭なことが多い。",
    mriSummary: "MRIでは脳幹・小脳のT2/FLAIR高信号、膿瘍性小病変、造影、拡散制限を評価する。",
    keywords: ["rhombencephalitis", "brainstem"],
    findings: [
      F.flairHigh("脳幹や小脳にFLAIR高信号を示す。", { weight: 5, subregion: "brainstem" }),
      F.restr("小膿瘍や急性炎症部に拡散制限を伴うことがある。", { weight: 3, typicality: "variable" }),
      F.ring("小膿瘍形成例でリング状造影を示すことがある。", { weight: 3, typicality: "variable" }),
      F.lepto("髄膜炎合併で軟髄膜造影を示すことがある。", { weight: 2, typicality: "variable" }),
      F.ctIso("CTで異常が目立たないことがある。", { weight: 1, typicality: "variable" })
    ]
  },
  {
    id: "hypertrophic_pachymeningitis",
    ja: "肥厚性硬膜炎",
    en: "Hypertrophic pachymeningitis",
    overview: "硬膜の炎症性肥厚を来す病態。IgG4関連疾患、ANCA関連、感染、腫瘍などが原因となる。",
    treatment: "原因検索を行い、ステロイド、免疫抑制、抗感染症治療などを行う。",
    epidemiology: "慢性頭痛、脳神経障害、硬膜造影病変の鑑別として重要。",
    demographics: demographics(20, 90, "中高年"),
    frequency: frequency("uncommon", 3, "pachymeningeal enhancement"),
    ctSummary: "CTでは硬膜肥厚や石灰化、骨病変の評価を行う。",
    mriSummary: "MRIでは硬膜肥厚、T2低信号〜等信号、強い硬膜造影、隣接構造への影響を評価する。",
    keywords: ["pachymeningitis", "dural thickening"],
    findings: [
      F.pachy("造影T1WIでびまん性または限局性硬膜造影を示す。", { weight: 5 }),
      F.t2Low("線維性肥厚ではT2低信号を示すことがある。", { weight: 3 }),
      F.ctMildHyper("CTで肥厚硬膜が軽度高吸収に見えることがある。", { weight: 2 }),
      F.mass("肥厚硬膜が隣接脳実質や脳神経にmass effectを及ぼすことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  {
    id: "developmental_venous_anomaly",
    ja: "発達性静脈奇形",
    en: "Developmental venous anomaly",
    overview: "髄質静脈が放射状に集合し、集約静脈へ流入する静脈性変異。",
    treatment: "通常は経過観察。合併海綿状血管奇形や出血がある場合に評価する。",
    epidemiology: "偶発的に発見されることが多い頻度の高い血管奇形。",
    demographics: demographics(0, 100, "全年齢"),
    frequency: frequency("common", 4, "incidental vascular lesion"),
    ctSummary: "造影CTで髄質静脈の放射状造影を認めることがある。",
    mriSummary: "造影MRIでcaput medusae様の放射状静脈、SWIで静脈構造を確認する。",
    keywords: ["caput medusae", "DVA"],
    findings: [
      F.avid("造影で放射状髄質静脈と集約静脈が描出される。", { weight: 5 }),
      F.flow("静脈性flow voidを認めることがある。", { weight: 3 }),
      F.blooming("SWIで静脈構造が低信号として目立つ。", { weight: 4 }),
      F.noRestr("周囲合併症がなければ拡散制限を伴わない。", { weight: 2 }),
      F.ctIso("非造影CTでは目立たないことが多い。", { weight: 1 })
    ]
  },
  {
    id: "brain_capillary_telangiectasia",
    ja: "脳毛細血管拡張症",
    en: "Brain capillary telangiectasia",
    overview: "橋などに多い低流量血管奇形。偶発的に発見されることが多い。",
    treatment: "典型例は経過観察。",
    epidemiology: "橋被蓋部の偶発病変として重要。",
    demographics: demographics(10, 90, "成人"),
    frequency: frequency("uncommon", 3, "incidental brainstem lesion"),
    ctSummary: "CTでは通常目立たない。",
    mriSummary: "MRIでは橋の淡い造影、T2/FLAIR軽度高信号、SWI低信号を示す。",
    keywords: ["pontine capillary telangiectasia"],
    findings: [
      F.ctIso("CTでは明らかな異常を示さないことが多い。", { weight: 1 }),
      F.mildEnh("造影T1WIで淡い斑状造影を示す。", { weight: 4, subregion: "pons" }),
      F.blooming("SWI/T2*で低信号を示す。", { weight: 5 }),
      F.t2High("T2/FLAIRで軽度高信号を示すことがある。", { weight: 2, typicality: "variable" }),
      F.noRestr("拡散制限を伴わない。", { weight: 2 })
    ]
  },
  {
    id: "radiation_necrosis",
    ja: "放射線壊死",
    en: "Radiation necrosis",
    overview: "放射線治療後に生じる遅発性壊死性変化。腫瘍再発との鑑別が重要。",
    treatment: "ステロイド、ベバシズマブ、外科的診断/減圧などを検討する。",
    epidemiology: "脳腫瘍や転移性脳腫瘍の放射線治療後に問題となる。",
    demographics: demographics(0, 100, "放射線治療後"),
    frequency: frequency("uncommon", 3, "post radiation enhancing lesion"),
    ctSummary: "CTでは低吸収浮腫、石灰化、mass effectを評価する。",
    mriSummary: "MRIではリング状/不整造影、周囲浮腫、灌流低下、MRS脂質乳酸ピークを再発と比較する。",
    keywords: ["post-radiation", "radiation necrosis"],
    findings: [
      F.edema("周囲血管原性浮腫を伴う。", { weight: 3 }),
      F.thickRing("造影T1WIで不整なリング状造影を示すことがある。", { weight: 3 }),
      F.cbvLow("灌流MRIでは再発腫瘍に比べCBV低下を示すことがある。", { weight: 4 }),
      F.lipid("MRSで脂質/乳酸ピークを示すことがある。", { weight: 3 }),
      F.restr("壊死辺縁で拡散変化は可変的。", { weight: 1, typicality: "variable" })
    ]
  },
  {
    id: "cerebral_small_vessel_disease",
    ja: "脳小血管病",
    en: "Cerebral small vessel disease",
    overview: "穿通枝や小血管の慢性障害により白質病変、ラクナ梗塞、微小出血を来す。",
    treatment: "血圧、糖尿病、脂質、喫煙など血管リスク管理を行う。",
    epidemiology: "高齢者で頻度が高い。",
    demographics: demographics(50, 100, "高齢"),
    frequency: frequency("common", 5, "white matter disease"),
    ctSummary: "CTでは白質低吸収、ラクナ梗塞、萎縮を確認する。",
    mriSummary: "MRIではFLAIR白質高信号、ラクナ、血管周囲腔、SWI微小出血を評価する。",
    keywords: ["leukoaraiosis", "lacune", "microbleeds"],
    findings: [
      F.ctHypo("CTで脳室周囲・深部白質低吸収を示す。", { weight: 3 }),
      F.periventricular("FLAIRで脳室周囲白質高信号を示す。", { weight: 5 }),
      F.whiteMatter("両側性白質病変として分布する。", { weight: 4 }),
      F.blooming("SWI/T2*で微小出血を伴うことがある。", { weight: 3, typicality: "variable" }),
      F.noEnh("慢性小血管病変は通常造影効果を欠く。", { weight: 2 })
    ]
  },
  {
    id: "cadasil",
    ja: "CADASIL",
    en: "CADASIL",
    overview: "NOTCH3変異による遺伝性小血管病。片頭痛、脳梗塞、認知機能低下を来す。",
    treatment: "血管リスク管理、症候治療、遺伝カウンセリングを行う。",
    epidemiology: "若年〜中年発症の家族性白質病変として重要。",
    demographics: demographics(20, 70, "30-50歳代"),
    frequency: frequency("rare", 2, "young white matter disease"),
    ctSummary: "CTでは白質低吸収を示すことがあるがMRIが重要。",
    mriSummary: "MRIでは前側頭極、外包、脳室周囲白質のFLAIR高信号と微小出血を評価する。",
    keywords: ["anterior temporal pole", "external capsule"],
    findings: [
      F.ctHypo("CTで白質低吸収を示すことがある。", { weight: 1 }),
      F.whiteMatter("両側性白質病変を示す。", { weight: 4 }),
      F.periventricular("脳室周囲白質高信号を認める。", { weight: 3 }),
      F.flairHigh("前側頭極や外包のFLAIR高信号が診断の手がかりになる。", { weight: 5, keywords: ["anterior temporal pole", "external capsule"] }),
      F.blooming("SWI/T2*で微小出血を伴うことがある。", { weight: 3, typicality: "variable" })
    ]
  },
  {
    id: "metronidazole_induced_encephalopathy",
    ja: "メトロニダゾール脳症",
    en: "Metronidazole-induced encephalopathy",
    overview: "メトロニダゾール曝露に関連する可逆性中毒性脳症。",
    treatment: "原因薬剤中止と支持療法を行う。",
    epidemiology: "長期または高用量投与例で問題となる。",
    demographics: demographics(0, 100, "薬剤曝露に依存"),
    frequency: frequency("rare", 2, "toxic encephalopathy"),
    ctSummary: "CTは正常のことが多い。",
    mriSummary: "MRIでは小脳歯状核、脳梁、脳幹のT2/FLAIR高信号、DWI変化を評価する。",
    keywords: ["dentate nucleus", "drug toxicity"],
    findings: [
      F.ctIso("CTで明らかな異常を示さないことが多い。", { weight: 1 }),
      F.flairHigh("小脳歯状核や脳幹にFLAIR高信号を示す。", { weight: 5, subregion: "cerebellum" }),
      F.callosal("脳梁病変を伴うことがある。", { weight: 3, typicality: "variable" }),
      F.dwiHigh("DWI高信号を伴うことがある。", { weight: 3, typicality: "variable" }),
      F.noEnh("通常、明らかな造影効果は乏しい。", { weight: 2 })
    ]
  },
  {
    id: "hepatic_encephalopathy",
    ja: "肝性脳症",
    en: "Hepatic encephalopathy",
    overview: "肝不全や門脈体循環シャントに伴う代謝性脳症。",
    treatment: "アンモニア低下、誘因治療、肝疾患管理を行う。",
    epidemiology: "肝硬変・急性肝不全で重要。",
    demographics: demographics(18, 100, "成人"),
    frequency: frequency("common", 4, "metabolic encephalopathy"),
    ctSummary: "CTは正常または脳浮腫を示すことがある。",
    mriSummary: "MRIでは淡蒼球T1高信号、急性高アンモニア血症で皮質DWI/FLAIR変化を評価する。",
    keywords: ["globus pallidus T1 hyperintensity", "hyperammonemia"],
    findings: [
      F.t1High("慢性肝障害では淡蒼球T1高信号を示すことがある。", { weight: 5, subregion: "basal_ganglia" }),
      F.basal("基底核、特に淡蒼球病変が手がかりになる。", { weight: 4 }),
      F.dwiHigh("急性高アンモニア血症では皮質DWI高信号を示すことがある。", { weight: 3, typicality: "variable" }),
      F.flairHigh("急性期に皮質/島皮質のFLAIR高信号を示すことがある。", { weight: 2, typicality: "variable" }),
      F.ctIso("慢性例ではCTで明らかな異常を示さないことも多い。", { weight: 1 })
    ]
  },
  {
    id: "diffuse_midline_glioma",
    ja: "びまん性正中神経膠腫",
    en: "Diffuse midline glioma",
    overview: "H3 K27 alteredを代表とする正中構造の浸潤性高悪性度神経膠腫。",
    treatment: "放射線治療、化学療法、臨床試験、症候緩和を検討する。",
    epidemiology: "小児〜若年に多く、橋・視床・脊髄など正中構造に生じる。",
    demographics: demographics(3, 40, "小児〜若年"),
    frequency: frequency("uncommon", 3, "brainstem or thalamic tumor"),
    ctSummary: "CTでは橋・視床などの腫大や低吸収として見えることがある。",
    mriSummary: "MRIでは正中構造のT2/FLAIR高信号浸潤性腫大、造影可変、拡散/灌流を評価する。",
    keywords: ["H3 K27", "pontine glioma", "thalamic glioma"],
    findings: [
      F.ctMildHypo("CTで正中構造の腫大または低吸収として見えることがある。", { weight: 2 }),
      F.flairHigh("橋、視床など正中構造にFLAIR高信号腫大を示す。", { weight: 5 }),
      F.t2High("T2WIで浸潤性高信号を示す。", { weight: 4 }),
      F.mildEnh("造影効果は可変的。", { weight: 2, typicality: "variable" }),
      F.restr("高細胞性成分では拡散制限を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  {
    id: "atypical_teratoid_rhabdoid_tumor",
    ja: "非定型奇形腫様ラブドイド腫瘍",
    en: "Atypical teratoid/rhabdoid tumor",
    overview: "乳幼児に多い高悪性度胎児性腫瘍。後頭蓋窩や大脳に発生する。",
    treatment: "手術、化学療法、放射線治療を組み合わせる。",
    epidemiology: "乳幼児脳腫瘍として重要。",
    demographics: demographics(0, 6, "乳幼児"),
    frequency: frequency("rare", 2, "pediatric brain tumor"),
    ctSummary: "CTでは高吸収〜不均一腫瘤、出血、石灰化、水頭症を評価する。",
    mriSummary: "MRIでは不均一腫瘤、壊死/出血、拡散制限、強い造影、髄液播種を評価する。",
    keywords: ["ATRT", "embryonal tumor"],
    findings: [
      F.ctMildHyper("高細胞性腫瘍としてCTで等〜高吸収を示すことがある。", { weight: 3 }),
      F.restr("高細胞性によりDWI高信号/ADC低値を示しやすい。", { weight: 5 }),
      F.adcLow("ADC低値は高細胞性腫瘍を支持する。", { weight: 5 }),
      F.thickRing("造影T1WIで不均一またはリング状造影を示すことがある。", { weight: 4 }),
      F.hydro("後頭蓋窩病変では水頭症を伴うことがある。", { weight: 3 })
    ]
  },
  {
    id: "suprasellar_germinoma",
    ja: "鞍上部胚細胞腫",
    en: "Suprasellar germinoma",
    overview: "鞍上部・視床下部・下垂体茎に生じる胚細胞腫。",
    treatment: "放射線治療と化学療法が主体。内分泌評価を行う。",
    epidemiology: "小児〜若年に多い。",
    demographics: demographics(5, 30, "10-20歳代", "male_predominant", "頭蓋内胚細胞腫全体では男性に多い。"),
    frequency: frequency("uncommon", 3, "sellar suprasellar mass"),
    ctSummary: "CTで鞍上部等〜高吸収腫瘤として見えることがある。",
    mriSummary: "MRIでは鞍上部/下垂体茎の均一造影腫瘤、拡散制限、内分泌関連変化を評価する。",
    keywords: ["diabetes insipidus", "pituitary stalk"],
    findings: [
      F.sellar("鞍上部腫瘤として見える。", { weight: 5 }),
      F.stalk("下垂体茎肥厚を伴うことがある。", { weight: 5 }),
      F.avid("造影T1WIで比較的均一に造影される。", { weight: 4 }),
      F.restr("高細胞性により拡散制限を示すことがある。", { weight: 4 }),
      F.ctMildHyper("CTで等〜軽度高吸収を示すことがある。", { weight: 2 })
    ]
  },
  {
    id: "pituitary_microadenoma",
    ja: "下垂体微小腺腫",
    en: "Pituitary microadenoma",
    overview: "10mm未満の下垂体腺腫。内分泌症状を契機に発見される。",
    treatment: "ホルモン型に応じた薬物治療、経蝶形骨洞手術、経過観察を選択する。",
    epidemiology: "下垂体偶発腫や内分泌異常で頻度が高い。",
    demographics: demographics(15, 80, "成人"),
    frequency: frequency("common", 4, "sellar lesion"),
    ctSummary: "CTでは微小病変は描出困難なことが多い。",
    mriSummary: "Dynamic造影MRIで正常下垂体より遅れて造影される低造影結節として評価する。",
    keywords: ["dynamic pituitary MRI", "delayed enhancement"],
    findings: [
      F.sellar("鞍内の小結節として評価する。", { weight: 4 }),
      F.mildEnh("dynamic造影で相対的低造影結節として見えることがある。", { weight: 5 }),
      F.t1Low("T1WIで正常下垂体より低信号のことがある。", { weight: 2, typicality: "variable" }),
      F.noRestr("典型的微小腺腫では強い拡散制限は目立たない。", { weight: 1 }),
      F.ctIso("CTでは等吸収で検出困難なことが多い。", { weight: 1 })
    ]
  },
  {
    id: "subependymal_giant_cell_astrocytoma",
    ja: "上衣下巨細胞性星細胞腫",
    en: "Subependymal giant cell astrocytoma",
    overview: "結節性硬化症に関連し、Monro孔近傍に生じる低悪性度腫瘍。",
    treatment: "水頭症リスク、増大、症状に応じて手術やmTOR阻害薬を検討する。",
    epidemiology: "小児〜若年のTSC患者で重要。",
    demographics: demographics(0, 30, "小児〜若年"),
    frequency: frequency("uncommon", 3, "intraventricular mass"),
    ctSummary: "CTでMonro孔近傍の石灰化を伴う脳室内腫瘤として確認する。",
    mriSummary: "MRIでは上衣下結節より大きい造影腫瘤、水頭症、石灰化/嚢胞を評価する。",
    keywords: ["SEGA", "Monro foramen", "TSC"],
    findings: [
      F.subependymal("Monro孔近傍の上衣下腫瘤として見える。", { weight: 5 }),
      F.calc("石灰化を伴うことがある。", { weight: 4 }),
      F.avid("造影T1WIで造影される腫瘤を示す。", { weight: 4 }),
      F.hydro("Monro孔閉塞により水頭症を伴うことがある。", { weight: 4 }),
      F.t2High("T2WIで不均一高信号を示すことがある。", { weight: 2 })
    ]
  },
  {
    id: "intraventricular_meningioma",
    ja: "脳室内髄膜腫",
    en: "Intraventricular meningioma",
    overview: "脈絡叢近傍、特に側脳室三角部に生じる髄膜腫。",
    treatment: "症状、増大、閉塞性水頭症に応じて手術を検討する。",
    epidemiology: "中年女性に多い傾向。",
    demographics: demographics(30, 80, "40-60歳代", "female_predominant", "女性に多い傾向。"),
    frequency: frequency("uncommon", 3, "intraventricular mass"),
    ctSummary: "CTでは等〜高吸収の脳室内腫瘤、石灰化、水頭症を評価する。",
    mriSummary: "MRIでは強く均一な造影、T1等〜低信号、T2可変、脳室内局在を評価する。",
    keywords: ["trigone", "intraventricular mass"],
    findings: [
      F.ctMildHyper("CTで等〜軽度高吸収の脳室内腫瘤として見える。", { weight: 3 }),
      F.calc("石灰化を伴うことがある。", { weight: 3 }),
      F.avid("造影T1WIで強く均一に造影される。", { weight: 5 }),
      F.hydro("脳室閉塞により水頭症を伴うことがある。", { weight: 2, typicality: "variable" }),
      F.noRestr("典型例では強い拡散制限は可変的。", { weight: 1, typicality: "variable" })
    ]
  },
  {
    id: "xanthogranuloma_choroid_plexus",
    ja: "脈絡叢黄色肉芽腫",
    en: "Choroid plexus xanthogranuloma",
    overview: "脈絡叢に生じる良性嚢胞性/脂質性病変。偶発的に発見されることが多い。",
    treatment: "典型的無症候例は経過観察。",
    epidemiology: "成人の偶発脳室内病変として見られる。",
    demographics: demographics(20, 90, "成人"),
    frequency: frequency("uncommon", 3, "intraventricular lesion"),
    ctSummary: "CTでは脈絡叢内の低吸収〜石灰化病変として見えることがある。",
    mriSummary: "MRIではT1/T2信号可変、脂質/蛋白性内容、造影乏しい脈絡叢病変として評価する。",
    keywords: ["choroid plexus", "xanthogranuloma"],
    findings: [
      F.ctMildHypo("CTで脈絡叢内の低吸収病変として見えることがある。", { weight: 2 }),
      F.calc("石灰化を伴うことがある。", { weight: 2, typicality: "variable" }),
      F.t1High("脂質/蛋白成分によりT1高信号を示すことがある。", { weight: 3, typicality: "variable" }),
      F.t2High("T2WIで高信号嚢胞性病変として見えることがある。", { weight: 3 }),
      F.noEnh("造影効果は乏しいことが多い。", { weight: 2 })
    ]
  },
  {
    id: "cerebral_fat_embolism_syndrome",
    ja: "脳脂肪塞栓症候群",
    en: "Cerebral fat embolism syndrome",
    overview: "長管骨骨折などに伴う脂肪塞栓により多発脳病変を来す。",
    treatment: "支持療法、呼吸循環管理、外傷治療を行う。",
    epidemiology: "外傷後の意識障害で重要。",
    demographics: demographics(10, 80, "外傷年齢に依存", "male_predominant", "外傷背景のため男性に多い傾向。"),
    frequency: frequency("uncommon", 3, "post trauma encephalopathy"),
    ctSummary: "CTは正常または浮腫性変化のみのことがある。",
    mriSummary: "MRIではDWIでstarfield pattern、SWIで微小出血、FLAIR高信号を評価する。",
    keywords: ["starfield pattern", "fat embolism"],
    findings: [
      F.ctIso("CTで明らかな異常を示さないことがある。", { weight: 1 }),
      F.dwiHigh("DWIで多発点状高信号のstarfield patternを示す。", { weight: 5, keywords: ["starfield pattern"] }),
      F.adcLow("急性微小梗塞部でADC低値を示すことがある。", { weight: 4 }),
      F.blooming("SWIで多発微小出血を認めることがある。", { weight: 4 }),
      F.flairHigh("FLAIRで散在性高信号病変を示すことがある。", { weight: 3 })
    ]
  },
  {
    id: "cerebral_air_embolism",
    ja: "脳空気塞栓症",
    en: "Cerebral air embolism",
    overview: "血管内空気により脳梗塞様障害を来す救急病態。",
    treatment: "高濃度酸素、高圧酸素療法、原因処置を検討する。",
    epidemiology: "医療手技、外傷、潜水などで起こりうる。",
    demographics: demographics(0, 100, "原因に依存"),
    frequency: frequency("rare", 2, "acute neurologic deficit after procedure"),
    ctSummary: "CTで血管内/くも膜下腔の空気、急性虚血変化を確認する。",
    mriSummary: "MRIでは多発DWI高信号/ADC低値の塞栓性梗塞を評価する。",
    keywords: ["air embolism", "iatrogenic embolism"],
    findings: [
      F.ctHypo("虚血化した領域が低吸収を示すことがある。", { weight: 2, typicality: "variable" }),
      F.vascularRestr?.("多発塞栓性梗塞がDWIで高信号を示す。", { weight: 5 }) || F.restr("多発塞栓性梗塞がDWIで高信号を示す。", { weight: 5 }),
      F.adcLow("急性虚血部はADC低値を示す。", { weight: 4 }),
      F.flairHigh("時間経過でFLAIR高信号を示す。", { weight: 2 }),
      F.noEnh("急性期は造影効果に乏しいことが多い。", { weight: 1 })
    ]
  },
  {
    id: "laminar_cortical_necrosis",
    ja: "皮質層状壊死",
    en: "Cortical laminar necrosis",
    overview: "低酸素、低血糖、痙攣重積、梗塞後などで皮質層状に壊死を来す。",
    treatment: "原因病態の治療と神経学的管理を行う。",
    epidemiology: "虚血性・代謝性・発作関連障害の後に見られる。",
    demographics: demographics(0, 100, "原因に依存"),
    frequency: frequency("uncommon", 3, "cortical injury"),
    ctSummary: "CTでは皮質浮腫や低吸収として見えることがある。",
    mriSummary: "MRIでは皮質リボン状FLAIR高信号、DWI高信号、亜急性期T1高信号を評価する。",
    keywords: ["cortical ribbon", "laminar necrosis"],
    findings: [
      F.ctHypo("CTで皮質低吸収/浮腫を示すことがある。", { weight: 2 }),
      F.laminar("皮質層状壊死として皮質リボン状異常信号を示す。", { weight: 5 }),
      F.dwiHigh("急性期にDWI高信号を示すことがある。", { weight: 4 }),
      F.adcLow("急性期はADC低値を伴うことがある。", { weight: 3 }),
      F.t1High("亜急性期に皮質T1高信号を示す。", { weight: 5 })
    ]
  },
  {
    id: "seizure_related_mri_abnormality",
    ja: "発作関連MRI異常",
    en: "Seizure-related MRI abnormality",
    overview: "痙攣発作や発作重積に伴う一過性の皮質・海馬・視床などのMRI異常。",
    treatment: "発作制御、原因検索、経時的画像フォローを行う。",
    epidemiology: "急性発作後の脳炎・梗塞 mimics として重要。",
    demographics: demographics(0, 100, "全年齢"),
    frequency: frequency("common", 4, "seizure or stroke mimic"),
    ctSummary: "CTは正常または軽度腫脹/低吸収を示す。",
    mriSummary: "MRIでは皮質/海馬のFLAIR高信号、DWI高信号、ADC低値または高値、灌流上昇を評価する。",
    keywords: ["peri-ictal", "status epilepticus"],
    findings: [
      F.cortical("発作焦点に一致する皮質〜皮質下病変を示す。", { weight: 4 }),
      F.flairHigh("皮質または海馬がFLAIR高信号を示す。", { weight: 4 }),
      F.dwiHigh("一過性DWI高信号を示すことがある。", { weight: 3 }),
      F.adcLow("ADC低値を伴うこともあるが可逆性のことがある。", { weight: 2, typicality: "variable" }),
      F.hyperperfusion("発作時/発作直後にASLや灌流で過灌流を示すことがある。", { weight: 5 })
    ]
  },
  {
    id: "acute_cerebellitis",
    ja: "急性小脳炎",
    en: "Acute cerebellitis",
    overview: "感染後または感染性/免疫性に小脳炎症を来す。",
    treatment: "原因に応じて抗感染症治療、ステロイド、脳浮腫/水頭症管理を行う。",
    epidemiology: "小児に多いが成人にも生じる。",
    demographics: demographics(0, 40, "小児〜若年"),
    frequency: frequency("uncommon", 3, "acute ataxia"),
    ctSummary: "CTでは小脳腫脹、低吸収、水頭症を評価する。",
    mriSummary: "MRIでは小脳皮質/白質のT2/FLAIR高信号、腫脹、造影、DWI変化を評価する。",
    keywords: ["acute ataxia", "cerebellar swelling"],
    findings: [
      F.ctHypo("CTで小脳低吸収/腫脹を示すことがある。", { weight: 2, subregion: "cerebellum" }),
      F.flairHigh("小脳にFLAIR高信号を示す。", { weight: 5, subregion: "cerebellum" }),
      F.mass("小脳腫脹により第4脳室圧排を来すことがある。", { weight: 3 }),
      F.hydro("閉塞性水頭症を伴うことがある。", { weight: 3 }),
      F.mildEnh("炎症部に造影効果を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  }
];

function main() {
  fs.mkdirSync(draftsDir, { recursive: true });
  fs.mkdirSync(sourcesDir, { recursive: true });
  writeJson(path.join(sourcesDir, "brain_batch4_public_sources.json"), {
    source_packet_id: PUBLIC_SOURCE_ID,
    created_at: now,
    purpose: "Phase1 brain disease draft expansion with modality-level CT/MRI findings.",
    sources: [
      { title: "NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/" },
      { title: "NINDS Disorders", url: "https://www.ninds.nih.gov/health-information/disorders" },
      { title: "MedlinePlus", url: "https://medlineplus.gov/" },
      { title: "CDC", url: "https://www.cdc.gov/" },
      { title: "PubMed Central open-access reviews", url: "https://pmc.ncbi.nlm.nih.gov/" }
    ],
    limitations: ["draft段階であり医師レビュー前提", "画像例は未取得"]
  });

  let written = 0;
  let skipped = 0;
  for (const spec of SPECS) {
    const filePath = path.join(draftsDir, `${spec.id}.json`);
    if (fs.existsSync(filePath)) {
      skipped += 1;
      continue;
    }
    writeJson(filePath, card(spec));
    written += 1;
  }
  console.log(`Brain draft batch4: wrote ${written}, skipped existing ${skipped}.`);
}

main();
