# Codex Literature Extraction Packet

Disease: Herpes simplex encephalitis
Japanese name: 単純ヘルペス脳炎
PubMed query: herpes simplex encephalitis[Title/Abstract] AND (MRI[Title/Abstract] OR magnetic resonance[Title/Abstract] OR imaging[Title/Abstract] OR diagnosis[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\herpes_simplex_encephalitis.source.json
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

PMID: 39322393
Title: Infectious leukoencephalopathies.
Journal: Handbook of clinical neurology
Year: 2024
DOI: 10.1016/B978-0-323-99209-1.00016-8
URL: https://pubmed.ncbi.nlm.nih.gov/39322393/

Abstract:
Leukoencephalopathy from infectious agents may have a rapid course, such as human simplex virus encephalitis; however, in many diseases, it may take months or years before diagnosis, such as in subacute sclerosing panencephalitis or Whipple disease. There are wide geographic distributions and susceptible populations, including both immunocompetent and immunodeficient patients. Many infections have high mortality rates, such as John Cunningham virus and subacute sclerosing panencephalitis, although others have effective treatments if suspected and treated early, such as herpes simplex encephalitis. This chapter will describe viral, bacterial, and protozoal infections, which predominantly cause leukoencephalopathy. We focus on the clinical presentation of these infectious agents briefly covering epidemiology and subtypes of infections. Next, we detail current pathophysiologic mechanisms causing white matter injury. Diagnostic and confirmatory tests are discussed. We cover predominantly MRI imaging features of leukoencephalopathies, and in addition, summarize the common imaging features. Additionally, we detail how imaging features may be used to narrow the differential of a leukoencephalopathy clinical presentation. Lastly, we present an outline of common treatment approaches where available.


## Article 2

PMID: 28074766
Title: [Herpes simplex encephalitis].
Journal: Ugeskrift for laeger
Year: 2018
DOI: 
URL: https://pubmed.ncbi.nlm.nih.gov/28074766/

Abstract:
Herpes simplex encephalitis (HSE) is a rare disease, although it is the most common form of sporadic encephalitis worldwide. Recently, studies have provided important new insight into the genetic and immunological basis of HSE. However, even in the presence of antiviral treatment, mortality and morbidity remain relatively high. Therefore, precise and early diagnosis together with basic and clinical studies to gain better insight into the pathogenesis of HSE is a prerequisite for the development of improved prophylaxis and treatment of this severe disease.


## Article 3

PMID: 9163027
Title: Herpes simplex encephalitis.
Journal: Scandinavian journal of infectious diseases. Supplementum
Year: 1997
DOI: 
URL: https://pubmed.ncbi.nlm.nih.gov/9163027/

Abstract:
Herpes simplex encephalitis (HSE) is a life-threatening condition with high mortality as well as significant morbidity in survivors. In most cases herpes simplex virus type 1 (HSV-1) is responsible for the diseases, however, the type 2 virus (HSV-2) is involved in 4-6% of cases. Primary HSV infection is identified in only one-third of patients with HSE. The majority of cases are recorded in adults with recurrent HSV infection who are already seropositive for HSV at the onset of symptoms, but only 6-10% of these patients have a history of labial herpes. Acute focal, necrotizing encephalitis with inflammation and swelling of the brain tissue are consistent features of the pathology of HSE. HSV-induced cytolysis certainly damages neurones, oligodendrocytes and astrocytes, but the role of cellular and humoral immunopathology is important. A complex network of cytokines seems to be active in regulating the local immune response and inflammation during and after HSE. Brain biopsy, serological analysis of intrathecal HSV antibodies and detection of HSV-DNA in the cerebrospinal fluid (CSF) are all useful techniques to confirm the aetiology of HSE. Neurodiagnostic tests which support a presumptive diagnosis of HSE include: CSF analysis, electroencephalography, computer-assisted tomography and magnetic resonance imaging. Although aciclovir is the treatment of choice in HSE, mortality and morbidity still remain problematic. Long-term follow-up indicates that intrathecal cellular and humoral activation persist in HSE.


## Article 4

PMID: 10481538
Title: [Herpes simplex encephalitis].
Journal: Polski merkuriusz lekarski : organ Polskiego Towarzystwa Lekarskiego
Year: 1999
DOI: 
URL: https://pubmed.ncbi.nlm.nih.gov/10481538/

Abstract:
Herpes simplex virus infection of the central nervous system is still a significant cause of morbidity and often mortality. Changes of central nervous system are results of primary infection or activation of latent HSV-1, HSV-2. Neurological deficits often follow encephalitis herpetica. The application of PCR is prompt and specific diagnosis of herpes simplex virus infections of the brain. Advances in treatment herpes simplex encephalitis with acyclovir have improved outcome.

