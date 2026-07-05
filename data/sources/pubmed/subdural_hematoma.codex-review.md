# Codex Literature Extraction Packet

Disease: Subdural hematoma
Japanese name: 硬膜下血腫
PubMed query: subdural hematoma[Title/Abstract] AND (CT[Title/Abstract] OR MRI[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\subdural_hematoma.source.json
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

PMID: 31786544
Title: Neuroendovascular surgery.
Journal: Journal of neurosurgery
Year: 2020
DOI: 10.3171/2019.8.JNS182678
URL: https://pubmed.ncbi.nlm.nih.gov/31786544/

Abstract:
Neuroendovascular surgery and interventional neuroradiology both describe the catheter-based (most often) endovascular diagnosis and treatment of vascular lesions affecting the brain and spinal cord. This article traces the evolution of these techniques and their current role as the dominant and frequently standard approach for many of these conditions. The article also discusses the important changes that have been brought to bear on open cerebrovascular neurosurgery by neuroendovascular surgery and their effects on resident and fellow training and describes new concepts for clinical care.


## Article 2

PMID: 27695533
Title: Chronic subdural hematoma.
Journal: Asian journal of neurosurgery
Year: 2022
DOI: 10.4103/1793-5482.145102
URL: https://pubmed.ncbi.nlm.nih.gov/27695533/

Abstract:
Chronic subdural hematoma (CSDH) is one of the most common neurosurgical conditions. There is lack of uniformity in the treatment of CSDH amongst surgeons in terms of various treatment strategies. Clinical presentation may vary from no symptoms to unconsciousness. CSDH is usually diagnosed by contrast-enhanced computed tomography scan. Magnetic resonance imaging (MRI) scan is more sensitive in the diagnosis of bilateral isodense CSDH, multiple loculations, intrahematoma membranes, fresh bleeding, hemolysis, and the size of capsule. Contrast-enhanced CT or MRI could detect associated primary or metastatic dural diseases. Although definite history of trauma could be obtained in a majority of cases, some cases may be secondary to coagulation defect, intracranial hypotension, use of anticoagulants and antiplatelet drugs, etc., Recurrent bleeding, increased exudates from outer membrane, and cerebrospinal fluid entrapment have been implicated in the enlargement of CSDH. Burr-hole evacuation is the treatment of choice for an uncomplicated CSDH. Most of the recent trials favor the use of drain to reduce recurrence rate. Craniotomy and twist drill craniostomy also play a role in the management. Dural biopsy should be taken, especially in recurrence and thick outer membrane. Nonsurgical management is reserved for asymptomatic or high operative risk patients. The steroids and angiotensin converting enzyme inhibitors may also play a role in the management. Single management strategy is not appropriate for all the cases of CSDH. Better understanding of the nature of the pathology, rational selection of an ideal treatment strategy for an individual patient, and identification of the merits and limitations of different surgical techniques could help in improving the prognosis.


## Article 3

PMID: 38725642
Title: Advances in chronic subdural hematoma and membrane imaging.
Journal: Frontiers in neurology
Year: 2024
DOI: 10.3389/fneur.2024.1366238
URL: https://pubmed.ncbi.nlm.nih.gov/38725642/

Abstract:
Chronic subdural hematoma (cSDH) is projected to become the most common cranial neurosurgical disease by 2030. Despite medical and surgical management, recurrence rates remain high. Recently, middle meningeal artery embolization (MMAE) has emerged as a promising treatment; however, determinants of disease recurrence are not well understood, and developing novel radiographic biomarkers to assess hematomas and cSDH membranes remains an active area of research. In this narrative review, we summarize the current state-of-the-art for subdural hematoma and membrane imaging and discuss the potential role of MR and dual-energy CT imaging in predicting cSDH recurrence, surgical planning, and selecting patients for embolization treatment.


## Article 4

PMID: 36381458
Title: Artery of Adamkiewicz.
Journal: Korean journal of neurotrauma
Year: 2022
DOI: 10.13004/kjnt.2022.18.e60
URL: https://pubmed.ncbi.nlm.nih.gov/36381458/

Abstract:
This article reviews the case of a 65-year-old patient with unstable L1 fracture after trauma. The fracture was treated via balloon kyphoplasty, shortly after which the patient developed shortness of breath and severe headache. Subsequent computed tomography (CT) of the head revealed subarachnoid hemorrhage. CT angiography did not reveal any intracranial aneurysms or arteriovenous malformations. A massive spinal subdural hematoma, which caused the patient to develop right leg paresis and hip joint weakness with grade 2-3, was found during magnetic resonance imaging (MRI). The hematoma was removed using multi-stage laminectomy Th5-L3. A follow-up MRI showed no pathological findings. Due to the unusual findings, spinal angiography was performed, revealing the artery of Adamkiewicz (A. radicularis magna, AKA) on the L1 level on the right side. Control CT showed a suboptimal insertion of the needle into the right pedicle, which caused the injury of the artery. AKA is present in the majority of the population, and surgical attention should be paid to avoid injury. Surgeons operating on the thoracolumbar spinal cord should have a thorough understanding of the anatomical features and surgical implications of this artery.


## Article 5

PMID: 36003292
Title: MRI appearance of chronic subdural hematoma.
Journal: Frontiers in neurology
Year: 2022
DOI: 10.3389/fneur.2022.872664
URL: https://pubmed.ncbi.nlm.nih.gov/36003292/

Abstract:
We aimed to describe the magnetic resonance imaging (MRI) characteristics of chronic subdural hematoma (cSDH) and to ascribe MRI patterns.
A total of 20 patients having 27 subdural hematomas underwent contrast-enhanced (CE) MRI of the brain at our institution between April 2019 and May 2021. The images were independently evaluated by two experienced neuroradiologists with regard to imaging characteristics on T1w, T2w, T2 * -GRE, FLAIR, diffusion-weighted magnetic resonance imaging (DWI), and CE images.
The signal characteristics of cSDH on T1- and T2-weighted images were rather heterogeneous. The majority of hematomas (74%) had internal septations. Surprisingly, contrast enhancement along the outer membrane adjacent to the cranium was noticed in all hematomas. There was also contrast enhancement along the inner membrane adjacent to the brain in more than one-third of the hematomas (37%). In approximately two-thirds of the cSDH (62%), there was a mass-like enhancement of the hematoma. Most hematomas (89%) were partially hypointense on T2 * -GRE and/or susceptibility-weighted imaging (SWI). Restricted diffusion was detected in approximately one-third of the hematomas (33%).
Consistent contrast enhancement along the outer membrane, triangular-shaped contrast enhancement at the borders of the cSDH, and infrequent enhancement of the inner membrane may help to distinguish cSDH from other entities such as empyema and tumors. Mass-like enhancement may refer to non-solid hematomas and could be an indicator for hematoma growth and a possible surrogate for successful endovascular embolization. Restricted diffusion in a subdural mass is not specific for empyema but may also be found in cSDH.

