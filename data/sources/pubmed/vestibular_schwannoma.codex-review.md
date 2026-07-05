# Codex Literature Extraction Packet

Disease: Vestibular schwannoma
Japanese name: 前庭神経鞘腫
PubMed query: vestibular schwannoma[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\vestibular_schwannoma.source.json
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

PMID: 31504802
Title: EANO guideline on the diagnosis and treatment of vestibular schwannoma.
Journal: Neuro-oncology
Year: 2021
DOI: 10.1093/neuonc/noz153
URL: https://pubmed.ncbi.nlm.nih.gov/31504802/

Abstract:
The level of evidence to provide treatment recommendations for vestibular schwannoma is low compared with other intracranial neoplasms. Therefore, the vestibular schwannoma task force of the European Association of Neuro-Oncology assessed the data available in the literature and composed a set of recommendations for health care professionals. The radiological diagnosis of vestibular schwannoma is made by magnetic resonance imaging. Histological verification of the diagnosis is not always required. Current treatment options include observation, surgical resection, fractionated radiotherapy, and radiosurgery. The choice of treatment depends on clinical presentation, tumor size, and expertise of the treating center. In small tumors, observation has to be weighed against radiosurgery, in large tumors surgical decompression is mandatory, potentially followed by fractionated radiotherapy or radiosurgery. Except for bevacizumab in neurofibromatosis type 2, there is no role for pharmacotherapy.


## Article 2

PMID: 41052870
Title: Vestibular schwannoma imaging and differential diagnosis.
Journal: Handbook of clinical neurology
Year: 2025
DOI: 10.1016/B978-0-12-824534-7.00005-6
URL: https://pubmed.ncbi.nlm.nih.gov/41052870/

Abstract:
Imaging plays a central role in the modern management of vestibular schwannomas (VS), from the initial diagnosis to treatment planning and subsequent monitoring of treatment response. It is of particular importance in NF2-related schwannomatosis (NF2) and similar genetic tumor predisposition syndromes, where patients require serial monitoring for many years. Magnetic resonance imaging (MRI) is the technique of choice and can reliably detect very small tumors and incremental growth. Modern imaging methods are reviewed, with a focus on MRI. The authors examine the initial evaluation of VS, differential diagnosis, expected posttreatment appearances, imaging after implantation, surveillance imaging, and assessment of complications. They also discuss imaging considerations arising in the context of NF2.


## Article 3

PMID: 38252395
Title: Cost considerations for vestibular schwannoma screening and imaging: a systematic review.
Journal: Neurosurgical review
Year: 2024
DOI: 10.1007/s10143-024-02305-3
URL: https://pubmed.ncbi.nlm.nih.gov/38252395/

Abstract:
Vestibular schwannomas (VS) account for approximately 8% of all intracranial neoplasms. Importantly, the cost of the diagnostic workup for VS, including the screening modalities most commonly used, has not been thoroughly investigated. Our aim is to conduct a systematic review of the published literature on costs associated with VS screening. A systematic review of the literature for cost of VS treatment was conducted in accordance with the Preferred Reporting Items for Systematic Reviews and Meta-Analyses (PRISMA) guidelines. The terms "vestibular schwannoma," "acoustic neuroma," and "cost" were queried using the PubMed and Embase databases. Studies from all countries were considered. Cost was then corrected for inflation using the US Bureau of Labor Statistics Inflation Calculator, correcting to April 2022. The search resulted in an initial review of 483 articles, of which 12 articles were included in the final analysis. Screening criteria were used for non-neurofibromatosis type I and II patients who complained of asymmetric hearing loss, tinnitus, or vertigo. Patients included in the studies ranged from 72 to 1249. The currency and inflation-adjusted mean cost was $418.40 (range, $21.81 to $487.03, n = 5) for auditory brainstem reflex and $1433.87 (range, $511.64 to $1762.15, n = 3) for non-contrasted computed tomography. A contrasted magnetic resonance imaging (MRI) scan was found to have a median cost of $913.27 (range, $172.25-$2733.99; n = 8) whereas a non-contrasted MRI was found to have a median cost of $478.62 (range, $116.61-$3256.38, n = 4). In terms of cost reporting, of the 12 articles, 1 (8.3%) of them separated out the cost elements, and 10 (83%) of them used local prices, which include institutional costs and/or average costs of multiple institutions. Our findings describe the limited data on published costs for screening and imaging of VS. The paucity of data and significant variability of costs between studies indicates that this endpoint is relatively unexplored, and the cost of screening is poorly understood.


## Article 4

PMID: 32690241
Title: Imaging of the temporal bone.
Journal: Clinical radiology
Year: 2021
DOI: 10.1016/j.crad.2020.06.013
URL: https://pubmed.ncbi.nlm.nih.gov/32690241/

Abstract:
This review will focus on key recent advances in imaging of the temporal bone. The role of magnetic resonance imaging (MRI) in providing aetiological and prognostic information for patients with sudden sensorineural hearing loss will be discussed. Novel MRI sequences, such as delayed contrast-enhanced 3D fluid-attenuated inversion recovery (FLAIR) and their utility in the identification and grading of endolymphatic hydrops in M&#xe9;ni&#xe8;re's disease will be described. Furthermore, we will document the considerable advances in auditory implant technology (including active middle ear implants), and how multidetector computed tomography (CT) and cone-beam CT may be invaluable in their preoperative and postoperative assessment. Finally, advances in the imaging of cholesteatoma, third-window lesions, otospongiosis (including internal auditory canal diverticula), and vestibular schwannoma will be reviewed.

