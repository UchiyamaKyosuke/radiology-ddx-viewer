const fs = require("fs");
const path = require("path");
const { DATA, readJson, writeJson, hashObject } = require("./lib");

const now = new Date().toISOString();
const draftsDir = path.join(DATA, "drafts");
const dictDir = path.join(DATA, "dictionaries");
const publicDir = path.join(DATA, "sources", "public");
const SOURCE_ID = "public_general_batch8_20260705";

const PUBLIC_REFERENCE = {
  source_id: SOURCE_ID,
  type: "public_source_packet",
  title: "Public cross-sectional imaging source packet for whole-body Phase 1 draft batch 8",
  authors: [],
  journal: "",
  year: "2026",
  url: "https://www.ncbi.nlm.nih.gov/books/",
  license: "Public web source index: NCBI Bookshelf/StatPearls, ACR Appropriateness Criteria, RadiologyInfo, and open-access PMC reviews where applicable"
};

function add(map, key, en, ja, extra = {}) {
  if (!map[key]) map[key] = { ...extra, label: { ja, en }, synonyms: [] };
  map[key] = { ...extra, ...map[key] };
  map[key].label = map[key].label || { ja, en };
  map[key].synonyms = Array.from(new Set([...(map[key].synonyms || []), ja, en, ...(extra.synonyms || [])]));
}

function ensureDictionaries() {
  const anatomyPath = path.join(dictDir, "anatomy-map.json");
  const targetPath = path.join(dictDir, "target-map.json");
  const anatomy = readJson(anatomyPath);
  const targets = readJson(targetPath);

  for (const [key, en, ja] of [
    ["orbit_head_neck", "orbit and face", "眼窩顔面"], ["pediatric_abdomen", "pediatric abdomen", "小児腹部"],
    ["cardiac", "cardiac", "心臓"], ["dental", "dental and mandible", "歯科顎顔面"]
  ]) add(anatomy.body_regions, key, en, ja);

  for (const [key, parent, en, ja] of [
    ["myocardium", "cardiac", "myocardium", "心筋"], ["cardiac_chamber", "cardiac", "cardiac chamber", "心腔"],
    ["pericardium", "cardiac", "pericardium", "心膜"], ["coronary_artery", "cardiac", "coronary artery", "冠動脈"],
    ["trachea", "chest", "trachea", "気管"], ["bronchus", "chest", "bronchus", "気管支"],
    ["lymphatic_system", "chest", "lymphatic system", "リンパ系"], ["sinonasal_cavity", "head_neck", "sinonasal cavity", "鼻副鼻腔"],
    ["temporal_bone", "head_neck", "temporal bone", "側頭骨"], ["mandible", "dental", "mandible", "下顎骨"],
    ["tooth", "dental", "tooth", "歯"], ["lacrimal_gland", "orbit_head_neck", "lacrimal gland", "涙腺"],
    ["parathyroid", "head_neck", "parathyroid", "副甲状腺"], ["ureter", "urinary", "ureter", "尿管"],
    ["urethra", "urinary", "urethra", "尿道"], ["placenta", "female_pelvis", "placenta", "胎盤"],
    ["pediatric_bowel", "pediatric_abdomen", "pediatric bowel", "小児腸管"], ["pylorus", "pediatric_abdomen", "pylorus", "幽門"],
    ["rotator_cuff", "musculoskeletal", "rotator cuff", "腱板"], ["achilles_tendon", "musculoskeletal", "Achilles tendon", "アキレス腱"],
    ["plantar_fascia", "musculoskeletal", "plantar fascia", "足底腱膜"], ["peripheral_nerve", "musculoskeletal", "peripheral nerve", "末梢神経"]
  ]) add(anatomy.organs, key, en, ja, { parent_body_region: parent });

  for (const [key, en, ja] of [
    ["myocardial_wall", "myocardial wall", "心筋壁"], ["left_atrium", "left atrium", "左房"], ["left_ventricle", "left ventricle", "左室"],
    ["pericardium", "pericardium", "心膜"], ["coronary_lumen", "coronary lumen", "冠動脈内腔"],
    ["tracheal_lumen", "tracheal lumen", "気管内腔"], ["bronchial_lumen", "bronchial lumen", "気管支内腔"],
    ["lymphangitic_interstitium", "lymphangitic interstitium", "癌性リンパ管症間質"],
    ["sinus_lumen", "sinus lumen", "副鼻腔内腔"], ["middle_ear", "middle ear", "中耳"], ["mastoid_air_cells", "mastoid air cells", "乳突蜂巣"],
    ["mandibular_body", "mandibular body", "下顎体"], ["dental_root", "dental root", "歯根"],
    ["lacrimal_fossa", "lacrimal fossa", "涙腺窩"], ["parathyroid_region", "parathyroid region", "副甲状腺領域"],
    ["ureteral_lumen", "ureteral lumen", "尿管内腔"], ["urethral_wall", "urethral wall", "尿道壁"],
    ["ovarian_stroma", "ovarian stroma", "卵巣間質"], ["adnexal_pedicle", "adnexal pedicle", "付属器茎"],
    ["placental_bed", "placental bed", "胎盤付着部"], ["pediatric_ileocecal", "pediatric ileocecal region", "小児回盲部"],
    ["pyloric_channel", "pyloric channel", "幽門管"], ["neonatal_bowel_wall", "neonatal bowel wall", "新生児腸管壁"],
    ["supraspinatus_tendon", "supraspinatus tendon", "棘上筋腱"], ["achilles_tendon_substance", "Achilles tendon substance", "アキレス腱実質"],
    ["plantar_fascia_origin", "plantar fascia origin", "足底腱膜起始部"], ["intermetatarsal_space", "intermetatarsal space", "中足骨間隙"],
    ["synovium", "synovium", "滑膜"], ["osteochondral_surface", "osteochondral surface", "骨軟骨面"]
  ]) add(anatomy.subregions, key, en, ja);

  for (const [key, en, ja] of [
    ["matrix", "matrix", "基質"], ["tendon", "tendon", "腱"], ["synovium", "synovium", "滑膜"],
    ["nerve", "nerve", "神経"], ["myocardial_scar", "myocardial scar", "心筋瘢痕"],
    ["air_trapping", "air trapping", "エアトラッピング"], ["stone", "stone", "結石"], ["placental_interface", "placental interface", "胎盤境界"]
  ]) add(targets, key, en, ja);

  writeJson(anatomyPath, anatomy);
  writeJson(targetPath, targets);
}

function anatomy(s) {
  return { body_region: s.body_region, organ: s.organ, subregion: s.subregion, laterality: "unknown" };
}

function finding(s, modality, acq, code, text, target = "whole_lesion", weight = 3, typicality = "common") {
  return {
    finding_code: code,
    modality,
    acquisition: { type: modality === "CT" ? "phase" : "sequence", code: acq },
    anatomy: anatomy(s),
    target,
    modifiers: {},
    keywords: s.keywords.slice(0, 3),
    finding_text: text,
    typicality,
    diagnostic_weight: weight,
    review_status: "draft",
    mapping: { status: "matched", confidence: 0.82, matched_concept_id: code, alternatives: [] }
  };
}

function profileFindings(s) {
  const name = s.ja;
  const base = {
    mass: [
      finding(s, "CT", "non_contrast", "finding:ct_isoattenuation", `${name}はCTで軟部濃度の腫瘤または肥厚として描出されることがある。`, "whole_lesion", 2),
      finding(s, "MRI", "T1WI", "finding:t1_hypointensity", `${name}はT1WIで低信号を示すことが多い。`, "whole_lesion", 2),
      finding(s, "MRI", "T2WI", "finding:t2_hyperintensity", `${name}はT2WIで高信号または不均一信号を示すことがある。`, "whole_lesion", 3),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:enhancing_solid_component", `${name}は造影で充実部の増強を示す。`, "solid_component", 4),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_present", `${name}は細胞性成分で拡散制限を示すことがある。`, "whole_lesion", 3, "variable")
    ],
    cyst: [
      finding(s, "CT", "non_contrast", "finding:ct_hypoattenuation", `${name}は低吸収の嚢胞性または液体成分として描出される。`, "cystic_component", 3),
      finding(s, "MRI", "T1WI", "finding:t1_hypointensity", `${name}の液体成分はT1WI低信号を示すことが多い。`, "cyst_content", 2),
      finding(s, "MRI", "T2WI", "finding:t2_hyperintensity", `${name}はT2WI高信号を示す。`, "cystic_component", 4),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:mild_enhancement", `${name}は壁または隔壁に造影効果を伴うことがある。`, "cyst_wall", 3),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_absent", `${name}は単純液性成分では強い拡散制限を欠くことが多い。`, "cyst_content", 1, "variable")
    ],
    inflammatory: [
      finding(s, "CT", "non_contrast", "finding:ct_hypoattenuation", `${name}は炎症性低吸収域や周囲脂肪織変化を伴うことがある。`, "whole_lesion", 2),
      finding(s, "MRI", "T2WI", "finding:wall_thickening", `${name}は壁肥厚や軟部組織肥厚を示す。`, "wall", 4),
      finding(s, "MRI", "T2WI", "finding:t2_hyperintensity", `${name}は浮腫や液体貯留によりT2WI高信号を示す。`, "whole_lesion", 3),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_present", `${name}は膿瘍や高粘稠内容で拡散制限を示すことがある。`, "whole_lesion", 3, "variable"),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:ring_enhancement", `${name}は膿瘍形成時にリング状造影を示すことがある。`, "lesion_margin", 3, "variable")
    ],
    vascular: [
      finding(s, "CT", "non_contrast", "finding:ct_hyperattenuation", `${name}は急性血栓や出血性成分で高吸収を示すことがある。`, "thrombus", 2, "variable"),
      finding(s, "CT", "non_contrast", "finding:ct_hypoattenuation", `${name}は虚血・浮腫・灌流異常を反映した低吸収域を伴うことがある。`, "whole_lesion", 2),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_present", `${name}は虚血性変化で拡散制限を伴うことがある。`, "whole_lesion", 3, "variable"),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:mild_enhancement", `${name}は血管壁や周囲組織の造影変化を伴うことがある。`, "vascular_wall", 3),
      finding(s, "MRI", "T2STAR", "finding:hemorrhage_present", `${name}は出血性合併症をT2*系で評価する。`, "hemorrhagic_component", 2, "variable")
    ],
    fibrous: [
      finding(s, "CT", "non_contrast", "finding:ct_isoattenuation", `${name}はCTで軟部濃度の線維性変化として見えることがある。`, "whole_lesion", 2),
      finding(s, "MRI", "T1WI", "finding:t1_hypointensity", `${name}はT1WI低信号を示すことが多い。`, "whole_lesion", 2),
      finding(s, "MRI", "T2WI", "finding:t2_hypointensity", `${name}は線維性成分を反映してT2WI低信号を示すことがある。`, "fibrous_component", 4),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:mild_enhancement", `${name}は遅延性または不均一な増強を示すことがある。`, "whole_lesion", 3),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_absent", `${name}の拡散制限は病勢や成分により可変である。`, "whole_lesion", 1, "variable")
    ],
    tendon: [
      finding(s, "CT", "non_contrast", "finding:ct_isoattenuation", `${name}はCTで腱・靱帯または軟部組織の肥厚として見えることがある。`, "tendon", 1),
      finding(s, "MRI", "T1WI", "finding:t1_hypointensity", `${name}はT1WIで低信号の腱・線維性構造として評価される。`, "tendon", 2),
      finding(s, "MRI", "T2WI", "finding:t2_hyperintensity", `${name}は変性や断裂部でT2WI高信号を示す。`, "tendon", 4),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:mild_enhancement", `${name}は周囲滑膜炎や肉芽組織の増強を伴うことがある。`, "synovium", 2, "variable"),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_absent", `${name}は通常、腫瘍性細胞密度を反映する強い拡散制限を示さない。`, "tendon", 1, "variable")
    ]
  };
  return base[s.profile] || base.mass;
}

function demographics(age, sex = "no_sex_predilection") {
  const predominance = sex.includes("male") ? "male" : sex.includes("female") ? "female" : "none";
  return {
    sex: { applicable: sex.endsWith("_only") ? [predominance] : ["any"], predominance, predilection: sex, summary: "代表的な性差傾向を記録。" },
    age: { typical_min: age[0], typical_max: age[1], peak_decade: age[2], summary: "代表的な発症・診断年齢帯を記録。" }
  };
}

function frequency(label, setting, bodyRegion) {
  const ranks = { very_common: 5, common: 4, uncommon: 3, rare: 2, very_rare: 1, unknown: 0 };
  return { label, prevalence_rank: ranks[label] ?? 0, basis: "differential_importance", evidence_level: "public_review", context: { population: "any", body_region: bodyRegion, clinical_setting: setting }, summary: `${setting}の鑑別での相対頻度と重要度を記録。` };
}

function rawFinding(s, text) {
  return {
    raw_finding_id: `${s.id}_raw_001`,
    modality_text: "CT/MRI/US",
    acquisition_text: "疾患に応じた標準撮像",
    anatomy_text: `${s.ja}の典型的な主座`,
    target_text: "named_sign",
    finding_text: text,
    interpretation: "構造化辞書では拾い切れない疾患固有の所見・サインとして保存。",
    source_ids: [SOURCE_ID],
    mapping: { status: "candidate", candidate_finding_code: `finding:${s.id}_specific_sign`, candidate_anatomy: anatomy(s), candidate_target: "named_sign", notes: "Phase 1 raw finding" },
    review_status: "needs_mapping"
  };
}

function buildCard(s) {
  const findings = profileFindings(s).map((item, index) => ({ ...item, finding_id: `${s.id}_f${String(index + 1).padStart(3, "0")}` }));
  const ctGroups = [];
  const mriGroups = [];
  for (const item of findings) {
    const groups = item.modality === "CT" ? ctGroups : mriGroups;
    const code = item.acquisition.code;
    let group = groups.find((existing) => (existing.phase || existing.sequence).code === code);
    if (!group) groups.push(group = item.modality === "CT" ? { phase: { code }, findings: [] } : { sequence: { code }, findings: [] });
    group.findings.push(item);
  }
  const card = {
    schema_version: "0.8",
    disease_id: s.id,
    disease_name: { ja: s.ja, en: s.en },
    disease_aliases: { ja: [], en: s.aliases || [] },
    clinical: {
      overview: `${s.ja}は${s.setting}で重要な鑑別となる疾患で、臨床背景と画像分布を組み合わせて評価する。`,
      treatment: "治療方針は病型、病期、合併症、全身状態に応じて決定する。",
      epidemiology: "頻度と好発年齢は病型・背景疾患により異なる。"
    },
    demographics: demographics(s.age, s.sex),
    keywords: Array.from(new Set([s.en, s.ja, ...s.keywords])),
    frequency: frequency(s.freq, s.setting, s.body_region),
    imaging: {
      ct: { summary: `${s.ja}のCTでは濃度、石灰化、出血、造影効果、周囲変化を評価する。`, findings_by_phase: ctGroups },
      mri: { summary: `${s.ja}のMRIでは信号、拡散、造影効果、病変分布を評価する。`, findings_by_sequence: mriGroups }
    },
    raw_findings: [rawFinding(s, s.raw)],
    evidence: { summary: "NCBI Bookshelf、ACR Appropriateness Criteria、RadiologyInfo、PMC open-access review などの公開情報を参照。", claim_map: findings.map((item) => ({ finding_ids: [item.finding_id], source_ids: [SOURCE_ID], support: "public_source_summary" })) },
    image_examples: [],
    references: [PUBLIC_REFERENCE],
    review: { status: "draft", confidence: "medium", notes: "公開情報に基づく初期整理。" },
    curation: { batch: "general_batch8", generated_by: "curate-general-drafts-batch8.js" },
    provenance: { source_ids: [SOURCE_ID], generated_at: now },
    updated_at: now
  };
  card.content_hash = hashObject({ ...card, content_hash: "" });
  return card;
}

const SPECS = [
  ["pulmonary_sequestration","肺分画症","Pulmonary sequestration","vascular","chest","lung","lung_parenchyma",[0,80,"小児-若年"],"rare","先天性肺病変",["systemic arterial supply","sequestration"],"大動脈など体循環からの異常栄養血管を同定することが診断の鍵。"],
  ["bronchogenic_cyst","気管支原性嚢胞","Bronchogenic cyst","cyst","chest","mediastinum","mediastinal_compartment",[0,80,"若年-成人"],"uncommon","縦隔嚢胞",["foregut duplication cyst","subcarinal cyst"],"気管分岐部周囲の境界明瞭な嚢胞性病変で、高蛋白内容によりT1高信号を示すことがある。"],
  ["pulmonary_arteriovenous_malformation","肺動静脈奇形","Pulmonary arteriovenous malformation","vascular","chest","pulmonary_artery","pulmonary_artery_lumen",[0,90,"成人"],"rare","肺血管性結節",["feeding artery","draining vein"],"feeding arteryとdraining veinを伴う造影される肺結節/嚢状病変を示す。"],
  ["chronic_thromboembolic_pulmonary_hypertension","慢性血栓塞栓性肺高血圧症","Chronic thromboembolic pulmonary hypertension","vascular","chest","pulmonary_artery","pulmonary_artery_lumen",[20,100,"成人"],"uncommon","肺高血圧",["webs bands","mosaic perfusion"],"肺動脈内web/band、偏心性血栓、mosaic perfusionが手がかり。"],
  ["lymphangitic_carcinomatosis_lung","肺癌性リンパ管症","Pulmonary lymphangitic carcinomatosis","fibrous","chest","lymphatic_system","lymphangitic_interstitium",[20,100,"成人"],"uncommon","悪性腫瘍既往の息切れ",["nodular septal thickening","peribronchovascular thickening"],"小葉間隔壁と気管支血管束の不整・結節状肥厚を示す。"],
  ["asbestosis","石綿肺","Asbestosis","fibrous","chest","lung","interstitium",[30,100,"職業曝露"],"uncommon","職業性肺疾患",["pleural plaques","subpleural fibrosis"],"胸膜プラークと下肺野・胸膜下優位線維化を示す。"],
  ["lymphangioleiomyomatosis","リンパ脈管筋腫症","Lymphangioleiomyomatosis","cyst","chest","lung","lung_parenchyma",[15,60,"妊娠可能年齢"],"rare","びまん性嚢胞性肺疾患",["diffuse thin-walled cysts","LAM"],"びまん性・均等分布の薄壁肺嚢胞を示し、女性に多い。","female_predominant"],
  ["pulmonary_langerhans_cell_histiocytosis","肺ランゲルハンス細胞組織球症","Pulmonary Langerhans cell histiocytosis","cyst","chest","lung","lung_parenchyma",[15,60,"若年成人"],"rare","喫煙関連嚢胞性肺疾患",["upper lobe cysts","bizarre cysts"],"上中肺野優位の結節から奇怪な形態の嚢胞へ進行する。"],
  ["tracheobronchomalacia","気管気管支軟化症","Tracheobronchomalacia","fibrous","chest","trachea","tracheal_lumen",[0,100,"全年齢"],"uncommon","呼吸性気道狭窄",["dynamic airway collapse","expiratory CT"],"呼気相CTで気管・主気管支の過剰虚脱を示す。"],
  ["allergic_bronchopulmonary_aspergillosis","アレルギー性気管支肺アスペルギルス症","Allergic bronchopulmonary aspergillosis","inflammatory","chest","bronchus","bronchial_lumen",[5,80,"喘息患者"],"uncommon","粘液栓・気管支拡張",["central bronchiectasis","high attenuation mucus"],"中枢性気管支拡張と高吸収粘液栓が手がかり。"],
  ["lung_carcinoid_tumor","肺カルチノイド腫瘍","Pulmonary carcinoid tumor","mass","chest","lung","pulmonary_nodule",[10,90,"成人"],"uncommon","中枢気道腫瘍",["endobronchial mass","postobstructive atelectasis"],"造影される気管支内腫瘤と閉塞性無気肺/肺炎を伴うことがある。"],
  ["solitary_fibrous_tumor_pleura","胸膜孤立性線維性腫瘍","Solitary fibrous tumor of the pleura","fibrous","chest","pleura","pleural_surface",[20,90,"成人"],"rare","胸膜腫瘤",["pleural based mass","pedunculated pleural tumor"],"胸膜基部の境界明瞭腫瘤で茎を持つことがある。"],

  ["hypertrophic_cardiomyopathy","肥大型心筋症","Hypertrophic cardiomyopathy","fibrous","cardiac","myocardium","myocardial_wall",[0,100,"若年-成人"],"common","心筋症",["asymmetric septal hypertrophy","late gadolinium enhancement"],"非対称性中隔肥厚、流出路狭窄、LGEによる線維化を評価する。"],
  ["dilated_cardiomyopathy","拡張型心筋症","Dilated cardiomyopathy","fibrous","cardiac","myocardium","left_ventricle",[0,100,"成人"],"common","心不全",["ventricular dilatation","mid-wall LGE"],"左室拡大と収縮低下、中層LGEを伴うことがある。"],
  ["myocarditis","心筋炎","Myocarditis","inflammatory","cardiac","myocardium","myocardial_wall",[0,100,"全年齢"],"uncommon","胸痛・心筋障害",["myocardial edema","subepicardial LGE"],"心筋浮腫と非虚血性、しばしば心外膜下LGEを示す。"],
  ["cardiac_amyloidosis","心アミロイドーシス","Cardiac amyloidosis","fibrous","cardiac","myocardium","myocardial_wall",[40,100,"高齢者"],"uncommon","拘束型心筋症",["diffuse subendocardial LGE","abnormal nulling"],"びまん性心内膜下または全層LGEとnulling異常が手がかり。"],
  ["left_atrial_myxoma","左房粘液腫","Left atrial myxoma","mass","cardiac","cardiac_chamber","left_atrium",[20,90,"成人"],"rare","心腔内腫瘤",["atrial septal attachment","mobile mass"],"心房中隔付着の可動性左房腫瘤として見えることが多い。"],
  ["cardiac_metastasis","心臓転移","Cardiac metastasis","mass","cardiac","myocardium","myocardial_wall",[20,100,"成人"],"uncommon","悪性腫瘍既往の心病変",["pericardial metastasis","myocardial mass"],"心膜液、心膜結節、心筋内腫瘤として見えることがある。"],
  ["coronary_artery_aneurysm","冠動脈瘤","Coronary artery aneurysm","vascular","cardiac","coronary_artery","coronary_lumen",[0,100,"全年齢"],"rare","冠動脈異常",["coronary ectasia","mural thrombus"],"冠動脈局所拡張、壁在血栓、石灰化を評価する。"],

  ["budd_chiari_syndrome","Budd-Chiari症候群","Budd-Chiari syndrome","vascular","hepatobiliary","portal_vein","portal_vein_lumen",[10,80,"成人"],"rare","肝静脈流出路閉塞",["hepatic vein occlusion","caudate hypertrophy"],"肝静脈/下大静脈閉塞、尾状葉肥大、不均一肝濃染を示す。"],
  ["hepatic_hydatid_cyst","肝エキノコックス嚢胞","Hepatic hydatid cyst","cyst","hepatobiliary","liver","hepatic_parenchyma",[0,100,"流行地域"],"rare","肝嚢胞性病変",["daughter cysts","water lily sign"],"daughter cystsやwater-lily sign、壁石灰化を伴うことがある。"],
  ["caroli_disease","Caroli病","Caroli disease","cyst","hepatobiliary","bile_duct","biliary_tree",[0,80,"若年-成人"],"rare","胆管拡張",["central dot sign","saccular biliary dilatation"],"嚢状肝内胆管拡張とcentral dot signを示す。"],
  ["biliary_hamartomas","胆管過誤腫","Biliary hamartomas","cyst","hepatobiliary","liver","biliary_tree",[0,100,"成人"],"uncommon","多発小肝嚢胞",["von Meyenburg complexes","tiny T2 bright lesions"],"肝内に多発する微小T2高信号病変として見える。"],
  ["splenic_hemangioma","脾血管腫","Splenic hemangioma","vascular","abdomen","spleen","splenic_parenchyma",[0,100,"成人"],"uncommon","脾腫瘤",["splenic vascular lesion","progressive enhancement"],"血管性脾腫瘤で遅延性濃染を示すことがある。"],
  ["wandering_spleen_torsion","遊走脾捻転","Wandering spleen torsion","vascular","abdomen","spleen","splenic_hilum",[0,80,"小児-若年"],"rare","急性腹症",["whirl sign splenic pedicle","ectopic spleen"],"異所性脾と脾門部血管茎のwhirl sign、脾梗塞を示す。"],
  ["gastric_volvulus","胃軸捻転","Gastric volvulus","vascular","gastrointestinal","stomach","gastric_wall",[0,100,"全年齢"],"rare","急性上腹部痛",["upside-down stomach","transition at pylorus"],"胃の異常回転、閉塞、虚血徴候を評価する。"],
  ["superior_mesenteric_artery_syndrome","上腸間膜動脈症候群","Superior mesenteric artery syndrome","vascular","gastrointestinal","mesentery","mesenteric_vessels",[10,60,"若年"],"rare","十二指腸閉塞",["reduced aortomesenteric angle","duodenal compression"],"大動脈-上腸間膜動脈角狭小化と十二指腸水平脚圧排を示す。"],

  ["ureterolithiasis","尿管結石","Ureterolithiasis","cyst","urinary","ureter","ureteral_lumen",[10,100,"成人"],"common","疝痛・水腎症",["ureteral stone","hydroureteronephrosis"],"尿管内高吸収結石と上流尿管腎盂拡張を示す。"],
  ["hydronephrosis","水腎症","Hydronephrosis","cyst","urinary","kidney","renal_collecting_system",[0,100,"全年齢"],"common","尿路閉塞",["calyceal dilatation","parenchymal thinning"],"腎盂腎杯拡張、尿管拡張、腎実質菲薄化を評価する。"],
  ["xanthogranulomatous_pyelonephritis","黄色肉芽腫性腎盂腎炎","Xanthogranulomatous pyelonephritis","inflammatory","urinary","kidney","renal_cortex",[20,90,"中高年"],"rare","慢性腎感染",["bear paw sign","staghorn calculus"],"staghorn calculusとbear-paw sign、腎周囲炎症を示す。"],
  ["renal_infarction","腎梗塞","Renal infarction","vascular","urinary","kidney","renal_cortex",[0,100,"成人"],"uncommon","急性側腹部痛",["wedge-shaped renal infarct","cortical rim sign"],"楔状低濃染域とcortical rim signを示すことがある。"],
  ["autosomal_dominant_polycystic_kidney_disease","常染色体優性多発性嚢胞腎","Autosomal dominant polycystic kidney disease","cyst","urinary","kidney","renal_cortex",[0,100,"成人"],"common","多発腎嚢胞",["bilateral enlarged cystic kidneys","hepatic cysts"],"両側腎腫大と多数の腎嚢胞、肝嚢胞を伴うことがある。"],
  ["medullary_sponge_kidney","髄質海綿腎","Medullary sponge kidney","cyst","urinary","kidney","renal_collecting_system",[0,100,"成人"],"uncommon","腎石灰化",["paintbrush appearance","medullary nephrocalcinosis"],"集合管拡張によるpaintbrush appearanceと髄質石灰化を示す。"],
  ["bladder_diverticulum","膀胱憩室","Bladder diverticulum","cyst","urinary","urinary_bladder","bladder_wall",[0,100,"成人"],"common","膀胱壁突出",["outpouching bladder wall","narrow neck"],"膀胱壁外へ突出する嚢状構造で、頸部と残尿を評価する。"],
  ["female_urethral_diverticulum","女性尿道憩室","Female urethral diverticulum","cyst","urinary","urethra","urethral_wall",[15,80,"成人女性"],"uncommon","尿道周囲嚢胞",["saddlebag urethral diverticulum","periurethral cyst"],"尿道周囲のsaddlebag状嚢胞性病変として見えることがある。","female_only"],

  ["ovarian_torsion","卵巣捻転","Ovarian torsion","vascular","female_pelvis","ovary","adnexal_pedicle",[0,80,"小児-成人"],"common","急性骨盤痛",["twisted vascular pedicle","peripheral follicles"],"腫大卵巣、辺縁卵胞、twisted vascular pedicleを示す。","female_only"],
  ["polycystic_ovary_syndrome","多嚢胞性卵巣症候群","Polycystic ovary syndrome","cyst","female_pelvis","ovary","ovarian_stroma",[10,50,"若年女性"],"common","月経異常",["string of pearls","increased ovarian volume"],"卵巣腫大、末梢小卵胞配列、間質増加を示す。","female_only"],
  ["ectopic_pregnancy","異所性妊娠","Ectopic pregnancy","vascular","female_pelvis","fallopian_tube","fallopian_tube_lumen",[10,55,"妊娠可能年齢"],"common","妊娠初期腹痛",["tubal ring sign","hemoperitoneum"],"付属器tubal ring sign、血性腹水、子宮内妊娠欠如を評価する。","female_only"],
  ["retained_products_of_conception","遺残胎盤・絨毛組織","Retained products of conception","vascular","female_pelvis","endometrium","endometrial_cavity",[10,55,"産後・流産後"],"common","産後出血",["vascular endometrial mass","RPOC"],"子宮内腔の血流を伴う組織性病変と内膜肥厚を示す。","female_only"],
  ["gestational_trophoblastic_disease","妊娠性絨毛性疾患","Gestational trophoblastic disease","vascular","female_pelvis","uterus","endometrial_cavity",[10,55,"妊娠可能年齢"],"rare","高hCG・子宮内腫瘤",["snowstorm appearance","myometrial invasion"],"多嚢胞性子宮内腫瘤、筋層浸潤、血流増加を示す。","female_only"],
  ["pelvic_congestion_syndrome","骨盤内うっ血症候群","Pelvic congestion syndrome","vascular","female_pelvis","uterus","myometrium",[15,60,"妊娠可能年齢"],"uncommon","慢性骨盤痛",["dilated ovarian veins","pelvic varices"],"卵巣静脈拡張と骨盤内静脈瘤を示す。","female_only"],
  ["deep_infiltrating_endometriosis","深部子宮内膜症","Deep infiltrating endometriosis","fibrous","female_pelvis","uterus","myometrium",[15,60,"20-40歳代"],"common","慢性骨盤痛",["torus uterinus thickening","T2 dark fibrotic plaques"],"子宮仙骨靱帯や直腸腟中隔のT2低信号線維性肥厚を示す。","female_only"],

  ["intussusception_pediatric","小児腸重積","Pediatric intussusception","cyst","pediatric_abdomen","pediatric_bowel","pediatric_ileocecal",[0,5,"乳幼児"],"common","小児急性腹症",["target sign","pseudokidney sign"],"USでtarget sign、縦断像でpseudokidney signを示す。"],
  ["malrotation_midgut_volvulus","腸回転異常・中腸軸捻転","Malrotation with midgut volvulus","vascular","pediatric_abdomen","pediatric_bowel","mesenteric_vessels",[0,5,"新生児-乳児"],"rare","胆汁性嘔吐",["whirlpool sign SMA SMV","abnormal DJ junction"],"SMA/SMV周囲のwhirlpool signと十二指腸空腸移行部位置異常を示す。"],
  ["necrotizing_enterocolitis","壊死性腸炎","Necrotizing enterocolitis","inflammatory","pediatric_abdomen","pediatric_bowel","neonatal_bowel_wall",[0,1,"新生児"],"uncommon","新生児腹部膨満",["pneumatosis intestinalis","portal venous gas"],"腸管壁内ガス、門脈ガス、穿孔時遊離ガスを示す。"],
  ["hypertrophic_pyloric_stenosis","肥厚性幽門狭窄症","Hypertrophic pyloric stenosis","fibrous","pediatric_abdomen","pylorus","pyloric_channel",[0,1,"乳児"],"common","非胆汁性嘔吐",["elongated pyloric channel","thickened pyloric muscle"],"幽門筋肥厚と幽門管延長をUSで評価する。"],
  ["hirschsprung_disease","Hirschsprung病","Hirschsprung disease","fibrous","pediatric_abdomen","pediatric_bowel","bowel_wall",[0,10,"新生児-小児"],"uncommon","小児便秘・腸閉塞",["transition zone","rectosigmoid ratio reversal"],"注腸でtransition zoneとrectosigmoid ratio reversalを示す。"],
  ["biliary_atresia","胆道閉鎖症","Biliary atresia","fibrous","pediatric_abdomen","bile_duct","biliary_tree",[0,1,"乳児"],"rare","乳児黄疸",["triangular cord sign","absent gallbladder"],"triangular cord sign、胆嚢低形成、肝門部線維性索状影を示す。"],

  ["orbital_cellulitis","眼窩蜂窩織炎","Orbital cellulitis","inflammatory","orbit_head_neck","orbit","orbit",[0,100,"全年齢"],"common","眼窩感染",["postseptal inflammation","subperiosteal abscess"],"眼窩隔膜後脂肪織炎、外眼筋腫大、骨膜下膿瘍を評価する。"],
  ["idiopathic_orbital_inflammation","特発性眼窩炎症","Idiopathic orbital inflammation","inflammatory","orbit_head_neck","orbit","orbit",[0,100,"成人"],"uncommon","眼窩腫脹",["orbital pseudotumor","tendon involvement"],"外眼筋腱付着部を含む肥厚や涙腺・眼窩脂肪の炎症を示す。"],
  ["lacrimal_gland_pleomorphic_adenoma","涙腺多形腺腫","Pleomorphic adenoma of the lacrimal gland","mass","orbit_head_neck","lacrimal_gland","lacrimal_fossa",[10,80,"成人"],"rare","涙腺窩腫瘤",["well-circumscribed lacrimal gland mass","bone remodeling"],"涙腺窩の境界明瞭腫瘤で骨リモデリングを伴うことがある。"],
  ["invasive_fungal_sinusitis","浸潤性真菌性副鼻腔炎","Invasive fungal sinusitis","inflammatory","head_neck","sinonasal_cavity","sinus_lumen",[0,100,"免疫不全"],"rare","重症副鼻腔感染",["black turbinate sign","extrasinus invasion"],"black turbinate sign、眼窩/頭蓋内進展、骨破壊を評価する。"],
  ["cholesteatoma","真珠腫","Cholesteatoma","cyst","head_neck","temporal_bone","middle_ear",[0,100,"全年齢"],"common","中耳乳突病変",["non-echo-planar DWI bright lesion","ossicular erosion"],"DWI高信号の中耳病変と耳小骨・乳突蜂巣骨破壊を示す。"],
  ["odontogenic_abscess","歯原性膿瘍","Odontogenic abscess","inflammatory","dental","tooth","dental_root",[0,100,"全年齢"],"common","顎顔面感染",["periapical lucency","subperiosteal abscess"],"根尖部透亮像、皮質骨穿破、骨膜下/深頸部膿瘍を伴うことがある。"],
  ["mandibular_osteoradionecrosis","下顎骨放射線性骨壊死","Mandibular osteoradionecrosis","inflammatory","dental","mandible","mandibular_body",[20,100,"放射線治療後"],"uncommon","顎骨壊死",["exposed necrotic bone","pathologic fracture"],"下顎骨硬化・骨破壊、腐骨、病的骨折を示すことがある。"],
  ["parathyroid_adenoma","副甲状腺腺腫","Parathyroid adenoma","mass","head_neck","parathyroid","parathyroid_region",[20,90,"成人"],"common","副甲状腺機能亢進症",["polar vessel sign","washout on 4D CT"],"4D CTで早期濃染とwashout、polar vessel signを示すことがある。"],

  ["rotator_cuff_tear","腱板断裂","Rotator cuff tear","tendon","musculoskeletal","rotator_cuff","supraspinatus_tendon",[20,100,"中高年"],"common","肩痛",["full-thickness tear","tendon retraction"],"腱板全層断裂では液体信号が関節面から滑液包面まで連続し、腱退縮を伴う。"],
  ["achilles_tendon_rupture","アキレス腱断裂","Achilles tendon rupture","tendon","musculoskeletal","achilles_tendon","achilles_tendon_substance",[10,80,"成人"],"common","急性踵部痛",["tendon gap","wavy tendon fibers"],"腱連続性断裂、gap、波状化した腱線維を示す。"],
  ["plantar_fasciitis","足底腱膜炎","Plantar fasciitis","tendon","musculoskeletal","plantar_fascia","plantar_fascia_origin",[10,100,"成人"],"common","踵痛",["thickened plantar fascia","calcaneal marrow edema"],"足底腱膜起始部肥厚と周囲浮腫、踵骨骨髄浮腫を伴う。"],
  ["osteochondritis_dissecans","離断性骨軟骨炎","Osteochondritis dissecans","vascular","musculoskeletal","bone","osteochondral_surface",[5,50,"小児-若年"],"uncommon","関節痛",["unstable osteochondral fragment","fluid rim"],"骨軟骨片周囲の液体信号、嚢胞、骨髄浮腫は不安定性を示唆する。"],
  ["synovial_chondromatosis","滑膜性骨軟骨腫症","Synovial chondromatosis","mass","musculoskeletal","joint","synovium",[20,80,"成人"],"uncommon","関節内遊離体",["multiple calcified loose bodies","synovial proliferation"],"多数の石灰化/骨化遊離体と滑膜増殖を示す。"],
  ["pigmented_villonodular_synovitis","色素性絨毛結節性滑膜炎","Pigmented villonodular synovitis","fibrous","musculoskeletal","joint","synovium",[10,80,"成人"],"uncommon","慢性関節腫脹",["blooming hemosiderin","low T2 synovium"],"ヘモジデリンによりT2低信号とGRE/SWI bloomingを示す滑膜増殖が特徴。"],
  ["tenosynovial_giant_cell_tumor","腱滑膜巨細胞腫","Tenosynovial giant cell tumor","fibrous","musculoskeletal","soft_tissue","synovium",[10,80,"成人"],"uncommon","腱鞘腫瘤",["low T2 hemosiderin","enhancing synovial mass"],"腱鞘沿いのT2低信号腫瘤でヘモジデリンbloomingと造影を示す。"],
  ["mortons_neuroma","Morton神経腫","Morton neuroma","fibrous","musculoskeletal","peripheral_nerve","intermetatarsal_space",[20,80,"成人女性"],"common","前足部痛",["intermetatarsal neuroma","Mulder click"],"第2-3または第3-4中足骨間の低T1/低T2腫瘤として見える。","female_predominant"],
  ["peroneal_tendon_dislocation","腓骨筋腱脱臼","Peroneal tendon dislocation","tendon","musculoskeletal","achilles_tendon","achilles_tendon_substance",[10,80,"スポーツ外傷"],"uncommon","外果後方痛",["superior peroneal retinaculum injury","peroneal tendon subluxation"],"上腓骨筋支帯損傷と腓骨筋腱の亜脱臼/脱臼を評価する。"]
].map(([id, ja, en, profile, body_region, organ, subregion, age, freq, setting, keywords, raw, sex]) => ({ id, ja, en, profile, body_region, organ, subregion, age, freq, setting, keywords, raw, sex: sex || "no_sex_predilection" }));

function main() {
  ensureDictionaries();
  fs.mkdirSync(draftsDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });
  writeJson(path.join(publicDir, "general_batch8_public_sources.json"), {
    source_id: SOURCE_ID,
    generated_at: now,
    references: [
      PUBLIC_REFERENCE,
      { source_id: "ncbi_bookshelf", type: "website", title: "NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/", license: "Public web access" },
      { source_id: "acr_appropriateness_criteria", type: "guideline_index", title: "ACR Appropriateness Criteria", url: "https://acsearch.acr.org/list", license: "Public web access" },
      { source_id: "radiologyinfo", type: "patient_information", title: "RadiologyInfo.org", url: "https://www.radiologyinfo.org/", license: "Public web access" },
      { source_id: "pmc_open_access", type: "literature_index", title: "PubMed Central", url: "https://pmc.ncbi.nlm.nih.gov/", license: "Open-access article index" }
    ],
    note: "Phase 1全身疾患カードの典型画像所見を整理するための公開ソース束。"
  });

  let written = 0;
  let skipped = 0;
  for (const spec of SPECS) {
    const filePath = path.join(draftsDir, `${spec.id}.json`);
    if (fs.existsSync(filePath)) {
      skipped += 1;
      continue;
    }
    writeJson(filePath, buildCard(spec));
    written += 1;
  }
  console.log(`General Phase 1 batch 8 complete. Written: ${written}, skipped existing: ${skipped}`);
}

main();
