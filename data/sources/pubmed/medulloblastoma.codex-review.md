# Codex Literature Extraction Packet

Disease: Medulloblastoma
Japanese name: 髄芽腫
PubMed query: medulloblastoma[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\medulloblastoma.source.json
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

PMID: 27375228
Title: Childhood medulloblastoma.
Journal: Critical reviews in oncology/hematology
Year: 2017
DOI: 10.1016/j.critrevonc.2016.05.012
URL: https://pubmed.ncbi.nlm.nih.gov/27375228/

Abstract:
Medulloblastoma accounts for 15-20% of childhood nervous system tumours. The risk of dying was reduced by 30% in the last twenty years. Patients are divided in risk strata according to post-surgical disease, dissemination, histology and some molecular features such as WNT subgroup and MYC status. Sixty to 70% of patients older than 3 years are assigned to the average-risk group. High-risk patients include those with disseminated and/or residual disease, large cell and/or anaplastic histotypes, MYC genes amplification. Current and currently planned clinical trials will: (1) evaluate the feasibility of reducing both the dose of craniospinal irradiation and the volume of the posterior fossa radiotherapy (RT) for those patients at low biologic risk, commonly identified as those having a medulloblastoma of the WNT subgroup; (2) determine whether intensification of chemotherapy (CT) or irradiation can improve outcome in patients with high-risk disease; (3) find target therapies allowing tailored therapies especially for relapsing patients and those with higher biological risk.


## Article 2

PMID: 27889018
Title: Posterior Fossa Tumors.
Journal: Neuroimaging clinics of North America
Year: 2017
DOI: 10.1016/j.nic.2016.08.001
URL: https://pubmed.ncbi.nlm.nih.gov/27889018/

Abstract:
Pediatric brain tumors are the leading cause of death from solid tumors in childhood. The most common posterior fossa tumors in children are medulloblastoma, atypical teratoid/rhabdoid tumor, cerebellar pilocytic astrocytoma, ependymoma, and brainstem glioma. Location, and imaging findings on computed tomography (CT) and conventional MR (cMR) imaging may provide important clues to the most likely diagnosis. Moreover, information obtained from advanced MR imaging techniques increase diagnostic confidence and help distinguish between different histologic tumor types. Here we discuss the most common posterior fossa tumors in children, including typical imaging findings on CT, cMR imaging, and advanced MR imaging studies.


## Article 3

PMID: 30516696
Title: Childhood Medulloblastoma Revisited.
Journal: Topics in magnetic resonance imaging : TMRI
Year: 2019
DOI: 10.1097/RMR.0000000000000184
URL: https://pubmed.ncbi.nlm.nih.gov/30516696/

Abstract:
Medulloblastoma is the most common malignant solid tumor in childhood and the most common embryonal neuroepithelial tumor of the central nervous system. Several morphological variants are recognized: classic medulloblastoma, large cell/anaplastic medulloblastoma, desmoplastic/nodular medulloblastoma, and medulloblastoma with extensive nodularity. Recent advances in transcriptome and methylome profiling of these tumors led to a molecular classification that includes 4 major genetically defined groups. Accordingly, the 2016 revision of the World Health Organization's Classification of Tumors of the Central Nervous System recognizes the following medulloblastoma entities: Wingless (WNT)-activated, Sonic hedgehog (SHH)-activated, Group 3, and Group 4. This transcriptionally driven classification constitutes the basis of new risk stratification schemes applied to current therapeutic clinical trials. Because additional layers of molecular tumor heterogeneities are being progressively unveiled, several clinically relevant subgroups within the 4 major groups have already been identified. The purpose of this article is to review the recent basic science and clinical advances in the understanding of "medulloblastomas," and their diagnostic imaging correlates and the implications of those on current neuroimaging practice.


## Article 4

PMID: 18995998
Title: [Childhood medulloblastoma].
Journal: Archives de pediatrie : organe officiel de la Societe francaise de pediatrie
Year: 2009
DOI: 10.1016/j.arcped.2008.09.021
URL: https://pubmed.ncbi.nlm.nih.gov/18995998/

Abstract:
Medulloblastoma is one of the most common malignant childhood brain tumors. It is a primitive neuroectodermal tumor (PNET) and predominantly arises in the cerebellum and 4th ventricle. Most cases of medulloblastoma are sporadic, but some predisposition syndromes are known, such as SUFU and Gorlin syndromes. Most often intracranial hypertension reveals the disease typically with headache and vomiting. However, the frequent atypical presentation should not delay neuroradiological investigations. Brain and spinal MRI can establish the diagnosis of posterior fossa tumor and define the extent of the disease. CSF study completes the staging. Histologic examination of the tumor confirms the diagnosis of medulloblastoma. Patients are classified into 2 risk groups: standard-risk medulloblastoma, defined by nonmetastatic disease treated by total or subtotal tumor resection; and high-risk patients who have disseminated disease and/or residual disease. Tumor molecular genetic findings allow the use of emerging prognostic factors and may ultimately contribute to the development of targeted therapy. Current treatment in the oldest children combines surgical resection followed by radiotherapy and chemotherapy. The aim of recent studies was to increase survival and decrease sequelae by reducing CSI in older children with standard risk medulloblastoma. Treatment in younger patients is as much as possible restricted to surgery and chemotherapy. However, long-term sequelae after treatment for medulloblastoma remain frequent and the detection and treatment of those sequelae is an essential part of the follow-up of the patients.

