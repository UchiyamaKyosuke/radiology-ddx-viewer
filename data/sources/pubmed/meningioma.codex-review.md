# Codex Literature Extraction Packet

Disease: Meningioma
Japanese name: 髄膜腫
PubMed query: meningioma MRI imaging findings dural tail extra-axial

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\meningioma.source.json
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

PMID: 15664571
Title: The dural tail sign--beyond meningioma.
Journal: Clinical radiology
Year: 2005
DOI: 10.1016/j.crad.2004.01.019
URL: https://pubmed.ncbi.nlm.nih.gov/15664571/

Abstract:
There have been somewhat conflicting reports published about the significance of linear meningeal thickening and enhancement adjacent to peripherally located cranial mass lesions on contrast-enhanced magnetic resonance (MR) images. Most of the authors consider this so-called "dural tail sign" or "flare sign" almost specific for meningioma. This review illustrates the MR imaging findings of a wide spectrum of disorders that show this dural sign. Causes include other extra-axial lesions and also peripherally located intra-axial lesions such as neuromas, chloromas, metastases, lymphoma, gliomas, pituitary diseases, granulomatous disorders, and also cerebral Erdheim-Chester disease. The dural tail sign is not specific to a particular pathological process. Nevertheless, useful conclusions can be drawn from the morphology of the lesion, its enhancement pattern, and its solitary or multifocal presentation. The final diagnosis must be based on cerebrospinal fluid studies or histological studies after biopsy.


## Article 2

PMID: 33459822
Title: Dural-based lesions: is it a meningioma?
Journal: Neuroradiology
Year: 2021
DOI: 10.1007/s00234-021-02632-y
URL: https://pubmed.ncbi.nlm.nih.gov/33459822/

Abstract:
Meningiomas are the most common extra-axial intracranial neoplasms with typical radiological findings. In approximately 2% of cases, histopathological reports reveal different neoplasms or non-neoplastic lesions that can closely mimic meningiomas. We describe radiological features of meningioma mimics highlighting imaging red flags to consider a differential diagnosis.
A total of 348 lesions with radiological diagnosis of meningiomas which underwent to surgical treatment or biopsy between December of 2000 and September of 2014 were analyzed. We determined imaging features that are not a typical finding of meningiomas, suggesting other lesions. The following imaging characteristics were evaluated on CT and MRI: (a) bone erosion; (b) hyperintensity on T2WI; (c) hypointensity on T2WI; (d) bone destruction; (e) dural tail; (f) leptomeningeal involvement; (g) pattern of contrast enhancement; (h) dural displacement sign.
We have a relatively high prevalence of meningioma mimics (7.2%). Dural-based lesions with homogeneous contrast enhancement (52%) are easily misdiagnosed as meningiomas. Most lesions mimic convexity (37.5%) or parafalcine (21.9%) meningiomas. We have determined five imaging red flags that can alert radiologists to consider meningioma mimics: (1) bone erosion (22.2%); (2) dural displacement sign (36%); (3) marked T2 hypointensity (32%); (4) marked T2 hyperintensity (12%); (5) absence of dural tail (48%). The most common mimic lesion in our series was hemangiopericytomas, followed by lymphomas and schwannomas.
The prevalence of meningioma mimics is not negligible. It is important to have awareness on main radiological findings suggestive of differential diagnosis due to a wide range of differentials which lead to different prognosis and treatment strategies.


## Article 3

PMID: 30845079
Title: Cavernous Angioma Mimicking Meningioma.
Journal: The Journal of craniofacial surgery
Year: 2019
DOI: 10.1097/SCS.0000000000005177
URL: https://pubmed.ncbi.nlm.nih.gov/30845079/

Abstract:
The authors present a rare case of cavernous angioma mimicking a meningioma in a 58-year-old man who presented with a headache and dizziness. There were no neurological deficits or other neurological symptoms or signs. An extra-axial mass lesion thought to be associated with diffusely well-enhanced falx in the postcontrast sections was noted in the posterior interhemispheric fissure near the posterior part of the corpus callosum splenium. Extra-axial cavernous angiomas (cavernomas) are extremely rare lesions. They most commonly occur in the parenchyma but have been occasionally reported to arise from the dura matter. Dural cavernous angiomas arise from dural sinuses, falx cerebri, tentorium cerebelli, cranial base dura, or internal auditory canal dura and convexity. Parenchymal cavernous angiomas classically have a ring of hemosiderin surrounding the lesions observed on magnetic resonance imaging, but dural cavernous angiomas do not display the same magnetic resonance imaging characteristics and occasionally exhibit a dural tail sign due to which they can often be misdiagnosed as meningiomas.

