const fs = require("fs");
const path = require("path");

const { ROOT, DATA, writeJson } = require("./lib");

const draftsDir = path.join(DATA, "drafts");
const now = new Date().toISOString();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function refsFor(diseaseId, keepPmids) {
  const articlePath = path.join(DATA, "sources", "pubmed", `${diseaseId}.articles.json`);
  const articles = fs.existsSync(articlePath) ? readJson(articlePath).articles || [] : [];
  return articles
    .filter((article) => !keepPmids || keepPmids.includes(String(article.pmid)))
    .map((article) => ({
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

function anatomy(overrides = {}) {
  return {
    body_region: "brain",
    organ: overrides.organ || "brain",
    subregion: overrides.subregion || "cerebral_hemisphere",
    laterality: overrides.laterality || "unknown"
  };
}

function finding(diseaseId, suffix, findingCode, modality, acqCode, findingText, opts = {}) {
  return {
    finding_id: `${diseaseId}_${suffix}`,
    finding_code: findingCode,
    modality,
    acquisition: { type: modality === "CT" ? "phase" : "sequence", code: acqCode },
    anatomy: anatomy(opts.anatomy || {}),
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

function ctGroup(code, findings) {
  return { phase: { code }, findings };
}

function mriGroup(code, findings) {
  return { sequence: { code }, findings };
}

function collectFindings(card) {
  return [
    ...(card.imaging.ct.findings_by_phase || []).flatMap((group) => group.findings || []),
    ...(card.imaging.mri.findings_by_sequence || []).flatMap((group) => group.findings || [])
  ];
}

function makeCard(spec) {
  const references = refsFor(spec.id, spec.keepPmids);
  const card = {
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
      summary: references.length
        ? `PubMedから取得しました（PMID: ${references.map((ref) => ref.pmid).join(", ")}）。`
        : "PubMedから取得しました。",
      claim_map: []
    },
    image_examples: [],
    references,
    review: {
      status: "draft",
      reviewed_by: "",
      reviewed_at: "",
      confidence: "low",
      notes: "PubMed metadata and Codex-curated draft; requires physician review before approval."
    },
    updated_at: now
  };
  card.evidence.claim_map.push({
    claim_type: "imaging_findings",
    finding_ids: collectFindings(card).map((item) => item.finding_id),
    claim_scope: ["finding_text", "typicality", "diagnostic_weight"],
    source_ids: references.map((ref) => ref.source_id),
    confidence: "low"
  });
  return card;
}

const specs = [
  {
    id: "brain_metastasis",
    ja: "脳転移",
    en: "Brain metastasis",
    aliases: { ja: ["転移性脳腫瘍"], en: ["Brain metastases", "Metastatic brain tumor"] },
    keepPmids: ["29307364", "25649387", "31214496", "37563948"],
    clinical: {
      overview: "全身悪性腫瘍から脳実質へ血行性に転移する病変。灰白白質境界や後頭蓋窩に多発しやすく、周囲の血管原性浮腫を伴う造影結節・リング状造影病変として鑑別に挙がる。",
      treatment: "原発巣、個数、症状、全身状態に応じて定位放射線治療、全脳照射、手術、薬物療法を組み合わせる。",
      epidemiology: "担癌患者の頭蓋内腫瘤では頻度の高い鑑別。成人、とくに中高年以降で重要。"
    },
    demographics: {
      sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "性差は原発腫瘍の分布に依存する。" },
      age: { typical_min: 40, typical_max: 85, peak_decade: "50-70歳代", summary: "中高年以降の担癌患者で多い。" }
    },
    frequency: { label: "common", prevalence_rank: 4, basis: "clinical_context", evidence_level: "review", context: { population: "adult cancer patient", body_region: "brain", clinical_setting: "enhancing_brain_mass" }, summary: "担癌患者の造影性脳内病変では頻度の高い鑑別。" },
    keywords: ["multiple lesions", "gray-white junction", "ring enhancement", "vasogenic edema"],
    ctSummary: "単純CTでは低吸収の浮腫や腫瘤効果として目立つことがあり、造影CTで結節状またはリング状造影を示すことがある。",
    mriSummary: "造影T1で結節状・リング状造影、FLAIR/T2で周囲血管原性浮腫を伴うことが多い。",
    ctGroups: [ctGroup("noncontrast", [finding("brain_metastasis", "ct_nc_001", "finding:ct_hypoattenuation", "CT", "noncontrast", "周囲浮腫や壊死成分が低吸収として見えることがある。", { target: "perilesional_edema", weight: 2, keywords: ["edema"] })])],
    mriGroups: [
      mriGroup("contrast_enhanced_T1WI", [finding("brain_metastasis", "mri_ce_001", "finding:ring_enhancement", "MRI", "contrast_enhanced_T1WI", "結節状またはリング状造影を示す転移巣として認められることがある。", { target: "lesion_margin", weight: 4, keywords: ["ring enhancement"] })]),
      mriGroup("FLAIR", [finding("brain_metastasis", "mri_flair_001", "finding:vasogenic_edema", "MRI", "FLAIR", "病変周囲にFLAIR高信号の血管原性浮腫を伴うことが多い。", { target: "perilesional_edema", weight: 3, keywords: ["vasogenic edema"] })]),
      mriGroup("DWI", [finding("brain_metastasis", "mri_dwi_001", "finding:diffusion_restriction_absent", "MRI", "DWI", "多くは膿瘍のような中心性拡散制限を示さないが、腫瘍成分や原発により幅がある。", { target: "lesion_core", typicality: "variable", weight: 1 })])
    ]
  },
  {
    id: "primary_central_nervous_system_lymphoma",
    ja: "原発性中枢神経系リンパ腫",
    en: "Primary central nervous system lymphoma",
    aliases: { ja: ["PCNSL", "原発性CNSリンパ腫"], en: ["PCNSL", "Primary CNS lymphoma"] },
    keepPmids: ["38703015", "33560416", "30072069", "35994050"],
    clinical: {
      overview: "中枢神経内に原発する悪性リンパ腫。深部白質、脳梁、基底核、脳室周囲に発生しやすく、高細胞性を反映した拡散制限と強い造影効果が重要。",
      treatment: "病理診断後に高用量メトトレキサートを中心とした化学療法、放射線治療などを検討する。ステロイド先行で病変が縮小し診断困難になることがある。",
      epidemiology: "免疫正常者では中高年以降に多い。免疫不全では若年にも発症し、壊死やリング状造影を伴いやすい。"
    },
    demographics: {
      sex: { applicable: ["any"], predominance: "male", predilection: "male_predominant", summary: "男性にやや多いとされる。" },
      age: { typical_min: 50, typical_max: 85, peak_decade: "60-70歳代", summary: "免疫正常者では中高年以降に多い。" }
    },
    frequency: { label: "uncommon", prevalence_rank: 2, basis: "epidemiology", evidence_level: "review", context: { population: "adult", body_region: "brain", clinical_setting: "deep_enhancing_mass" }, summary: "脳腫瘍全体では多くないが、深部造影性腫瘤では重要な鑑別。" },
    keywords: ["deep white matter", "periventricular", "corpus callosum", "homogeneous enhancement"],
    ctSummary: "高細胞性を反映して単純CTで高吸収を示すことがある。",
    mriSummary: "DWI高信号/ADC低値、比較的均一で強い造影効果、T2等〜軽度低信号が手掛かりになる。",
    ctGroups: [ctGroup("noncontrast", [finding("primary_central_nervous_system_lymphoma", "ct_nc_001", "finding:ct_hyperattenuation", "CT", "noncontrast", "高細胞性病変として単純CTで高吸収を示すことがある。", { weight: 3 })])],
    mriGroups: [
      mriGroup("DWI", [finding("primary_central_nervous_system_lymphoma", "mri_dwi_001", "finding:dwi_hyperintensity", "MRI", "DWI", "高細胞性を反映してDWI高信号を示すことが多い。", { weight: 4 })]),
      mriGroup("ADC", [finding("primary_central_nervous_system_lymphoma", "mri_adc_001", "finding:adc_low", "MRI", "ADC", "ADC低値を伴う拡散制限が重要な所見。", { weight: 4 })]),
      mriGroup("contrast_enhanced_T1WI", [finding("primary_central_nervous_system_lymphoma", "mri_ce_001", "finding:avid_homogeneous_enhancement", "MRI", "contrast_enhanced_T1WI", "免疫正常者では比較的均一で強い造影効果を示すことが多い。", { weight: 4, keywords: ["homogeneous enhancement"] })]),
      mriGroup("T2WI", [finding("primary_central_nervous_system_lymphoma", "mri_t2_001", "finding:t2_mild_hypointensity", "MRI", "T2WI", "高細胞性を反映してT2で等〜軽度低信号寄りに見えることがある。", { typicality: "variable", weight: 2 })])
    ]
  },
  {
    id: "diffuse_low_grade_glioma",
    ja: "びまん性低悪性度神経膠腫",
    en: "Diffuse low-grade glioma",
    aliases: { ja: ["低悪性度神経膠腫"], en: ["Low-grade glioma", "Diffuse LGG"] },
    keepPmids: ["31143247", "30292978", "41198334", "40668344"],
    clinical: {
      overview: "若年成人から中年に多い浸潤性神経膠腫。境界不明瞭なT2/FLAIR高信号病変として発見され、造影効果や強い拡散制限を欠く場合が多い。",
      treatment: "分子診断を含めた評価のうえ、最大安全切除、経過観察、放射線治療、化学療法を病勢とリスクに応じて選択する。",
      epidemiology: "成人のびまん性神経膠腫の一群で、若年〜中年発症が典型。けいれん発症が多い。"
    },
    demographics: {
      sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" },
      age: { typical_min: 20, typical_max: 55, peak_decade: "30-40歳代", summary: "若年成人から中年に多い。" }
    },
    frequency: { label: "uncommon", prevalence_rank: 2, basis: "epidemiology", evidence_level: "review", context: { population: "adult", body_region: "brain", clinical_setting: "nonenhancing_intra_axial_mass" }, summary: "非造影性の浸潤性脳内腫瘤では重要な鑑別。" },
    keywords: ["nonenhancing mass", "infiltrative", "seizure presentation"],
    ctSummary: "単純CTでは低吸収の皮質下病変として認められることがある。石灰化は組織型により伴う。",
    mriSummary: "T2/FLAIR高信号、T1低信号、造影効果なし〜軽度、強い拡散制限なしが典型。",
    ctGroups: [ctGroup("noncontrast", [finding("diffuse_low_grade_glioma", "ct_nc_001", "finding:ct_hypoattenuation", "CT", "noncontrast", "単純CTで低吸収の浸潤性病変として見えることがある。", { typicality: "variable", weight: 1 })])],
    mriGroups: [
      mriGroup("T2WI", [finding("diffuse_low_grade_glioma", "mri_t2_001", "finding:t2_hyperintensity", "MRI", "T2WI", "境界不明瞭なT2高信号病変として認められる。", { weight: 3, keywords: ["infiltrative"] })]),
      mriGroup("FLAIR", [finding("diffuse_low_grade_glioma", "mri_flair_001", "finding:flair_hyperintensity", "MRI", "FLAIR", "浸潤性のFLAIR高信号を示すことが多い。", { weight: 3 })]),
      mriGroup("T1WI", [finding("diffuse_low_grade_glioma", "mri_t1_001", "finding:t1_hypointensity", "MRI", "T1WI", "T1低信号として認められることが多い。", { weight: 2 })]),
      mriGroup("contrast_enhanced_T1WI", [finding("diffuse_low_grade_glioma", "mri_ce_001", "finding:enhancement_absent", "MRI", "contrast_enhanced_T1WI", "明らかな造影効果を欠くことが多い。", { weight: 3, keywords: ["nonenhancing"] })]),
      mriGroup("DWI", [finding("diffuse_low_grade_glioma", "mri_dwi_001", "finding:diffusion_restriction_absent", "MRI", "DWI", "強い拡散制限を欠くことが多い。", { weight: 2 })])
    ]
  },
  {
    id: "cerebral_cavernous_malformation",
    ja: "脳海綿状血管奇形",
    en: "Cerebral cavernous malformation",
    aliases: { ja: ["海綿状血管奇形", "脳海綿状血管腫"], en: ["Cavernous malformation", "Cavernoma", "Cerebral cavernoma"] },
    keepPmids: ["33494000", "16100539", "36403580"],
    clinical: {
      overview: "拡張した毛細血管様血管腔からなる低流速血管奇形。反復する微小出血によりヘモジデリン沈着を伴い、SWI/T2*でbloomingを示す。",
      treatment: "無症候例は経過観察、出血や難治性てんかん、到達可能部位では外科的切除を検討する。",
      epidemiology: "孤発例と家族例があり、小児から成人まで幅広い。けいれん、出血、偶発発見で見つかる。"
    },
    demographics: {
      sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "明確な性差は強くない。" },
      age: { typical_min: 10, typical_max: 70, peak_decade: "20-50歳代", summary: "小児から成人まで幅広いが若年〜中年でも重要。" }
    },
    frequency: { label: "uncommon", prevalence_rank: 2, basis: "epidemiology", evidence_level: "review", context: { population: "any", body_region: "brain", clinical_setting: "hemorrhagic_or_susceptibility_lesion" }, summary: "出血性・磁化率病変では重要な鑑別。" },
    keywords: ["popcorn appearance", "mulberry appearance", "hemosiderin rim", "blooming"],
    ctSummary: "CTでは不明瞭なことも多いが、石灰化や出血を伴う高吸収病変として見えることがある。",
    mriSummary: "混在信号のpopcorn様病変、T2低信号リム、SWI/T2*で著明なbloomingが特徴。",
    ctGroups: [ctGroup("noncontrast", [
      finding("cerebral_cavernous_malformation", "ct_nc_001", "finding:calcification_present", "CT", "noncontrast", "石灰化を伴うことがある。", { typicality: "variable", weight: 1 }),
      finding("cerebral_cavernous_malformation", "ct_nc_002", "finding:hemorrhage_present", "CT", "noncontrast", "急性・亜急性出血を伴うと高吸収として認められる。", { typicality: "variable", weight: 2 })
    ])],
    mriGroups: [
      mriGroup("SWI", [finding("cerebral_cavernous_malformation", "mri_swi_001", "finding:susceptibility_blooming", "MRI", "SWI", "ヘモジデリン沈着によりSWIで著明なbloomingを示す。", { typicality: "typical", weight: 5, keywords: ["blooming", "hemosiderin rim"] })]),
      mriGroup("T2STAR", [finding("cerebral_cavernous_malformation", "mri_t2star_001", "finding:susceptibility_blooming", "MRI", "T2STAR", "T2*で磁化率低信号とbloomingを示す。", { typicality: "typical", weight: 5, keywords: ["blooming"] })]),
      mriGroup("T2WI", [finding("cerebral_cavernous_malformation", "mri_t2_001", "finding:t2_hypointensity", "MRI", "T2WI", "ヘモジデリンリムに相当するT2低信号縁を伴う。", { weight: 3, keywords: ["hemosiderin rim"] })]),
      mriGroup("T1WI", [finding("cerebral_cavernous_malformation", "mri_t1_001", "finding:hemorrhage_present", "MRI", "T1WI", "血腫の時相により内部信号が混在する。", { weight: 2, keywords: ["popcorn appearance"] })])
    ]
  },
  {
    id: "posterior_reversible_encephalopathy_syndrome",
    ja: "可逆性後頭葉白質脳症",
    en: "Posterior reversible encephalopathy syndrome",
    aliases: { ja: ["PRES", "可逆性後白質脳症"], en: ["PRES", "Reversible posterior leukoencephalopathy syndrome"] },
    keepPmids: ["28054130", "34275982", "37951698", "28131335"],
    clinical: {
      overview: "急性高血圧、腎不全、免疫抑制薬、子癇などを背景に生じる可逆性の血管原性浮腫症候群。後頭葉・頭頂葉優位の皮質下白質浮腫が典型。",
      treatment: "原因薬剤の中止、血圧管理、けいれん治療、基礎疾患への対応を行う。不可逆性梗塞や出血を伴う例では注意が必要。",
      epidemiology: "発症母集団に依存し、妊娠関連、腎疾患、移植・免疫抑制、自己免疫疾患などで重要。"
    },
    demographics: {
      sex: { applicable: ["any"], predominance: "none", predilection: "no_sex_predilection", summary: "基礎疾患により性差は変わる。妊娠・子癇関連では女性に限られる。" },
      age: { typical_min: 15, typical_max: 85, peak_decade: "幅広い年齢層", summary: "小児から高齢者まで発症し、背景疾患で変動する。" }
    },
    frequency: { label: "uncommon", prevalence_rank: 2, basis: "clinical_context", evidence_level: "review", context: { population: "risk_factor_present", body_region: "brain", clinical_setting: "acute_encephalopathy_or_seizure" }, summary: "急性脳症・けいれんと後方優位浮腫では重要な鑑別。" },
    keywords: ["posterior predominant edema", "parieto-occipital", "vasogenic edema", "hypertension", "eclampsia"],
    ctSummary: "CTでは後方優位の低吸収域として見えることがあるが、MRIの方が感度が高い。",
    mriSummary: "FLAIR/T2で頭頂後頭葉優位の皮質下白質高信号。多くは血管原性浮腫でADC低下を伴わない。",
    ctGroups: [ctGroup("noncontrast", [finding("posterior_reversible_encephalopathy_syndrome", "ct_nc_001", "finding:ct_hypoattenuation", "CT", "noncontrast", "後方優位の浮腫が低吸収域として見えることがある。", { target: "white_matter", typicality: "variable", weight: 2 })])],
    mriGroups: [
      mriGroup("FLAIR", [finding("posterior_reversible_encephalopathy_syndrome", "mri_flair_001", "finding:flair_hyperintensity", "MRI", "FLAIR", "頭頂後頭葉優位の皮質下白質FLAIR高信号を示す。", { target: "white_matter", typicality: "typical", weight: 4, keywords: ["parieto-occipital", "posterior predominant edema"] })]),
      mriGroup("T2WI", [finding("posterior_reversible_encephalopathy_syndrome", "mri_t2_001", "finding:t2_hyperintensity", "MRI", "T2WI", "血管原性浮腫としてT2高信号を示す。", { target: "white_matter", weight: 3 })]),
      mriGroup("ADC", [finding("posterior_reversible_encephalopathy_syndrome", "mri_adc_001", "finding:adc_high", "MRI", "ADC", "血管原性浮腫ではADC上昇を示すことが多い。", { target: "white_matter", weight: 3 })]),
      mriGroup("DWI", [finding("posterior_reversible_encephalopathy_syndrome", "mri_dwi_001", "finding:diffusion_restriction_absent", "MRI", "DWI", "典型例では強い拡散制限を欠く。梗塞合併例では一部制限を伴う。", { target: "white_matter", weight: 2 })])
    ]
  },
  {
    id: "subdural_hematoma",
    ja: "硬膜下血腫",
    en: "Subdural hematoma",
    aliases: { ja: ["硬膜下出血", "SDH"], en: ["SDH", "Subdural haemorrhage", "Subdural hemorrhage"] },
    keepPmids: ["27695533", "38725642", "36003292"],
    clinical: {
      overview: "硬膜とくも膜の間に血液が貯留する病態。外傷、抗凝固療法、高齢、脳萎縮などが背景になり、三日月状の脳外血腫として認められる。",
      treatment: "症状、血腫厚、正中偏位、急性度に応じて経過観察、穿頭血腫洗浄、開頭血腫除去、中硬膜動脈塞栓などを検討する。",
      epidemiology: "高齢者や外傷後で重要。慢性硬膜下血腫は高齢者で頻度が高い。"
    },
    demographics: {
      sex: { applicable: ["any"], predominance: "male", predilection: "male_predominant", summary: "外傷・高齢者背景を反映して男性に多い傾向がある。" },
      age: { typical_min: 60, typical_max: 95, peak_decade: "70-80歳代", summary: "慢性硬膜下血腫は高齢者に多い。急性例は外傷背景で年齢幅が広い。" }
    },
    frequency: { label: "common", prevalence_rank: 4, basis: "clinical_context", evidence_level: "review", context: { population: "elderly_or_trauma", body_region: "brain", clinical_setting: "extra_axial_hemorrhage" }, summary: "高齢者や外傷後の脳外液体貯留では頻度の高い鑑別。" },
    keywords: ["crescent shape", "extra-axial collection", "midline shift", "bridging vein"],
    ctSummary: "三日月状の脳外血腫。急性期は高吸収、亜急性は等吸収、慢性期は低吸収になりうる。",
    mriSummary: "血腫の時相によりT1/T2信号が変化し、隔壁や膜、再出血、磁化率低信号を評価できる。",
    ctGroups: [ctGroup("noncontrast", [
      finding("subdural_hematoma", "ct_nc_001", "finding:ct_hyperattenuation", "CT", "noncontrast", "急性硬膜下血腫は三日月状の高吸収域として認められる。", { anatomy: { organ: "meninges", subregion: "extra_axial" }, target: "extra_axial_collection", weight: 4, keywords: ["crescent shape"] }),
      finding("subdural_hematoma", "ct_nc_002", "finding:ct_isoattenuation", "CT", "noncontrast", "亜急性期には脳実質と等吸収に近づき見落としやすい。", { anatomy: { organ: "meninges", subregion: "extra_axial" }, target: "extra_axial_collection", typicality: "variable", weight: 2 }),
      finding("subdural_hematoma", "ct_nc_003", "finding:ct_hypoattenuation", "CT", "noncontrast", "慢性硬膜下血腫では低吸収の脳外液体貯留として見えることが多い。", { anatomy: { organ: "meninges", subregion: "extra_axial" }, target: "extra_axial_collection", weight: 3 })
    ])],
    mriGroups: [
      mriGroup("T1WI", [finding("subdural_hematoma", "mri_t1_001", "finding:t1_hyperintensity", "MRI", "T1WI", "亜急性血腫ではメトヘモグロビンによりT1高信号を示すことがある。", { anatomy: { organ: "meninges", subregion: "extra_axial" }, target: "extra_axial_collection", typicality: "variable", weight: 2 })]),
      mriGroup("T2WI", [finding("subdural_hematoma", "mri_t2_001", "finding:t2_hyperintensity", "MRI", "T2WI", "慢性血腫はT2高信号の脳外液体貯留として見えることが多い。", { anatomy: { organ: "meninges", subregion: "extra_axial" }, target: "extra_axial_collection", weight: 2 })]),
      mriGroup("SWI", [finding("subdural_hematoma", "mri_swi_001", "finding:susceptibility_blooming", "MRI", "SWI", "血液分解産物や再出血部位で磁化率低信号を伴うことがある。", { anatomy: { organ: "meninges", subregion: "extra_axial" }, target: "extra_axial_collection", typicality: "variable", weight: 2 })])
    ]
  }
];

for (const spec of specs) {
  writeJson(path.join(draftsDir, `${spec.id}.json`), makeCard(spec));
}

const findingPath = path.join(DATA, "dictionaries", "finding-concepts.json");
const findings = readJson(findingPath);
const findingUpdates = {
  "finding:susceptibility_blooming": ["磁化率低信号/blooming", ["磁化率低信号", "blooming", "ブルーミング", "SWI低信号"]],
  "finding:venous_sinus_thrombosis": ["静脈洞血栓", ["静脈洞血栓", "硬膜静脈洞血栓症"]],
  "finding:hyperperfusion": ["過灌流", ["過灌流", "血流増加"]],
  "finding:hypoperfusion": ["低灌流", ["低灌流", "血流低下"]],
  "finding:elevated_cbv": ["CBV上昇", ["CBV上昇", "rCBV上昇"]],
  "finding:reduced_cbv": ["CBV低下", ["CBV低下", "rCBV低下"]],
  "finding:elevated_choline_peak": ["コリンピーク上昇", ["コリンピーク上昇", "Cho上昇"]],
  "finding:lactate_peak": ["乳酸ピーク", ["乳酸ピーク", "lactate peak"]],
  "finding:lipid_peak": ["脂質ピーク", ["脂質ピーク", "lipid peak"]],
  "finding:fat_suppression_signal_drop": ["脂肪抑制で信号低下", ["脂肪抑制で信号低下", "脂肪抑制低下"]],
  "finding:heavily_t2_fluid_signal": ["強T2強調で液体信号", ["強T2強調で液体信号", "MRCP様高信号"]],
  "finding:flow_void": ["flow void", ["flow void", "フローボイド", "血流空隙"]],
  "finding:arterial_stenosis_or_occlusion": ["動脈狭窄/閉塞", ["動脈狭窄", "動脈閉塞", "血管狭窄", "血管閉塞"]],
  "finding:opposed_phase_signal_drop": ["opposed-phaseで信号低下", ["逆位相で信号低下", "opposed-phase信号低下", "chemical shift"]]
};
for (const [conceptId, [label, synonyms]] of Object.entries(findingUpdates)) {
  if (!findings[conceptId]) continue;
  findings[conceptId].canonical_label = findings[conceptId].canonical_label || {};
  findings[conceptId].canonical_label.ja = label;
  findings[conceptId].synonyms = findings[conceptId].synonyms || {};
  findings[conceptId].synonyms.ja = Array.from(new Set([...(findings[conceptId].synonyms.ja || []).filter((item) => !item.includes("???")), ...synonyms]));
  findings[conceptId].tokens = Array.from(new Set([...(findings[conceptId].tokens || []).filter((item) => !item.includes("???")), ...synonyms]));
}
writeJson(findingPath, findings);

const sequencePath = path.join(DATA, "dictionaries", "sequence-map.json");
const sequences = readJson(sequencePath);
const sequenceUpdates = {
  T1WI_fat_suppressed: ["脂肪抑制T1強調像", ["脂肪抑制T1", "脂肪抑制T1強調像", "T1FS", "T1 fat-sat", "fat-suppressed T1WI"]],
  T2WI_fat_suppressed: ["脂肪抑制T2強調像", ["脂肪抑制T2", "脂肪抑制T2強調像", "T2FS", "T2 fat-sat", "fat-suppressed T2WI"]],
  STIR: ["STIR", ["STIR", "short tau inversion recovery"]],
  PDWI: ["プロトン密度強調像", ["PDWI", "PD", "プロトン密度強調像", "proton density"]],
  PDWI_fat_suppressed: ["脂肪抑制プロトン密度強調像", ["PD FS", "PD fat-sat", "脂肪抑制PD", "fat-suppressed PDWI"]],
  T2STAR: ["T2*強調像", ["T2*", "T2STAR", "T2 star", "T2*WI", "T2スター", "T2*強調像"]],
  GRE_T2STAR: ["GRE T2*強調像", ["GRE", "T2* GRE", "GRE T2*", "gradient echo", "gradient-echo T2*"]],
  SWI: ["SWI", ["SWI", "磁化率強調像", "susceptibility-weighted imaging"]],
  DIR: ["二重反転回復", ["DIR", "double inversion recovery", "二重反転回復"]],
  contrast_enhanced_T1WI_fat_suppressed: ["脂肪抑制造影T1強調像", ["脂肪抑制造影T1", "造影T1FS", "CE T1 fat-sat"]],
  DCE_MRI: ["ダイナミック造影MRI", ["DCE", "DCE-MRI", "dynamic contrast enhanced MRI", "ダイナミック造影"]],
  DSC_perfusion: ["DSC灌流MRI", ["DSC", "DSC perfusion", "perfusion MRI", "灌流MRI"]],
  ASL: ["ASL灌流", ["ASL", "arterial spin labeling", "ASL灌流"]],
  MRA_TOF: ["TOF MRA", ["TOF", "TOF MRA", "time-of-flight MRA"]],
  MRA_contrast_enhanced: ["造影MRA", ["造影MRA", "contrast-enhanced MRA"]],
  MRV: ["MR静脈撮像", ["MRV", "MR venography", "MR静脈撮像"]],
  MRS: ["MR spectroscopy", ["MRS", "MR spectroscopy", "MRスペクトロスコピー"]],
  CISS_FIESTA: ["CISS/FIESTA", ["CISS", "FIESTA", "balanced steady-state"]],
  DIXON_opposed_phase: ["Dixon opposed-phase", ["Dixon opposed-phase", "opposed-phase", "逆位相"]]
};
for (const [sequenceId, [label, synonyms]] of Object.entries(sequenceUpdates)) {
  if (!sequences[sequenceId]) continue;
  sequences[sequenceId].label = sequences[sequenceId].label || {};
  sequences[sequenceId].label.ja = label;
  sequences[sequenceId].synonyms = Array.from(new Set(synonyms));
}
writeJson(sequencePath, sequences);

const candidatePath = path.join(DATA, "dictionaries", "new-concept-candidates.json");
if (fs.existsSync(candidatePath)) {
  const candidates = readJson(candidatePath);
  candidates.candidates = (candidates.candidates || []).filter(
    (candidate) => candidate.candidate_id !== "candidate:unknown" && candidate.proposed_concept_id !== "finding:unknown"
  );
  writeJson(candidatePath, candidates);
}

console.log(`Curated ${specs.length} brain draft cards.`);
console.log(`Root: ${ROOT}`);
