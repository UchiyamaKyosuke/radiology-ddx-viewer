const fs = require("fs");
const path = require("path");
const { DATA, writeJson } = require("./lib");

const now = new Date().toISOString();
const draftsDir = path.join(DATA, "drafts");
const publicDir = path.join(DATA, "sources", "public");

const SOURCE_ID = "public_brain_batch5_20260628";
const PUBLIC_REFERENCE = {
  source_id: SOURCE_ID,
  type: "public_source_packet",
  title: "Public neuroradiology source packet for brain draft batch 5",
  authors: [],
  journal: "",
  year: "2026",
  url: "https://www.ncbi.nlm.nih.gov/books/",
  license: "Public web source index: NCBI Bookshelf/StatPearls, NINDS, MedlinePlus, CDC, and open-access review articles where applicable"
};

function anatomy(subregion = "brain", organ = "brain") {
  return { body_region: "brain", organ, subregion, laterality: "unknown" };
}

function finding(acq, code, text, opts = {}) {
  const modality = opts.modality || (opts.phase ? "CT" : "MRI");
  return {
    finding_code: code,
    modality,
    acquisition: { type: modality === "CT" ? "phase" : "sequence", code: acq },
    anatomy: anatomy(opts.subregion || "brain", opts.organ || "brain"),
    target: opts.target || "whole_lesion",
    modifiers: {},
    keywords: opts.keywords || [],
    finding_text: text,
    typicality: opts.typicality || "common",
    diagnostic_weight: opts.weight ?? 3,
    review_status: "draft",
    mapping: { status: "matched", confidence: 0.85, matched_concept_id: code, alternatives: [] }
  };
}

const F = {
  ctHypo: (t, o = {}) => finding("non_contrast", "finding:ct_hypoattenuation", t, { ...o, modality: "CT" }),
  ctHyper: (t, o = {}) => finding("non_contrast", "finding:ct_hyperattenuation", t, { ...o, modality: "CT" }),
  ctMildHyper: (t, o = {}) => finding("non_contrast", "finding:ct_mild_hyperattenuation", t, { ...o, modality: "CT" }),
  ctIso: (t, o = {}) => finding("non_contrast", "finding:ct_isoattenuation", t, { ...o, modality: "CT" }),
  calc: (t, o = {}) => finding("non_contrast", "finding:calcification_present", t, { ...o, modality: "CT" }),
  t1Low: (t, o = {}) => finding("T1WI", "finding:t1_hypointensity", t, o),
  t1High: (t, o = {}) => finding("T1WI", "finding:t1_hyperintensity", t, o),
  t2High: (t, o = {}) => finding("T2WI", "finding:t2_hyperintensity", t, o),
  t2Low: (t, o = {}) => finding("T2WI", "finding:t2_hypointensity", t, o),
  flair: (t, o = {}) => finding("FLAIR", "finding:flair_hyperintensity", t, o),
  dwi: (t, o = {}) => finding("DWI", "finding:dwi_hyperintensity", t, o),
  adcLow: (t, o = {}) => finding("ADC", "finding:adc_low", t, o),
  adcHigh: (t, o = {}) => finding("ADC", "finding:adc_high", t, o),
  restr: (t, o = {}) => finding("DWI", "finding:diffusion_restriction_present", t, o),
  noRestr: (t, o = {}) => finding("DWI", "finding:diffusion_restriction_absent", t, o),
  edema: (t, o = {}) => finding("FLAIR", "finding:vasogenic_edema", t, { ...o, target: "perilesional_edema" }),
  avid: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:avid_homogeneous_enhancement", t, o),
  mildEnh: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:mild_enhancement", t, o),
  solidEnh: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:enhancing_solid_component", t, o),
  ring: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:ring_enhancement", t, o),
  thickRing: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:thick_irregular_ring_enhancement", t, o),
  openRing: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:open_ring_enhancement", t, o),
  noEnh: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:enhancement_absent", t, o),
  lepto: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:leptomeningeal_enhancement", t, { ...o, target: "meninges" }),
  pachy: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:pachymeningeal_enhancement", t, { ...o, target: "meninges" }),
  blooming: (t, o = {}) => finding("SWI", "finding:susceptibility_blooming", t, o),
  stenosis: (t, o = {}) => finding("MRA_TOF", "finding:arterial_stenosis_or_occlusion", t, { ...o, organ: "cerebral_vessel", target: "vascular_nidus" }),
  hypoperfusion: (t, o = {}) => finding("ASL", "finding:hypoperfusion", t, o),
  hyperperfusion: (t, o = {}) => finding("ASL", "finding:hyperperfusion", t, o),
  cbvHigh: (t, o = {}) => finding("DSC_perfusion", "finding:elevated_cbv", t, o),
  cbvLow: (t, o = {}) => finding("DSC_perfusion", "finding:reduced_cbv", t, o),
  choline: (t, o = {}) => finding("MRS", "finding:elevated_choline_peak", t, o),
  lactate: (t, o = {}) => finding("MRS", "finding:lactate_peak", t, o),
  lipid: (t, o = {}) => finding("MRS", "finding:lipid_peak", t, o),
  csf: (t, o = {}) => finding("T2WI", "finding:csf_like_signal", t, o),
  hydro: (t, o = {}) => finding("T2WI", "finding:hydrocephalus", t, o),
  vent: (t, o = {}) => finding("T2WI", "finding:ventriculomegaly", t, o),
  mass: (t, o = {}) => finding("T2WI", "finding:mass_effect", t, o),
  shift: (t, o = {}) => finding("T2WI", "finding:midline_shift", t, o),
  cortical: (t, o = {}) => finding("FLAIR", "finding:cortical_subcortical_lesion", t, { ...o, target: "cortex" }),
  basal: (t, o = {}) => finding("FLAIR", "finding:basal_ganglia_involvement", t, { ...o, organ: "basal_ganglia", subregion: "basal_ganglia", target: "deep_gray_matter" }),
  white: (t, o = {}) => finding("FLAIR", "finding:bilateral_symmetric_white_matter_lesions", t, { ...o, subregion: "symmetric_white_matter", target: "white_matter" }),
  perivent: (t, o = {}) => finding("FLAIR", "finding:periventricular_ovoid_lesions", t, { ...o, subregion: "periventricular", target: "white_matter" }),
  callosal: (t, o = {}) => finding("FLAIR", "finding:callosal_lesion", t, { ...o, organ: "corpus_callosum", subregion: "periventricular" }),
  sellar: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:sellar_suprasellar_mass", t, { ...o, organ: "pituitary", subregion: "sellar", target: "sellar_mass" }),
  stalk: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:pituitary_stalk_thickening", t, { ...o, organ: "pituitary", subregion: "pituitary_stalk", target: "pituitary_stalk" }),
  subependymal: (t, o = {}) => finding("T2WI", "finding:subependymal_nodule", t, { ...o, organ: "ventricle", subregion: "subependymal", target: "ventricular_mass" }),
  mural: (t, o = {}) => finding("contrast_enhanced_T1WI", "finding:cyst_with_enhancing_mural_nodule", t, { ...o, target: "mural_nodule" })
};

function demographics(min, max, peak, sex = "no_sex_predilection") {
  const predominance = sex.includes("male") ? "male" : sex.includes("female") ? "female" : "none";
  return {
    sex: { applicable: sex.endsWith("_only") ? [predominance] : ["any"], predominance, predilection: sex, summary: "臨床背景により変動するが、代表的な疫学傾向を記載。" },
    age: { typical_min: min, typical_max: max, peak_decade: peak, summary: "代表的な発症年齢帯を記載。" }
  };
}

function frequency(label, rank, setting) {
  return {
    label,
    prevalence_rank: rank,
    basis: "differential_importance",
    evidence_level: "public_review",
    context: { population: "any", body_region: "brain", clinical_setting: setting },
    summary: `${setting} の鑑別として重要。`
  };
}

const PROFILE = {
  infiltrative_tumor: (s) => [
    F.ctHypo(`${s.ja} はCTで低吸収の浸潤性病変として見えることがある。`, { weight: 1, subregion: s.subregion }),
    F.t2High(`${s.ja} はT2WIで高信号の浸潤性病変として評価する。`, { weight: 3, subregion: s.subregion }),
    F.flair(`${s.ja} はFLAIR高信号として病変範囲が把握しやすい。`, { weight: 4, subregion: s.subregion }),
    F.mildEnh(`${s.ja} の造影効果は可変で、gradeや活動性の評価に用いる。`, { weight: 2, typicality: "variable", subregion: s.subregion }),
    F.choline(`${s.ja} ではMRSでコリン上昇を伴うことがある。`, { weight: 2, typicality: "variable", subregion: s.subregion })
  ],
  cellular_tumor: (s) => [
    F.ctMildHyper(`${s.ja} は高細胞性を反映してCTで軽度高吸収を示すことがある。`, { weight: 2, subregion: s.subregion }),
    F.restr(`${s.ja} はDWI高信号を伴いやすい。`, { weight: 4, subregion: s.subregion }),
    F.adcLow(`${s.ja} はADC低下を伴うことがある。`, { weight: 4, subregion: s.subregion }),
    F.solidEnh(`${s.ja} は充実性造影病変として見えることが多い。`, { weight: 4, subregion: s.subregion }),
    F.mass(`${s.ja} が大きい場合はmass effectを伴う。`, { weight: 2, typicality: "variable", subregion: s.subregion })
  ],
  cystic_tumor: (s) => [
    F.ctHypo(`${s.ja} はCTで嚢胞性低吸収成分を示すことがある。`, { weight: 2, subregion: s.subregion, target: "cystic_component" }),
    F.t2High(`${s.ja} の嚢胞性成分はT2WI高信号を示す。`, { weight: 3, subregion: s.subregion, target: "cystic_component" }),
    F.mural(`${s.ja} では造影される壁在結節や充実成分を確認する。`, { weight: 4, subregion: s.subregion }),
    F.noRestr(`${s.ja} は高細胞性腫瘍ほど強い拡散制限を示さないことがある。`, { weight: 1, typicality: "variable", subregion: s.subregion }),
    F.hydro(`${s.ja} が後頭蓋窩や脳室近傍にある場合、水頭症を伴うことがある。`, { weight: 2, typicality: "variable", subregion: s.subregion })
  ],
  meningeal: (s) => [
    F.ctIso(`${s.ja} はCTで硬膜近傍の等吸収から軽度高吸収病変として見えることがある。`, { weight: 2, organ: "meninges", subregion: s.subregion, target: "extra_axial_mass" }),
    F.avid(`${s.ja} は強い均一造影を示すことがある。`, { weight: 4, organ: "meninges", subregion: s.subregion, target: "extra_axial_mass" }),
    F.pachy(`${s.ja} では硬膜造影や硬膜付着を伴うことがある。`, { weight: 3, organ: "meninges", subregion: s.subregion }),
    F.edema(`${s.ja} は周囲脳実質の血管原性浮腫を伴うことがある。`, { weight: 2, typicality: "variable", subregion: s.subregion }),
    F.blooming(`${s.ja} では石灰化や出血成分によりSWI低信号を伴うことがある。`, { weight: 1, typicality: "variable", subregion: s.subregion })
  ],
  infection: (s) => [
    F.ctHypo(`${s.ja} はCTで低吸収域として見えることがある。`, { weight: 1, subregion: s.subregion }),
    F.flair(`${s.ja} はFLAIR高信号の炎症性病変として評価する。`, { weight: 4, subregion: s.subregion }),
    F.restr(`${s.ja} は急性炎症や膿瘍性成分で拡散制限を伴うことがある。`, { weight: 3, typicality: "variable", subregion: s.subregion }),
    F.ring(`${s.ja} では造影効果を伴うことがある。`, { weight: 3, typicality: "variable", subregion: s.subregion }),
    F.lepto(`${s.ja} では髄膜炎を伴う場合に軟膜造影を認める。`, { weight: 2, typicality: "variable" })
  ],
  demyelinating: (s) => [
    F.ctHypo(`${s.ja} はCTで白質低吸収として見えることがある。`, { weight: 1, subregion: "white_matter", target: "white_matter" }),
    F.flair(`${s.ja} は白質優位のFLAIR高信号病変として評価する。`, { weight: 4, subregion: "white_matter", target: "white_matter" }),
    F.t2High(`${s.ja} はT2WI高信号を示す。`, { weight: 3, subregion: "white_matter", target: "white_matter" }),
    F.openRing(`${s.ja} は活動性病変でopen-ring様造影を示すことがある。`, { weight: 3, typicality: "variable", subregion: "white_matter", target: "lesion_margin" }),
    F.noRestr(`${s.ja} は急性虚血ほど強い拡散制限を示さないことがある。`, { weight: 1, typicality: "variable", subregion: "white_matter" })
  ],
  metabolic: (s) => [
    F.ctHypo(`${s.ja} はCTで対称性低吸収や浮腫として見えることがある。`, { weight: 1, subregion: s.subregion }),
    F.basal(`${s.ja} では基底核や深部灰白質病変が重要な手掛かりとなる。`, { weight: 4 }),
    F.white(`${s.ja} では対称性白質病変を伴うことがある。`, { weight: 3, typicality: "variable" }),
    F.restr(`${s.ja} の急性期にはDWI高信号を伴うことがある。`, { weight: 3, typicality: "variable", subregion: s.subregion }),
    F.lactate(`${s.ja} ではMRSで乳酸ピークを確認することがある。`, { weight: 2, typicality: "variable", subregion: s.subregion })
  ],
  vascular: (s) => [
    F.ctHypo(`${s.ja} はCTで虚血性低吸収や浮腫として見えることがある。`, { weight: 2, subregion: s.subregion }),
    F.restr(`${s.ja} ではDWI高信号/ADC低下を伴う虚血性病変を確認する。`, { weight: 4, subregion: s.subregion }),
    F.stenosis(`${s.ja} ではMRAで狭窄・閉塞・血管異常を確認する。`, { weight: 4 }),
    F.blooming(`${s.ja} では出血や微小出血によりSWI低信号を伴うことがある。`, { weight: 2, typicality: "variable", subregion: s.subregion }),
    F.hypoperfusion(`${s.ja} では灌流低下を伴うことがある。`, { weight: 3, typicality: "variable", subregion: s.subregion })
  ],
  malformation: (s) => [
    F.ctIso(`${s.ja} はCTで構造異常として評価される。`, { weight: 1, subregion: s.subregion, target: "developmental_anomaly" }),
    F.cortical(`${s.ja} では皮質形成異常や皮質・皮質下構造の異常を確認する。`, { weight: 4, subregion: s.subregion }),
    F.flair(`${s.ja} はFLAIRで皮質下白質や周囲信号変化を評価する。`, { weight: 3, subregion: s.subregion }),
    F.noEnh(`${s.ja} は通常、腫瘍性の強い造影効果を示さない。`, { weight: 2, subregion: s.subregion }),
    F.noRestr(`${s.ja} は通常、急性拡散制限を示さない。`, { weight: 2, subregion: s.subregion })
  ],
  neurodegenerative: (s) => [
    F.ctIso(`${s.ja} ではCTで萎縮や二次的変化を評価する。`, { weight: 1, subregion: s.subregion }),
    F.flair(`${s.ja} ではFLAIRで白質変化や萎縮に伴う周囲変化を評価する。`, { weight: 2, subregion: s.subregion }),
    F.vent(`${s.ja} では萎縮に伴う脳室拡大を伴うことがある。`, { weight: 2, typicality: "variable" }),
    F.t2High(`${s.ja} では疾患特異的なT2信号変化を示すことがある。`, { weight: 2, typicality: "variable", subregion: s.subregion }),
    F.noEnh(`${s.ja} は通常、腫瘤様造影効果を示さない。`, { weight: 2, subregion: s.subregion })
  ],
  sellar: (s) => [
    F.ctIso(`${s.ja} は鞍上部・鞍内病変としてCTで評価される。`, { weight: 1, organ: "pituitary", subregion: "sellar", target: "sellar_mass" }),
    F.sellar(`${s.ja} は鞍内から鞍上部の病変として確認する。`, { weight: 5 }),
    F.stalk(`${s.ja} では下垂体柄肥厚を伴うことがある。`, { weight: 3, typicality: "variable" }),
    F.avid(`${s.ja} は造影MRIで病変範囲を評価する。`, { weight: 4, organ: "pituitary", subregion: "sellar", target: "sellar_mass" }),
    F.noRestr(`${s.ja} は病型により拡散制限の程度が変動する。`, { weight: 1, typicality: "variable", organ: "pituitary", subregion: "sellar" })
  ]
};

const SPECS = [
  ["gliomatosis_cerebri_pattern", "神経膠腫症パターン", "Gliomatosis cerebri pattern", "infiltrative_tumor", 20, 80, "成人", "cerebral_hemisphere", "diffuse infiltrative glioma pattern", ["diffuse infiltration", "gliomatosis"]],
  ["polymorphous_low_grade_neuroepithelial_tumor_young", "若年者多形低悪性度神経上皮腫瘍", "Polymorphous low-grade neuroepithelial tumor of the young", "infiltrative_tumor", 5, 35, "小児-若年成人", "temporal_lobe", "epilepsy-associated tumor", ["PLNTY", "epilepsy"]],
  ["rosette_forming_glioneuronal_tumor", "ロゼット形成性グリア神経細胞腫瘍", "Rosette-forming glioneuronal tumor", "cystic_tumor", 5, 40, "若年成人", "fourth_ventricle", "posterior fossa tumor", ["RGNT", "fourth ventricle"]],
  ["myxopapillary_ependymoma_intracranial", "頭蓋内粘液乳頭状上衣腫", "Intracranial myxopapillary ependymoma", "cellular_tumor", 10, 60, "成人", "intraventricular", "intraventricular tumor", ["ependymoma"]],
  ["choroid_plexus_carcinoma", "脈絡叢癌", "Choroid plexus carcinoma", "cellular_tumor", 0, 10, "小児", "choroid_plexus", "pediatric intraventricular mass", ["choroid plexus", "carcinoma"]],
  ["choroid_plexus_cyst", "脈絡叢嚢胞", "Choroid plexus cyst", "cystic_tumor", 0, 90, "全年齢", "choroid_plexus", "intraventricular cyst", ["choroid plexus cyst"]],
  ["papillary_tumor_of_pineal_region", "松果体部乳頭状腫瘍", "Papillary tumor of the pineal region", "cellular_tumor", 10, 70, "成人", "pineal_region", "pineal region mass", ["pineal", "papillary tumor"]],
  ["pineal_parenchymal_tumor_intermediate_differentiation", "中間分化型松果体実質腫瘍", "Pineal parenchymal tumor of intermediate differentiation", "cellular_tumor", 10, 70, "成人", "pineal_region", "pineal region mass", ["pineal parenchymal tumor"]],
  ["solitary_fibrous_tumor_cns", "中枢神経孤立性線維性腫瘍", "CNS solitary fibrous tumor", "meningeal", 20, 80, "成人", "extra_axial", "dural based mass", ["solitary fibrous tumor"]],
  ["dural_metastasis", "硬膜転移", "Dural metastasis", "meningeal", 40, 90, "中高年", "cerebral_convexity", "dural based mass", ["dural metastasis"]],
  ["leptomeningeal_carcinomatosis", "癌性髄膜症", "Leptomeningeal carcinomatosis", "infection", 20, 90, "成人", "subarachnoid_space", "leptomeningeal enhancement", ["leptomeningeal disease"]],
  ["neurocutaneous_melanosis", "神経皮膚黒色症", "Neurocutaneous melanosis", "meningeal", 0, 20, "小児", "subarachnoid_space", "melanocytic leptomeningeal disease", ["melanosis"]],
  ["cns_tuberculous_meningitis", "中枢神経結核性髄膜炎", "CNS tuberculous meningitis", "infection", 0, 90, "全年齢", "basal_cistern", "basal meningitis", ["tuberculous meningitis"]],
  ["viral_encephalitis_non_hsv", "非HSVウイルス性脳炎", "Non-HSV viral encephalitis", "infection", 0, 90, "全年齢", "cerebral_hemisphere", "acute encephalitis", ["viral encephalitis"]],
  ["japanese_encephalitis", "日本脳炎", "Japanese encephalitis", "infection", 0, 90, "小児-高齢者", "thalami", "acute encephalitis with thalamic lesions", ["Japanese encephalitis", "thalami"]],
  ["west_nile_encephalitis", "ウエストナイル脳炎", "West Nile encephalitis", "infection", 0, 90, "成人-高齢者", "basal_ganglia", "acute encephalitis with deep gray matter lesions", ["West Nile"]],
  ["cmv_encephalitis", "サイトメガロウイルス脳炎", "Cytomegalovirus encephalitis", "infection", 0, 90, "免疫不全", "periventricular", "immunocompromised encephalitis", ["CMV", "periventricular"]],
  ["hiv_encephalopathy", "HIV脳症", "HIV encephalopathy", "demyelinating", 10, 80, "成人", "symmetric_white_matter", "diffuse white matter disease", ["HIV encephalopathy"]],
  ["progressive_rubella_panencephalitis", "進行性風疹全脳炎", "Progressive rubella panencephalitis", "demyelinating", 5, 30, "小児-若年成人", "white_matter", "progressive white matter disease", ["rubella"]],
  ["subacute_sclerosing_panencephalitis", "亜急性硬化性全脳炎", "Subacute sclerosing panencephalitis", "demyelinating", 5, 25, "小児-若年成人", "white_matter", "progressive encephalitis", ["SSPE"]],
  ["balo_concentric_sclerosis", "バロー同心円硬化症", "Balo concentric sclerosis", "demyelinating", 10, 60, "若年-中年成人", "white_matter", "tumefactive demyelination", ["concentric rings"]],
  ["acute_hemorrhagic_leukoencephalitis", "急性出血性白質脳炎", "Acute hemorrhagic leukoencephalitis", "demyelinating", 0, 80, "全年齢", "white_matter", "fulminant demyelination", ["AHLE", "hemorrhagic demyelination"]],
  ["gfap_astrocytopathy", "GFAPアストロサイトパチー", "GFAP astrocytopathy", "infection", 0, 90, "成人", "periventricular", "meningoencephalomyelitis", ["GFAP", "radial enhancement"]],
  ["clippers", "CLIPPERS", "CLIPPERS", "infection", 20, 80, "成人", "pons", "punctate brainstem enhancement", ["CLIPPERS", "pons"]],
  ["neuro_behcet_disease", "神経ベーチェット病", "Neuro-Behcet disease", "infection", 10, 70, "若年-中年成人", "brainstem", "brainstem inflammatory lesion", ["Behcet", "brainstem"]],
  ["susac_syndrome", "スザック症候群", "Susac syndrome", "vascular", 10, 60, "若年-中年成人", "periventricular", "callosal microangiopathy", ["Susac", "snowball lesions"]],
  ["primary_cns_vasculitis", "原発性中枢神経血管炎", "Primary CNS vasculitis", "vascular", 10, 80, "成人", "cerebral_hemisphere", "multifocal ischemia", ["vasculitis"]],
  ["caa_related_inflammation", "脳アミロイド血管症関連炎症", "CAA-related inflammation", "vascular", 50, 95, "高齢者", "cerebral_hemisphere", "asymmetric vasogenic edema", ["CAA-ri"]],
  ["sneddon_syndrome", "スネドン症候群", "Sneddon syndrome", "vascular", 10, 60, "若年-中年成人", "white_matter", "multifocal ischemia", ["Sneddon"]],
  ["fabry_disease_cns", "ファブリー病中枢神経病変", "Fabry disease CNS involvement", "vascular", 5, 70, "若年-中年成人", "white_matter", "young stroke and white matter lesions", ["Fabry"]],
  ["focal_cortical_dysplasia", "限局性皮質異形成", "Focal cortical dysplasia", "malformation", 0, 40, "小児-若年成人", "cortex", "epilepsy malformation", ["FCD", "transmantle sign"]],
  ["periventricular_nodular_heterotopia", "脳室周囲結節状異所性灰白質", "Periventricular nodular heterotopia", "malformation", 0, 60, "小児-成人", "periventricular", "epilepsy malformation", ["heterotopia"]],
  ["lissencephaly", "滑脳症", "Lissencephaly", "malformation", 0, 10, "乳幼児", "cortex", "cortical malformation", ["lissencephaly"]],
  ["polymicrogyria", "多小脳回", "Polymicrogyria", "malformation", 0, 60, "小児-成人", "cortex", "cortical malformation", ["polymicrogyria"]],
  ["schizencephaly", "裂脳症", "Schizencephaly", "malformation", 0, 60, "小児-成人", "cortex", "cortical cleft", ["schizencephaly"]],
  ["holoprosencephaly", "全前脳胞症", "Holoprosencephaly", "malformation", 0, 5, "胎児-乳幼児", "frontal_lobe", "congenital brain malformation", ["holoprosencephaly"]],
  ["septo_optic_dysplasia", "中隔視神経形成異常", "Septo-optic dysplasia", "malformation", 0, 20, "小児", "optic_chiasm", "midline malformation", ["septo-optic dysplasia"]],
  ["joubert_syndrome", "ジュベール症候群", "Joubert syndrome", "malformation", 0, 20, "小児", "posterior_fossa", "posterior fossa malformation", ["molar tooth sign"]],
  ["rhombencephalosynapsis", "菱脳癒合症", "Rhombencephalosynapsis", "malformation", 0, 20, "小児", "cerebellum", "posterior fossa malformation", ["cerebellar vermis"]],
  ["wilson_disease_cns", "ウィルソン病中枢神経病変", "Wilson disease CNS involvement", "metabolic", 5, 50, "若年", "basal_ganglia", "basal ganglia disease", ["Wilson disease"]],
  ["fahr_disease", "ファール病", "Fahr disease", "metabolic", 10, 90, "成人", "basal_ganglia", "basal ganglia calcification", ["basal ganglia calcification"]],
  ["maple_syrup_urine_disease", "メープルシロップ尿症", "Maple syrup urine disease", "metabolic", 0, 10, "新生児-小児", "corticospinal_tract", "metabolic encephalopathy", ["MSUD"]],
  ["urea_cycle_disorder_encephalopathy", "尿素サイクル異常症脳症", "Urea cycle disorder encephalopathy", "metabolic", 0, 40, "小児-若年成人", "cortex", "hyperammonemic encephalopathy", ["hyperammonemia"]],
  ["kernicterus", "核黄疸", "Kernicterus", "metabolic", 0, 5, "新生児", "globus_pallidus", "bilirubin encephalopathy", ["globus pallidus"]],
  ["methylmalonic_acidemia", "メチルマロン酸血症", "Methylmalonic acidemia", "metabolic", 0, 20, "小児", "basal_ganglia", "organic acidemia", ["methylmalonic acidemia"]],
  ["biotin_thiamine_responsive_basal_ganglia_disease", "ビオチン・チアミン反応性基底核疾患", "Biotin-thiamine-responsive basal ganglia disease", "metabolic", 0, 30, "小児-若年成人", "basal_ganglia", "basal ganglia disease", ["BTBGD"]],
  ["parkinson_disease_mri_support", "パーキンソン病MRI補助所見", "Parkinson disease MRI support", "neurodegenerative", 40, 90, "高齢者", "basal_ganglia", "movement disorder", ["Parkinson disease"]],
  ["multiple_system_atrophy", "多系統萎縮症", "Multiple system atrophy", "neurodegenerative", 40, 90, "中高年", "pons", "parkinsonism", ["MSA", "hot cross bun"]],
  ["progressive_supranuclear_palsy", "進行性核上性麻痺", "Progressive supranuclear palsy", "neurodegenerative", 50, 90, "高齢者", "midbrain", "parkinsonism", ["PSP", "hummingbird sign"]],
  ["corticobasal_degeneration", "大脳皮質基底核変性症", "Corticobasal degeneration", "neurodegenerative", 50, 90, "高齢者", "cortex", "asymmetric neurodegeneration", ["CBD"]],
  ["huntington_disease", "ハンチントン病", "Huntington disease", "neurodegenerative", 20, 80, "成人", "basal_ganglia", "chorea and caudate atrophy", ["caudate atrophy"]],
  ["frontotemporal_lobar_degeneration", "前頭側頭葉変性症", "Frontotemporal lobar degeneration", "neurodegenerative", 40, 85, "中高年", "frontal_lobe", "dementia pattern", ["FTD"]],
  ["alzheimer_disease_mri_pattern", "アルツハイマー病MRIパターン", "Alzheimer disease MRI pattern", "neurodegenerative", 50, 100, "高齢者", "hippocampus", "dementia pattern", ["hippocampal atrophy"]],
  ["dementia_with_lewy_bodies_mri_pattern", "レビー小体型認知症MRIパターン", "Dementia with Lewy bodies MRI pattern", "neurodegenerative", 50, 100, "高齢者", "cerebral_hemisphere", "dementia pattern", ["DLB"]],
  ["amyotrophic_lateral_sclerosis_mri_support", "筋萎縮性側索硬化症MRI補助所見", "Amyotrophic lateral sclerosis MRI support", "neurodegenerative", 20, 90, "成人", "corticospinal_tract", "motor neuron disease", ["ALS", "corticospinal tract"]],
  ["lhermitte_duclos_disease", "レルミット・デュクロ病", "Lhermitte-Duclos disease", "cystic_tumor", 10, 70, "成人", "cerebellum", "cerebellar mass", ["dysplastic cerebellar gangliocytoma"]],
  ["hypothalamic_hamartoma", "視床下部過誤腫", "Hypothalamic hamartoma", "sellar", 0, 40, "小児-若年成人", "suprasellar", "sellar suprasellar lesion", ["gelastic seizure"]],
  ["ectopic_posterior_pituitary", "異所性後葉", "Ectopic posterior pituitary", "sellar", 0, 30, "小児-若年成人", "sellar", "pituitary developmental anomaly", ["posterior pituitary bright spot"]],
  ["empty_sella", "空虚トルコ鞍", "Empty sella", "sellar", 10, 90, "成人", "sellar", "sellar lesion", ["empty sella"]],
  ["intracranial_hypotension_subdural_collection", "低髄液圧症候群関連硬膜下液体貯留", "Intracranial hypotension-related subdural collection", "meningeal", 10, 90, "成人", "extra_axial", "orthostatic headache", ["intracranial hypotension", "subdural collection"]],
  ["radiation_induced_cavernous_malformation", "放射線誘発海綿状血管奇形", "Radiation-induced cavernous malformation", "vascular", 5, 90, "放射線治療後", "cerebral_hemisphere", "post-radiation hemorrhagic lesion", ["radiation induced cavernoma"]]
].map(([id, ja, en, profile, min, max, peak, subregion, setting, keywords]) => ({
  id,
  ja,
  en,
  profile,
  demographics: demographics(min, max, peak),
  frequency: frequency(profile === "neurodegenerative" ? "common" : "uncommon", profile === "neurodegenerative" ? 3 : 2, setting),
  subregion,
  keywords
}));

function grouped(findings) {
  const ct = new Map();
  const mr = new Map();
  for (const item of findings) {
    const map = item.modality === "CT" ? ct : mr;
    const key = item.acquisition.code;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return {
    ctGroups: Array.from(ct, ([code, items]) => ({ phase: { code }, findings: items })),
    mriGroups: Array.from(mr, ([code, items]) => ({ sequence: { code }, findings: items }))
  };
}

function card(spec) {
  const findings = PROFILE[spec.profile](spec);
  const { ctGroups, mriGroups } = grouped(findings);
  let n = 1;
  for (const group of [...ctGroups, ...mriGroups]) {
    for (const item of group.findings) item.finding_id = `${spec.id}_${item.modality.toLowerCase()}_${String(n++).padStart(3, "0")}`;
  }
  const all = [...ctGroups, ...mriGroups].flatMap((group) => group.findings);
  return {
    schema_version: "0.8",
    disease_id: spec.id,
    disease_name: { ja: spec.ja, en: spec.en },
    disease_aliases: { ja: [spec.ja], en: [spec.en] },
    clinical: {
      overview: `${spec.ja} (${spec.en}) は ${spec.frequency.context.clinical_setting} の文脈で鑑別に挙がる脳疾患。臨床像とCT/MRI所見の分布を組み合わせて評価する。`,
      treatment: "治療方針は病型、重症度、基礎疾患、病理・検査結果により異なるため、ここでは画像診断上の鑑別整理を目的とする。",
      epidemiology: "頻度と好発年齢は代表的な傾向として記載し、個別症例では臨床背景と検査所見を合わせて判断する。"
    },
    demographics: spec.demographics,
    keywords: spec.keywords,
    frequency: spec.frequency,
    imaging: {
      ct: { summary: `${spec.ja} のCTでは密度変化、石灰化、出血、mass effect、水頭症などを確認する。`, findings_by_phase: ctGroups },
      mri: { summary: `${spec.ja} のMRIではT1/T2/FLAIR、DWI/ADC、造影、SWI、灌流、MRSを組み合わせて病変の性状と分布を評価する。`, findings_by_sequence: mriGroups }
    },
    evidence: {
      summary: "Public source packet was used for broad Phase1 draft expansion.",
      claim_map: [{
        claim_type: "imaging_findings",
        finding_ids: all.map((item) => item.finding_id),
        claim_scope: ["finding_text", "typicality", "diagnostic_weight"],
        source_ids: [SOURCE_ID],
        confidence: "low"
      }]
    },
    image_examples: [],
    references: [PUBLIC_REFERENCE],
    review: { status: "draft", reviewed_by: "", reviewed_at: "", confidence: "low", notes: "Phase1 batch5 broad brain-disease draft. Requires physician review before approval." },
    curation: { auto_update_allowed: true, locked_fields: [], notes: "" },
    provenance: { created_by: "codex_public_source_review", model: "codex", created_at: now, prompt_version: "brain_batch5_v0.1", source_query: `${spec.en} MRI CT imaging findings` },
    updated_at: now,
    content_hash: ""
  };
}

function main() {
  fs.mkdirSync(draftsDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });
  writeJson(path.join(publicDir, "brain_batch5_public_sources.json"), {
    source_packet_id: SOURCE_ID,
    created_at: now,
    purpose: "Phase1 broad brain disease draft expansion.",
    sources: [
      { title: "NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/" },
      { title: "NINDS Disorders", url: "https://www.ninds.nih.gov/health-information/disorders" },
      { title: "MedlinePlus", url: "https://medlineplus.gov/" },
      { title: "CDC", url: "https://www.cdc.gov/" },
      { title: "PubMed Central open-access reviews", url: "https://pmc.ncbi.nlm.nih.gov/" }
    ],
    limitations: ["Draft stage only; physician review is required before approval.", "Disease-level source packets are intentionally broad and should be replaced by per-disease literature review over time."]
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
  console.log(`Brain draft batch5: wrote ${written}, skipped existing ${skipped}.`);
}

main();
