const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DRAFT_DIR = path.join(ROOT, "data", "drafts");
const PUBLIC_SOURCE_ID = "public_modality_review_20260625";

const PUBLIC_REFERENCE = {
  source_id: PUBLIC_SOURCE_ID,
  type: "public_web_source_packet",
  title: "Non-PubMed public source packet for modality-level neuroradiology draft enrichment",
  authors: [],
  journal: "",
  year: "2026",
  url: "https://www.ncbi.nlm.nih.gov/books/",
  license: "public web source index; includes NCBI Bookshelf/StatPearls, NIH/NINDS, MedlinePlus, CDC pages, and open-access PMC reviews where applicable"
};

const SOURCE_NOTE =
  "PubMed以外の公開ソース（NCBI Bookshelf/StatPearls、NIH/NINDS、MedlinePlus、CDC、PMC open-access review等）を参照し、各モダリティでの見え方をdraft所見として補強。";

function baseAnatomy(subregion = "brain", laterality = "unknown") {
  return { body_region: "brain", organ: "brain", subregion, laterality };
}

function finding(acquisitionCode, findingCode, findingText, options = {}) {
  const modality = options.modality || (options.phase ? "CT" : "MRI");
  return {
    finding_code: findingCode,
    modality,
    acquisition: {
      type: modality === "CT" ? "phase" : "sequence",
      code: acquisitionCode
    },
    anatomy: options.anatomy || baseAnatomy(options.subregion),
    target: options.target || "lesion",
    modifiers: options.modifiers || {},
    finding_text: findingText,
    typicality: options.typicality || "common",
    diagnostic_weight: options.weight ?? 3,
    review_status: "draft",
    keywords: options.keywords || []
  };
}

const F = {
  ctHypo: (text, opt) => finding("non_contrast", "finding:ct_hypoattenuation", text, { ...opt, modality: "CT" }),
  ctMildHypo: (text, opt) => finding("non_contrast", "finding:ct_mild_hypoattenuation", text, { ...opt, modality: "CT" }),
  ctHyper: (text, opt) => finding("non_contrast", "finding:ct_hyperattenuation", text, { ...opt, modality: "CT" }),
  ctMildHyper: (text, opt) => finding("non_contrast", "finding:ct_mild_hyperattenuation", text, { ...opt, modality: "CT" }),
  ctIso: (text, opt) => finding("non_contrast", "finding:ct_isoattenuation", text, { ...opt, modality: "CT" }),
  ctFat: (text, opt) => finding("non_contrast", "finding:ct_fat_attenuation", text, { ...opt, modality: "CT" }),
  calc: (text, opt) => finding("non_contrast", "finding:calcification_present", text, { ...opt, modality: "CT" }),
  t1Low: (text, opt) => finding("T1WI", "finding:t1_hypointensity", text, opt),
  t1High: (text, opt) => finding("T1WI", "finding:t1_hyperintensity", text, opt),
  t1Iso: (text, opt) => finding("T1WI", "finding:t1_isointensity", text, opt),
  t2High: (text, opt) => finding("T2WI", "finding:t2_hyperintensity", text, opt),
  t2Low: (text, opt) => finding("T2WI", "finding:t2_hypointensity", text, opt),
  t2Iso: (text, opt) => finding("T2WI", "finding:t2_isointensity", text, opt),
  flairHigh: (text, opt) => finding("FLAIR", "finding:flair_hyperintensity", text, opt),
  flairSupp: (text, opt) => finding("FLAIR", "finding:flair_suppression", text, opt),
  dwiHigh: (text, opt) => finding("DWI", "finding:dwi_hyperintensity", text, opt),
  dwiIso: (text, opt) => finding("DWI", "finding:dwi_isointensity", text, opt),
  adcLow: (text, opt) => finding("ADC", "finding:adc_low", text, opt),
  adcHigh: (text, opt) => finding("ADC", "finding:adc_high", text, opt),
  restr: (text, opt) => finding("DWI", "finding:diffusion_restriction_present", text, opt),
  noRestr: (text, opt) => finding("DWI", "finding:diffusion_restriction_absent", text, opt),
  centralRestr: (text, opt) => finding("DWI", "finding:central_diffusion_restriction", text, opt),
  vascularRestr: (text, opt) => finding("DWI", "finding:vascular_territory_restricted_diffusion", text, opt),
  edema: (text, opt) => finding("FLAIR", "finding:vasogenic_edema", text, opt),
  ring: (text, opt) => finding("contrast_enhanced_T1WI", "finding:ring_enhancement", text, opt),
  thickRing: (text, opt) => finding("contrast_enhanced_T1WI", "finding:thick_irregular_ring_enhancement", text, opt),
  thinRing: (text, opt) => finding("contrast_enhanced_T1WI", "finding:thin_regular_ring_enhancement", text, opt),
  openRing: (text, opt) => finding("contrast_enhanced_T1WI", "finding:open_ring_enhancement", text, opt),
  avid: (text, opt) => finding("contrast_enhanced_T1WI", "finding:avid_homogeneous_enhancement", text, opt),
  noEnh: (text, opt) => finding("contrast_enhanced_T1WI", "finding:enhancement_absent", text, opt),
  mildEnh: (text, opt) => finding("contrast_enhanced_T1WI", "finding:mild_enhancement", text, opt),
  solidEnh: (text, opt) => finding("contrast_enhanced_T1WI", "finding:enhancing_solid_component", text, opt),
  csf: (text, opt) => finding("T2WI", "finding:csf_like_signal", text, opt),
  hydro: (text, opt) => finding("T2WI", "finding:hydrocephalus", text, opt),
  ventricles: (text, opt) => finding("T2WI", "finding:ventriculomegaly", text, opt),
  mass: (text, opt) => finding("T2WI", "finding:mass_effect", text, opt),
  shift: (text, opt) => finding("T2WI", "finding:midline_shift", text, opt),
  blooming: (text, opt) => finding("SWI", "finding:susceptibility_blooming", text, opt),
  flow: (text, opt) => finding("MRA_TOF", "finding:flow_void", text, opt),
  stenosis: (text, opt) => finding("MRA_TOF", "finding:arterial_stenosis_or_occlusion", text, opt),
  nidus: (text, opt) => finding("MRA_TOF", "finding:vascular_nidus", text, opt),
  sinus: (text, opt) => finding("MRV", "finding:venous_sinus_thrombosis", text, opt),
  delta: (text, opt) => finding("contrast_enhanced_T1WI", "finding:empty_delta_sign", text, opt),
  hyperperfusion: (text, opt) => finding("ASL", "finding:hyperperfusion", text, opt),
  hypoperfusion: (text, opt) => finding("ASL", "finding:hypoperfusion", text, opt),
  cbvHigh: (text, opt) => finding("DSC_perfusion", "finding:elevated_cbv", text, opt),
  cbvLow: (text, opt) => finding("DSC_perfusion", "finding:reduced_cbv", text, opt),
  choline: (text, opt) => finding("MRS", "finding:elevated_choline_peak", text, opt),
  lactate: (text, opt) => finding("MRS", "finding:lactate_peak", text, opt),
  lipid: (text, opt) => finding("MRS", "finding:lipid_peak", text, opt),
  whiteMatter: (text, opt) => finding("FLAIR", "finding:bilateral_symmetric_white_matter_lesions", text, opt),
  periventricular: (text, opt) => finding("FLAIR", "finding:periventricular_ovoid_lesions", text, opt),
  basalGanglia: (text, opt) => finding("FLAIR", "finding:basal_ganglia_involvement", text, opt),
  callosal: (text, opt) => finding("FLAIR", "finding:callosal_lesion", text, opt),
  cortical: (text, opt) => finding("FLAIR", "finding:cortical_subcortical_lesion", text, opt),
  sellar: (text, opt) => finding("contrast_enhanced_T1WI", "finding:sellar_suprasellar_mass", text, opt),
  stalk: (text, opt) => finding("contrast_enhanced_T1WI", "finding:pituitary_stalk_thickening", text, opt),
  clivus: (text, opt) => finding("non_contrast", "finding:clival_bone_destruction", text, { ...opt, modality: "CT" }),
  iac: (text, opt) => finding("contrast_enhanced_T1WI", "finding:internal_auditory_canal_extension", text, opt),
  mural: (text, opt) => finding("contrast_enhanced_T1WI", "finding:cyst_with_enhancing_mural_nodule", text, opt),
  subependymal: (text, opt) => finding("T2WI", "finding:subependymal_nodule", text, opt),
  pachy: (text, opt) => finding("contrast_enhanced_T1WI", "finding:pachymeningeal_enhancement", text, opt),
  lepto: (text, opt) => finding("contrast_enhanced_T1WI", "finding:leptomeningeal_enhancement", text, opt),
  fat: (text, opt) => finding("T1WI", "finding:fat_present", text, opt),
  fatSuppress: (text, opt) => finding("T1WI_fat_suppressed", "finding:fat_suppression_signal_drop", text, opt),
  laminar: (text, opt) => finding("FLAIR", "finding:cortical_laminar_necrosis", text, opt)
};

const T = {
  infiltrativeGlioma(name) {
    return {
      ctSummary: `${name}はCTで低吸収〜等吸収の浸潤性病変として見えることがあり、石灰化や腫瘤効果を確認する。`,
      mriSummary: `${name}はT1低信号、T2/FLAIR高信号の浸潤性腫瘍として評価し、造影、拡散、灌流、MRSで悪性度を推定する。`,
      findings: [
        F.ctMildHypo("CTでは低吸収〜等吸収の浸潤性腫瘤として描出されることがある。", { weight: 2 }),
        F.t1Low("T1WIでは腫瘍実質が低信号を示すことが多い。", { weight: 2 }),
        F.t2High("T2WIでは浸潤範囲が高信号として広がる。", { weight: 3 }),
        F.flairHigh("FLAIRでは腫瘍浸潤と浮腫が高信号として目立つ。", { weight: 3 }),
        F.noRestr("低悪性度成分では強い拡散制限を欠くことが多い。", { weight: 1, typicality: "variable" }),
        F.choline("MRSではコリン上昇が腫瘍性病変の補助所見になる。", { weight: 2 })
      ]
    };
  },
  highGradeTumor(name) {
    return {
      ctSummary: `${name}はCTで低吸収〜不均一腫瘤、壊死、出血、浮腫、腫瘤効果を確認する。`,
      mriSummary: `${name}は不均一造影、壊死、T2/FLAIR高信号浮腫、拡散制限、灌流上昇を組み合わせて評価する。`,
      findings: [
        F.ctMildHypo("CTでは不均一な低吸収腫瘤と周囲浮腫を示すことがある。", { weight: 2 }),
        F.t1Low("T1WIでは壊死部を含む不均一低信号腫瘤として見える。", { weight: 2 }),
        F.t2High("T2WIでは腫瘍と浮腫が高信号として広がる。", { weight: 3 }),
        F.flairHigh("FLAIRでは浸潤性高信号と浮腫が目立つ。", { weight: 3 }),
        F.thickRing("造影T1WIでは厚く不整なリング状または不均一造影を示すことが多い。", { weight: 4, keywords: ["irregular ring enhancement"] }),
        F.restr("高細胞性成分で拡散制限を伴うことがある。", { weight: 2, typicality: "variable" }),
        F.cbvHigh("灌流MRIでは高悪性度腫瘍成分でCBV上昇を示しやすい。", { weight: 3 }),
        F.choline("MRSではコリン上昇が腫瘍性病変を支持する。", { weight: 2 }),
        F.lipid("壊死を伴う高悪性度腫瘍では脂質/乳酸ピークが参考になる。", { weight: 2, typicality: "variable" })
      ]
    };
  },
  ringInfection(name) {
    return {
      ctSummary: `${name}はCTで低吸収病変、周囲浮腫、造影でリング状増強として確認されることがある。`,
      mriSummary: `${name}はT2/FLAIR高信号、リング状造影、DWI/ADCでの拡散制限、MRSの乳酸ピークを評価する。`,
      findings: [
        F.ctHypo("CTでは低吸収病変と周囲浮腫として認識されることがある。", { weight: 2 }),
        F.t2High("T2WIでは病変中心や周囲浮腫が高信号を示す。", { weight: 2 }),
        F.flairHigh("FLAIRでは病変周囲浮腫や炎症性変化が高信号となる。", { weight: 2 }),
        F.ring("造影T1WIでリング状造影を示すことがある。", { weight: 4 }),
        F.centralRestr("膿瘍性病変では中心部拡散制限が重要な鑑別所見になる。", { weight: 5 }),
        F.adcLow("DWI高信号部に対応してADC低値を示す場合、粘稠な膿や高細胞性内容を示唆する。", { weight: 4 }),
        F.lactate("MRSでは乳酸ピークが感染性/壊死性病変の補助所見になる。", { weight: 2 })
      ]
    };
  },
  csfCyst(name) {
    return {
      ctSummary: `${name}はCTで髄液様低吸収の嚢胞性病変として確認する。`,
      mriSummary: `${name}はT1低信号、T2高信号、FLAIR抑制、拡散制限なし、造影効果なしを確認する。`,
      findings: [
        F.ctHypo("CTでは髄液に近い低吸収を示す。", { weight: 3 }),
        F.csf("T2WIでは髄液様高信号を示す。", { weight: 4 }),
        F.t1Low("T1WIでは髄液様低信号を示す。", { weight: 3 }),
        F.flairSupp("FLAIRでは髄液と同様に信号抑制される。", { weight: 4 }),
        F.noRestr("DWI/ADCでは通常、拡散制限を示さない。", { weight: 4 }),
        F.noEnh("造影効果を欠くことが多い。", { weight: 3 })
      ]
    };
  },
  leukodystrophy(name) {
    return {
      ctSummary: `${name}はCTで白質低吸収や萎縮を確認するが、病変分布評価はMRIが中心になる。`,
      mriSummary: `${name}はT2/FLAIR高信号の白質病変分布、左右対称性、脳梁/基底核/造影縁を評価する。`,
      findings: [
        F.ctMildHypo("CTでは白質低吸収として認識されることがある。", { weight: 1 }),
        F.whiteMatter("T2/FLAIRで両側対称性白質高信号を示す。", { weight: 4 }),
        F.t1Low("T1WIでは進行した白質病変が低信号を示すことがある。", { weight: 2 }),
        F.noEnh("非活動性病変では造影効果を欠くことが多い。", { weight: 1, typicality: "variable" }),
        F.restr("活動性病変や急性期では辺縁や病変部に拡散制限を伴うことがある。", { weight: 2, typicality: "variable" })
      ]
    };
  },
  hemorrhage(name) {
    return {
      ctSummary: `${name}はCTで高吸収血腫、周囲浮腫、mass effectを迅速に評価する。`,
      mriSummary: `${name}はT1/T2信号の時相変化とSWI/T2*のbloomingで血液成分を確認する。`,
      findings: [
        F.ctHyper("急性期CTでは高吸収の出血として見える。", { weight: 5 }),
        F.blooming("SWI/T2*で磁化率低信号/bloomingを示す。", { weight: 5 }),
        F.t1High("亜急性期血腫ではT1高信号を示すことがある。", { weight: 3, typicality: "variable" }),
        F.edema("周囲浮腫を伴うことがある。", { weight: 2 }),
        F.mass("大きい血腫ではmass effectを伴う。", { weight: 3 })
      ]
    };
  },
  vascular(name) {
    return {
      ctSummary: `${name}はCTで出血、石灰化、拡張血管、周囲浮腫を確認し、CTA/DSAやMRIで血管構造を評価する。`,
      mriSummary: `${name}はflow void、SWI/T2*の出血/静脈性変化、MRA/MRVの血管異常を評価する。`,
      findings: [
        F.flow("T1/T2で血管flow voidを認めることがある。", { weight: 4 }),
        F.nidus("MRA/CTAで異常血管nidusや短絡血管を認める。", { weight: 5 }),
        F.blooming("SWI/T2*で出血や静脈性うっ滞に伴うbloomingを認めることがある。", { weight: 3 }),
        F.ctHyper("出血を伴う場合、CTで高吸収を示す。", { weight: 2, typicality: "variable" })
      ]
    };
  }
};

const ENRICHMENTS = {
  acute_ischemic_stroke: {
    ctSummary: "急性期CTでは出血除外と早期虚血変化（皮髄境界不明瞭化、低吸収、血管内高吸収）を確認する。",
    mriSummary: "MRIではDWI高信号とADC低値の組み合わせが急性虚血を強く支持し、FLAIR変化やMRA閉塞を時相評価に使う。",
    findings: [
      F.ctMildHypo("非造影CTでは早期虚血変化として軽度低吸収や皮髄境界不明瞭化を示すことがある。", { weight: 3, keywords: ["early ischemic change"] }),
      F.vascularRestr("DWIでは血管支配域に沿う高信号/拡散制限を示す。", { weight: 5 }),
      F.adcLow("ADC mapで低値を示すことで真の拡散制限を支持する。", { weight: 5 }),
      F.flairHigh("発症から時間が経つとFLAIR高信号が明瞭化する。", { weight: 3 }),
      F.stenosis("MRA/CTAで責任血管の閉塞または高度狭窄を認めることがある。", { weight: 4 })
    ]
  },
  brain_abscess: T.ringInfection("脳膿瘍"),
  glioblastoma: T.highGradeTumor("膠芽腫"),
  brain_metastasis: {
    ...T.highGradeTumor("脳転移"),
    mriSummary: "脳転移は灰白質白質境界に多発しやすく、造影効果、周囲血管原性浮腫、DWI/灌流所見を組み合わせて評価する。"
  },
  primary_central_nervous_system_lymphoma: {
    ctSummary: "PCNSLはCTで等〜高吸収の深部腫瘤として見えることがあり、造影で均一増強を示しやすい。",
    mriSummary: "PCNSLはT2等〜低信号寄り、強い均一造影、著明な拡散制限、低〜中等度浮腫が重要。",
    findings: [
      F.ctMildHyper("CTでは等〜軽度高吸収の腫瘤として見えることがある。", { weight: 3 }),
      F.t2Low("T2WIでは高細胞性を反映して等〜低信号寄りに見えることがある。", { weight: 3 }),
      F.avid("造影T1WIでは強い均一造影を示すことが多い。", { weight: 5 }),
      F.restr("高細胞性を反映してDWI高信号/ADC低値を示しやすい。", { weight: 5 }),
      F.adcLow("ADC低値はPCNSLを支持する重要所見。", { weight: 5 }),
      F.cbvLow("灌流では高悪性度神経膠腫ほどCBVが高くならないことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  tumefactive_demyelinating_lesion: {
    ctSummary: "腫瘤様脱髄はCTで低吸収腫瘤様病変として見えることがある。",
    mriSummary: "MRIではT2/FLAIR高信号、open-ring enhancement、辺縁拡散制限、腫瘤効果が腫瘍との鑑別に重要。",
    findings: [
      F.ctHypo("CTでは低吸収の腫瘤様病変として見えることがある。", { weight: 2 }),
      F.flairHigh("FLAIRで大きな白質〜皮質下高信号病変を示す。", { weight: 4 }),
      F.openRing("造影T1WIでopen-ring enhancementを示すことがある。", { weight: 5 }),
      F.restr("辺縁優位の拡散制限を伴うことがある。", { weight: 3, typicality: "variable" }),
      F.mass("2cmを超える病変ではmass effectを伴うことがある。", { weight: 2 })
    ]
  },
  multiple_sclerosis: {
    ctSummary: "多発性硬化症の病変評価はMRIが中心で、CTでは目立たないことが多い。",
    mriSummary: "MRIでは脳室周囲、脳梁、皮質下、テント下のT2/FLAIR高信号病変と活動性造影を評価する。",
    findings: [
      F.periventricular("FLAIRで脳室周囲卵円形白質病変を認める。", { weight: 5, keywords: ["Dawson fingers"] }),
      F.callosal("脳梁病変は脱髄性疾患を支持する。", { weight: 4 }),
      F.flairHigh("T2/FLAIR高信号病変が時間的・空間的多発性を示す。", { weight: 4 }),
      F.openRing("活動性脱髄病変ではopen-ring enhancementを示すことがある。", { weight: 3, typicality: "variable" })
    ]
  },
  acute_disseminated_encephalomyelitis: {
    ctSummary: "ADEMはCTで低吸収白質病変として見えることがあるがMRIが中心。",
    mriSummary: "MRIでは多発性・非対称性のT2/FLAIR高信号病変、深部灰白質病変、可変的造影を評価する。",
    findings: [
      F.ctHypo("CTでは白質低吸収として見えることがある。", { weight: 1 }),
      F.flairHigh("FLAIRで多発性白質高信号病変を示す。", { weight: 4 }),
      F.basalGanglia("基底核や視床など深部灰白質病変を伴うことがある。", { weight: 3 }),
      F.restr("急性炎症性病変で拡散制限を伴うことがある。", { weight: 2, typicality: "variable" }),
      F.mildEnh("造影効果は斑状または可変的。", { weight: 2, typicality: "variable" })
    ]
  },
  neuromyelitis_optica_spectrum_disorder: {
    ctSummary: "NMOSDの頭蓋内病変はCTで目立たないことが多く、MRIで評価する。",
    mriSummary: "MRIでは視神経、視床下部/脳幹、脳室周囲病変、長大脊髄病変との組み合わせを確認する。",
    findings: [
      F.flairHigh("脳室周囲、視床下部、脳幹などにT2/FLAIR高信号病変を認めることがある。", { weight: 3 }),
      F.periventricular("脳室周囲病変はNMOSDの頭蓋内病変として参考になる。", { weight: 2 }),
      F.restr("急性病変では拡散制限を伴うことがある。", { weight: 2, typicality: "variable" }),
      F.mildEnh("活動性病変では造影効果を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  mog_antibody_associated_disease: {
    ctSummary: "MOGADはCTよりMRIで病変分布を評価する。",
    mriSummary: "MRIではADEM様病変、皮質性FLAIR高信号、視神経炎、脳幹病変などを評価する。",
    findings: [
      F.flairHigh("FLAIRで白質または皮質性高信号病変を示す。", { weight: 4 }),
      F.cortical("皮質〜皮質下病変を示すことがある。", { weight: 3 }),
      F.restr("急性炎症性病変で拡散制限を伴うことがある。", { weight: 2, typicality: "variable" }),
      F.mildEnh("活動性病変では造影効果を示すことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  progressive_multifocal_leukoencephalopathy: {
    ctSummary: "PMLはCTで白質低吸収として見えることがあるが、早期評価はMRIが優れる。",
    mriSummary: "MRIでは非対称性白質T2/FLAIR高信号、皮質下U線維病変、通常乏しい造影とmass effectを評価する。",
    findings: [
      F.ctHypo("CTで非対称性白質低吸収を示すことがある。", { weight: 2 }),
      F.flairHigh("FLAIRで非対称性白質高信号を示す。", { weight: 4 }),
      F.noEnh("典型例では造影効果に乏しい。", { weight: 3 }),
      F.noRestr("中心部は拡散制限に乏しいことが多いが、活動辺縁では可変的。", { weight: 2, typicality: "variable" })
    ]
  },
  herpes_simplex_encephalitis: {
    ctSummary: "HSV脳炎はCTで側頭葉/島皮質の低吸収や浮腫として見えることがある。",
    mriSummary: "MRIでは側頭葉内側、島皮質、眼窩前頭葉のT2/FLAIR高信号、DWI高信号、出血性変化を確認する。",
    findings: [
      F.ctHypo("CTでは側頭葉や島皮質の低吸収/浮腫を認めることがある。", { weight: 2 }),
      F.flairHigh("FLAIRで側頭葉内側や島皮質の高信号を示す。", { weight: 5, subregion: "temporal_lobe" }),
      F.dwiHigh("急性期にDWI高信号を示すことがある。", { weight: 4 }),
      F.adcLow("急性期病変ではADC低値を伴うことがある。", { weight: 3 }),
      F.blooming("出血性壊死に伴いSWI/T2*でbloomingを示すことがある。", { weight: 3, typicality: "variable" })
    ]
  },
  creutzfeldt_jakob_disease: {
    ctSummary: "CJDはCTで目立たないことが多く、MRI DWI/FLAIRが重要。",
    mriSummary: "MRIでは皮質リボン状DWI/FLAIR高信号、基底核/視床病変、ADC低値を評価する。",
    findings: [
      F.dwiHigh("DWIで皮質リボン状高信号を示す。", { weight: 5, keywords: ["cortical ribboning"] }),
      F.adcLow("DWI高信号部に対応してADC低値を示すことがある。", { weight: 4 }),
      F.flairHigh("FLAIRで皮質または基底核高信号を認める。", { weight: 4 }),
      F.basalGanglia("基底核や視床の高信号病変を伴うことがある。", { weight: 4 })
    ]
  },
  posterior_reversible_encephalopathy_syndrome: {
    ctSummary: "PRESはCTで後頭頭頂葉優位の低吸収/浮腫として見えることがある。",
    mriSummary: "MRIでは後頭頭頂葉優位の血管原性浮腫、FLAIR高信号、通常ADC高値、可逆性を評価する。",
    findings: [
      F.ctHypo("CTでは後頭頭頂葉優位の低吸収/浮腫として見えることがある。", { weight: 2 }),
      F.flairHigh("FLAIRで後頭頭頂葉優位の皮質下高信号を示す。", { weight: 5 }),
      F.edema("血管原性浮腫が主体。", { weight: 5 }),
      F.adcHigh("血管原性浮腫ではADC高値を示すことが多い。", { weight: 4 }),
      F.restr("重症例では一部に拡散制限を伴うことがある。", { weight: 1, typicality: "variable" })
    ]
  },
  cerebral_venous_sinus_thrombosis: {
    ctSummary: "CVSTはCTで静脈洞高吸収、静脈性梗塞/出血、造影CTでempty delta signを評価する。",
    mriSummary: "MRI/MRVでは静脈洞血栓、流入欠損、静脈性浮腫、出血、拡散制限の有無を確認する。",
    findings: [
      F.ctHyper("非造影CTで血栓化静脈洞が高吸収を示すことがある。", { weight: 3 }),
      F.sinus("MRVで静脈洞血栓または流入欠損を確認する。", { weight: 5 }),
      F.delta("造影CT/MRIでempty delta signを示すことがある。", { weight: 4, keywords: ["empty delta sign"] }),
      F.flairHigh("静脈性浮腫や静脈性梗塞がFLAIR高信号を示す。", { weight: 3 }),
      F.blooming("静脈性出血を伴う場合、SWI/T2*でbloomingを示す。", { weight: 3 })
    ]
  },
  hypertensive_intracerebral_hemorrhage: T.hemorrhage("高血圧性脳内出血"),
  subdural_hematoma: {
    ...T.hemorrhage("硬膜下血腫"),
    ctSummary: "硬膜下血腫はCTで三日月状の硬膜下液体貯留として、急性期高吸収、慢性期低〜等吸収を評価する。"
  },
  cerebral_amyloid_angiopathy: {
    ctSummary: "CAAではCTで皮質下/葉性出血を確認する。",
    mriSummary: "MRIではSWI/T2*で皮質下微小出血、皮質表在性ヘモジデリン沈着、葉性出血を評価する。",
    findings: [
      F.ctHyper("葉性皮質下出血はCTで高吸収を示す。", { weight: 4 }),
      F.blooming("SWI/T2*で皮質下微小出血や表在性ヘモジデリン沈着を認める。", { weight: 5, keywords: ["lobar microbleeds", "cortical superficial siderosis"] }),
      F.flairHigh("白質病変や浮腫をFLAIRで評価する。", { weight: 2 })
    ]
  },
  cerebral_cavernous_malformation: {
    ctSummary: "海綿状血管奇形はCTで石灰化や出血を伴う高吸収病変として見えることがある。",
    mriSummary: "MRIではpopcorn状混在信号、ヘモジデリンリム、SWI/T2* bloomingが重要。",
    findings: [
      F.calc("CTで石灰化を伴うことがある。", { weight: 2 }),
      F.blooming("SWI/T2*で著明なblooming/ヘモジデリンリムを示す。", { weight: 5, keywords: ["popcorn", "hemosiderin rim"] }),
      F.t2Low("T2WIで辺縁低信号リムを認める。", { weight: 4 }),
      F.mildEnh("造影効果は乏しい〜軽度のことが多い。", { weight: 1, typicality: "variable" })
    ]
  },
  brain_arteriovenous_malformation: T.vascular("脳動静脈奇形"),
  dural_arteriovenous_fistula: {
    ...T.vascular("硬膜動静脈瘻"),
    mriSummary: "硬膜動静脈瘻では拡張皮質静脈、flow void、SWIの静脈性変化、MRA/DSAでシャントを評価する。"
  },
  intracranial_aneurysm: {
    ctSummary: "動脈瘤はCTでくも膜下出血や石灰化壁を確認し、CTAで瘤を評価する。",
    mriSummary: "MRA/CTAで嚢状動脈瘤、血栓化瘤の壁/内腔、周囲mass effectを確認する。",
    findings: [
      F.flow("MRA/CTAで嚢状または紡錘状の血管性構造を認める。", { weight: 5 }),
      F.ctHyper("破裂例ではCTでくも膜下腔高吸収を示す。", { weight: 5, typicality: "variable" }),
      F.blooming("血栓化成分や出血ではSWI/T2*で低信号を示すことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  moyamoya_disease: {
    ctSummary: "もやもや病はCTで慢性虚血変化や出血を確認する。",
    mriSummary: "MRI/MRAでは内頸動脈終末部狭窄/閉塞、基底核周囲の側副血行、灌流低下を評価する。",
    findings: [
      F.stenosis("MRAで内頸動脈終末部〜近位前/中大脳動脈の狭窄・閉塞を認める。", { weight: 5 }),
      F.flow("基底核周囲に側副血管flow voidを認める。", { weight: 4, keywords: ["moyamoya vessels"] }),
      F.hypoperfusion("ASL/灌流画像で灌流低下を示すことがある。", { weight: 4 }),
      F.flairHigh("慢性虚血や陳旧性梗塞に伴うFLAIR高信号を認めることがある。", { weight: 2 })
    ]
  },
  reversible_cerebral_vasoconstriction_syndrome: {
    ctSummary: "RCVSはCTでくも膜下出血や脳内出血、梗塞を確認することがある。",
    mriSummary: "MRA/CTAで多発性分節状狭窄、PRES様浮腫、梗塞/出血合併を評価する。",
    findings: [
      F.stenosis("MRA/CTAで多発性分節状の血管狭窄を示す。", { weight: 5, keywords: ["string of beads"] }),
      F.flairHigh("PRES様の皮質下FLAIR高信号を伴うことがある。", { weight: 2, typicality: "variable" }),
      F.ctHyper("凸面くも膜下出血や脳内出血を伴う場合、CTで高吸収を示す。", { weight: 2, typicality: "variable" })
    ]
  },
  carotid_cavernous_fistula: {
    ctSummary: "CCFはCT/CTAで上眼静脈拡張、海綿静脈洞拡大、眼窩うっ血を確認する。",
    mriSummary: "MRI/MRAでは上眼静脈拡張、海綿静脈洞増強、flow void、外眼筋腫大を評価する。",
    findings: [
      F.flow("海綿静脈洞周囲や上眼静脈にflow void/異常血流を認める。", { weight: 5 }),
      F.avid("海綿静脈洞の強い造影や拡大を示すことがある。", { weight: 3 }),
      F.hyperperfusion("シャントに伴う過灌流/早期静脈描出を認めることがある。", { weight: 3 })
    ]
  },
  normal_pressure_hydrocephalus: {
    ctSummary: "NPHはCTで脳室拡大を確認し、脳萎縮との不均衡を評価する。",
    mriSummary: "MRIでは脳室拡大、DESH、Sylvian fissure開大、高位円蓋部脳溝狭小化、FLAIR周囲高信号を評価する。",
    findings: [
      F.ventricles("側脳室を中心とした脳室拡大を認める。", { weight: 5 }),
      F.hydro("水頭症パターンを示す。", { weight: 5 }),
      F.flairHigh("脳室周囲FLAIR高信号を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  idiopathic_intracranial_hypertension: {
    ctSummary: "IIHはCTで腫瘤や水頭症を除外し、直接所見は乏しいことが多い。",
    mriSummary: "MRI/MRVではempty sella、視神経鞘拡大、後眼球平坦化、横静脈洞狭窄を評価する。",
    findings: [
      F.sellar("empty sella様の鞍部変化を示すことがある。", { weight: 3 }),
      F.sinus("MRVで横静脈洞狭窄/流入低下を認めることがある。", { weight: 3, typicality: "variable" }),
      F.noEnh("頭蓋内腫瘤性造影病変を欠くことが鑑別上重要。", { weight: 1 })
    ]
  },
  spontaneous_intracranial_hypotension: {
    ctSummary: "低髄液圧症はCTで硬膜下液貯留やbrain saggingを疑うことがある。",
    mriSummary: "MRIではびまん性硬膜造影、brain sagging、硬膜下液貯留、静脈洞拡張を評価する。",
    findings: [
      F.pachy("造影T1WIでびまん性硬膜造影を示す。", { weight: 5 }),
      F.ctHypo("硬膜下液貯留はCTで低吸収として見えることがある。", { weight: 2 }),
      F.flairHigh("硬膜下液貯留や脳表変化をFLAIRで確認する。", { weight: 2 }),
      F.sellar("下垂体腫大や鞍上部変化を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  chiari_1_malformation: {
    ctSummary: "Chiari I奇形はCTで後頭蓋窩骨構造や水頭症を確認できるが、MRIが中心。",
    mriSummary: "MRIでは小脳扁桃下垂、頭蓋頸椎移行部狭小化、脊髄空洞症、水頭症を評価する。",
    findings: [
      F.hydro("水頭症を合併することがある。", { weight: 2, typicality: "variable" }),
      F.csf("頭蓋頸椎移行部で髄液腔狭小化を評価する。", { weight: 3 }),
      F.t2High("脊髄空洞症がT2高信号腔として見えることがある。", { weight: 3, typicality: "variable" })
    ]
  },
  dandy_walker_malformation: {
    ctSummary: "Dandy-Walker奇形はCTで後頭蓋窩嚢胞性拡大と水頭症を確認する。",
    mriSummary: "MRIでは第4脳室嚢胞性拡大、小脳虫部低形成、後頭蓋窩拡大、水頭症を評価する。",
    findings: [
      F.csf("後頭蓋窩に髄液様信号の嚢胞性拡大を示す。", { weight: 5, subregion: "posterior_fossa" }),
      F.hydro("水頭症を伴うことが多い。", { weight: 4 }),
      F.ventricles("脳室拡大を伴う。", { weight: 3 })
    ]
  },
  agenesis_of_corpus_callosum: {
    ctSummary: "脳梁欠損はCT/MRIで側脳室形態異常や正中構造を確認する。",
    mriSummary: "MRIでは脳梁欠損、parallel lateral ventricles、colpocephaly、放射状脳溝走行を評価する。",
    findings: [
      F.callosal("脳梁の欠損または低形成を認める。", { weight: 5 }),
      F.ventricles("側脳室形態異常や後角拡大を認める。", { weight: 4 }),
      F.csf("正中嚢胞など髄液様構造を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  arachnoid_cyst: T.csfCyst("くも膜嚢胞"),
  epidermoid_cyst: {
    ctSummary: "類表皮嚢胞はCTで髄液様低吸収として見えることが多い。",
    mriSummary: "MRIでは髄液様信号ながらFLAIRで完全抑制されず、DWI高信号/拡散制限が鑑別に重要。",
    findings: [
      F.ctHypo("CTでは髄液に近い低吸収を示す。", { weight: 2 }),
      F.csf("T1/T2では髄液様信号を示す。", { weight: 3 }),
      F.flairHigh("FLAIRではくも膜嚢胞と異なり不完全抑制/高信号を示すことがある。", { weight: 4 }),
      F.dwiHigh("DWI高信号を示す。", { weight: 5 }),
      F.adcLow("ADC低値または真の拡散制限を伴うことがある。", { weight: 4 }),
      F.noEnh("通常、明らかな造影効果を欠く。", { weight: 3 })
    ]
  },
  dermoid_cyst: {
    ctSummary: "類皮嚢胞はCTで脂肪吸収値を示し、破裂例では脂肪滴を認める。",
    mriSummary: "MRIではT1高信号、脂肪抑制で信号低下、DWIは可変的で、造影は乏しい。",
    findings: [
      F.ctFat("CTで脂肪吸収値を示す。", { weight: 5 }),
      F.fat("T1WIで脂肪成分による高信号を示す。", { weight: 5 }),
      F.fatSuppress("脂肪抑制で信号低下を示す。", { weight: 5 }),
      F.noEnh("造影効果は乏しい。", { weight: 2 })
    ]
  },
  colloid_cyst: {
    ctSummary: "コロイド嚢胞は第3脳室前部の高吸収〜等吸収結節として水頭症を伴うことがある。",
    mriSummary: "MRI信号は内容により可変だが、第3脳室前部病変と水頭症の評価が重要。",
    findings: [
      F.ctHyper("非造影CTで高吸収結節として見えることが多い。", { weight: 4 }),
      F.hydro("Monro孔閉塞により水頭症を伴うことがある。", { weight: 4 }),
      F.t1High("内容物によりT1高信号を示すことがある。", { weight: 3, typicality: "variable" }),
      F.noEnh("造影効果は乏しいことが多い。", { weight: 2 })
    ]
  },
  rathke_cleft_cyst: {
    ctSummary: "Rathke嚢胞は鞍内〜鞍上部嚢胞性病変としてCTで低吸収〜等吸収を示す。",
    mriSummary: "MRI信号は内容で可変だが、非造影性嚢胞、T1高信号内容、薄い壁造影を確認する。",
    findings: [
      F.sellar("鞍内〜鞍上部の嚢胞性病変として見える。", { weight: 5 }),
      F.t1High("蛋白濃度によりT1高信号を示すことがある。", { weight: 3, typicality: "variable" }),
      F.t2High("T2WIでは嚢胞性高信号を示すことが多い。", { weight: 3 }),
      F.noRestr("通常、強い拡散制限を欠く。", { weight: 2 }),
      F.noEnh("内部は造影されず、薄い壁造影にとどまることが多い。", { weight: 3 })
    ]
  },
  craniopharyngioma: {
    ctSummary: "頭蓋咽頭腫は鞍上部嚢胞充実性腫瘤、石灰化、嚢胞内容をCTで評価する。",
    mriSummary: "MRIでは鞍上部嚢胞充実性腫瘤、T1高信号嚢胞、造影充実成分、水頭症を評価する。",
    findings: [
      F.sellar("鞍上部優位の腫瘤として見える。", { weight: 5 }),
      F.calc("CTで石灰化を伴うことが多い。", { weight: 5 }),
      F.t1High("嚢胞内容がT1高信号を示すことがある。", { weight: 3 }),
      F.solidEnh("造影される充実成分を伴う。", { weight: 4 }),
      F.hydro("第三脳室圧排により水頭症を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  pituitary_macroadenoma: {
    ctSummary: "下垂体腺腫は鞍内〜鞍上部腫瘤としてCT/MRIで確認し、骨変化や出血を評価する。",
    mriSummary: "MRIでは鞍内腫瘤、鞍上伸展、海綿静脈洞浸潤、比較的均一〜不均一造影を評価する。",
    findings: [
      F.sellar("鞍内〜鞍上部腫瘤として見える。", { weight: 5 }),
      F.mildEnh("造影T1WIで比較的均一〜不均一に造影される。", { weight: 3 }),
      F.t2High("嚢胞変性や壊死を伴うとT2高信号成分を示す。", { weight: 2, typicality: "variable" }),
      F.noRestr("典型的腺腫では強い拡散制限は目立たないことが多い。", { weight: 1, typicality: "variable" })
    ]
  },
  pituitary_apoplexy: {
    ctSummary: "下垂体卒中はCTで鞍内腫瘤内高吸収出血として見えることがある。",
    mriSummary: "MRIでは下垂体腫瘤内出血/梗塞、T1高信号、SWI blooming、造影欠損を評価する。",
    findings: [
      F.sellar("鞍内〜鞍上部腫瘤を背景に発症する。", { weight: 4 }),
      F.ctHyper("急性出血ではCTで高吸収を示すことがある。", { weight: 4 }),
      F.t1High("亜急性血腫ではT1高信号を示す。", { weight: 4 }),
      F.blooming("血液成分によりSWI/T2*でbloomingを示す。", { weight: 4 })
    ]
  },
  hypophysitis: {
    ctSummary: "下垂体炎はCTより造影MRIで評価する。",
    mriSummary: "MRIでは下垂体びまん性腫大、均一造影、下垂体茎肥厚、後葉高信号消失を評価する。",
    findings: [
      F.sellar("鞍内のびまん性下垂体腫大を示す。", { weight: 4 }),
      F.avid("造影T1WIで均一な造影を示すことがある。", { weight: 3 }),
      F.stalk("下垂体茎肥厚を伴うことがある。", { weight: 5 }),
      F.noRestr("強い拡散制限は典型的ではない。", { weight: 1 })
    ]
  },
  chordoma: {
    ctSummary: "斜台脊索腫はCTで斜台骨破壊性腫瘤として確認する。",
    mriSummary: "MRIでは斜台中心のT2高信号分葉状腫瘤、不均一造影、骨破壊と硬膜外進展を評価する。",
    findings: [
      F.clivus("CTで斜台骨破壊を示す。", { weight: 5 }),
      F.t2High("T2WIで高信号の分葉状腫瘤を示す。", { weight: 4 }),
      F.mildEnh("造影効果は不均一なことが多い。", { weight: 3 }),
      F.mass("脳幹や頭蓋底構造へのmass effectを評価する。", { weight: 3 })
    ]
  },
  chondrosarcoma_skull_base: {
    ctSummary: "頭蓋底軟骨肉腫は傍正中頭蓋底骨破壊と石灰化基質をCTで確認する。",
    mriSummary: "MRIではT2高信号の頭蓋底腫瘤、不均一造影、斜台外側/錐体尖部由来を評価する。",
    findings: [
      F.clivus("CTで頭蓋底骨破壊を示す。", { weight: 4 }),
      F.calc("軟骨性基質石灰化を伴うことがある。", { weight: 4 }),
      F.t2High("T2WIで高信号腫瘤を示す。", { weight: 4 }),
      F.mildEnh("造影効果は不均一なことが多い。", { weight: 3 })
    ]
  },
  vestibular_schwannoma: {
    ctSummary: "前庭神経鞘腫はCTで内耳道拡大や小脳橋角部腫瘤を確認する。",
    mriSummary: "MRIでは内耳道内〜小脳橋角部の造影腫瘤、T2高信号嚢胞変性、内耳道進展を評価する。",
    findings: [
      F.iac("内耳道内進展を伴う小脳橋角部腫瘤として見える。", { weight: 5 }),
      F.avid("造影T1WIで強い造影効果を示す。", { weight: 4 }),
      F.t2High("T2WIで高信号〜不均一信号を示す。", { weight: 3 }),
      F.noRestr("典型例では強い拡散制限は目立たないことが多い。", { weight: 1, typicality: "variable" })
    ]
  },
  medulloblastoma: {
    ctSummary: "髄芽腫はCTで後頭蓋窩正中の高吸収腫瘤、水頭症を確認する。",
    mriSummary: "MRIでは小脳虫部/第4脳室近傍腫瘤、拡散制限、造影、髄液播種を評価する。",
    findings: [
      F.ctHyper("高細胞性のためCTで高吸収を示すことがある。", { weight: 3 }),
      F.restr("高細胞性腫瘍としてDWI高信号/ADC低値を示しやすい。", { weight: 5 }),
      F.adcLow("ADC低値は髄芽腫を支持する。", { weight: 5 }),
      F.mildEnh("造影効果は中等度〜強いことが多い。", { weight: 3 }),
      F.hydro("第4脳室閉塞により水頭症を伴うことがある。", { weight: 4 })
    ]
  },
  ependymoma: {
    ctSummary: "上衣腫はCTで第4脳室内/脳室近傍腫瘤、石灰化、嚢胞を確認する。",
    mriSummary: "MRIでは脳室内腫瘤、T2不均一高信号、造影、foraminaを介した進展、拡散を評価する。",
    findings: [
      F.calc("CTで石灰化を伴うことがある。", { weight: 3 }),
      F.t2High("T2WIで不均一高信号腫瘤を示す。", { weight: 3 }),
      F.mildEnh("造影効果は不均一なことが多い。", { weight: 3 }),
      F.restr("細胞密度に応じて拡散制限を伴うことがある。", { weight: 2, typicality: "variable" }),
      F.hydro("脳室閉塞により水頭症を伴うことがある。", { weight: 3 })
    ]
  },
  pilocytic_astrocytoma: {
    ctSummary: "毛様細胞性星細胞腫はCTで嚢胞性腫瘤や水頭症を確認する。",
    mriSummary: "MRIでは嚢胞+造影壁在結節、T2高信号、比較的境界明瞭な腫瘤を評価する。",
    findings: [
      F.mural("造影される壁在結節を伴う嚢胞性腫瘤を示すことが多い。", { weight: 5 }),
      F.t2High("嚢胞成分や腫瘍がT2高信号を示す。", { weight: 3 }),
      F.noRestr("典型例では強い拡散制限に乏しい。", { weight: 2 }),
      F.hydro("後頭蓋窩病変では水頭症を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  hemangioblastoma: {
    ctSummary: "血管芽腫はCTで後頭蓋窩嚢胞性腫瘤/造影結節を確認する。",
    mriSummary: "MRIでは嚢胞+強く造影される壁在結節、flow void、灌流上昇を評価する。",
    findings: [
      F.mural("造影壁在結節を伴う嚢胞性病変を示す。", { weight: 5 }),
      F.avid("壁在結節は強く造影される。", { weight: 5 }),
      F.flow("腫瘍周囲にflow voidを伴うことがある。", { weight: 4 }),
      F.csf("嚢胞成分は髄液様信号を示す。", { weight: 3 })
    ]
  },
  oligodendroglioma: {
    ...T.infiltrativeGlioma("乏突起膠腫"),
    findings: [
      ...T.infiltrativeGlioma("乏突起膠腫").findings,
      F.calc("CTで石灰化を伴いやすい。", { weight: 5 }),
      F.cortical("皮質〜皮質下に及ぶ病変として見えることが多い。", { weight: 4 })
    ]
  },
  astrocytoma_idh_mutant: T.infiltrativeGlioma("IDH変異型星細胞腫"),
  diffuse_low_grade_glioma: T.infiltrativeGlioma("びまん性低悪性度神経膠腫"),
  ganglioglioma: {
    ...T.infiltrativeGlioma("神経節膠腫"),
    findings: [
      F.cortical("皮質〜皮質下の腫瘤として見えることが多い。", { weight: 4 }),
      F.t2High("T2/FLAIR高信号病変を示す。", { weight: 3 }),
      F.calc("石灰化を伴うことがある。", { weight: 3 }),
      F.mildEnh("造影効果は可変的。", { weight: 2, typicality: "variable" })
    ]
  },
  dysembryoplastic_neuroepithelial_tumor: {
    ctSummary: "DNETはCTで皮質性低吸収病変や骨リモデリングを示すことがある。",
    mriSummary: "MRIでは皮質性多房性/泡沫状T2高信号、FLAIR rim、造影乏しい所見を評価する。",
    findings: [
      F.cortical("皮質〜皮質下病変として見える。", { weight: 5 }),
      F.t2High("T2WIで多房性/泡沫状高信号を示す。", { weight: 5, keywords: ["bubbly"] }),
      F.noEnh("造影効果は乏しいことが多い。", { weight: 3 }),
      F.noRestr("強い拡散制限は通常目立たない。", { weight: 2 })
    ]
  },
  pleomorphic_xanthoastrocytoma: {
    ctSummary: "PXAはCTで表在性嚢胞性腫瘤や石灰化を確認することがある。",
    mriSummary: "MRIでは表在性皮質病変、嚢胞+造影壁在結節、髄膜接触/造影を評価する。",
    findings: [
      F.cortical("表在性皮質〜皮質下腫瘤として見える。", { weight: 5 }),
      F.mural("嚢胞性腫瘤に造影壁在結節を伴うことがある。", { weight: 4 }),
      F.solidEnh("充実成分が造影される。", { weight: 3 }),
      F.calc("石灰化を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  central_neurocytoma: {
    ctSummary: "中枢神経細胞腫は側脳室内腫瘤、石灰化、嚢胞変性、水頭症をCTで確認する。",
    mriSummary: "MRIでは側脳室内の不均一腫瘤、T2高信号嚢胞、石灰化/出血、造影を評価する。",
    findings: [
      F.calc("CTで石灰化を伴うことが多い。", { weight: 4 }),
      F.t2High("T2WIで嚢胞性/海綿状の高信号成分を示す。", { weight: 3 }),
      F.mildEnh("造影効果は不均一なことが多い。", { weight: 3 }),
      F.hydro("脳室閉塞により水頭症を伴うことがある。", { weight: 3 })
    ]
  },
  choroid_plexus_papilloma: {
    ctSummary: "脈絡叢乳頭腫は脳室内造影腫瘤、水頭症、石灰化をCTで確認する。",
    mriSummary: "MRIでは脳室内の強い造影腫瘤、T2高信号、flow void、水頭症を評価する。",
    findings: [
      F.avid("脳室内腫瘤が強く造影される。", { weight: 5 }),
      F.flow("血流豊富な腫瘤としてflow voidを伴うことがある。", { weight: 3 }),
      F.hydro("髄液産生/閉塞により水頭症を伴うことがある。", { weight: 4 }),
      F.calc("石灰化を伴うことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  pineal_germinoma: {
    ctSummary: "松果体胚細胞腫はCTで松果体部腫瘤、石灰化の巻き込み、水頭症を確認する。",
    mriSummary: "MRIでは松果体部均一造影腫瘤、拡散制限、水頭症、髄液播種を評価する。",
    findings: [
      F.calc("松果体石灰化の engulfment を伴うことがある。", { weight: 3 }),
      F.avid("造影T1WIで比較的均一に造影される。", { weight: 4 }),
      F.restr("高細胞性により拡散制限を示すことがある。", { weight: 4 }),
      F.hydro("中脳水道閉塞により水頭症を伴うことがある。", { weight: 4 })
    ]
  },
  pineoblastoma: {
    ctSummary: "松果体芽腫はCTで高吸収の松果体部腫瘤、水頭症を確認する。",
    mriSummary: "MRIでは高細胞性を反映した拡散制限、不均一造影、浸潤/播種、水頭症を評価する。",
    findings: [
      F.ctHyper("高細胞性腫瘍としてCTで高吸収を示すことがある。", { weight: 3 }),
      F.restr("DWI高信号/ADC低値を示しやすい。", { weight: 5 }),
      F.mildEnh("造影効果は不均一なことが多い。", { weight: 3 }),
      F.hydro("中脳水道閉塞により水頭症を伴うことが多い。", { weight: 4 })
    ]
  },
  tuberous_sclerosis_complex: {
    ctSummary: "TSCはCTで上衣下結節の石灰化を確認しやすい。",
    mriSummary: "MRIでは皮質結節、上衣下結節、SEGA、白質放射状線状病変を評価する。",
    findings: [
      F.subependymal("脳室上衣下結節を認める。", { weight: 5 }),
      F.calc("上衣下結節は石灰化を伴いやすい。", { weight: 4 }),
      F.cortical("皮質結節/皮質下病変を認める。", { weight: 4 }),
      F.flairHigh("白質病変や皮質結節がFLAIR高信号を示す。", { weight: 3 })
    ]
  },
  sturge_weber_syndrome: {
    ctSummary: "Sturge-Weber症候群はCTでtram-track状皮質石灰化と萎縮を確認する。",
    mriSummary: "MRIでは軟髄膜造影、皮質萎縮、白質変化、脈絡叢拡大を評価する。",
    findings: [
      F.calc("CTで皮質石灰化を認める。", { weight: 5, keywords: ["tram-track calcification"] }),
      F.lepto("造影T1WIで軟髄膜造影を示す。", { weight: 5 }),
      F.flairHigh("慢性虚血/グリオーシスに伴うFLAIR高信号を認める。", { weight: 3 })
    ]
  },
  neurocysticercosis: {
    ctSummary: "神経嚢虫症はCTで嚢胞、石灰化結節、周囲浮腫を病期ごとに評価する。",
    mriSummary: "MRIでは嚢胞内scolex、リング状造影、周囲浮腫、DWI所見を評価する。",
    findings: [
      F.calc("陳旧性病変ではCTで石灰化結節を示す。", { weight: 5 }),
      F.csf("嚢胞期では髄液様信号の嚢胞を示す。", { weight: 4 }),
      F.ring("変性期ではリング状造影を示す。", { weight: 4 }),
      F.edema("活動性/変性期では周囲浮腫を伴う。", { weight: 3 })
    ]
  },
  cerebral_toxoplasmosis: T.ringInfection("脳トキソプラズマ症"),
  tuberculoma: {
    ...T.ringInfection("頭蓋内結核腫"),
    mriSummary: "結核腫はT2低信号〜等信号中心、リング状造影、髄膜炎合併、MRS脂質/乳酸ピークを評価する。"
  },
  cryptococcal_meningitis: {
    ctSummary: "クリプトコッカス髄膜炎はCTで水頭症や基底槽病変を確認することがある。",
    mriSummary: "MRIでは髄膜造影、Virchow-Robin腔拡大、ゼラチン様偽嚢胞、基底核病変、水頭症を評価する。",
    findings: [
      F.lepto("造影T1WIで軟髄膜造影を示すことがある。", { weight: 3 }),
      F.basalGanglia("基底核周囲のゼラチン様偽嚢胞/拡大血管周囲腔を認めることがある。", { weight: 3 }),
      F.hydro("水頭症を合併することがある。", { weight: 3 }),
      F.flairHigh("髄膜炎や脳実質病変でFLAIR高信号を示すことがある。", { weight: 2 })
    ]
  },
  wernicke_encephalopathy: {
    ctSummary: "Wernicke脳症はCTで目立たないことが多く、MRIが重要。",
    mriSummary: "MRIでは内側視床、乳頭体、中脳水道周囲、第三脳室周囲のT2/FLAIR高信号とDWI変化を評価する。",
    findings: [
      F.flairHigh("内側視床や中脳水道周囲にFLAIR高信号を認める。", { weight: 5 }),
      F.basalGanglia("視床病変を含む深部灰白質病変として見える。", { weight: 4 }),
      F.dwiHigh("急性期にDWI高信号を示すことがある。", { weight: 3 }),
      F.mildEnh("乳頭体造影を示すことがある。", { weight: 2, typicality: "variable" })
    ]
  },
  melas: {
    ctSummary: "MELASはCTで脳卒中様病変の低吸収を示すことがある。",
    mriSummary: "MRIでは血管支配に一致しない皮質〜皮質下FLAIR高信号、DWI/ADCの可変的変化、乳酸ピークを評価する。",
    findings: [
      F.cortical("血管支配域に一致しない皮質〜皮質下病変を示す。", { weight: 5 }),
      F.flairHigh("脳卒中様病変がFLAIR高信号を示す。", { weight: 4 }),
      F.dwiHigh("急性期病変でDWI高信号を示すことがある。", { weight: 3 }),
      F.lactate("MRSで乳酸ピークを認めることがある。", { weight: 5 })
    ]
  },
  leigh_syndrome: {
    ctSummary: "Leigh症候群はCTで基底核低吸収として見えることがある。",
    mriSummary: "MRIでは基底核、脳幹、小脳の左右対称性T2/FLAIR高信号、拡散制限、乳酸ピークを評価する。",
    findings: [
      F.basalGanglia("基底核に左右対称性病変を認める。", { weight: 5 }),
      F.flairHigh("T2/FLAIR高信号病変を示す。", { weight: 4 }),
      F.restr("急性病変で拡散制限を伴うことがある。", { weight: 3 }),
      F.lactate("MRSで乳酸ピークを認めることがある。", { weight: 4 })
    ]
  },
  marchiafava_bignami_disease: {
    ctSummary: "Marchiafava-Bignami病はCTで脳梁低吸収として見えることがある。",
    mriSummary: "MRIでは脳梁のT2/FLAIR高信号、DWI高信号/ADC低値、慢性期萎縮を評価する。",
    findings: [
      F.callosal("脳梁病変を認める。", { weight: 5 }),
      F.flairHigh("脳梁がFLAIR高信号を示す。", { weight: 4 }),
      F.dwiHigh("急性期にDWI高信号を示すことがある。", { weight: 4 }),
      F.adcLow("急性期病変でADC低値を伴うことがある。", { weight: 3 })
    ]
  },
  osmotic_demyelination_syndrome: {
    ctSummary: "浸透圧性脱髄症候群はCTで橋中心低吸収として見えることがある。",
    mriSummary: "MRIでは橋中心部T2/FLAIR高信号、三叉状/左右対称病変、DWI早期高信号を評価する。",
    findings: [
      F.flairHigh("橋中心部にT2/FLAIR高信号を認める。", { weight: 5, subregion: "pons" }),
      F.dwiHigh("早期にDWI高信号を示すことがある。", { weight: 4 }),
      F.adcLow("急性期にはADC低値を伴うことがある。", { weight: 3 }),
      F.noEnh("通常、明らかな造影効果は乏しい。", { weight: 2 })
    ]
  },
  alexander_disease: T.leukodystrophy("Alexander病"),
  canavan_disease: T.leukodystrophy("Canavan病"),
  metachromatic_leukodystrophy: T.leukodystrophy("異染性白質ジストロフィー"),
  x_linked_adrenoleukodystrophy: {
    ...T.leukodystrophy("X連鎖副腎白質ジストロフィー"),
    findings: [
      ...T.leukodystrophy("X連鎖副腎白質ジストロフィー").findings,
      F.callosal("脳梁膨大部周囲から後頭頭頂白質に広がる病変を示すことが多い。", { weight: 4 }),
      F.mildEnh("活動性辺縁では造影効果を示すことがある。", { weight: 4, typicality: "variable" })
    ]
  },
  glutaric_aciduria_type_1: {
    ctSummary: "GA1はCTで前頭側頭部萎縮/髄液腔拡大や硬膜下液貯留を確認することがある。",
    mriSummary: "MRIでは前頭側頭部萎縮、Sylvian fissure開大、基底核病変、白質変化を評価する。",
    findings: [
      F.basalGanglia("基底核、特に線条体病変を認めることがある。", { weight: 4 }),
      F.csf("前頭側頭部髄液腔拡大を認める。", { weight: 4 }),
      F.flairHigh("白質変化や基底核病変がFLAIR高信号を示すことがある。", { weight: 3 })
    ]
  },
  nf1_optic_pathway_glioma: {
    ctSummary: "NF1関連視路膠腫はCTよりMRIで視神経/視交叉を評価する。",
    mriSummary: "MRIでは視神経/視交叉の腫大、T2高信号、造影可変、NF1関連白質病変を確認する。",
    findings: [
      F.t2High("視路腫瘍はT2高信号を示すことが多い。", { weight: 4, subregion: "optic_pathway" }),
      F.mildEnh("造影効果は可変的。", { weight: 2, typicality: "variable" }),
      F.noRestr("典型例では強い拡散制限は目立たない。", { weight: 2 }),
      F.flairHigh("NF1関連白質病変を伴うことがある。", { weight: 1, typicality: "variable" })
    ]
  },
  posterior_fossa_juvenile_xanthogranuloma: {
    ctSummary: "CNS juvenile xanthogranulomaはCTで充実性/嚢胞性腫瘤、出血や石灰化を確認する。",
    mriSummary: "MRIでは後頭蓋窩腫瘤、造影充実成分、T2信号、周囲浮腫を評価する。",
    findings: [
      F.t2High("T2WIで高信号〜不均一信号の腫瘤を示す。", { weight: 3 }),
      F.solidEnh("造影される充実成分を伴う。", { weight: 4 }),
      F.edema("周囲浮腫を伴うことがある。", { weight: 2, typicality: "variable" }),
      F.calc("石灰化を伴うことがある。", { weight: 1, typicality: "variable" })
    ]
  }
};

function normalizeGroupKey(modality, code) {
  return modality === "CT" ? "findings_by_phase" : "findings_by_sequence";
}

function getGroups(card, modality) {
  if (modality === "CT") {
    card.imaging.ct ||= { summary: "", findings_by_phase: [] };
    card.imaging.ct.findings_by_phase ||= [];
    return card.imaging.ct.findings_by_phase;
  }
  card.imaging.mri ||= { summary: "", findings_by_sequence: [] };
  card.imaging.mri.findings_by_sequence ||= [];
  return card.imaging.mri.findings_by_sequence;
}

function groupCode(group, modality) {
  return modality === "CT" ? group.phase?.code : group.sequence?.code;
}

function ensureGroup(card, modality, code) {
  const groups = getGroups(card, modality);
  let group = groups.find((item) => groupCode(item, modality) === code);
  if (!group) {
    group = modality === "CT"
      ? { phase: { code }, findings: [] }
      : { sequence: { code }, findings: [] };
    groups.push(group);
  }
  group.findings ||= [];
  return group;
}

function stableIdPart(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/^finding:/, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function addFindings(card, enrichment) {
  const added = [];
  const existingKeys = new Set();
  for (const section of [card.imaging?.ct?.findings_by_phase || [], card.imaging?.mri?.findings_by_sequence || []]) {
    for (const group of section) {
      for (const finding of group.findings || []) {
        existingKeys.add([
          finding.modality,
          finding.acquisition?.code,
          finding.finding_code,
          finding.target,
          finding.finding_text
        ].join("|"));
      }
    }
  }

  const counters = new Map();
  for (const item of enrichment.findings || []) {
    const key = [item.modality, item.acquisition.code, item.finding_code, item.target, item.finding_text].join("|");
    if (existingKeys.has(key)) continue;
    const group = ensureGroup(card, item.modality, item.acquisition.code);
    const prefix = `${card.disease_id}_${item.modality.toLowerCase()}_${stableIdPart(item.acquisition.code)}_${stableIdPart(item.finding_code)}`;
    const next = (counters.get(prefix) || 0) + 1;
    counters.set(prefix, next);
    const findingId = `${prefix}_${String(next).padStart(2, "0")}`;
    const finalFinding = { finding_id: findingId, ...item };
    group.findings.push(finalFinding);
    existingKeys.add(key);
    added.push(findingId);
  }
  return added;
}

function ensurePublicEvidence(card, addedIds) {
  if (!addedIds.length) return;
  card.references ||= [];
  if (!card.references.some((ref) => ref.source_id === PUBLIC_SOURCE_ID)) {
    card.references.push(PUBLIC_REFERENCE);
  }
  card.evidence ||= { summary: "", claim_map: [] };
  card.evidence.claim_map ||= [];
  card.evidence.claim_map.push({
    claim_type: "imaging_findings",
    finding_ids: addedIds,
    claim_scope: ["finding_text", "typicality", "diagnostic_weight"],
    source_ids: [PUBLIC_SOURCE_ID],
    confidence: "medium"
  });
  const summary = String(card.evidence.summary || "");
  if (!summary.includes("PubMed以外の公開ソース")) {
    card.evidence.summary = summary ? `${summary} ${SOURCE_NOTE}` : SOURCE_NOTE;
  }
}

function enrichCard(filePath) {
  const card = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const enrichment = ENRICHMENTS[card.disease_id];
  if (!enrichment) return { id: card.disease_id, added: 0, skipped: true };

  card.imaging ||= { ct: { summary: "", findings_by_phase: [] }, mri: { summary: "", findings_by_sequence: [] } };
  if (enrichment.ctSummary) card.imaging.ct.summary = enrichment.ctSummary;
  if (enrichment.mriSummary) card.imaging.mri.summary = enrichment.mriSummary;
  const addedIds = addFindings(card, enrichment);
  ensurePublicEvidence(card, addedIds);
  card.updated_at = new Date().toISOString();

  fs.writeFileSync(filePath, `${JSON.stringify(card, null, 2)}\n`, "utf8");
  return { id: card.disease_id, added: addedIds.length, skipped: false };
}

function main() {
  const results = [];
  for (const file of fs.readdirSync(DRAFT_DIR).filter((name) => name.endsWith(".json")).sort()) {
    results.push(enrichCard(path.join(DRAFT_DIR, file)));
  }
  const touched = results.filter((r) => !r.skipped);
  const added = touched.reduce((sum, r) => sum + r.added, 0);
  console.log(`Enriched draft modality findings: ${touched.length} cards touched, ${added} findings added.`);
  for (const r of results) {
    if (!r.skipped) console.log(`- ${r.id}: +${r.added}`);
  }
  const skipped = results.filter((r) => r.skipped).map((r) => r.id);
  if (skipped.length) console.log(`Skipped without curated enrichment: ${skipped.join(", ")}`);
}

main();
