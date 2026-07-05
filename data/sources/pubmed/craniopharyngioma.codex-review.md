# Codex Literature Extraction Packet

Disease: Craniopharyngioma
Japanese name: 頭蓋咽頭腫
PubMed query: craniopharyngioma[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract] OR calcification[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\craniopharyngioma.source.json
```

Goals:

1. Fill clinical overview, treatment, epidemiology, demographics, and frequency.
2. Extract CT/MRI findings into the source JSON shape used by scripts/generate-draft.js.
3. Prefer existing finding concepts. If a finding does not map, leave it descriptive; generate-draft.js will mark it as needs_mapping.
4. Keep uncertain statements conservative.
5. Do not use external APIs. Edit files directly in this workspace.

## Current Dictionary Concepts

- finding:t2_hypointensity: T2低信号 / T2 hypointensity
- finding:t2_mild_hypointensity: T2軽度低信号 / mild T2 hypointensity
- finding:t2_hyperintensity: T2高信号 / T2 hyperintensity
- finding:t2_mild_hyperintensity: T2軽度高信号 / mild T2 hyperintensity
- finding:t2_isointensity: T2等信号 / T2 isointensity
- finding:t1_hypointensity: T1低信号 / T1 hypointensity
- finding:t1_mild_hypointensity: T1軽度低信号 / mild T1 hypointensity
- finding:t1_mild_hyperintensity: T1軽度高信号 / mild T1 hyperintensity
- finding:t1_isointensity: T1等信号 / T1 isointensity
- finding:diffusion_restriction_absent: 拡散制限なし / Absent diffusion restriction
- finding:bridging_vessel_sign: bridging vessel sign / bridging vessel sign
- finding:ovarian_origin: 卵巣由来 / ovarian origin
- finding:mild_enhancement: 軽度造影効果 / mild enhancement
- finding:t1_hyperintensity: T1高信号 / T1 hyperintensity
- finding:adc_low: ADC低下 / low ADC
- finding:adc_high: ADC高値 / high ADC
- finding:adc_iso: ADC等信号 / ADC isointensity
- finding:dwi_hyperintensity: DWI高信号 / DWI hyperintensity
- finding:dwi_isointensity: DWI等信号 / DWI isointensity
- finding:ct_hypoattenuation: CT低吸収 / CT hypoattenuation
- finding:ct_mild_hypoattenuation: CT軽度低吸収 / mild CT hypoattenuation
- finding:ct_isoattenuation: CT等吸収 / CT isoattenuation
- finding:ct_mild_hyperattenuation: CT軽度高吸収 / mild CT hyperattenuation
- finding:ct_hyperattenuation: CT高吸収 / CT hyperattenuation
- finding:ct_fat_attenuation: 脂肪吸収値 / fat attenuation
- finding:calcification_present: 石灰化あり / calcification
- finding:fat_present: 脂肪成分あり / fat-containing lesion
- finding:diffusion_restriction_present: 拡散制限あり / restricted diffusion
- finding:multilocular_cystic_mass: 多房性嚢胞性腫瘤 / multilocular cystic mass
- finding:papillary_projection: 乳頭状充実成分 / papillary projection
- finding:wall_thickening: 壁肥厚 / wall thickening
- finding:hemorrhage_present: 出血成分あり / hemorrhagic content
- finding:t2_shading: T2 shading / T2 shading
- finding:enhancing_solid_component: 造影される充実成分 / enhancing solid component
- finding:enhancement_absent: 造影効果なし / absent enhancement
- finding:ring_enhancement: リング状造影 / ring enhancement
- finding:thick_irregular_ring_enhancement: 厚く不整なリング状造影 / thick irregular ring enhancement
- finding:dural_tail_sign: dural tail sign / dural tail sign
- finding:extra_axial_dural_based_mass: 硬膜付着性脳外腫瘤 / extra-axial dural-based mass
- finding:avid_homogeneous_enhancement: 強く均一な造影効果 / avid homogeneous enhancement
- finding:flair_hyperintensity: FLAIR高信号 / FLAIR hyperintensity
- finding:vasogenic_edema: 血管原性浮腫 / vasogenic edema
- finding:central_diffusion_restriction: 中心部拡散制限 / central restricted diffusion
- finding:vascular_territory_restricted_diffusion: 血管支配域に沿う拡散制限 / vascular territory restricted diffusion
- finding:periventricular_ovoid_lesions: 脳室周囲卵円形白質病変 / periventricular ovoid lesions
- finding:open_ring_enhancement: open-ring enhancement / open-ring enhancement
- finding:stained_glass_appearance: 嚢胞ごとに信号強度が異なる stained-glass appearance を示すことがある。 / 
- finding:susceptibility_blooming: 磁化率低信号/blooming / susceptibility blooming
- finding:flow_void: flow void / flow void
- finding:arterial_stenosis_or_occlusion: 動脈狭窄/閉塞 / arterial stenosis or occlusion
- finding:venous_sinus_thrombosis: 静脈洞血栓 / venous sinus thrombosis
- finding:hyperperfusion: 過灌流 / hyperperfusion
- finding:hypoperfusion: 低灌流 / hypoperfusion
- finding:elevated_cbv: CBV上昇 / elevated CBV
- finding:reduced_cbv: CBV低下 / reduced CBV
- finding:elevated_choline_peak: コリンピーク上昇 / elevated choline peak
- finding:lactate_peak: 乳酸ピーク / lactate peak
- finding:lipid_peak: 脂質ピーク / lipid peak
- finding:opposed_phase_signal_drop: opposed-phaseで信号低下 / opposed-phase signal drop
- finding:fat_suppression_signal_drop: 脂肪抑制で信号低下 / signal drop on fat suppression
- finding:heavily_t2_fluid_signal: 強T2強調で液体信号 / heavily T2-weighted fluid signal

## PubMed Abstracts

## Article 1

PMID: 31699993
Title: Craniopharyngioma.
Journal: Nature reviews. Disease primers
Year: 2020
DOI: 10.1038/s41572-019-0125-9
URL: https://pubmed.ncbi.nlm.nih.gov/31699993/

Abstract:
Craniopharyngiomas are rare malformational tumours of low histological malignancy arising along the craniopharyngeal duct. The two histological subtypes, adamantinomatous craniopharyngioma (ACP) and papillary craniopharyngioma (PCP), differ in genesis and age distribution. ACPs are diagnosed with a bimodal peak of incidence (5-15 years and 45-60 years), whereas PCPs are restricted to adults mainly in the fifth and sixth decades of life. ACPs are driven by somatic mutations in CTNNB1 (encoding &#x3b2;-catenin) that affect &#x3b2;-catenin stability and are predominantly cystic in appearance. PCPs frequently harbour somatic BRAF V600E  mutations and are typically solid tumours. Clinical manifestations due to increased intracranial pressure, visual impairment and endocrine deficiencies should prompt imaging investigations, preferentially MRI. Treatment comprises neurosurgery and radiotherapy; intracystic chemotherapy is used in monocystic ACP. Although long-term survival is high, quality of life and neuropsychological function are frequently impaired due to the close anatomical proximity to the optic chiasm, hypothalamus and pituitary gland. Indeed, hypothalamic involvement and treatment-related hypothalamic lesions frequently result in hypothalamic obesity, physical fatigue and psychosocial deficits. Given the rarity of these tumours, efforts to optimize infrastructure and international collaboration should be research priorities.


## Article 2

PMID: 33040852
Title: Neuroimaging of the Pituitary Gland: Practical Anatomy and Pathology.
Journal: Radiologic clinics of North America
Year: 2020
DOI: 10.1016/j.rcl.2020.07.009
URL: https://pubmed.ncbi.nlm.nih.gov/33040852/

Abstract:
The pituitary gland is a small endocrine organ located within the sella turcica. Various pathologic conditions affect the pituitary gland and produce endocrinologic and neurologic abnormalities. The most common lesion of the pituitary gland is the adenoma, a benign neoplasm. Dedicated MR imaging of the pituitary is radiologic study of choice for evaluating pituitary gland and central skull region. Computed tomography is complimentary and allows for identification of calcification and adjacent abnormalities of the osseous skull base. This review emphasizes basic anatomy, current imaging techniques, and highlights the spectrum of pathologic conditions that affect the pituitary gland and sellar region.


## Article 3

PMID: 32389269
Title: Sellar Tumors.
Journal: Surgical pathology clinics
Year: 2021
DOI: 10.1016/j.path.2020.02.006
URL: https://pubmed.ncbi.nlm.nih.gov/32389269/

Abstract:
Sellar region lesions include a broad range of benign and malignant neoplastic as well as non-neoplastic entities, many of which are newly described or have recently revised nomenclature. In contrast to other intracranial sites, imaging features are relatively less specific, and the need for histopathological diagnosis is of paramount importance. This review will describe pituitary adenomas, inflammatory lesions, and tumors unique to the region (craniopharyngioma) as well as tumors which may occur in but are not exclusively localized to the sellar location (schwannoma, metastasis, etc.).

