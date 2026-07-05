# Codex Literature Extraction Packet

Disease: Brain arteriovenous malformation
Japanese name: 脳動静脈奇形
PubMed query: brain arteriovenous malformation[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR MRA[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\brain_arteriovenous_malformation.source.json
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

PMID: 41584770
Title: Modern Brain Arteriovenous Malformation Models: A Review.
Journal: Stroke (Hoboken, N.J.)
Year: 2026
DOI: 10.1161/SVIN.121.000335
URL: https://pubmed.ncbi.nlm.nih.gov/41584770/

Abstract:
Research of William Hunter's hypothesized (then discovered) arteriovenous varix (now arteriovenous malformation [AVM]) has developed exponentially over the previous quarter-millennium. Virchow and Luschka's subsequent contributions (nearly 100 years later) by identifying an AVM of the brain and its congenital nature were 2 of the first significant developments made in the field. AVMs present as an erroneous connection (known as a fistula) between an artery and a vein that bypasses the capillary circulation. The arteries and arterioles contributing to the malformation are known as feeders which connect to the draining veins via a plexiform vascular network known as a nidus. Prior to the design of a synthetic anastomosis coupled with vessel ligation by Spetzler et al, animal models were largely based on embolization or study of the normal anatomy. The animal and early genetic models have been reported on at length and numerous times across the literature, but novel developments spanning the previous decade have ushered in a technological revolution of vascular modeling that warrants discussion and analysis.
Parameterization of a PubMed query to include all literature including the words "brain," "arteriovenous malformation," and "model" yielded 489 articles. After extraction of relevant literature and full-text screening, 41 articles were chosen for detailed review.
Technological innovations outside of neurosurgery have greatly impacted the development of novel AVM models in the form of 3D flow models printed into silicon models and combined with advanced imaging technology such as 4D flow magnetic resonance imagin. Technological developments in preservation solutions, catheterization tools, and imaging technologies have also allowed for advent of the cerebrovascular placental model for testing of treatments such as radiosurgery, glue embolization, coiling, as well as histological assessment of tissue directly after intervention.
We review the breadth of AVM models in the literature over the last almost 5 decades.


## Article 2

PMID: 40274404
Title: Unruptured brain arteriovenous malformation risk stratification.
Journal: Journal of neurointerventional surgery
Year: 2026
DOI: 10.1136/jnis-2024-022779
URL: https://pubmed.ncbi.nlm.nih.gov/40274404/

Abstract:
Cerebral arteriovenous malformations (AVMs) are an uncommon type of central nervous system vascular anomaly that have the potential to rupture and cause intracranial hemorrhage. AVM hemorrhagic risk assessment has been mainly based on anatomical features derived from imaging; the most recent focus on AVM hemodynamics, vessel wall imaging, and molecular analysis of the inflammatory response, provide new insights into the hemorrhagic risk stratification. The greater data availability provided by innovative imaging techniques and biological analysis of biomarkers and genetic polymorphism further demonstrates the existence of a complex interaction between anatomically altered vasculature, non-physiological hemodynamics, and inflammatory molecular activity. The accurate prediction of cerebral AVM rupture, essential to guide the management decision by comparing the risk of observation to the risk of intervention, has yet to be solved. This review of several studies aims to summarize the current evidence on brain AVM rupture risk stratification.


## Article 3

PMID: 28267351
Title: Contemporary Imaging of Cerebral Arteriovenous Malformations.
Journal: AJR. American journal of roentgenology
Year: 2017
DOI: 10.2214/AJR.16.17306
URL: https://pubmed.ncbi.nlm.nih.gov/28267351/

Abstract:
Brain arteriovenous malformation (AVM) rupture results in substantial morbidity and mortality. The goal of AVM treatment is eradication of the AVM, but the risk of treatment must be weighed against the risk of future hemorrhage.
Imaging plays a vital role by providing the information necessary for AVM management. Here, we discuss the background, natural history, clinical presentation, and imaging of AVMs. In addition, we explain advances in techniques for imaging AVMs.


## Article 4

PMID: 37253407
Title: Ultrafast Doppler Imaging of Brain Arteriovenous Malformation.
Journal: World neurosurgery
Year: 2025
DOI: 10.1016/j.wneu.2023.05.088
URL: https://pubmed.ncbi.nlm.nih.gov/37253407/

Abstract:
Ultrafast ultrasound Doppler imaging offers a new and advantageous intraoperative method for brain lesions. Compared to the conventional color Doppler ultrasound system, the ultrafast Doppler allows us to image hemodynamics in small vasculature in an unprecedented high spatio-temporal resolution without using contrast agent. This report presents an intraoperative ultrafast ultrasound Doppler image of a 53-year-old male with a language eloquent area brain arteriovenous malformation. The advanced ultrafast Doppler method provides the nidus vasculature hemodynamics with a spatial resolution of 300&#xa0;&#x3bc;m at thousands of framerates per second. The image also demonstrates that no abnormal vessels infiltrated the eloquent gyrus as the piamatral small vessels outlined the intact boundary. Successful removal of the nidus with full language function preservation highlights the potentials of ultrafast Doppler imaging to improve diagnostic capabilities and surgical outcomes for patients with intracranial lesions.

