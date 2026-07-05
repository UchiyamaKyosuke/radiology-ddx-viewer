# Codex Literature Extraction Packet

Disease: Multiple sclerosis
Japanese name: 多発性硬化症
PubMed query: multiple sclerosis MRI imaging findings periventricular lesions

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\multiple_sclerosis.source.json
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

## PubMed Abstracts

## Article 1

PMID: 31209474
Title: Assessment of lesions on magnetic resonance imaging in multiple sclerosis: practical guidelines.
Journal: Brain : a journal of neurology
Year: 2020
DOI: 10.1093/brain/awz144
URL: https://pubmed.ncbi.nlm.nih.gov/31209474/

Abstract:
MRI has improved the diagnostic work-up of multiple sclerosis, but inappropriate image interpretation and application of MRI diagnostic criteria contribute to misdiagnosis. Some diseases, now recognized as conditions distinct from multiple sclerosis, may satisfy the MRI criteria for multiple sclerosis (e.g. neuromyelitis optica spectrum disorders, Susac syndrome), thus making the diagnosis of multiple sclerosis more challenging, especially if biomarker testing (such as serum anti-AQP4 antibodies) is not informative. Improvements in MRI technology contribute and promise to better define the typical features of multiple sclerosis lesions (e.g. juxtacortical and periventricular location, cortical involvement). Greater understanding of some key aspects of multiple sclerosis pathobiology has allowed the identification of characteristics more specific to multiple sclerosis (e.g. central vein sign, subpial demyelination and lesional rims), which are not included in the current multiple sclerosis diagnostic criteria. In this review, we provide the clinicians and researchers with a practical guide to enhance the proper recognition of multiple sclerosis lesions, including a thorough definition and illustration of typical MRI features, as well as a discussion of red flags suggestive of alternative diagnoses. We also discuss the possible place of emerging qualitative features of lesions which may become important in the near future.


## Article 2

PMID: 40975102
Title: 2024 MAGNIMS-CMSC-NAIMS consensus recommendations on the use of MRI for the diagnosis of multiple sclerosis.
Journal: The Lancet. Neurology
Year: 2025
DOI: 10.1016/S1474-4422(25)00304-7
URL: https://pubmed.ncbi.nlm.nih.gov/40975102/

Abstract:
MRI plays an increasingly important role in the diagnosis of multiple sclerosis. We discuss the expanded role of MRI in the 2024 McDonald diagnostic criteria for multiple sclerosis, which include the optic nerve as a fifth anatomical location, in addition to the periventricular, juxtacortical or cortical, infratentorial, and spinal cord regions. The diagnosis of multiple sclerosis can now be confirmed when the criteria of dissemination in space are fulfilled with the detection of typical lesions in at least four locations without additional evidence. We recommend appropriate imaging strategies and MRI acquisition protocols for all aspects of multiple sclerosis diagnosis, including fat-saturated sequences for detection of symptomatic optic nerve lesions. Diagnostic imaging should always cover the brain and spinal cord and include susceptibility-sensitive sequences for the assessment of the central vein sign and paramagnetic rim lesions, which can be especially helpful in cases when conventional imaging findings are insufficient to establish a diagnosis. We discuss how to handle the diagnosis of radiologically isolated presentations of multiple sclerosis, which are included in the 2024 criteria. We present recommendations for image interpretation and avoidance of misdiagnosis, and extend the recommendations to the use of MRI in the diagnosis of multiple sclerosis in older people, children, people with vascular comorbidities or migraine, and people living outside Europe and North America. Finally, we provide recommendations for standardisation of MRI acquisition and communication of results to enable an earlier diagnosis while maintaining high diagnostic specificity.


## Article 3

PMID: 40773034
Title: Characteristics of MRI lesions in AQP4 antibody-positive NMOSD, MOGAD, and multiple sclerosis: a systematic review and meta-analysis.
Journal: Journal of neurology
Year: 2025
DOI: 10.1007/s00415-025-13303-w
URL: https://pubmed.ncbi.nlm.nih.gov/40773034/

Abstract:
Multiple sclerosis (MS), aquaporin-4 antibody-positive neuromyelitis optica spectrum disorder (AQP4-Ab&#x2009;+&#x2009;ve NMOSD), and myelin oligodendrocyte glycoprotein-associated disease (MOGAD) are demyelinating diseases with differing pathophysiological processes and treatments. The objective of this study was to compile a comprehensive list of MRI lesions, and to quantify the utility of these lesions in distinguishing between these conditions.
We searched for articles comparing MRI lesion frequency in MS, AQP4-Ab&#x2009;+&#x2009;ve NMOSD, MOGAD and healthy controls. Bayesian network meta-analysis together with pairwise and pooled case-case comparison analyses to develop sensitivity, specificity, and positive predictive values were undertaken.
Sixty-six articles were reported on 2933 MS, 3296 AQP4-Ab&#x2009;+&#x2009;ve NMOSD, and 1559 MOGAD cases, and 561 healthy controls. MRI lesions associated with MS were: periventricular T2, subcortical white matter T2, Dawson's finger, U-fibre T2 lesion, posterior spinal column T2, inferior temporal T2, cortical T2, brain T1 hypointensity (black holes), peripheral spinal cord T2, pons T2, unilateral optic nerve T2 and brain gadolinium enhancing lesions. Optic chiasm T2, LETM, bright spotty spinal cord T2, area postrema T2, hypothalamic T2, spinal cord atrophy and optic tract T2 lesions were associated with AQP4-Ab&#x2009;+&#x2009;ve NMOSD. Conus medullaris T2, fluffy, perineural enhancement, peri-ependymal 3rd ventricle T2 and peri-ependymal 4th ventricle T2 lesions were associated with MOGAD.
This review identified MRI features supportive of a diagnosis of MS, NMOSD or MOGAD, and has clarified the diagnostic utility of various MRI lesion characteristics, to aid in future clinical decision-making and guide future approaches to research.

