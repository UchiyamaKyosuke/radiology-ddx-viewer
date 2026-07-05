# Codex Literature Extraction Packet

Disease: Ependymoma
Japanese name: 上衣腫
PubMed query: ependymoma[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\ependymoma.source.json
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

PMID: 27889018
Title: Posterior Fossa Tumors.
Journal: Neuroimaging clinics of North America
Year: 2017
DOI: 10.1016/j.nic.2016.08.001
URL: https://pubmed.ncbi.nlm.nih.gov/27889018/

Abstract:
Pediatric brain tumors are the leading cause of death from solid tumors in childhood. The most common posterior fossa tumors in children are medulloblastoma, atypical teratoid/rhabdoid tumor, cerebellar pilocytic astrocytoma, ependymoma, and brainstem glioma. Location, and imaging findings on computed tomography (CT) and conventional MR (cMR) imaging may provide important clues to the most likely diagnosis. Moreover, information obtained from advanced MR imaging techniques increase diagnostic confidence and help distinguish between different histologic tumor types. Here we discuss the most common posterior fossa tumors in children, including typical imaging findings on CT, cMR imaging, and advanced MR imaging studies.


## Article 2

PMID: 12691623
Title: Ependymomas.
Journal: Current neurology and neuroscience reports
Year: 2003
DOI: 10.1007/s11910-003-0078-x
URL: https://pubmed.ncbi.nlm.nih.gov/12691623/

Abstract:
Ependymomas are uncommon neoplasms of the central nervous system (CNS), and as a consequence, few randomized, clinical trials have been performed, thereby limiting treatment guidelines. A review of the literature would permit the following conclusions regarding treatment. The best management of newly diagnosed ependymoma entails a complete resection corroborated by postoperative contrast-enhanced magnetic resonance imaging (MRI). If an incomplete resection is documented, a second attempt at gross total resection should be considered, given the prognostic significance of complete resection. Small volume residual disease is best managed with involved-field radiotherapy unless postoperative staging (cerebrospinal fluid cytology, neuraxis MRI) documents metastatic disease, which is best managed by craniospinal irradiation. The role of chemotherapy is uncertain and in general would be reserved for patients having previously failed surgery and radiotherapy. Disease-free survival following recurrence is unusual (<15% at 5 years) and suggests intensification of initial adjuvant treatment may best prevent relapse.


## Article 3

PMID: 30100960
Title: [Not Available].
Journal: The Pan African medical journal
Year: 2018
DOI: 10.11604/pamj.2018.29.206.10723
URL: https://pubmed.ncbi.nlm.nih.gov/30100960/

Abstract:
 Chronic hydrocephalus associated with a tumor of the conus medullaris and/or of the cauda equina is extremely rare. We here report two cases of medullary tumor revealed by the triad: dementia, difficulty walking and urinary incontinence. Magnetic resonance imaging (MRI) of the cerebrospinal fluid showed communicating hydrocephalus and intradural spinal tumors at the level of the conus medullaris and of the cauda equina. Surgical resection of a benign schwannoma and of an ependymoma allowed the resolution of the clinical symptomatology due to hydrocephalus without implantation of ventricular shunt. A dozen cases of dementia and hydrocephalus associated to spinal tumor have been reported. A variety of approaches have been proposed to explain this association but the exact pathophysiology is not accurately known. 
L&#x2019;hydroc&#xe9;phalie chronique associ&#xe9;e &#xe0; une tumeur du c&#xf4;ne m&#xe9;dullaire et /ou de la queue de cheval est extr&#xea;mement rare. Nous pr&#xe9;sentons deux patients porteurs d&#x2019;une tumeur m&#xe9;dullaire r&#xe9;v&#xe9;l&#xe9;e par la triade: d&#xe9;mence, troubles de la marche et incontinence urinaire. L&#x2019;imagerie par r&#xe9;sonance magn&#xe9;tique (IRM) c&#xe9;r&#xe9;brospinale objectivait une hydroc&#xe9;phalie communicante et une tumeur intradurale si&#xe9;geant au niveau du c&#xf4;ne m&#xe9;dullaire et de la queue de cheval. L&#x2019;ex&#xe9;r&#xe8;se chirurgicale d&#x2019;un schwannome b&#xe9;nin et d&#x2019;un &#xe9;pendymome a permis la r&#xe9;solution de la symptomatologie clinique due &#xe0; l&#x2019;hydroc&#xe9;phalie sans proc&#xe9;der &#xe0; un shunt ventriculaire. Une dizaine de cas de d&#xe9;mence et d&#x2019;hydroc&#xe9;phalie accompagnant une tumeur spinale sont rapport&#xe9;es. Une vari&#xe9;t&#xe9; de m&#xe9;canismes a &#xe9;t&#xe9; propos&#xe9;e pour expliquer cette association mais la physiopathologie exacte reste mal connue.


## Article 4

PMID: 39287805
Title: Supratentorial and Infratentorial Ependymoma.
Journal: Advances and technical standards in neurosurgery
Year: 2024
DOI: 10.1007/978-3-031-67077-0_7
URL: https://pubmed.ncbi.nlm.nih.gov/39287805/

Abstract:
Ependymomas are the third most common intracranial tumor in children, presenting in both the supratentorial and infratentorial compartments. They may present in infants, young children, and adolescents with symptoms depending on size, location, and the age of the patient. The ideal imaging for evaluation and treatment is MRI. This is crucial for preoperative evaluation and planning, as well as postoperative assessment and evaluating the efficacy of treatment. Essentially without exception, aggressive surgery aimed at complete resection is the initial and most important factor in the long-term outcome of all these children. Histopathologic diagnosis for intracranial pediatric ependymoma has been narrowed to grade II and grade III, no longer characterized as classic and anaplastic. Subsequent conformal photon or proton beam irradiation is an established post-surgical therapy, with solid evidence that it benefits survival and offers lower toxicity to the normal brain of the young child. Although chemotherapeutic treatment has not been generally impactful, immunotherapeutic interventions may be on the horizon. Updated molecular subgrouping of ependymoma is changing the post-resection approach of these tumors with regard to both treatment and outcome. Excluding spinal ependymoma and subependymoma, there are four subtypes that are defined by genetic characteristics, two found in the supratentorial compartment, ST-EPN-YAP1 and ST-EPN-ZFTA, and two in the posterior fossa, PF-EPN-A and PF-EPN-B. Younger children harboring ZFTA fusion-positive supratentorial and type A posterior fossa tumors, regardless of histology, tend toward the poorest outcomes. On the contrary, older children with supratentorial YAP1 fusion-positive ependymomas and type B posterior fossa tumors may survive with surgery alone. The paradigm shift regarding the behavior of the various childhood ependymoma subtypes will hopefully lead to targeted, individualized therapies and improved outcomes.

