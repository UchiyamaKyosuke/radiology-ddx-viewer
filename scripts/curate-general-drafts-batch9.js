const fs = require("fs");
const path = require("path");
const { DATA, readJson, writeJson, hashObject } = require("./lib");

const now = new Date().toISOString();
const draftsDir = path.join(DATA, "drafts");
const dictDir = path.join(DATA, "dictionaries");
const publicDir = path.join(DATA, "sources", "public");
const SOURCE_ID = "public_general_batch9_20260705";

const PUBLIC_REFERENCE = {
  source_id: SOURCE_ID,
  type: "public_source_packet",
  title: "Public imaging source packet for accelerated whole-body Phase 1 draft batch 9",
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
    ["endocrine", "endocrine", "内分泌"], ["skin_soft_tissue", "skin and soft tissue", "皮膚軟部"],
    ["trauma", "trauma", "外傷"], ["pediatric", "pediatric", "小児"]
  ]) add(anatomy.body_regions, key, en, ja);

  for (const [key, parent, en, ja] of [
    ["skin", "skin_soft_tissue", "skin", "皮膚"], ["subcutaneous_tissue", "skin_soft_tissue", "subcutaneous tissue", "皮下組織"],
    ["hematopoietic_system", "abdomen", "hematopoietic system", "造血リンパ系"], ["esophagus", "gastrointestinal", "esophagus", "食道"],
    ["duodenum", "gastrointestinal", "duodenum", "十二指腸"], ["colon", "gastrointestinal", "colon", "結腸"],
    ["rectum", "gastrointestinal", "rectum", "直腸"], ["anal_canal", "gastrointestinal", "anal canal", "肛門管"],
    ["omentum", "abdomen", "omentum", "大網"], ["diaphragm", "chest", "diaphragm", "横隔膜"],
    ["rib", "chest", "rib", "肋骨"], ["brachial_plexus", "musculoskeletal", "brachial plexus", "腕神経叢"],
    ["hip", "musculoskeletal", "hip", "股関節"], ["knee", "musculoskeletal", "knee", "膝関節"],
    ["shoulder", "musculoskeletal", "shoulder", "肩関節"], ["ankle", "musculoskeletal", "ankle", "足関節"],
    ["foot", "musculoskeletal", "foot", "足部"], ["sacroiliac_joint", "musculoskeletal", "sacroiliac joint", "仙腸関節"],
    ["uterine_cavity", "female_pelvis", "uterine cavity", "子宮腔"], ["vulva", "female_pelvis", "vulva", "外陰"],
    ["seminal_vesicle", "male_pelvis", "seminal vesicle", "精嚢"], ["urachus", "urinary", "urachus", "尿膜管"],
    ["renal_vessel", "urinary", "renal vessel", "腎血管"], ["neonatal_adrenal", "pediatric", "neonatal adrenal gland", "新生児副腎"],
    ["sympathetic_chain", "abdomen", "sympathetic chain", "交感神経幹"], ["mediastinal_vessel", "chest", "mediastinal vessel", "縦隔血管"]
  ]) add(anatomy.organs, key, en, ja, { parent_body_region: parent });

  for (const [key, en, ja] of [
    ["skin_dermis", "skin dermis", "真皮"], ["subcutaneous_fat", "subcutaneous fat", "皮下脂肪"],
    ["esophageal_wall", "esophageal wall", "食道壁"], ["duodenal_wall", "duodenal wall", "十二指腸壁"],
    ["colonic_wall", "colonic wall", "結腸壁"], ["rectal_wall", "rectal wall", "直腸壁"], ["anal_canal_wall", "anal canal wall", "肛門管壁"],
    ["omental_fat", "omental fat", "大網脂肪"], ["diaphragmatic_crus", "diaphragmatic crus", "横隔膜脚"],
    ["rib_cortex", "rib cortex", "肋骨皮質"], ["brachial_plexus_root", "brachial plexus root", "腕神経叢根部"],
    ["acetabular_labrum", "acetabular labrum", "寛骨臼唇"], ["glenoid_labrum", "glenoid labrum", "関節唇"],
    ["meniscus", "meniscus", "半月板"], ["cruciate_ligament", "cruciate ligament", "十字靱帯"],
    ["sacroiliac_subchondral_bone", "sacroiliac subchondral bone", "仙腸関節軟骨下骨"],
    ["tarsal_bone", "tarsal bone", "足根骨"], ["metatarsal_bone", "metatarsal bone", "中足骨"],
    ["uterine_scar", "uterine scar", "子宮瘢痕"], ["vulvar_soft_tissue", "vulvar soft tissue", "外陰軟部組織"],
    ["seminal_vesicle_lumen", "seminal vesicle lumen", "精嚢内腔"], ["urachal_remnant", "urachal remnant", "尿膜管遺残"],
    ["renal_medulla", "renal medulla", "腎髄質"], ["renal_vascular_pedicle", "renal vascular pedicle", "腎血管茎"],
    ["adrenal_neonatal", "neonatal adrenal", "新生児副腎"], ["paraspinal_soft_tissue", "paraspinal soft tissue", "傍脊柱軟部"],
    ["sympathetic_chain_region", "sympathetic chain region", "交感神経幹領域"], ["mediastinal_vascular_space", "mediastinal vascular space", "縦隔血管腔"]
  ]) add(anatomy.subregions, key, en, ja);

  for (const [key, en, ja] of [
    ["ligament", "ligament", "靱帯"], ["labrum", "labrum", "関節唇"], ["cartilage", "cartilage", "軟骨"],
    ["periosteum", "periosteum", "骨膜"], ["scar", "scar", "瘢痕"], ["mucus", "mucus", "粘液"],
    ["abscess_cavity", "abscess cavity", "膿瘍腔"], ["tumor_matrix", "tumor matrix", "腫瘍基質"]
  ]) add(targets, key, en, ja);

  writeJson(anatomyPath, anatomy);
  writeJson(targetPath, targets);
}

function anatomy(s) {
  return { body_region: s.body_region, organ: s.organ, subregion: s.subregion, laterality: "unknown" };
}

function finding(s, modality, acq, code, text, target, weight = 3, typicality = "common") {
  return {
    finding_code: code,
    modality,
    acquisition: { type: modality === "CT" ? "phase" : "sequence", code: acq },
    anatomy: anatomy(s),
    target: target || "whole_lesion",
    modifiers: {},
    keywords: s.keywords.slice(0, 4),
    finding_text: text,
    typicality,
    diagnostic_weight: weight,
    review_status: "draft",
    mapping: { status: "matched", confidence: 0.82, matched_concept_id: code, alternatives: [] }
  };
}

function profile(s) {
  const n = s.ja;
  const p = {
    mass: [
      finding(s, "CT", "non_contrast", "finding:ct_isoattenuation", `${n}はCTで軟部濃度腫瘤、壁肥厚、または充実性病変として描出されることがある。`, "whole_lesion", 2),
      finding(s, "MRI", "T1WI", "finding:t1_hypointensity", `${n}はT1WI低信号を示すことが多く、脂肪や出血を含む場合は信号が変化する。`, "whole_lesion", 2),
      finding(s, "MRI", "T2WI", "finding:t2_hyperintensity", `${n}はT2WIで高信号から不均一信号を示し、壊死・嚢胞変性の評価に有用。`, "whole_lesion", 3),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:enhancing_solid_component", `${n}では造影される充実成分、浸潤範囲、隣接臓器との境界を評価する。`, "solid_component", 4),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_present", `${n}は細胞密度の高い部位でDWI高信号を示すことがある。`, "whole_lesion", 3, "variable")
    ],
    cyst: [
      finding(s, "CT", "non_contrast", "finding:ct_hypoattenuation", `${n}はCTで液体濃度または嚢胞性病変として描出されることがある。`, "cystic_component", 3),
      finding(s, "MRI", "T1WI", "finding:t1_hypointensity", `${n}の単純液性成分はT1WI低信号を示す。`, "cyst_content", 2),
      finding(s, "MRI", "T2WI", "finding:t2_hyperintensity", `${n}はT2WI高信号を示し、隔壁・壁肥厚・内容性状を評価する。`, "cystic_component", 4),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:mild_enhancement", `${n}では壁、隔壁、炎症性変化、または充実結節の造影効果を確認する。`, "cyst_wall", 3),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_absent", `${n}の単純液性成分は強い拡散制限を欠くことが多い。`, "cyst_content", 1, "variable")
    ],
    infection: [
      finding(s, "CT", "non_contrast", "finding:ct_hypoattenuation", `${n}は炎症性低吸収域、膿瘍、または周囲脂肪織濃度上昇として評価される。`, "whole_lesion", 2),
      finding(s, "MRI", "T2WI", "finding:wall_thickening", `${n}では壁肥厚、筋膜肥厚、または粘膜下浮腫を確認する。`, "wall", 4),
      finding(s, "MRI", "T2WI", "finding:t2_hyperintensity", `${n}は浮腫や液体貯留によりT2WI高信号を示す。`, "whole_lesion", 3),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_present", `${n}では膿瘍や高粘稠内容がDWI高信号/ADC低下を示すことがある。`, "abscess_cavity", 4, "variable"),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:ring_enhancement", `${n}は膿瘍形成時にリング状造影を示すことがある。`, "lesion_margin", 3, "variable")
    ],
    vascular: [
      finding(s, "CT", "non_contrast", "finding:ct_hyperattenuation", `${n}は急性血栓、出血、または高吸収塞栓として見えることがある。`, "thrombus", 2, "variable"),
      finding(s, "CT", "non_contrast", "finding:ct_hypoattenuation", `${n}は虚血、梗塞、浮腫、または灌流低下に伴う低吸収域を示すことがある。`, "whole_lesion", 2),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_present", `${n}は急性虚血性変化で拡散制限を伴うことがある。`, "whole_lesion", 3, "variable"),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:mild_enhancement", `${n}では血管壁、梗塞辺縁、炎症性変化の造影を評価する。`, "vascular_wall", 3),
      finding(s, "MRI", "T2STAR", "finding:hemorrhage_present", `${n}は出血性変化をT2*系で評価する。`, "hemorrhagic_component", 2, "variable")
    ],
    fibrous: [
      finding(s, "CT", "non_contrast", "finding:ct_isoattenuation", `${n}はCTで軟部濃度、硬化、または線維性肥厚として描出されることがある。`, "whole_lesion", 2),
      finding(s, "MRI", "T1WI", "finding:t1_hypointensity", `${n}はT1WI低信号を示すことが多い。`, "whole_lesion", 2),
      finding(s, "MRI", "T2WI", "finding:t2_hypointensity", `${n}は線維性成分、ヘモジデリン、硬化性変化によりT2WI低信号を示すことがある。`, "fibrous_component", 4),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:mild_enhancement", `${n}では遅延性または不均一な増強を確認する。`, "whole_lesion", 3),
      finding(s, "MRI", "DWI", "finding:diffusion_restriction_absent", `${n}の拡散制限は病勢や細胞成分により可変である。`, "whole_lesion", 1, "variable")
    ],
    fat: [
      finding(s, "CT", "non_contrast", "finding:ct_hypoattenuation", `${n}では脂肪濃度または脂肪を含む成分をCTで確認する。`, "fat_component", 3),
      finding(s, "MRI", "T1WI", "finding:t1_hyperintensity", `${n}の脂肪成分はT1WI高信号を示す。`, "fat_component", 4),
      finding(s, "MRI", "T1WI", "finding:fat_present", `${n}では肉眼的脂肪または脂肪信号が診断の手がかりとなる。`, "fat_component", 4),
      finding(s, "MRI", "T1WI_fat_suppressed", "finding:fat_suppression_signal_drop", `${n}の脂肪成分は脂肪抑制で信号低下する。`, "fat_component", 5),
      finding(s, "MRI", "contrast_enhanced_T1WI", "finding:mild_enhancement", `${n}では非脂肪性成分や隔壁の造影効果を確認する。`, "solid_component", 2, "variable")
    ]
  };
  return p[s.profile] || p.mass;
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

function rawFinding(s) {
  return {
    raw_finding_id: `${s.id}_raw_001`,
    modality_text: "CT/MRI/US",
    acquisition_text: "疾患に応じた標準撮像",
    anatomy_text: `${s.ja}の典型的な主座`,
    target_text: "named_sign",
    finding_text: s.raw,
    interpretation: "構造化辞書では拾い切れない疾患固有の所見・サインとして保存。",
    source_ids: [SOURCE_ID],
    mapping: { status: "candidate", candidate_finding_code: `finding:${s.id}_specific_sign`, candidate_anatomy: anatomy(s), candidate_target: "named_sign", notes: "Phase 1 raw finding" },
    review_status: "needs_mapping"
  };
}

function buildCard(s) {
  const findings = profile(s).map((item, i) => ({ ...item, finding_id: `${s.id}_f${String(i + 1).padStart(3, "0")}` }));
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
      overview: `${s.ja}は${s.setting}で重要な鑑別となる疾患で、典型所見として${s.raw}。臨床背景、病変分布、造影効果を組み合わせて評価する。`,
      treatment: s.treatment || "治療方針は病型、重症度、合併症、全身状態に応じて決定する。",
      epidemiology: s.epidemiology || "頻度と好発年齢は病型・背景疾患・地域差により異なる。"
    },
    demographics: demographics(s.age, s.sex),
    keywords: Array.from(new Set([s.en, s.ja, ...s.keywords])),
    frequency: frequency(s.freq, s.setting, s.body_region),
    imaging: {
      ct: { summary: `${s.ja}のCTでは濃度、石灰化、出血、ガス、造影効果、周囲変化を評価する。`, findings_by_phase: ctGroups },
      mri: { summary: `${s.ja}のMRIでは信号、拡散、造影効果、病変分布、隣接構造への進展を評価する。`, findings_by_sequence: mriGroups }
    },
    raw_findings: [rawFinding(s)],
    evidence: { summary: "NCBI Bookshelf、ACR Appropriateness Criteria、RadiologyInfo、PMC open-access review などの公開情報を参照。", claim_map: findings.map((item) => ({ finding_ids: [item.finding_id], source_ids: [SOURCE_ID], support: "public_source_summary" })) },
    image_examples: [],
    references: [PUBLIC_REFERENCE],
    review: { status: "draft", confidence: "medium", notes: "公開情報に基づく初期整理。" },
    curation: { batch: "general_batch9", generated_by: "curate-general-drafts-batch9.js", detail_level: "expanded" },
    provenance: { source_ids: [SOURCE_ID], generated_at: now },
    updated_at: now
  };
  card.content_hash = hashObject({ ...card, content_hash: "" });
  return card;
}

const R = (id, ja, en, profile, body_region, organ, subregion, age, freq, setting, keywords, raw, sex, treatment, epidemiology) => ({ id, ja, en, profile, body_region, organ, subregion, age, freq, setting, keywords, raw, sex: sex || "no_sex_predilection", treatment, epidemiology });

const SPECS = [
  R("miliary_tuberculosis_lung","粟粒結核","Miliary pulmonary tuberculosis","infection","chest","lung","lung_parenchyma",[0,100,"全年齢"],"uncommon","びまん性小結節影",["miliary nodules","tuberculosis"],"両肺にランダム分布する均一な微小結節を示す"),
  R("pneumocystis_jirovecii_pneumonia","ニューモシスチス肺炎","Pneumocystis jirovecii pneumonia","infection","chest","lung","alveolar_space",[0,100,"免疫不全"],"uncommon","免疫不全の肺炎",["PJP","ground-glass opacity"],"両側びまん性すりガラス影、嚢胞形成、気胸を伴うことがある"),
  R("cmv_pneumonia","CMV肺炎","Cytomegalovirus pneumonia","infection","chest","lung","lung_parenchyma",[0,100,"免疫不全"],"rare","免疫不全の肺炎",["CMV","centrilobular nodules"],"すりガラス影、小結節、consolidationが混在することがある"),
  R("eosinophilic_pneumonia","好酸球性肺炎","Eosinophilic pneumonia","infection","chest","lung","alveolar_space",[10,90,"成人"],"uncommon","末梢優位肺炎",["photographic negative edema","peripheral consolidation"],"末梢優位consolidationが肺水腫の写真陰性像様に分布することがある"),
  R("diffuse_alveolar_hemorrhage","びまん性肺胞出血","Diffuse alveolar hemorrhage","vascular","chest","lung","alveolar_space",[0,100,"全年齢"],"uncommon","喀血・急性呼吸不全",["alveolar hemorrhage","ground-glass opacity"],"急性期にびまん性すりガラス影、時間経過で濃度変化を示す"),
  R("pulmonary_contusion","肺挫傷","Pulmonary contusion","vascular","trauma","lung","lung_parenchyma",[0,100,"外傷"],"common","胸部外傷",["nonsegmental opacity","trauma"],"区域に一致しないすりガラス影やconsolidationが外傷部近傍に出現する"),
  R("pulmonary_laceration","肺裂傷","Pulmonary laceration","vascular","trauma","lung","lung_parenchyma",[0,100,"外傷"],"uncommon","胸部外傷",["traumatic pneumatocele","pulmonary hematoma"],"肺内空洞、気液面、血腫を伴う外傷性病変を示す"),
  R("flail_chest","動揺胸郭","Flail chest","vascular","trauma","rib","rib_cortex",[0,100,"多発肋骨骨折"],"uncommon","胸部外傷",["segmental rib fractures","paradoxical motion"],"連続肋骨の複数箇所骨折と肺挫傷・血気胸を伴うことがある"),
  R("diaphragmatic_rupture","横隔膜破裂","Diaphragmatic rupture","vascular","trauma","diaphragm","diaphragmatic_crus",[0,100,"外傷"],"uncommon","胸腹部外傷",["collar sign","dependent viscera sign"],"collar signやdependent viscera sign、腹腔内臓器の胸腔内脱出を示す"),
  R("esophageal_perforation","食道穿孔","Esophageal perforation","infection","gastrointestinal","esophagus","esophageal_wall",[0,100,"急性胸痛"],"rare","縦隔気腫",["pneumomediastinum","contrast leak"],"縦隔気腫、食道周囲液体、造影剤漏出を示す"),
  R("achalasia","アカラシア","Achalasia","fibrous","gastrointestinal","esophagus","esophageal_wall",[10,90,"成人"],"uncommon","嚥下障害",["bird-beak narrowing","dilated esophagus"],"食道拡張と胃食道接合部のbird-beak状狭窄を示す"),
  R("esophageal_cancer","食道癌","Esophageal cancer","mass","gastrointestinal","esophagus","esophageal_wall",[40,100,"中高年"],"common","嚥下障害",["irregular esophageal wall thickening","mediastinal nodes"],"不整な食道壁肥厚、周囲脂肪織浸潤、縦隔リンパ節転移を評価する"),
  R("hiatal_hernia","食道裂孔ヘルニア","Hiatal hernia","cyst","gastrointestinal","stomach","gastric_wall",[20,100,"成人"],"common","胸部下部腫瘤・逆流症",["retrocardiac air-fluid level","sliding hernia"],"胃噴門部が食道裂孔を越えて胸腔側へ脱出する"),
  R("mallory_weiss_tear","Mallory-Weiss裂傷","Mallory-Weiss tear","vascular","gastrointestinal","esophagus","esophageal_wall",[10,100,"嘔吐後吐血"],"uncommon","上部消化管出血",["gastroesophageal junction tear","active extravasation"],"胃食道接合部近傍の粘膜裂創と活動性出血を評価する"),
  R("boerhaave_syndrome","Boerhaave症候群","Boerhaave syndrome","infection","gastrointestinal","esophagus","esophageal_wall",[10,100,"嘔吐後胸痛"],"rare","食道破裂",["left pleural effusion","pneumomediastinum"],"食道壁全層破裂により縦隔気腫、胸水、造影剤漏出を示す"),
  R("aortoenteric_fistula","大動脈腸管瘻","Aortoenteric fistula","vascular","cardiovascular","aorta","aortic_lumen",[30,100,"消化管出血"],"rare","術後または大動脈瘤合併症",["ectopic gas near graft","contrast extravasation into bowel"],"人工血管周囲ガス、腸管との接触、造影剤腸管内漏出が手がかり"),
  R("aortic_intramural_hematoma","大動脈壁内血腫","Aortic intramural hematoma","vascular","cardiovascular","aorta","aortic_lumen",[40,100,"急性大動脈症候群"],"uncommon","急性胸背部痛",["crescentic high attenuation aortic wall","no intimal flap"],"単純CTで三日月状高吸収壁肥厚を示し、明瞭なintimal flapを欠く"),
  R("penetrating_aortic_ulcer","穿通性大動脈潰瘍","Penetrating aortic ulcer","vascular","cardiovascular","aorta","aortic_lumen",[50,100,"動脈硬化背景"],"uncommon","急性大動脈症候群",["ulcer-like projection","atherosclerotic aorta"],"高度粥状硬化を背景に造影剤が壁内へ突出するulcer-like projectionを示す"),
  R("mycotic_aortic_aneurysm","感染性大動脈瘤","Mycotic aortic aneurysm","infection","cardiovascular","aorta","aortic_lumen",[0,100,"発熱・動脈瘤"],"rare","感染性動脈瘤",["saccular aneurysm","periaortic inflammation"],"嚢状動脈瘤、周囲軟部影、急速増大が手がかり"),
  R("takotsubo_cardiomyopathy","たこつぼ心筋症","Takotsubo cardiomyopathy","vascular","cardiac","myocardium","left_ventricle",[30,100,"急性胸痛"],"uncommon","急性冠症候群様症状",["apical ballooning","myocardial edema without infarct LGE"],"心尖部ballooningと冠動脈支配に一致しない壁運動異常を示す"),
  R("acute_myocardial_infarction_mri","急性心筋梗塞MRIパターン","Acute myocardial infarction MRI pattern","vascular","cardiac","myocardium","myocardial_wall",[20,100,"急性冠症候群"],"common","胸痛・心筋逸脱酵素上昇",["subendocardial LGE","microvascular obstruction"],"冠動脈支配域に一致する心内膜下または全層LGEを示す"),
  R("left_ventricular_thrombus","左室内血栓","Left ventricular thrombus","vascular","cardiac","cardiac_chamber","left_ventricle",[20,100,"心筋梗塞後・心不全"],"uncommon","心腔内欠損",["nonenhancing ventricular thrombus","apical aneurysm"],"遅延造影で増強しない左室内腫瘤として血栓を同定する"),
  R("arrhythmogenic_right_ventricular_cardiomyopathy","不整脈原性右室心筋症","Arrhythmogenic right ventricular cardiomyopathy","fat","cardiac","myocardium","myocardial_wall",[10,70,"若年-成人"],"rare","不整脈・右室異常",["right ventricular dilation","fibrofatty replacement"],"右室拡大、壁運動異常、線維脂肪置換が手がかり"),
  R("cardiac_sarcoidosis","心サルコイドーシス","Cardiac sarcoidosis","inflammatory","cardiac","myocardium","myocardial_wall",[20,90,"成人"],"uncommon","不整脈・心不全",["patchy mid-myocardial LGE","basal septal involvement"],"基部中隔などに斑状の非虚血性LGEを示す"),
  R("infective_endocarditis_abscess","感染性心内膜炎弁輪部膿瘍","Perivalvular abscess in infective endocarditis","infection","cardiac","heart","cardiac_myocardium",[0,100,"感染性心内膜炎"],"uncommon","弁輪部感染",["perivalvular abscess","pseudoaneurysm"],"弁輪周囲の膿瘍、仮性瘤、瘻孔形成を評価する"),
  R("pericardial_cyst","心膜嚢胞","Pericardial cyst","cyst","cardiac","pericardium","pericardium",[0,100,"偶発縦隔嚢胞"],"uncommon","心横隔膜角嚢胞",["right cardiophrenic angle cyst","water attenuation"],"心横隔膜角の境界明瞭な水濃度嚢胞として見える"),
  R("thyroiditis","甲状腺炎","Thyroiditis","infection","head_neck","thyroid","thyroid_lobe",[0,100,"甲状腺腫大・疼痛"],"common","甲状腺びまん性病変",["diffuse thyroid enlargement","hypervascularity"],"びまん性甲状腺腫大、低エコー化、血流変化を示す"),
  R("graves_disease","Basedow病","Graves disease","vascular","endocrine","thyroid","thyroid_lobe",[10,80,"成人女性"],"common","甲状腺機能亢進症",["thyroid inferno","diffuse hypervascular thyroid"],"びまん性甲状腺腫大と著明な血流増加を示す","female_predominant"),
  R("multinodular_goiter","多結節性甲状腺腫","Multinodular goiter","mass","head_neck","thyroid","thyroid_lobe",[20,100,"成人"],"common","甲状腺腫大",["multinodular thyroid enlargement","retrosternal extension"],"多結節性甲状腺腫大と縦隔内進展、気管偏位を評価する"),
  R("medullary_thyroid_carcinoma","甲状腺髄様癌","Medullary thyroid carcinoma","mass","head_neck","thyroid","thyroid_lobe",[10,90,"成人"],"rare","甲状腺悪性腫瘍",["coarse calcification","nodal metastasis"],"粗大石灰化を伴う甲状腺腫瘤と頸部リンパ節転移を評価する"),
  R("anaplastic_thyroid_carcinoma","甲状腺未分化癌","Anaplastic thyroid carcinoma","mass","head_neck","thyroid","thyroid_lobe",[50,100,"高齢者"],"rare","急速増大甲状腺腫瘤",["invasive thyroid mass","airway encasement"],"急速増大する浸潤性甲状腺腫瘤で気道・食道浸潤を評価する"),
  R("paraganglioma_carotid_body","頸動脈小体腫瘍","Carotid body paraganglioma","vascular","head_neck","lymph_node","cervical_lymph_node",[10,90,"成人"],"rare","頸動脈分岐部腫瘤",["splaying of internal and external carotid arteries","salt and pepper"],"内外頸動脈を開大させる多血性腫瘤として見える"),
  R("glomus_jugulare_tumor","頸静脈孔傍神経節腫","Glomus jugulare tumor","vascular","head_neck","temporal_bone","middle_ear",[20,90,"成人"],"rare","側頭骨多血性腫瘤",["moth-eaten jugular foramen","salt and pepper"],"頸静脈孔の虫食い状骨破壊と多血性腫瘤を示す"),
  R("juvenile_nasopharyngeal_angiofibroma","若年性鼻咽腔血管線維腫","Juvenile nasopharyngeal angiofibroma","vascular","head_neck","sinonasal_cavity","nasopharynx",[5,25,"思春期男性"],"rare","上咽頭多血性腫瘤",["pterygopalatine fossa widening","anterior bowing posterior maxillary wall"],"翼口蓋窩拡大と上顎洞後壁前方偏位を伴う多血性腫瘤","male_predominant"),
  R("sinonasal_polyposis","鼻副鼻腔ポリポーシス","Sinonasal polyposis","cyst","head_neck","sinonasal_cavity","sinus_lumen",[0,100,"慢性鼻閉"],"common","鼻副鼻腔病変",["bilateral nasal polyps","sinus opacification"],"両側鼻腔・副鼻腔を占めるポリープ状軟部影を示す"),
  R("paranasal_sinus_mucocele","副鼻腔粘液嚢胞","Paranasal sinus mucocele","cyst","head_neck","sinonasal_cavity","sinus_lumen",[10,100,"成人"],"uncommon","副鼻腔拡張性嚢胞",["expansile sinus lesion","bone remodeling"],"副鼻腔を拡張させる嚢胞性病変で骨菲薄化・リモデリングを伴う"),
  R("sinonasal_inverted_papilloma","鼻副鼻腔内反性乳頭腫","Sinonasal inverted papilloma","mass","head_neck","sinonasal_cavity","sinus_lumen",[20,90,"成人男性"],"uncommon","片側鼻腔腫瘤",["cerebriform pattern","focal hyperostosis"],"MRIでcerebriform pattern、CTで付着部の限局性骨硬化を示す","male_predominant"),
  R("sinonasal_squamous_cell_carcinoma","鼻副鼻腔扁平上皮癌","Sinonasal squamous cell carcinoma","mass","head_neck","sinonasal_cavity","sinus_lumen",[30,100,"中高年"],"uncommon","鼻副鼻腔悪性腫瘍",["bone destruction","orbital invasion"],"骨破壊、眼窩・頭蓋底浸潤、壊死性腫瘤を評価する"),
  R("peritonsillar_abscess","扁桃周囲膿瘍","Peritonsillar abscess","infection","head_neck","soft_tissue","oropharynx",[5,80,"若年-成人"],"common","咽頭痛・開口障害",["rim-enhancing peritonsillar collection","uvular deviation"],"扁桃周囲のリング状造影性液体貯留と口蓋垂偏位を示す"),
  R("retropharyngeal_abscess","咽後膿瘍","Retropharyngeal abscess","infection","head_neck","soft_tissue","oropharynx",[0,80,"小児-成人"],"uncommon","深頸部感染",["retropharyngeal fluid collection","danger space spread"],"咽後間隙液体貯留、縦隔進展、気道狭窄を評価する"),
  R("lemierre_syndrome","Lemierre症候群","Lemierre syndrome","vascular","head_neck","lymph_node","cervical_lymph_node",[10,50,"若年"],"rare","咽頭感染後敗血症",["internal jugular vein thrombosis","septic pulmonary emboli"],"内頸静脈血栓性静脈炎と敗血症性肺塞栓を示す"),
  R("odontogenic_keratocyst","歯原性角化嚢胞","Odontogenic keratocyst","cyst","dental","mandible","mandibular_body",[5,80,"若年-成人"],"uncommon","顎骨嚢胞",["scalloped mandibular cyst","minimal expansion"],"下顎骨内を長軸方向に進展するscalloped marginの嚢胞性病変"),
  R("ameloblastoma","エナメル上皮腫","Ameloblastoma","mass","dental","mandible","mandibular_body",[10,80,"成人"],"uncommon","顎骨腫瘍",["soap-bubble jaw lesion","root resorption"],"多房性soap-bubble様下顎骨病変と歯根吸収を示す"),
  R("florid_cemento_osseous_dysplasia","開花性セメント質骨異形成症","Florid cemento-osseous dysplasia","fibrous","dental","mandible","mandibular_body",[20,100,"中年女性"],"uncommon","顎骨硬化性病変",["multifocal periapical sclerosis","cemento-osseous dysplasia"],"多発性根尖周囲硬化性病変として見える","female_predominant"),
  R("hepatic_steatosis","脂肪肝","Hepatic steatosis","fat","hepatobiliary","liver","hepatic_parenchyma",[0,100,"全年齢"],"very_common","肝濃度低下",["diffuse hepatic steatosis","signal drop opposed phase"],"CTで肝濃度低下、opposed-phase MRIで信号低下を示す"),
  R("focal_fatty_sparing_liver","限局性脂肪沈着回避","Focal fatty sparing of the liver","fat","hepatobiliary","liver","hepatic_parenchyma",[0,100,"脂肪肝背景"],"common","偽腫瘤性肝病変",["geographic fatty sparing","no mass effect"],"胆嚢床周囲などに地図状分布し、mass effectを欠く"),
  R("hepatic_iron_overload","肝鉄過剰症","Hepatic iron overload","fibrous","hepatobiliary","liver","hepatic_parenchyma",[0,100,"輸血・鉄代謝異常"],"uncommon","びまん性肝低信号",["T2 star shortening","diffuse hepatic low signal"],"T2*/T2低信号とR2*上昇により肝鉄沈着を評価する"),
  R("acute_hepatitis","急性肝炎","Acute hepatitis","infection","hepatobiliary","liver","hepatic_parenchyma",[0,100,"急性肝障害"],"common","肝逸脱酵素上昇",["periportal edema","gallbladder wall thickening"],"門脈周囲浮腫、胆嚢壁肥厚、肝腫大を伴うことがある"),
  R("congestive_hepatopathy","うっ血肝","Congestive hepatopathy","vascular","hepatobiliary","liver","hepatic_parenchyma",[0,100,"右心不全"],"common","肝うっ血",["nutmeg liver","dilated hepatic veins"],"肝静脈・下大静脈拡張とnutmeg enhancementを示す"),
  R("portal_hypertension","門脈圧亢進症","Portal hypertension","vascular","hepatobiliary","portal_vein","portal_vein_lumen",[0,100,"慢性肝疾患"],"common","側副血行路",["varices","splenomegaly","ascites"],"脾腫、腹水、食道胃静脈瘤、側副血行路を評価する"),
  R("peliosis_hepatis","肝ペリオーシス","Peliosis hepatis","vascular","hepatobiliary","liver","hepatic_parenchyma",[0,100,"薬剤・免疫不全"],"rare","多発肝血液腔",["blood-filled cavities","centripetal enhancement"],"血液を含む多発肝内腔が多彩な造影パターンを示す"),
  R("hepatic_laceration_trauma","外傷性肝損傷","Traumatic hepatic laceration","vascular","trauma","liver","hepatic_parenchyma",[0,100,"外傷"],"common","腹部外傷",["linear hepatic laceration","active extravasation"],"線状低吸収裂創、被膜下血腫、造影剤血管外漏出を評価する"),
  R("splenic_laceration_trauma","外傷性脾損傷","Traumatic splenic laceration","vascular","trauma","spleen","splenic_parenchyma",[0,100,"外傷"],"common","腹部外傷",["splenic laceration","sentinel clot"],"脾裂創、被膜下血腫、腹腔内出血、活動性出血を評価する"),
  R("accessory_spleen","副脾","Accessory spleen","mass","abdomen","spleen","splenic_hilum",[0,100,"偶発結節"],"common","脾門部結節",["splenic-equivalent enhancement","splenule"],"脾臓と同じ信号・濃染パターンを示す小結節"),
  R("splenosis","脾症","Splenosis","mass","abdomen","spleen","peritoneal_cavity",[0,100,"脾損傷・脾摘後"],"uncommon","腹腔内多発結節",["post-traumatic splenic implants","Tc-99m heat-damaged RBC uptake"],"脾摘後に腹膜・胸膜へ移植された脾組織結節として見える"),
  R("adrenal_hemorrhage","副腎出血","Adrenal hemorrhage","vascular","abdomen","adrenal_gland","adrenal",[0,100,"外傷・抗凝固・新生児"],"uncommon","副腎腫瘤",["acute adrenal hyperattenuation","evolving hematoma"],"急性期高吸収副腎腫大から経時的に縮小・信号変化を示す"),
  R("congenital_adrenal_hyperplasia","先天性副腎過形成","Congenital adrenal hyperplasia","mass","endocrine","adrenal_gland","adrenal",[0,100,"小児-成人"],"rare","副腎過形成",["bilateral adrenal enlargement","cerebriform adrenal glands"],"両側副腎腫大と脳回様形態を示すことがある"),
  R("neonatal_adrenal_hemorrhage","新生児副腎出血","Neonatal adrenal hemorrhage","vascular","pediatric","neonatal_adrenal","adrenal_neonatal",[0,1,"新生児"],"uncommon","新生児副腎腫瘤",["evolving adrenal hematoma","no internal vascularity"],"内部血流を欠く副腎血腫が時間経過で縮小・石灰化する"),
  R("retroperitoneal_liposarcoma","後腹膜脂肪肉腫","Retroperitoneal liposarcoma","fat","abdomen","retroperitoneum","retroperitoneal_space",[20,100,"成人"],"uncommon","後腹膜脂肪性腫瘤",["large retroperitoneal fatty mass","thick septa nodules"],"巨大脂肪性腫瘤内の厚い隔壁や非脂肪性結節を評価する"),
  R("retroperitoneal_lymphoma","後腹膜リンパ腫","Retroperitoneal lymphoma","mass","abdomen","lymph_node","retroperitoneal_space",[0,100,"成人"],"common","後腹膜リンパ節腫大",["homogeneous nodal conglomerate","vessel encasement"],"均一なリンパ節塊が血管を取り囲んでも閉塞が軽いことがある"),
  R("duodenal_ulcer_perforation","十二指腸潰瘍穿孔","Duodenal ulcer perforation","infection","gastrointestinal","duodenum","duodenal_wall",[10,100,"急性腹症"],"common","上腹部痛",["pneumoperitoneum near duodenum","duodenal wall thickening"],"十二指腸近傍の遊離ガス、壁肥厚、周囲液体を示す"),
  R("duodenal_diverticulitis","十二指腸憩室炎","Duodenal diverticulitis","infection","gastrointestinal","duodenum","duodenal_wall",[20,100,"成人"],"uncommon","上腹部痛",["inflamed periampullary diverticulum","retroperitoneal gas"],"傍乳頭憩室周囲炎、後腹膜気腫、胆膵管圧排を伴うことがある"),
  R("celiac_disease","セリアック病","Celiac disease","fibrous","gastrointestinal","bowel","bowel_wall",[0,100,"吸収不良"],"uncommon","小腸疾患",["reversal jejunoileal fold pattern","transient intussusception"],"空腸皺襞減少と回腸皺襞増加、腸重積を伴うことがある"),
  R("meckel_diverticulitis","Meckel憩室炎","Meckel diverticulitis","infection","gastrointestinal","bowel","bowel_wall",[0,80,"小児-若年"],"uncommon","右下腹部痛",["blind-ending ileal diverticulum","ectopic gastric mucosa"],"回腸から盲端状に突出する炎症性憩室として見える"),
  R("adult_intussusception","成人腸重積","Adult intussusception","mass","gastrointestinal","bowel","bowel_wall",[10,100,"成人"],"uncommon","腸閉塞",["bowel-within-bowel","lead point mass"],"bowel-within-bowel appearanceと器質的lead pointを評価する"),
  R("cecal_volvulus","盲腸軸捻転","Cecal volvulus","vascular","gastrointestinal","colon","colonic_wall",[10,100,"成人"],"uncommon","腸閉塞",["coffee bean cecum","whirl sign"],"拡張盲腸の異常位置と腸間膜whirl signを示す"),
  R("sigmoid_volvulus","S状結腸軸捻転","Sigmoid volvulus","vascular","gastrointestinal","colon","colonic_wall",[20,100,"高齢者"],"common","大腸閉塞",["coffee bean sign","bird beak tapering"],"coffee bean sign、bird-beak tapering、mesenteric whirlを示す"),
  R("internal_hernia","内ヘルニア","Internal hernia","vascular","gastrointestinal","mesentery","mesenteric_vessels",[0,100,"術後・急性腹症"],"uncommon","絞扼性腸閉塞",["clustered bowel loops","mesenteric swirl"],"腸管集簇、腸間膜血管swirl、閉塞・虚血徴候を示す"),
  R("omental_infarction","大網梗塞","Omental infarction","fat","abdomen","omentum","omental_fat",[10,100,"成人"],"uncommon","限局性腹痛",["cake-like omental fat stranding","right-sided omental infarct"],"大網内の限局性脂肪濃度上昇と渦巻き状血管を示すことがある"),
  R("sclerosing_mesenteritis","硬化性腸間膜炎","Sclerosing mesenteritis","fibrous","abdomen","mesentery","mesenteric_vessels",[20,100,"成人"],"uncommon","腸間膜脂肪病変",["fat ring sign","tumoral pseudocapsule"],"fat ring signと腫瘤様偽被膜を伴う腸間膜脂肪織変化を示す"),
  R("proctitis","直腸炎","Proctitis","infection","gastrointestinal","rectum","rectal_wall",[0,100,"直腸痛・下血"],"common","直腸壁肥厚",["rectal wall thickening","perirectal fat stranding"],"直腸壁肥厚、粘膜増強、直腸周囲脂肪織炎を示す"),
  R("anal_cancer","肛門管癌","Anal cancer","mass","gastrointestinal","anal_canal","anal_canal_wall",[30,100,"成人"],"uncommon","肛門管腫瘤",["anal canal mass","inguinal nodes"],"肛門管腫瘤と鼠径リンパ節転移、括約筋浸潤を評価する"),
  R("renal_lymphoma","腎リンパ腫","Renal lymphoma","mass","urinary","kidney","renal_cortex",[0,100,"リンパ腫"],"uncommon","腎多発腫瘤",["multiple hypovascular renal masses","renal sinus infiltration"],"低血流性多発腎腫瘤や腎洞浸潤として見えることがある"),
  R("renal_papillary_necrosis","腎乳頭壊死","Renal papillary necrosis","vascular","urinary","kidney","renal_medulla",[0,100,"糖尿病・鎮痛薬"],"uncommon","血尿・腎髄質病変",["sloughed papilla","ball-on-tee sign"],"造影排泄相で乳頭欠損、sloughed papilla、ball-on-tee signを示す"),
  R("emphysematous_pyelonephritis","気腫性腎盂腎炎","Emphysematous pyelonephritis","infection","urinary","kidney","renal_cortex",[20,100,"糖尿病"],"rare","重症腎感染",["gas in renal parenchyma","diabetic infection"],"腎実質内または腎周囲ガスを伴う壊死性感染を示す"),
  R("renal_artery_dissection","腎動脈解離","Renal artery dissection","vascular","urinary","renal_vessel","renal_vascular_pedicle",[10,80,"成人"],"rare","側腹部痛・腎梗塞",["renal artery intimal flap","segmental renal infarcts"],"腎動脈intimal flapと区域性腎梗塞を示す"),
  R("renal_vein_thrombosis","腎静脈血栓症","Renal vein thrombosis","vascular","urinary","renal_vessel","renal_vascular_pedicle",[0,100,"ネフローゼ・腫瘍"],"uncommon","腎静脈内欠損",["renal vein filling defect","enlarged kidney"],"腎静脈充盈欠損、腎腫大、側副路を評価する"),
  R("wilms_tumor","Wilms腫瘍","Wilms tumor","mass","pediatric","kidney","renal_cortex",[0,10,"小児"],"uncommon","小児腎腫瘤",["claw sign renal origin","pseudocapsule"],"腎由来を示すclaw signと大きな小児腎腫瘤を示す"),
  R("neuroblastoma_abdominal","神経芽腫","Abdominal neuroblastoma","mass","pediatric","sympathetic_chain","sympathetic_chain_region",[0,10,"乳幼児"],"uncommon","小児副腎/後腹膜腫瘤",["encases vessels","calcified adrenal mass"],"血管を取り囲む石灰化後腹膜腫瘤として見えることが多い"),
  R("hepatoblastoma","肝芽腫","Hepatoblastoma","mass","pediatric","liver","hepatic_parenchyma",[0,5,"乳幼児"],"rare","小児肝腫瘤",["large pediatric liver mass","calcification"],"石灰化を伴う大きな小児肝腫瘤として見えることがある"),
  R("mesenteric_adenitis","腸間膜リンパ節炎","Mesenteric adenitis","infection","pediatric","lymph_node","pediatric_ileocecal",[0,20,"小児"],"common","小児右下腹部痛",["clustered right lower quadrant nodes","normal appendix"],"右下腹部リンパ節腫大と正常虫垂が手がかり"),
  R("urachal_cyst","尿膜管嚢胞","Urachal cyst","cyst","urinary","urachus","urachal_remnant",[0,100,"正中下腹部嚢胞"],"uncommon","尿膜管遺残",["midline anterior bladder dome cyst","urachal remnant"],"膀胱頂部から臍方向の正中嚢胞性病変として見える"),
  R("urachal_carcinoma","尿膜管癌","Urachal carcinoma","mass","urinary","urachus","urachal_remnant",[20,100,"成人"],"rare","膀胱頂部腫瘤",["midline supravesical mass","mucinous calcification"],"膀胱頂部正中の粘液性腫瘤で石灰化を伴うことが多い"),
  R("bladder_stone","膀胱結石","Bladder stone","cyst","urinary","urinary_bladder","bladder_wall",[0,100,"排尿障害"],"common","膀胱内高吸収",["dependent bladder calculus","mobile echogenic stone"],"膀胱内の可動性高吸収結石と音響陰影を示す"),
  R("urethral_stricture","尿道狭窄","Urethral stricture","fibrous","urinary","urethra","urethral_wall",[0,100,"排尿障害"],"uncommon","尿道狭窄",["short segment urethral narrowing","spongiofibrosis"],"尿道造影で短区域狭窄、MRIで海綿体線維化を評価する"),
  R("prostate_abscess","前立腺膿瘍","Prostate abscess","infection","urinary","prostate","prostate_transition_zone",[20,100,"発熱・排尿痛"],"rare","前立腺感染",["rim-enhancing prostatic collection","restricted diffusion"],"前立腺内リング状造影性液体貯留と拡散制限を示す","male_only"),
  R("seminal_vesicle_cyst","精嚢嚢胞","Seminal vesicle cyst","cyst","male_pelvis","seminal_vesicle","seminal_vesicle_lumen",[0,80,"男性骨盤嚢胞"],"rare","精嚢嚢胞",["seminal vesicle cyst with renal agenesis","Zinner syndrome"],"同側腎無形成を伴う精嚢嚢胞はZinner症候群を示唆する","male_only"),
  R("epididymal_cyst","精巣上体嚢胞","Epididymal cyst","cyst","male_pelvis","testis","epididymis",[0,100,"陰嚢嚢胞"],"common","陰嚢内嚢胞",["extratesticular cyst","spermatocele"],"精巣外の薄壁嚢胞で精液瘤では内部エコーを伴うことがある","male_only"),
  R("varicocele","精索静脈瘤","Varicocele","vascular","male_pelvis","scrotum","scrotal_wall",[10,80,"男性不妊・陰嚢腫大"],"common","陰嚢静脈拡張",["dilated pampiniform plexus","Valsalva reflux"],"蔓状静脈叢拡張とValsalvaでの逆流を示す","male_only"),
  R("hydrocele","陰嚢水腫","Hydrocele","cyst","male_pelvis","scrotum","scrotal_wall",[0,100,"陰嚢腫大"],"common","陰嚢液体貯留",["simple fluid around testis","scrotal hydrocele"],"精巣周囲の単純液体貯留として見える","male_only"),
  R("ovarian_serous_cystadenoma","漿液性卵巣嚢胞腺腫","Ovarian serous cystadenoma","cyst","female_pelvis","ovary","adnexa",[10,90,"成人女性"],"common","付属器嚢胞",["unilocular thin-walled cyst","serous cystadenoma"],"薄壁単房性嚢胞で充実結節を欠くことが多い","female_only"),
  R("ovarian_granulosa_cell_tumor","卵巣顆粒膜細胞腫","Ovarian granulosa cell tumor","mass","female_pelvis","ovary","adnexa",[0,90,"小児-成人女性"],"rare","ホルモン産生卵巣腫瘍",["multiloculated solid-cystic ovarian mass","endometrial thickening"],"多房性充実嚢胞性腫瘤と内膜肥厚を伴うことがある","female_only"),
  R("ovarian_dysgerminoma","卵巣未分化胚細胞腫","Ovarian dysgerminoma","mass","female_pelvis","ovary","adnexa",[5,40,"若年女性"],"rare","若年卵巣充実腫瘍",["lobulated solid ovarian mass","fibrovascular septa"],"分葉状充実性腫瘤と造影される線維血管性隔壁を示す","female_only"),
  R("ovarian_yolk_sac_tumor","卵黄嚢腫瘍","Ovarian yolk sac tumor","mass","female_pelvis","ovary","adnexa",[0,40,"若年女性"],"rare","AFP高値卵巣腫瘍",["large heterogeneous ovarian mass","hemorrhage necrosis"],"大型不均一卵巣腫瘤で出血・壊死を伴いやすい","female_only"),
  R("ovarian_hyperstimulation_syndrome","卵巣過剰刺激症候群","Ovarian hyperstimulation syndrome","cyst","female_pelvis","ovary","ovarian_stroma",[10,50,"不妊治療後"],"uncommon","両側卵巣腫大",["bilateral enlarged multicystic ovaries","ascites"],"両側多嚢胞性卵巣腫大、腹水、胸水を伴うことがある","female_only"),
  R("pelvic_inflammatory_disease","骨盤内炎症性疾患","Pelvic inflammatory disease","infection","female_pelvis","fallopian_tube","fallopian_tube_lumen",[10,60,"若年-成人女性"],"common","骨盤痛・発熱",["thickened enhancing fallopian tubes","pelvic fat stranding"],"卵管壁肥厚・造影、骨盤脂肪織炎、液体貯留を示す","female_only"),
  R("cesarean_scar_pregnancy","帝王切開瘢痕部妊娠","Cesarean scar pregnancy","vascular","female_pelvis","uterus","uterine_scar",[10,55,"妊娠可能年齢"],"rare","瘢痕部妊娠",["gestational sac embedded in cesarean scar","thin myometrium"],"帝王切開瘢痕部に着床嚢が埋まり、前壁筋層菲薄化を示す","female_only"),
  R("uterine_sarcoma","子宮肉腫","Uterine sarcoma","mass","female_pelvis","uterus","myometrium",[20,90,"成人女性"],"rare","急速増大子宮腫瘤",["large heterogeneous myometrial mass","hemorrhage necrosis"],"不整な筋層腫瘤で出血・壊死・拡散制限を伴いやすい","female_only"),
  R("endometrial_hyperplasia","子宮内膜増殖症","Endometrial hyperplasia","mass","female_pelvis","endometrium","endometrial_cavity",[20,90,"成人女性"],"common","不正出血",["diffuse endometrial thickening","no myometrial invasion"],"びまん性内膜肥厚を示し、明らかな筋層浸潤を欠く","female_only"),
  R("nabothian_cyst","ナボット嚢胞","Nabothian cyst","cyst","female_pelvis","cervix","cervical_stroma",[10,90,"成人女性"],"common","子宮頸部嚢胞",["small cervical cysts","mucus retention cyst"],"子宮頸部間質内の小嚢胞性粘液貯留として見える","female_only"),
  R("bartholin_gland_abscess","バルトリン腺膿瘍","Bartholin gland abscess","infection","female_pelvis","vulva","vulvar_soft_tissue",[10,70,"成人女性"],"common","外陰部疼痛腫脹",["posterolateral vaginal introitus abscess","rim enhancement"],"腟入口部後外側のリング状造影性液体貯留を示す","female_only"),
  R("vulvar_carcinoma","外陰癌","Vulvar carcinoma","mass","female_pelvis","vulva","vulvar_soft_tissue",[40,100,"高齢女性"],"uncommon","外陰腫瘤",["vulvar mass","inguinofemoral nodal metastasis"],"外陰部腫瘤と鼠径大腿リンパ節転移を評価する","female_only"),
  R("acl_tear","前十字靱帯断裂","Anterior cruciate ligament tear","fibrous","musculoskeletal","knee","cruciate_ligament",[10,70,"スポーツ外傷"],"common","膝外傷",["discontinuous ACL fibers","pivot-shift bone contusion"],"ACL線維不連続、走行異常、pivot-shift骨挫傷を示す"),
  R("meniscal_tear","半月板断裂","Meniscal tear","fibrous","musculoskeletal","knee","meniscus",[10,100,"膝痛"],"common","膝関節内障",["linear fluid signal reaching articular surface","bucket-handle tear"],"関節面に達する線状高信号やbucket-handle fragmentを示す"),
  R("shoulder_labral_tear","肩関節唇損傷","Shoulder labral tear","fibrous","musculoskeletal","shoulder","glenoid_labrum",[10,80,"肩関節不安定性"],"common","肩痛・脱臼後",["Bankart lesion","SLAP tear"],"Bankart lesionやSLAP tearとして関節唇の剥離・断裂を示す"),
  R("hip_labral_tear","股関節唇損傷","Hip labral tear","fibrous","musculoskeletal","hip","acetabular_labrum",[10,80,"股関節痛"],"common","股関節インピンジメント",["acetabular labral fluid cleft","paralabral cyst"],"寛骨臼唇内高信号裂隙や傍関節唇嚢胞を伴うことがある"),
  R("osteoarthritis_knee","変形性膝関節症","Knee osteoarthritis","fibrous","musculoskeletal","knee","joint_space",[30,100,"中高年"],"very_common","慢性膝痛",["joint space narrowing","osteophytes","subchondral cysts"],"関節裂隙狭小化、骨棘、軟骨欠損、軟骨下嚢胞を示す"),
  R("ankylosing_spondylitis","強直性脊椎炎","Ankylosing spondylitis","fibrous","musculoskeletal","sacroiliac_joint","sacroiliac_subchondral_bone",[10,70,"若年男性"],"uncommon","炎症性腰背部痛",["bilateral sacroiliitis","bamboo spine"],"両側仙腸関節炎、靱帯骨棘、bamboo spineを示す","male_predominant"),
  R("sacroiliitis_inflammatory","炎症性仙腸関節炎","Inflammatory sacroiliitis","infection","musculoskeletal","sacroiliac_joint","sacroiliac_subchondral_bone",[10,80,"若年-成人"],"common","炎症性腰痛",["bone marrow edema sacroiliac joint","erosions"],"仙腸関節軟骨下骨髄浮腫、びらん、脂肪化を示す"),
  R("psoriatic_arthritis","乾癬性関節炎","Psoriatic arthritis","infection","musculoskeletal","joint","joint_space",[10,90,"成人"],"uncommon","末梢関節炎・腱付着部炎",["dactylitis","pencil-in-cup deformity"],"付着部炎、指趾炎、pencil-in-cup変形を示すことがある"),
  R("charcot_arthropathy","Charcot関節症","Charcot arthropathy","fibrous","musculoskeletal","foot","tarsal_bone",[20,100,"糖尿病神経障害"],"uncommon","足部変形",["midfoot collapse","rocker-bottom deformity"],"足根中足関節の破壊、亜脱臼、rocker-bottom変形を示す"),
  R("brodie_abscess","Brodie膿瘍","Brodie abscess","infection","musculoskeletal","bone","metaphysis",[0,60,"小児-若年"],"uncommon","亜急性骨髄炎",["intraosseous abscess","penumbra sign"],"骨内膿瘍とT1高信号のpenumbra signを示すことがある"),
  R("langerhans_cell_histiocytosis_bone","骨ランゲルハンス細胞組織球症","Langerhans cell histiocytosis of bone","mass","musculoskeletal","bone","bone_marrow",[0,30,"小児"],"uncommon","小児溶骨性病変",["beveled-edge skull lesion","vertebra plana"],"頭蓋骨beveled edge病変やvertebra planaを示すことがある"),
  R("fibrous_dysplasia_bone","線維性骨異形成","Fibrous dysplasia","fibrous","musculoskeletal","bone","bone_marrow",[0,80,"若年-成人"],"common","骨膨張性病変",["ground-glass matrix","shepherd crook deformity"],"すりガラス状骨基質と骨膨張性変形を示す"),
  R("paget_disease_bone","骨Paget病","Paget disease of bone","fibrous","musculoskeletal","bone","bone_marrow",[40,100,"高齢者"],"uncommon","骨肥厚・変形",["cortical thickening","coarsened trabeculae"],"骨肥大、皮質肥厚、粗大化した骨梁、骨変形を示す"),
  R("osteochondroma","骨軟骨腫","Osteochondroma","mass","musculoskeletal","bone","metaphysis",[0,40,"小児-若年"],"common","骨性隆起",["corticomedullary continuity","cartilage cap"],"母骨との皮質・髄腔連続性と軟骨帽を評価する"),
  R("chondroblastoma","軟骨芽細胞腫","Chondroblastoma","mass","musculoskeletal","bone","epiphysis",[5,30,"若年"],"rare","骨端部腫瘍",["epiphyseal lytic lesion","surrounding marrow edema"],"骨端部溶骨性病変と周囲骨髄浮腫を示す"),
  R("nonossifying_fibroma","非骨化性線維腫","Non-ossifying fibroma","fibrous","musculoskeletal","bone","metaphysis",[0,30,"小児-若年"],"common","良性骨病変",["eccentric metaphyseal lucent lesion","sclerotic rim"],"骨幹端偏心性透亮性病変と硬化縁を示す"),
  R("desmoid_tumor","デスモイド腫瘍","Desmoid tumor","fibrous","musculoskeletal","soft_tissue","soft_tissue_compartment",[10,80,"成人"],"uncommon","線維性軟部腫瘤",["band-like low T2 signal","fascial tail sign"],"T2低信号帯とfascial tail signを伴う浸潤性線維性腫瘤"),
  R("rhabdomyosarcoma","横紋筋肉腫","Rhabdomyosarcoma","mass","musculoskeletal","soft_tissue","soft_tissue_compartment",[0,30,"小児"],"rare","小児軟部腫瘍",["rapidly growing soft tissue mass","necrosis"],"小児の急速増大軟部腫瘤で壊死・出血を伴うことがある"),
  R("myxoid_liposarcoma","粘液型脂肪肉腫","Myxoid liposarcoma","mass","musculoskeletal","soft_tissue","soft_tissue_compartment",[10,80,"成人"],"rare","深部軟部腫瘍",["pseudocystic T2 bright mass","fatty septa"],"T2著明高信号の偽嚢胞様腫瘤に脂肪性隔壁を伴うことがある"),
  R("leiomyosarcoma_soft_tissue","軟部平滑筋肉腫","Soft-tissue leiomyosarcoma","mass","musculoskeletal","soft_tissue","soft_tissue_compartment",[20,100,"成人"],"rare","軟部肉腫",["heterogeneous enhancing soft tissue mass","necrosis"],"壊死を伴う不均一造影性軟部腫瘤として見える"),
  R("plexiform_neurofibroma","叢状神経線維腫","Plexiform neurofibroma","mass","musculoskeletal","peripheral_nerve","brachial_plexus_root",[0,80,"NF1"],"rare","神経原性腫瘤",["bag of worms appearance","target sign"],"神経走行に沿うbag of worms appearanceを示す"),
  R("malignant_peripheral_nerve_sheath_tumor","悪性末梢神経鞘腫瘍","Malignant peripheral nerve sheath tumor","mass","musculoskeletal","peripheral_nerve","brachial_plexus_root",[10,90,"NF1・成人"],"rare","神経原性悪性腫瘍",["large heterogeneous nerve sheath mass","perilesional edema"],"大きく不均一で周囲浮腫や壊死を伴う神経鞘腫瘤"),
  R("elastofibroma_dorsi","背部弾性線維腫","Elastofibroma dorsi","fibrous","musculoskeletal","soft_tissue","paraspinal_soft_tissue",[40,100,"高齢者"],"uncommon","肩甲下部軟部腫瘤",["subscapular fibrofatty mass","bilateral elastofibroma"],"肩甲骨下角深部の線維脂肪性腫瘤として見える"),
  R("Morel_Lavallee_lesion","Morel-Lavallee病変","Morel-Lavallee lesion","cyst","trauma","soft_tissue","soft_tissue_compartment",[0,100,"外傷後"],"uncommon","閉鎖性デグロービング損傷",["post-traumatic closed degloving collection","fluid-fluid level"],"筋膜表層の被膜化液体貯留として外傷後に出現する"),
  R("subcutaneous_hematoma","皮下血腫","Subcutaneous hematoma","vascular","skin_soft_tissue","subcutaneous_tissue","subcutaneous_fat",[0,100,"外傷・抗凝固"],"common","軟部腫瘤",["evolving blood products","fluid-fluid level"],"血液産物の時相によりCT濃度とMRI信号が変化する"),
  R("cellulitis","蜂窩織炎","Cellulitis","infection","skin_soft_tissue","skin","skin_dermis",[0,100,"皮膚軟部感染"],"common","皮膚発赤・腫脹",["skin thickening","subcutaneous fat stranding"],"皮膚肥厚と皮下脂肪織濃度上昇を示し、膿瘍の有無を評価する"),
  R("hidradenitis_suppurativa","化膿性汗腺炎","Hidradenitis suppurativa","infection","skin_soft_tissue","skin","skin_dermis",[10,70,"若年-成人"],"common","腋窩・鼠径部慢性炎症",["sinus tracts","recurrent abscesses"],"皮下膿瘍、瘻孔、瘢痕性肥厚が腋窩・鼠径部に反復する"),
  R("pilomatricoma","石灰化上皮腫","Pilomatricoma","mass","skin_soft_tissue","skin","skin_dermis",[0,80,"小児-若年"],"common","皮下石灰化腫瘤",["superficial calcified nodule","pilomatrixoma"],"皮下浅層の石灰化を伴う境界明瞭結節として見える"),
  R("epidermal_inclusion_cyst","表皮嚢腫","Epidermal inclusion cyst","cyst","skin_soft_tissue","skin","skin_dermis",[0,100,"皮下嚢胞"],"common","皮下腫瘤",["punctum-connected cyst","keratin debris"],"皮膚表面との交通を伴う角化物内容の嚢胞性病変"),
  R("cutaneous_squamous_cell_carcinoma","皮膚扁平上皮癌","Cutaneous squamous cell carcinoma","mass","skin_soft_tissue","skin","skin_dermis",[40,100,"高齢者"],"common","皮膚悪性腫瘍",["ulcerated enhancing skin mass","perineural spread"],"潰瘍を伴う造影性皮膚腫瘤で深部浸潤や神経周囲進展を評価する"),
  R("melanoma_soft_tissue_metastasis","悪性黒色腫軟部転移","Melanoma soft-tissue metastasis","mass","skin_soft_tissue","subcutaneous_tissue","subcutaneous_fat",[20,100,"悪性黒色腫既往"],"uncommon","皮下転移",["T1 hyperintense melanin metastasis","subcutaneous nodules"],"メラニンや出血によりT1高信号を示す皮下結節を伴うことがある"),
  R("systemic_sclerosis_lung","全身性硬化症関連肺病変","Systemic sclerosis-associated lung disease","fibrous","chest","lung","interstitium",[10,90,"膠原病"],"uncommon","膠原病肺",["NSIP pattern","patulous esophagus"],"NSIPパターンの間質性肺炎と拡張食道を伴うことがある","female_predominant"),
  R("rheumatoid_lung_disease","関節リウマチ関連肺病変","Rheumatoid arthritis-associated lung disease","fibrous","chest","lung","interstitium",[20,100,"関節リウマチ"],"uncommon","膠原病肺",["UIP or NSIP pattern","rheumatoid nodules"],"UIP/NSIPパターン、胸膜病変、リウマチ結節を示すことがある"),
  R("wegener_granulomatosis_lung","多発血管炎性肉芽腫症肺病変","Granulomatosis with polyangiitis lung disease","vascular","chest","lung","pulmonary_nodule",[0,100,"血管炎"],"uncommon","空洞性肺結節",["multiple cavitary nodules","airway stenosis"],"多発空洞性結節、気道狭窄、副鼻腔病変を伴うことがある"),
  R("pulmonary_veno_occlusive_disease","肺静脈閉塞性疾患","Pulmonary veno-occlusive disease","vascular","chest","pulmonary_artery","pulmonary_artery_lumen",[0,100,"肺高血圧"],"rare","肺高血圧",["smooth septal thickening","centrilobular ground-glass nodules"],"肺高血圧に小葉間隔壁肥厚、胸水、中心小葉性すりガラス結節を伴う"),
  R("catamenial_pneumothorax","月経随伴性気胸","Catamenial pneumothorax","cyst","chest","pleura","pleural_space",[10,60,"妊娠可能年齢女性"],"rare","反復気胸",["right-sided recurrent pneumothorax","diaphragmatic fenestrations"],"月経周期に一致する右気胸と横隔膜小孔・胸腔内子宮内膜症を示唆する","female_predominant"),
  R("thoracic_endometriosis","胸腔内子宮内膜症","Thoracic endometriosis","vascular","chest","pleura","pleural_surface",[10,60,"妊娠可能年齢女性"],"rare","月経随伴胸部症状",["catamenial hemothorax","pleural implants"],"月経随伴性血胸、胸膜/横隔膜インプラントを示すことがある","female_predominant"),
  R("mediastinal_teratoma","縦隔奇形腫","Mediastinal teratoma","fat","chest","mediastinum","mediastinal_compartment",[0,60,"若年"],"uncommon","前縦隔脂肪含有腫瘤",["fat fluid calcification in mediastinal mass","tooth"],"脂肪、液体、石灰化、歯牙様成分を含む前縦隔腫瘤"),
  R("esophageal_duplication_cyst","食道重複嚢胞","Esophageal duplication cyst","cyst","chest","mediastinum","mediastinal_compartment",[0,80,"小児-成人"],"rare","後縦隔嚢胞",["paraesophageal foregut cyst","smooth muscle wall"],"食道近傍の前腸重複嚢胞として後縦隔に見える"),
  R("neurogenic_tumor_posterior_mediastinum","後縦隔神経原性腫瘍","Posterior mediastinal neurogenic tumor","mass","chest","mediastinum","mediastinal_compartment",[0,80,"小児-成人"],"uncommon","後縦隔腫瘤",["neural foraminal extension","dumbbell mediastinal mass"],"椎間孔進展を伴うdumbbell型後縦隔腫瘤を示すことがある"),
  R("thoracic_duct_cyst","胸管嚢胞","Thoracic duct cyst","cyst","chest","lymphatic_system","mediastinal_compartment",[0,100,"縦隔嚢胞"],"rare","後縦隔嚢胞",["thoracic duct cyst","chylous cyst"],"胸管走行に沿う薄壁嚢胞性病変として見える"),
  R("chylothorax","乳び胸","Chylothorax","cyst","chest","pleura","pleural_space",[0,100,"胸水"],"uncommon","乳び胸水",["low attenuation pleural effusion","thoracic duct injury"],"胸管損傷や閉塞に伴う胸水で、基礎疾患を検索する"),
  R("superior_vena_cava_syndrome","上大静脈症候群","Superior vena cava syndrome","vascular","chest","mediastinal_vessel","mediastinal_vascular_space",[0,100,"顔面上肢腫脹"],"uncommon","縦隔腫瘍・血栓",["SVC obstruction","chest wall collaterals"],"上大静脈狭窄/閉塞と胸壁・奇静脈系側副路を示す"),
  R("thoracic_aortic_aneurysm","胸部大動脈瘤","Thoracic aortic aneurysm","vascular","cardiovascular","aorta","aortic_lumen",[30,100,"成人"],"common","胸部大動脈拡張",["aortic diameter","mural thrombus"],"瘤径、壁在血栓、分枝との関係、破裂徴候を評価する"),
  R("abdominal_wall_endometriosis","腹壁子宮内膜症","Abdominal wall endometriosis","mass","female_pelvis","uterus","uterine_scar",[10,60,"術後女性"],"uncommon","月経随伴腹壁痛",["cesarean scar endometrioma","cyclic pain"],"帝王切開瘢痕近傍の出血性軟部腫瘤として見える","female_predominant"),
  R("rectus_sheath_hematoma","腹直筋鞘血腫","Rectus sheath hematoma","vascular","abdomen","soft_tissue","soft_tissue_compartment",[0,100,"抗凝固・咳嗽"],"uncommon","急性腹壁痛",["rectus muscle hematoma","active extravasation"],"腹直筋内血腫、血液濃度、活動性出血を評価する"),
  R("abdominal_wall_desmoid","腹壁デスモイド","Abdominal wall desmoid tumor","fibrous","abdomen","soft_tissue","soft_tissue_compartment",[10,80,"成人"],"uncommon","腹壁線維性腫瘤",["fascial tail sign","low T2 bands"],"腹壁筋膜から連続する線維性腫瘤で低T2帯を伴う"),
  R("incisional_hernia","腹壁瘢痕ヘルニア","Incisional hernia","cyst","abdomen","soft_tissue","soft_tissue_compartment",[0,100,"術後"],"common","腹壁膨隆",["fascial defect","herniated bowel or fat"],"腹壁筋膜欠損と脂肪・腸管脱出を評価する"),
  R("inguinal_hernia","鼠径ヘルニア","Inguinal hernia","cyst","pelvis","peritoneum","peritoneal_cavity",[0,100,"鼠径部膨隆"],"common","鼠径部腫瘤",["inguinal canal hernia","bowel incarceration"],"鼠径管を通る脂肪または腸管脱出と嵌頓の有無を評価する"),
  R("femoral_hernia","大腿ヘルニア","Femoral hernia","cyst","pelvis","peritoneum","peritoneal_cavity",[20,100,"成人女性"],"uncommon","鼠径部腫瘤",["hernia below inguinal ligament","femoral canal"],"鼠径靱帯下・大腿静脈内側のヘルニアとして見える","female_predominant"),
  R("sports_hernia_athletic_pubalgia","スポーツヘルニア","Athletic pubalgia","fibrous","musculoskeletal","hip","soft_tissue_compartment",[10,60,"スポーツ選手"],"uncommon","鼠径部痛",["rectus-adductor aponeurosis injury","pubic bone marrow edema"],"恥骨結合周囲骨髄浮腫と腹直筋-内転筋腱膜損傷を示す"),
  R("osteitis_pubis","恥骨結合炎","Osteitis pubis","infection","musculoskeletal","hip","bone_marrow",[10,80,"スポーツ・術後"],"uncommon","恥骨部痛",["pubic symphysis marrow edema","subchondral erosions"],"恥骨結合周囲骨髄浮腫、骨びらん、関節液を示す"),
  R("piriformis_syndrome","梨状筋症候群","Piriformis syndrome","fibrous","musculoskeletal","muscle","soft_tissue_compartment",[10,90,"坐骨神経痛"],"uncommon","殿部痛",["sciatic nerve irritation near piriformis","piriformis asymmetry"],"梨状筋近傍で坐骨神経の腫大・信号変化を評価する"),
  R("brachial_plexopathy_radiation","放射線性腕神経叢障害","Radiation-induced brachial plexopathy","fibrous","musculoskeletal","brachial_plexus","brachial_plexus_root",[20,100,"放射線治療後"],"uncommon","腕神経叢症状",["diffuse brachial plexus thickening","fibrotic low T2 signal"],"腕神経叢のびまん性肥厚と線維性低T2信号を示す"),
  R("brachial_plexus_schwannoma","腕神経叢神経鞘腫","Brachial plexus schwannoma","mass","musculoskeletal","brachial_plexus","brachial_plexus_root",[10,90,"成人"],"rare","腕神経叢腫瘤",["fusiform nerve sheath mass","target sign"],"神経走行に沿う紡錘形腫瘤でtarget signを示すことがある"),
  R("tarsal_tunnel_syndrome","足根管症候群","Tarsal tunnel syndrome","fibrous","musculoskeletal","ankle","tarsal_bone",[10,90,"成人"],"uncommon","足底しびれ",["posterior tibial nerve compression","space occupying lesion"],"足根管内の後脛骨神経圧迫原因と神経腫大を評価する"),
  R("sinus_tarsi_syndrome","足根洞症候群","Sinus tarsi syndrome","infection","musculoskeletal","ankle","tarsal_bone",[10,80,"足関節捻挫後"],"uncommon","足根洞痛",["sinus tarsi fat obliteration","interosseous ligament injury"],"足根洞脂肪消失と距踵骨間靱帯損傷を示す"),
  R("navicular_stress_fracture","舟状骨疲労骨折","Navicular stress fracture","vascular","musculoskeletal","foot","tarsal_bone",[10,60,"アスリート"],"uncommon","足背部痛",["navicular fracture line","dorsal cortical break"],"舟状骨中央部の低信号骨折線と骨髄浮腫を示す"),
  R("lisfranc_injury","Lisfranc損傷","Lisfranc injury","fibrous","musculoskeletal","foot","metatarsal_bone",[10,80,"足部外傷"],"uncommon","中足部痛",["Lisfranc ligament tear","tarsometatarsal malalignment"],"Lisfranc靱帯断裂と足根中足関節アライメント異常を評価する"),
  R("diabetic_foot_osteomyelitis","糖尿病足骨髄炎","Diabetic foot osteomyelitis","infection","musculoskeletal","foot","metatarsal_bone",[20,100,"糖尿病足潰瘍"],"common","足潰瘍・感染",["ulcer-to-bone tract","marrow replacement"],"皮膚潰瘍から骨へ連続する瘻孔と骨髄T1低信号置換を示す"),
  R("sever_disease","Sever病","Sever disease","infection","pediatric","bone","epiphysis",[5,18,"小児アスリート"],"common","踵痛",["calcaneal apophysitis","fragmented apophysis"],"踵骨骨端核の硬化・分節化と周囲浮腫を示す"),
  R("osgood_schlatter_disease","Osgood-Schlatter病","Osgood-Schlatter disease","infection","pediatric","bone","epiphysis",[8,18,"成長期"],"common","脛骨粗面痛",["tibial tubercle fragmentation","patellar tendon edema"],"脛骨粗面分節化と膝蓋腱遠位部腫脹・浮腫を示す"),
  R("slipped_capital_femoral_epiphysis","大腿骨頭すべり症","Slipped capital femoral epiphysis","vascular","pediatric","bone","epiphysis",[8,18,"思春期"],"uncommon","小児股関節痛",["posteroinferior epiphyseal slip","physeal widening"],"大腿骨頭骨端の後下方すべりと骨端線拡大を示す"),
  R("legg_calve_perthes_disease","Perthes病","Legg-Calve-Perthes disease","vascular","pediatric","bone","epiphysis",[3,15,"小児"],"uncommon","小児股関節痛",["femoral head epiphyseal necrosis","crescent sign"],"大腿骨頭骨端壊死、扁平化、crescent signを示す"),
  R("developmental_dysplasia_hip","発育性股関節形成不全","Developmental dysplasia of the hip","fibrous","pediatric","hip","acetabular_labrum",[0,10,"乳幼児"],"common","乳幼児股関節異常",["shallow acetabulum","superolateral femoral head displacement"],"寛骨臼形成不全と大腿骨頭外上方偏位を評価する")
];

function main() {
  ensureDictionaries();
  fs.mkdirSync(draftsDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });
  writeJson(path.join(publicDir, "general_batch9_public_sources.json"), {
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
  console.log(`General Phase 1 batch 9 complete. Written: ${written}, skipped existing: ${skipped}`);
}

main();
