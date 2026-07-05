# Codex Literature Extraction Packet

Disease: Pituitary macroadenoma
Japanese name: 下垂体腺腫
PubMed query: pituitary adenoma[Title/Abstract] AND (MRI[Title/Abstract] OR magnetic resonance[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\pituitary_macroadenoma.source.json
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

PMID: 25732655
Title: Pituitary apoplexy.
Journal: Endocrinology and metabolism clinics of North America
Year: 2015
DOI: 10.1016/j.ecl.2014.10.016
URL: https://pubmed.ncbi.nlm.nih.gov/25732655/

Abstract:
Pituitary apoplexy (PA) is a rare clinical syndrome caused by sudden hemorrhaging and/or infarction of the pituitary gland, generally within a pituitary adenoma. The main symptom is sudden-onset severe headache, associated with visual disorders or ocular palsy. Corticotropic deficiency may be life-threatening if left untreated. Computed tomography (CT) or MRI confirms the diagnosis by revealing a pituitary tumor with hemorrhagic and/or necrotic components. PA used to be considered a neurosurgical emergency but a conservative approach is increasingly used in selected patients, as it yields similar outcomes. Glucocorticoid treatment must always be started immediately after onset.


## Article 2

PMID: 31745969
Title: Pituitary apoplexy.
Journal: Neurologia i neurochirurgia polska
Year: 2020
DOI: 10.5603/PJNNS.a2019.0054
URL: https://pubmed.ncbi.nlm.nih.gov/31745969/

Abstract:
Pituitary apoplexy (PA) is a clinical syndrome caused by acute haemorrhage and/or infarction of the pituitary gland, generally within a frequently undiagnosed pituitary adenoma. The sudden increase in pituitary gland volume is responsible for typical symptoms: severe headache, nausea, vomiting, visual impairment, cranial nerve palsies, deteriorating level of consciousness, and hypopituitarism. Radiological evidence, especially magnetic resonance imaging (MRI) which is the most sensitive diagnostic modality, establishes the diagnosis. Multiple risk factors have been reported, although the majority of cases have no identifiable precipitants. The management strategy depends on the clinical manifestation, as well as the presence of co-morbidities, and remains controversial. Post apoplexy, there needs to be careful monitoring for recurrence of tumour growth and endocrinological function of the pituitary. This disease is rare but potentially life-threatening without rapid treatment. Because there are no randomised studies, it is suggested that further trials are needed to optimise proper management.


## Article 3

PMID: 36826759
Title: Imaging of pituitary tumors: an update with the 5th WHO Classifications-part 1. Pituitary neuroendocrine tumor (PitNET)/pituitary adenoma.
Journal: Japanese journal of radiology
Year: 2023
DOI: 10.1007/s11604-023-01400-7
URL: https://pubmed.ncbi.nlm.nih.gov/36826759/

Abstract:
The pituitary gland is the body's master gland of the endocrine glands. Although it is a small organ, many types of tumors can develop within it. The recently revised fifth edition of the World Health Organization (WHO) classifications (2021 World Health Organization Classification of Central Nervous System Tumors and 2022 World Health Organization Classification of Endocrine and Neuroendocrine Tumors) revealed significant changes to the classification of pituitary adenomas, the most common type of pituitary gland tumor. This change categorized pituitary adenomas as neuroendocrine tumors and proposed the name to be revised to pituitary neuroendocrine tumor (PitNET). The International Classification of Diseases for Oncology behavior code for this tumor was previously "0" for benign tumor. In contrast, the fifth edition WHO classification has changed this code to "3" for primary malignant tumors as same to neuroendocrine tumor in other organs. Because the WHO classification made an important and significant change in the fundamental concept of the disease, in this paper, we will discuss the imaging diagnosis (magnetic resonance imaging, computed tomography, and positron emission tomography) of PitNET/pituitary adenoma in detail, considering these revisions as per the latest version of the WHO classification.


## Article 4

PMID: 42307852
Title: Functional pituitary adenoma imaging.
Journal: Reviews in endocrine & metabolic disorders
Year: 2026
DOI: 10.1007/s11154-026-10063-4
URL: https://pubmed.ncbi.nlm.nih.gov/42307852/

Abstract:
High-resolution pituitary MRI localises most pituitary neuroendocrine tumours (PitNETs), yet clinically important subgroups remain challenging: (i) very small functioning tumours, particularly corticotroph microadenomas, and (ii) post-operative remnants where scar, gland and tumour cannot be reliably separated. Functional imaging, specifically PET has matured into a problem-solving modality when conventional imaging is equivocal, provided it is used selectively and interpreted within a physiology-led framework. This review proposes an MRI-first, tiered imaging strategy and a pragmatic approach to tracer selection from the available armamentarium ([ 11 C]methionine, [ 68 &#xa0;Ga]SSTR ligands, [ 68 &#xa0;Ga]PentixaFor, [ 18 F]FET and [ 18 F]FDG). We emphasise how to optimise PET acquisition and reporting, and how to integrate imaging with endocrine phenotype, treatment history and surgical/radiosurgical planning to maximise clinical impact while safeguarding pituitary function.

