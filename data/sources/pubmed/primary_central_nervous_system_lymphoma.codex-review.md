# Codex Literature Extraction Packet

Disease: Primary central nervous system lymphoma
Japanese name: 原発性中枢神経系リンパ腫
PubMed query: primary central nervous system lymphoma[Title/Abstract] AND (MRI[Title/Abstract] OR magnetic resonance[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\primary_central_nervous_system_lymphoma.source.json
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
- finding:susceptibility_blooming: ??????/blooming / susceptibility blooming
- finding:flow_void: flow void / flow void
- finding:arterial_stenosis_or_occlusion: ????/?? / arterial stenosis or occlusion
- finding:venous_sinus_thrombosis: ????? / venous sinus thrombosis
- finding:hyperperfusion: ??? / hyperperfusion
- finding:hypoperfusion: ??? / hypoperfusion
- finding:elevated_cbv: CBV?? / elevated CBV
- finding:reduced_cbv: CBV?? / reduced CBV
- finding:elevated_choline_peak: ???????? / elevated choline peak
- finding:lactate_peak: ????? / lactate peak
- finding:lipid_peak: ????? / lipid peak
- finding:opposed_phase_signal_drop: ??????? / opposed-phase signal drop
- finding:fat_suppression_signal_drop: ????????? / signal drop on fat suppression
- finding:heavily_t2_fluid_signal: ??T2??? / heavily T2-weighted fluid signal

## PubMed Abstracts

## Article 1

PMID: 38703015
Title: Primary central nervous system lymphoma: Imaging features and differential diagnosis.
Journal: The neuroradiology journal
Year: 2024
DOI: 10.1177/19714009241252625
URL: https://pubmed.ncbi.nlm.nih.gov/38703015/

Abstract:
Primary central nervous system lymphoma (PCNSL) represents 5% of malignant primary brain tumors. The clinical presentation typically includes focal neurological symptoms, increased intracranial pressure, seizures, and psychiatric symptoms. Although histological examination remains the gold standard for diagnostic confirmation, non-invasive imaging plays a crucial role for the diagnosis. In immunocompetent individuals, PCNSL usually appears as a single, well-defined, supratentorial lesion with a predilection for periventricular areas, iso- or hypointense on T1- and T2-weighted magnetic resonance imaging, with restricted diffusion, slightly increased perfusion, and homogenous gadolinium-enhancement. Differential diagnoses include high-grade glioma and pseudotumoral demyelinating disease. In immunocompromised patients, PCNSL may present as multiple lesions, with a higher likelihood of hemorrhage and necrosis and less restricted diffusion than immunocompetent individuals. Differential diagnoses include neurotoxoplasmosis, progressive multifocal leukoencephalopathy, and cerebral abscess. Atypical forms of lymphoma are characterized by extra-axial lymphoma, lymphomatosis cerebri, and intravascular lymphoma. Extra-axial lymphoma presents as single or multiple extra-axial dural lesions with diffuse leptomeningeal contrast-enhancement. Lymphomatosis cerebri appears as an infiltrative and symmetric lesion, primarily affecting deep white matter and basal ganglia, appearing hyperintense on T2-weighted imaging, without significant contrast-enhancement or perfusion changes. Intravascular lymphoma presents as multiple rounded or oval-shaped "infarct-like" lesions, located cortically or subcortically. This study aims to highlight the imaging characteristics of PCNSL, focusing on magnetic resonance imaging and its differential diagnosis.


## Article 2

PMID: 33560416
Title: Consensus recommendations for MRI and PET imaging of primary central nervous system lymphoma: guideline statement from the International Primary CNS Lymphoma Collaborative Group (IPCG).
Journal: Neuro-oncology
Year: 2021
DOI: 10.1093/neuonc/noab020
URL: https://pubmed.ncbi.nlm.nih.gov/33560416/

Abstract:
Advanced molecular and pathophysiologic characterization of primary central nervous system lymphoma (PCNSL) has revealed insights into promising targeted therapeutic approaches. Medical imaging plays a fundamental role in PCNSL diagnosis, staging, and response assessment. Institutional imaging variation and inconsistent clinical trial reporting diminishes the reliability and reproducibility of clinical response assessment. In this context, we aimed to: (1) critically review the use of advanced positron emission tomography (PET) and magnetic resonance imaging (MRI) in the setting of PCNSL; (2) provide results from an international survey of clinical sites describing the current practices for routine and advanced imaging, and (3) provide biologically based recommendations from the International PCNSL Collaborative Group (IPCG) on adaptation of standardized imaging practices. The IPCG provides PET and MRI consensus recommendations built upon previous recommendations for standardized brain tumor imaging protocols (BTIP) in primary and metastatic disease. A biologically integrated approach is provided to addresses the unique challenges associated with the imaging assessment of PCNSL. Detailed imaging parameters facilitate the adoption of these recommendations by researchers and clinicians. To enhance clinical feasibility, we have developed both "ideal" and "minimum standard" protocols at 3T and 1.5T MR systems that will facilitate widespread adoption.


## Article 3

PMID: 30072069
Title: Primary Central Nervous System Lymphoma.
Journal: Neurologic clinics
Year: 2019
DOI: 10.1016/j.ncl.2018.04.008
URL: https://pubmed.ncbi.nlm.nih.gov/30072069/

Abstract:
Primary central nervous system lymphoma (PCNSL) is an aggressive form of non-Hodgkin lymphoma restricted to the central nervous system. Stereotactic biopsy is the gold-standard for diagnosis of PCNSL. Extent of disease evaluation for newly diagnosed PCNSL patients includes brain imaging, eye examination, cerebrospinal fluid assessment, body imaging, and bone marrow biopsy. Methotrexate-based chemotherapy is the standard induction for PCNSL patients. Optimal consolidation therapy for PCNSL has not been defined, with several options feasible, including chemotherapy, high-dose chemotherapy, and autologous stem cell transplantation or whole-brain radiation therapy. Optimal treatment for relapsed and refractory PCNSL has not been defined.


## Article 4

PMID: 37452952
Title: Lymphomas of Central Nervous System.
Journal: Advances in experimental medicine and biology
Year: 2023
DOI: 10.1007/978-3-031-23705-8_20
URL: https://pubmed.ncbi.nlm.nih.gov/37452952/

Abstract:
Central nervous system (CNS) lymphoma consists of primary central nervous system lymphoma (PCNSL) and secondary CNS involvement by systemic lymphoma. This chapter focuses on the former. PCNSL is a relative rare disease, accounting for approximately 2.4-4.9% of all primary CNS tumors. It is an extra-nodal variant of non-Hodgkin's lymphoma (NHL), confined to the brain, leptomeninges, spinal cord, and eyes, with no systemic involvement. Recently, elderly patients (&#x2265;&#xa0;60&#xa0;years) are increasing. Histologically, B cell&#xa0;blasts, which originate from late&#xa0;germinal center&#xa0;exit B cell, are growing and homing in CNS. Immunohistochemically, these cells are positive for PAX5, CD19, CD20, CD22, and CD79a. PCNSL shows relatively characteristic appearances on CT, MR imaging, and PET. Treatment first line of PCNSL is HD-MTX-based chemotherapy with or without rituximab and irradiation. Severe side-effect of this treatment is delayed onset neurotoxicity, which cause of cognitive impairment. Therefore, combined chemotherapy alone or chemotherapy with reduced-dose irradiation is more recommended for elderly patients. There is no established standard care for relapse of the PCNSLs. Temsirolimus, lenalidomide, temozolomide, and Bruton's tyrosine kinase (BTK) inhibitor ibrutinib are candidates for refractory patients. The prognosis of PCNSL has significantly improved over the last decades (median OS: 26&#xa0;months, 5-year survival: 31%). Younger than 60 age and WHO performance status less than&#x2009;<&#x2009;or&#x2009;=&#x2009;1 are associated with a significantly better overall survival.


## Article 5

PMID: 35994050
Title: Primary central nervous system lymphoma: advances in MRI and PET imaging.
Journal: Annals of lymphoma
Year: 2022
DOI: 10.21037/aol-20-53
URL: https://pubmed.ncbi.nlm.nih.gov/35994050/

Abstract:
Contrast enhanced magnetic resonance imaging (CE-MRI) remains the imaging modality of choice for initial workup, staging, and response assessment after therapy in patients with primary central nervous system lymphoma (PCNSL). While CE-MRI is a sensitive test to detect blood brain barrier (BBB) dysfunction, it does not biologically represent the true tumor burden. Current response assessment criteria relies heavily on two dimensional anatomical measurements on post contrast T1-weighted (T1W) images, as well as pre-contrast T2-weighted (T2W) imaging. Additional MRI features, such as diffusion-weighted imaging (DWI) and perfusion weighted imaging, can be routinely obtained at most centers with MRI capabilities. Emerging evidence supports the incorporation of these data to better define tumor physiology and provide additional valuable clinical tools capable of identifying high risk subgroups as well as early predictors of response to therapies. Further, novel advanced molecular and pathophysiologic characterization of PCNSL provides insights into promising targeted therapeutic approaches. However, significant institutional imaging variation and inconsistent clinical trial reporting diminishes the reliability, reproducibility and eventual translation in day to day management of patients with PCNSL. Here we review established neuroimaging concepts and provide an overview of published literature about novel imaging techniques that may improve diagnosis and response assessments. Finally, we highlight the need for standardization of image acquisition, post-processing, and incorporation of novel imaging biomarkers in early phase PCNSL clinical trials.

