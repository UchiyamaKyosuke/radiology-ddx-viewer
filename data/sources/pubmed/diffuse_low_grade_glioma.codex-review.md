# Codex Literature Extraction Packet

Disease: Diffuse low-grade glioma
Japanese name: びまん性低悪性度神経膠腫
PubMed query: diffuse low-grade glioma[Title/Abstract] AND (MRI[Title/Abstract] OR magnetic resonance[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\diffuse_low_grade_glioma.source.json
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

PMID: 41198334
Title: Pediatric-Type Diffuse Low Grade Glioma.
Journal: Advances in cancer research
Year: 2025
DOI: 10.1016/bs.acr.2025.08.006
URL: https://pubmed.ncbi.nlm.nih.gov/41198334/

Abstract:
Pediatric-type diffuse low grade glioma are a novel subgrouping of pediatric glioma defined in the updated WHO 2021 classification of central nervous system tumors. The newly recognized pediatric-type diffuse low grade glioma family is comprised of four distinct entities, including diffuse astrocytoma MYB or MYBL1-altered, angiocentric glioma, polymorphous low-grade neuroepithelial tumor of the young, and diffuse low grade glioma MAPK-altered. Due to significant overlap in histopathology and molecular alterations between pediatric-type diffuse low grade glioma, accurate diagnosis of these tumor subtypes requires integration of both histology and molecular findings. Herein, we describe the epidemiologic, imaging, and molecular features of these pediatric diffuse glioma. In addition, we review current knowledge regarding management approach and treatment outcomes, including potential therapeutic implications of prevalent molecular alterations within this family of tumors.


## Article 2

PMID: 31143247
Title: Diffuse Low-Grade Glioma - Changing Concepts in Diagnosis and Management: A Review.
Journal: Asian journal of neurosurgery
Year: 2020
DOI: 10.4103/ajns.AJNS_24_18
URL: https://pubmed.ncbi.nlm.nih.gov/31143247/

Abstract:
Though diffuse low-grade gliomas (dLGGs) represent only 15% of gliomas, they have been receiving increasing attention in the past decade. Significant advances in knowledge of the natural history and clinical diversity have been documented, and an improved pathological classification of gliomas that integrates histological features with molecular markers has been issued by the WHO. Advances in the radiological assessment of dLGG, particularly new magnetic resonance imaging scanning sequences, allow improved diagnostic and prognostic information. The management paradigms are evolving from "wait and watch" of the past to more active interventional therapy to obviate the risk of malignant transformation. New surgical technologies allow more aggressive surgical resections with a reduction of morbidity. Many reports suggest the association of gross total resection with longer overall survival and progression-free survival in addition to better seizure control. The literature also shows the use of chemotherapeutics and radiation therapy as important adjuncts to surgery. The goals of management have has been increasing survival with increasing stress on quality of life. Our review highlights the recent advances in the molecular diagnosis and management of dLGG with trends toward multidisciplinary and multimodality management of dLGG with an aim to surgically resect the primary disease, followed by chemoradiation in cases of progressive or recurrent disease.


## Article 3

PMID: 36510417
Title: Editorial for "An MRI Study Combining Virtual Brain Grafting and Surface-Based Morphometry Analysis to Investigate Contralateral Alterations in Cortical Morphology in Patients With Diffuse Low-Grade Glioma".
Journal: Journal of magnetic resonance imaging : JMRI
Year: 2023
DOI: 10.1002/jmri.28561
URL: https://pubmed.ncbi.nlm.nih.gov/36510417/

Abstract:
(no abstract)


## Article 4

PMID: 30292978
Title: Diffuse low grade glioma after the 2016 WHO update, seizure characteristics, imaging correlates and outcomes.
Journal: Clinical neurology and neurosurgery
Year: 2019
DOI: 10.1016/j.clineuro.2018.10.001
URL: https://pubmed.ncbi.nlm.nih.gov/30292978/

Abstract:
The majority of patients with supratentorial diffuse grade II glioma present with seizures, which adversely affect quality of life. The exact mechanism of epileptogenesis is unknown and the influence of tumour characteristics, radiological and histological, are not well studied, particularly following the introduction of molecular genetics in the 2016 WHO reclassification of gliomas. We sought to define predictors of seizure development and outcome in low grade glioma.
A retrospective review of patients who underwent resection of a supratentorial grade II glioma in a single institution. All patients underwent surgery at initial presentation with the aim of maximal safe resection. Presenting symptoms and radiological variables were recorded, including eloquent location, cortical involvement, tumour margins and tumour volume. Extent of resection (EOR), surgery type (awake vs asleep) and seizure outcome were analysed. Using molecular genetics data the original histology was reclassified according to the 2016 WHO update.
63 patients were included, 45 (71%) presented with seizures. 36 (57%) had oligodendroglioma and 27 astrocytoma. IDH-1 mutation was present in 53 (84%). 18 (29%) had tumour in an eloquent location. 33 (73%) were Engel class I following surgery at median follow up of 43 months. 6 patients were Engel II, 6 class III. Complete and near total resection were associated with improved Engel class compared to subtotal resection. No factors such as age, tumour location, tumour margins or tumour molecular genetics (including IDH-1 mutation) predicted better seizure outcome. Updated histological subtype did not predict the presence of seizures at initial diagnosis, only tumour heterogeneousity on initial MRI (p&#x2009;=&#x2009;0.043). More patients who underwent awake craniotomy with intraoperative mapping were Engel class 1 post-operatively than those operated under general anaesthetic (84% vs 65%). Tumour volume at presentation did not correlate with seizure outcome but impacts on the EOR.
Seizure outcome is directly related to EOR in low grade glioma, which can be predicted by the initial tumour volume. Tumour histological subtype, including updated molecular genetic classification did not predict seizure development or outcome in this series. The use of awake craniotomy results in greater EOR and improved Engel Class following surgery.


## Article 5

PMID: 40668344
Title: Illuminating radiogenomic signatures in pediatric-type diffuse gliomas: insights into molecular, clinical, and imaging correlations. Part II: low-grade group.
Journal: La Radiologia medica
Year: 2025
DOI: 10.1007/s11547-025-02049-0
URL: https://pubmed.ncbi.nlm.nih.gov/40668344/

Abstract:
The fifth edition of the World Health Organization classification of central nervous system tumors represents a significant advancement in the molecular-genetic classification of pediatric-type diffuse gliomas. This article comprehensively summarizes the clinical, molecular, and radiological imaging features in pediatric-type low-grade gliomas (pLGGs), including MYB- or MYBL1-altered tumors, polymorphous low-grade neuroepithelial tumor of the young (PLNTY), and diffuse low-grade glioma, MAPK pathway-altered. Most pLGGs harbor alterations in the RAS/MAPK pathway, functioning as "one pathway disease". Specific magnetic resonance imaging features, such as the T2-fluid-attenuated inversion recovery (FLAIR) mismatch sign in MYB- or MYBL1-altered tumors and the transmantle-like sign in PLNTYs, may serve as non-invasive biomarkers for underlying molecular alterations. Recent advances in radiogenomics have enabled the differentiation of BRAF fusion from BRAF V600E mutant tumors based on magnetic resonance imaging characteristics. Machine learning approaches have further enhanced our ability to predict molecular subtypes from imaging features. These radiology-molecular correlations offer potential clinical utility in treatment planning and prognostication, especially as targeted therapies against the MAPK pathway emerge. Continued research is needed to refine our understanding of genotype-phenotype correlations in less common molecular alterations and to validate these imaging biomarkers in larger cohorts.

