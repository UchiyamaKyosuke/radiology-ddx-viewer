# Codex Literature Extraction Packet

Disease: Cerebral cavernous malformation
Japanese name: 脳海綿状血管奇形
PubMed query: cerebral cavernous malformation[Title/Abstract] AND (MRI[Title/Abstract] OR magnetic resonance[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\cerebral_cavernous_malformation.source.json
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

PMID: 36403580
Title: Safety and efficacy of propranolol for treatment of familial cerebral cavernous malformations (Treat_CCM): a randomised, open-label, blinded-endpoint, phase 2 pilot trial.
Journal: The Lancet. Neurology
Year: 2022
DOI: 10.1016/S1474-4422(22)00409-4
URL: https://pubmed.ncbi.nlm.nih.gov/36403580/

Abstract:
Observations in people with cerebral cavernous malformations, and in preclinical models of this disorder, suggest that the &#x3b2;-blocker propranolol might reduce the risk of intracerebral haemorrhage. We aimed to evaluate the safety and efficacy of prolonged treatment with propranolol to reduce the incidence of symptomatic intracerebral haemorrhage or focal neurological deficit in people with familial cerebral cavernous malformations.
We conducted a randomised, open-label, blinded-endpoint, phase 2 pilot trial (Treat_CCM) at six national reference centres for rare diseases in Italy. People aged 18 years or older with symptomatic familial cerebral cavernous malformation were eligible for enrolment. Participants were randomly assigned (2:1) to receive either oral propranolol (20-320 mg daily) plus standard care (intervention group), or standard care alone (control group), for 24 months. Participants, caregivers, and investigators were aware of treatment group assignment. Participants had clinical assessments and 3 T brain MRI at baseline and at 12 and 24 months. The primary outcome was new occurrence of symptomatic intracerebral haemorrhage or focal neurological deficit attributable to cerebral cavernous malformation over 24 months. Outcome assessors were masked to treatment group assignment. The primary analysis was done in the intention-to-treat population. Because of the pilot study design, we chose a one-sided 80% CI, which could either exclude a clinically meaningful effect or show a signal of efficacy. This trial is registered with EudraCT, 2017-003595-30, and ClinicalTrials.gov, NCT03589014, and is closed to recruitment.
Between April 11, 2018, and Dec 5, 2019, 95 people were assessed for eligibility and 83 were enrolled, of whom 57 were assigned to the propranolol plus standard care group and 26 to the standard care alone group. The mean age of participants was 46 years (SD 15); 48 (58%) were female and 35 (42%) were male. The incidence of symptomatic intracerebral haemorrhage or focal neurological deficit was 1&#xb7;7 (95% CI 1&#xb7;4-2&#xb7;0) cases per 100 person-years (two [4%] of 57 participants) in the propranolol plus standard care group and 3&#xb7;9 (3&#xb7;1-4&#xb7;7) per 100 person-years (two [8%] of 26) in the standard care alone group (univariable hazard ratio [HR] 0&#xb7;43, 80% CI 0&#xb7;18-0&#xb7;98). The univariable HR showed a signal of efficacy, according to predefined criteria. The incidence of hospitalisation did not differ between groups (8&#xb7;2 cases [95% CI 7&#xb7;5-8&#xb7;9] per 100 person-years in the propranolol plus standard care group vs 8&#xb7;2 [95% CI 7&#xb7;1-9&#xb7;3] per 100 person-years in the standard care alone group). One participant in the standard care alone group died of sepsis. Three participants in the propranolol plus standard care group discontinued propranolol due to side-effects (two reported hypotension and one reported weakness).
Propranolol was safe and well tolerated in this population. Propranolol might be beneficial for reducing the incidence of clinical events in people with symptomatic familial cerebral cavernous malformations, although this trial was not designed to be adequately powered to investigate efficacy. A definitive phase 3 trial of propranolol in people with symptomatic familial cerebral cavernous malformations is justified.
Italian Medicines Agency, Associazione Italiana per la Ricerca sul Cancro, Swedish Science Council, Knut and Alice Wallenberg Foundation, CARIPLO Foundation, Italian Ministry of Health.


## Article 2

PMID: 33494000
Title: Pediatric Cerebral Cavernous Malformations.
Journal: Pediatric neurology
Year: 2022
DOI: 10.1016/j.pediatrneurol.2020.11.004
URL: https://pubmed.ncbi.nlm.nih.gov/33494000/

Abstract:
Cerebral cavernous malformations are the second most common vascular malformations in the central nervous system, and over one-third are found in children. Lesions may be solitary or multiple, be discovered incidentally, be sporadic, or be secondary to familial cavernomatosis or radiation therapy. Children may present with focal seizures, intracranial hemorrhage, or focal neurological deficits without radiological evidence of recent hemorrhage. We present several children with cerebral cavernous malformations and explore the challenges of their diagnosis in children, their key imaging features, the role of follow-up imaging, and their subsequent management including stereotactic radiosurgery and microsurgical resection. Individual patient risk stratification is advocated for all affected children and their families.


## Article 3

PMID: 38113759
Title: Circulating biomarkers in familial cerebral cavernous malformation.
Journal: EBioMedicine
Year: 2024
DOI: 10.1016/j.ebiom.2023.104914
URL: https://pubmed.ncbi.nlm.nih.gov/38113759/

Abstract:
Cerebral Cavernous Malformation (CCM) is a rare cerebrovascular disease, characterized by the presence of multiple vascular malformations that may result in intracerebral hemorrhages (ICHs), seizure(s), or focal neurological deficits (FND). Familial CCM (fCCM) is due to loss of function mutations in one of the three independent genes KRIT1 (CCM1), Malcavernin (CCM2), or Programmed Cell death 10 (PDCD10/CCM3). The aim of this study was to identify plasma protein biomarkers of fCCM to assess the severity of the disease and predict its progression.
Here, we have investigated plasma samples derived from n&#xa0;=&#xa0;71 symptomatic fCCM patients (40 female/31 male) and n&#xa0;=&#xa0;17 healthy donors (HD) (9 female/8 male) of the Phase 1/2 Treat_CCM trial, using multiplexed protein profiling approaches.
Biomarkers as sCD14 (p&#xa0;=&#xa0;0.00409), LBP (p&#xa0;=&#xa0;0.02911), CXCL4 (p&#xa0;=&#xa0;0.038), ICAM-1 (p&#xa0;=&#xa0;0.02013), ANG2 (p&#xa0;=&#xa0;0.026), CCL5 (p&#xa0;=&#xa0;0.00403), THBS1 (p&#xa0;=&#xa0;0.0043), CRP (p&#xa0;=&#xa0;0.0092), and HDL (p&#xa0;=&#xa0;0.027), were significantly different in fCCM compared to HDs. Of note, sENG (p&#xa0;=&#xa0;0.011), THBS1 (p&#xa0;=&#xa0;0.011) and CXCL4 (p&#xa0;=&#xa0;0.011), were correlated to CCM genotype. sROBO4 (p&#xa0;= 0.014), TM (p&#xa0;= 0.026) and CRP (p&#xa0;= 0.040) were able to predict incident adverse clinical events, such as ICH, FND or seizure. GDF-15, FLT3L, CXCL9, FGF-21 and CDCP1, were identified as predictors of the formation of new MRI-detectable lesions over 2-year follow-up. Furthermore, the functional relevance of ang2, thbs1, robo4 and cdcp1 markers was validated by zebrafish pre-clinical model of fCCM.
Overall, our study identifies a set of biochemical parameters to predict CCM progression, suggesting biological interpretations and potential therapeutic approaches to CCM disease.
Italian Medicines Agency, Associazione Italiana per la Ricerca sul Cancro (AIRC), ERC, Leducq Transatlantic Network of Excellence, Swedish Research Council.


## Article 4

PMID: 16100539
Title: [Cerebral cavernous malformations].
Journal: Tidsskrift for den Norske laegeforening : tidsskrift for praktisk medicin, ny raekke
Year: 2005
DOI: 
URL: https://pubmed.ncbi.nlm.nih.gov/16100539/

Abstract:
Cerebral cavernous malformations exist in sporadic and familial forms. They have considerable genetic and clinical heterogeneity. Better understanding of these disorders may improve management.
This review is based on personal experience and recent literature.
Cerebral cavernous malformations are venous malformations that can be detected with gradient echo MRI of the brain. Approximately 0.5% of the general population have the sporadic form with a single or a few cerebral cavernous malformations which mostly are asymptomatic. Those with the familial form usually have several cavernous malformations caused by an autosomal dominant condition. So far, 3 loci have been identified: CCM1 on chromosome 7q, CCM2 on chromosome 7p, and CCM3 on chromosome 3q, occurring in, respectively, approximately 40%, 20% and 40% of the families. CCM1 is caused by a mutation in the KRIT1 gene and CCM2 is caused by a mutation in the MGC4607 gene, while the gene for CCM3 is not yet identified. Mean age at onset is 20-40, but onset can occur at all ages. The most frequent symptoms are seizures, cerebral haemorrhage, chronic headache and focal neurological deficits. Many carriers are, however, asymptomatic.
Sporadic cerebral cavernous malformation is often asymptomatic, while the familial form shows phenotypic and genetic heterogeneity. The symptoms are depending on the location of the malformations as well as whether haemorrhage does occur.

