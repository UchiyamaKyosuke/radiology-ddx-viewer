# Codex Literature Extraction Packet

Disease: Posterior reversible encephalopathy syndrome
Japanese name: 可逆性後頭葉白質脳症
PubMed query: posterior reversible encephalopathy syndrome[Title/Abstract] AND (MRI[Title/Abstract] OR magnetic resonance[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\posterior_reversible_encephalopathy_syndrome.source.json
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

PMID: 28054130
Title: Posterior reversible encephalopathy syndrome.
Journal: Journal of neurology
Year: 2018
DOI: 10.1007/s00415-016-8377-8
URL: https://pubmed.ncbi.nlm.nih.gov/28054130/

Abstract:
The posterior reversible encephalopathy syndrome (PRES) is a neurological disorder of (sub)acute onset characterized by varied neurological symptoms, which may include headache, impaired visual acuity or visual field deficits, disorders of consciousness, confusion, seizures, and focal neurological deficits. In a majority of patients the clinical presentation includes elevated arterial blood pressure up to hypertensive emergencies. Neuroimaging, in particular magnetic resonance imaging, frequently shows a distinctive parieto-occipital pattern with a symmetric distribution of changes reflecting vasogenic edema. PRES frequently develops in the context of cytotoxic medication, (pre)eclampsia, sepsis, renal disease or autoimmune disorders. The treatment is symptomatic and is determined by the underlying condition. The overall prognosis is favorable, since clinical symptoms as well as imaging lesions are reversible in most patients. However, neurological sequelae including long-term epilepsy may persist in individual cases.


## Article 2

PMID: 34275982
Title: Posterior Reversible Encephalopathy Syndrome: A Review of the Literature.
Journal: Internal medicine (Tokyo, Japan)
Year: 2022
DOI: 10.2169/internalmedicine.7520-21
URL: https://pubmed.ncbi.nlm.nih.gov/34275982/

Abstract:
Posterior reversible encephalopathy syndrome (PRES) is a group of clinical syndromes typically characterized by bilateral reversible vasogenic edema of the subcortical white matter in the parieto-occipital region on neuroimaging that causes a wide variety of acute or subacute neurological symptoms, including headache, mental status alteration, seizures, and visual dysfunction. PRES is classically suspected in patients with severe hypertension, renal failure, autoimmune disorders, eclampsia, or immunosuppressant medications. Frequent neurological evaluations and neuroimaging examinations by computed tomography or magnetic resonance imaging are required for both the diagnosis and assessment of the condition. Early detection of the disease is key for a rapid recovery and good prognosis.


## Article 3

PMID: 31272323
Title: Reversible Cerebral Vasoconstriction Syndrome.
Journal: Stroke
Year: 2020
DOI: 10.1161/STROKEAHA.119.024416
URL: https://pubmed.ncbi.nlm.nih.gov/31272323/

Abstract:
(no abstract)


## Article 4

PMID: 37951698
Title: Imaging of Reversible Cerebral Vasoconstriction Syndrome and Posterior Reversible Encephalopathy Syndrome.
Journal: Neuroimaging clinics of North America
Year: 2023
DOI: 10.1016/j.nic.2023.07.004
URL: https://pubmed.ncbi.nlm.nih.gov/37951698/

Abstract:
PRES and RCVS are increasingly recognized due to the wider use of brain MRI and increasing clinical awareness. Imaging plays a crucial role in confirming the diagnosis and guiding clinical management for PRES and RCVS. Imaging also has a pivotal role in determining the temporal progression of these entities, detecting complications, and predicting prognosis. In this review, we aim to describe PRES and RCVS, discuss their possible pathophysiological mechanisms, and discuss imaging methods that are useful in the diagnosis, management, and follow-up of patients.


## Article 5

PMID: 28131335
Title: Posterior Reversible Encephalopathy Syndrome: A Review.
Journal: Canadian Association of Radiologists journal = Journal l'Association canadienne des radiologistes
Year: 2017
DOI: 10.1016/j.carj.2016.08.005
URL: https://pubmed.ncbi.nlm.nih.gov/28131335/

Abstract:
Radiologists may be the first to suggest the diagnosis of posterior reversible encephalopathy syndrome (PRES). PRES is associated with many diverse clinical entities, the most common of which are eclampsia, hypertension, and immunosuppressive treatment. Radiologists should be aware of the spectrum of imaging findings in PRES. When promptly recognized and treated, the symptoms and radiological abnormalities can be completely reversed. When unrecognized, patients can progress to ischemia, massive infarction, and death. In this review, we present an overview of the unique signs observed on computed tomography and magnetic resonance images in PRES that can help in the early diagnosis and treatment that is highly effective in this syndrome.

