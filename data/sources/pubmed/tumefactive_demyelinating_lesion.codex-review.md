# Codex Literature Extraction Packet

Disease: Tumefactive demyelinating lesion
Japanese name: 腫瘤形成性脱髄病変
PubMed query: tumefactive demyelinating lesion[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\tumefactive_demyelinating_lesion.source.json
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

PMID: 33762460
Title: [Tumefactive demyelinating lesion (TDL)].
Journal: No shinkei geka. Neurological surgery
Year: 2021
DOI: 10.11477/mf.1436204401
URL: https://pubmed.ncbi.nlm.nih.gov/33762460/

Abstract:
Tumefactive demyelinating lesion(TDL)is defined as a large lesion, size >2 cm, mass effect, perilesional edema and/or ring enhancement. TDL could occur in multiple sclerosis(MS), neuromyelitis optica spectrum disorder(NMOSD), acute disseminated encephalomyelitis(ADEM)or other immunological diseases. Non-invasive methods including MR imaging and assay of several autoantibodies(e.g. aquaporin-4 autoantibodies)are recommended when each TDL is identified. The radiological findings on MRI are characterized by size >2 cm, mass effect, perilesional edema, T2 weighted hypointense rim, peripheral diffusion restriction, open ring enhancement, vascular enhancement, and central vein sign. When atypical clinical and radiological presentations are present in patients with TDL, diagnosis may necessitate brain biopsy due to exclude alternative pathology(e.g. primary central nervous system lymphoma). Because treatments and outcomes for patients with TDL are dependent on each disease etiology including MS, NMOSD, ADEM or others, we should always clarify the entire picture behind the disease.


## Article 2

PMID: 31857550
Title: Tumefactive Demyelinating Lesions and Pregnancy.
Journal: Neurology India
Year: 2020
DOI: 10.4103/0028-3886.273654
URL: https://pubmed.ncbi.nlm.nih.gov/31857550/

Abstract:
Until now, only one gestational tumefactive demyelinating lesion (TDL) has been described. Here we report two TDL cases occurring during and after the pregnancy. A 26-year-old 6-week pregnant woman developed a 3-cm left frontotemporoparietal subcortical TDL with inhomogeneous partial enhancement. Brain biopsy revealed a subacute demyelinating lesion with abundant macrophages and mild chronic perivascular inflammatory infiltrates. She also had femoralpopliteal deep vein thrombosis. During the 4-year follow-up, magnetic resonance imaging showed only residual biopsied TDL. The second case was a 41-year-woman affected by both multiple sclerosis (MS) and rheumatoid arthritis who developed a 2-cm right anterior corona radiata TDL with sporadic gadolinium-enhancing "annular spots" eight months after delivery. After steroid therapy at the 6-month radiological follow-up, this TDL was half-reduced. Five years earlier, at the beginning of her MS, she already had a 2-cm TDL with incomplete ring enhancement. These two described TDLs formed in prothrombotic conditions and were likely representative of thromboinflammation around and inside the small-medium veins.


## Article 3

PMID: 28619436
Title: Tumefactive demyelinating lesions: A comprehensive review.
Journal: Multiple sclerosis and related disorders
Year: 2018
DOI: 10.1016/j.msard.2017.04.003
URL: https://pubmed.ncbi.nlm.nih.gov/28619436/

Abstract:
Tumefactive multiple sclerosis or tumefactive demyelinating lesion (TDL) is one of the rare variants of multiple sclerosis (MS) posing a diagnostic challenge and a therapeutic enigma since it is difficult to distinguish from a true central nervous system (CNS) neoplasm or other CNS lesions on magnetic resonance imaging (MRI). The prevalence of TDL is estimated to be 1-3/1000 cases of MS with an annual incidence of 0.3/100,000. This could be an underestimate due to unavailability of a global MS registry and under-reporting of this condition. TDL may occur at any age with the ages between the 20s and 30s being more frequently affected. The pathogenesis of TDL remains unknown, but some speculations have been made. These include the autoimmune theory based on the close relationship between TDLs and MS, Fingolimod use, Fingolimod cessation, and Natalizumab use. The clinical presentation of patients with TDL is variable and atypical for demyelinating disease due to the differences in size and location of the lesion. In this article, we aim to explore TDL comprehensively and provide an evidence-based approach for diagnosis and treatment. This will result in recommendations that may improve the diagnostic accuracy and treatment outcomes. Detailed history, physical examination, and several MRI imaging can spare patients the need for a brain biopsy. Treatment of acute lesions includes corticosteroids and plasma exchange therapy. When a diagnosis of relapsing-remitting MS is fulfilled, conventional first line MS disease modifying therapy should be used. Available recently published data suggests that Fingolimod should not be used in TDL patients, mainly due to the possibility of more than just a chance association between TDLs and initiation of Fingolimod. The use of several new MS disease modifying therapy for the management of TDL remains to be studied. Further well-conducted research including multi-center trials is needed to explain several ambiguous aspects related to the etiology and management of TDL.


## Article 4

PMID: 42071194
Title: Biopsy-proven tumefactive demyelinating lesions: a systematic review and meta-analysis.
Journal: BMC neurology
Year: 2026
DOI: 10.1186/s12883-026-04947-w
URL: https://pubmed.ncbi.nlm.nih.gov/42071194/

Abstract:
A tumefactive demyelinating lesion (TDL) is an area of pathological changes in the central nervous system consistent with demyelination, larger than 2&#xa0;cm, and can mimic tumors on imaging; hence the term "tumefactive." TDLs are often challenging, as they have been reported in isolation or in conjunction with demyelinating diseases.
To describe the clinical and radiological features of TDLs, explore the treatments used and outcomes, and describe different nomenclatures reported.
We followed PRISMA guidelines, and our protocol was registered on PROSPERO [CRD42024593078]. We searched PubMed, Web of Science, EMBASE, and Google Scholar. We included published cases with TDL (>&#x2009;2&#xa0;cm) on magnetic resonance imaging (MRI) in patients aged&#x2009;&#x2265;&#x2009;18 years. We excluded a priori any established diagnoses of the lesions other than TDLs, cases without biopsy confirmation of demyelination, and cases lacking relevant data. The study framework is exploratory and descriptive in nature, and analyses are taken as hypothesis-generating. Comprehensive Meta-Analysis V3.0 was used for meta-analyses.
We examined 112 cases from 51 publications. The average age was 41.5 years, with women representing 54% of patients. MRI revealed solitary lesions in 65% of cases, mainly in the frontal (35%) and parietal (28%) lobes, with a mean lesion size of 4.25&#x2009;&#xb1;&#x2009;1.32&#xa0;cm. CSF analysis showed oligoclonal bands in 20% of cases. The meta-analysis demonstrated a 72% pooled response rate to intravenous methylprednisolone (IVMP) (95% CI: 57.9% - 83.2%, p&#x2009;<&#x2009;0.01), with moderate heterogeneity (I 2 &#x2009;=&#x2009;62.4%), which should be interpreted cautiously given the small number of contributing studies. Subgroup analysis revealed no meaningful differences between nomenclatures. Publication bias assessments were exploratory and suggested potential bias, and that the observed variability may reflect study-level and reporting differences rather than disease-related effects.
Acute IVMP treatment had a high response rate and similar use rate. Despite variations in nomenclature and presentation, the broader pathological and clinical features, as well as the response to IVMP in TDLs, appear broadly similar across studies, acknowledging the methodological limitations of the available literature. Our study was also limited by the small sample due to the rarity of the condition.

