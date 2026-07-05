# Codex Literature Extraction Packet

Disease: Cerebral venous sinus thrombosis
Japanese name: 脳静脈洞血栓症
PubMed query: cerebral venous thrombosis[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR MRV[Title/Abstract] OR imaging[Title/Abstract] OR diagnosis[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\cerebral_venous_sinus_thrombosis.source.json
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

PMID: 38428733
Title: Cerebral venous thrombosis.
Journal: Revista clinica espanola
Year: 2024
DOI: 10.1016/j.rceng.2024.02.015
URL: https://pubmed.ncbi.nlm.nih.gov/38428733/

Abstract:
Cerebral venous thrombosis is part of the so-called thrombosis in unusual sites. It is defined as an occlusion in the cerebral venous territory. Its incidence is progressively increasing, especially in developing countries. It is more frequently observed in young women, with hormonal factors such as pregnancy or hormonal contraception being significant risk factors in the development of this condition. The clinical presentation will depend fundamentally on the topography of the thrombosis, with a confirmatory diagnosis based mainly on imaging tests. The treatment generally consists of anticoagulation, and other options may be considered depending on the severity of the case. Overall, the prognosis is better than that of other intracranial vascular disorders. This review describes the current evidence available regarding cerebral venous thrombosis.


## Article 2

PMID: 31440838
Title: Cerebral Venous Thrombosis: an Update.
Journal: Current neurology and neuroscience reports
Year: 2020
DOI: 10.1007/s11910-019-0988-x
URL: https://pubmed.ncbi.nlm.nih.gov/31440838/

Abstract:
The purpose of this update is to summarize the recent advances on the management of cerebral venous thrombosis (CVT).
There is a trend in declining frequency of CVT patients presenting with focal deficits or coma and a decrease in mortality over time. Anemia and obesity were identified as risk factors for CVT. During pregnancy and puerperium, the higher risk of CVT occurs in the first months post-delivery. With appropriate management, 1/3 of comatose CVT patients can have a full recovery. The management of CVT patients includes treatment of associated conditions, anticoagulation with parenteral heparin, prevention of recurrent seizures, and decompressive neurosurgery in patients with large venous infarcts/hemorrhages with impending herniation. After the acute phase, patients should be anticoagulated for 3-12&#xa0;months. Results of recently completed randomized controlled trials on endovascular treatment and comparing dabigatran with warfarin will improve the treatment of CVT.


## Article 3

PMID: 32958591
Title: Cerebral venous thrombosis: a practical guide.
Journal: Practical neurology
Year: 2021
DOI: 10.1136/practneurol-2019-002415
URL: https://pubmed.ncbi.nlm.nih.gov/32958591/

Abstract:
All neurologists need to be able to recognise and treat cerebral venous thrombosis (CVT). It is difficult to diagnose, partly due to its relative rarity, its multiple and various clinical manifestations (different from 'conventional' stroke, and often mimicking other acute neurological conditions), and because it is often challenging to obtain and interpret optimal and timely brain imaging. Although CVT can result in death or permanent disability, it generally has a favourable prognosis if diagnosed and treated early. Neurologists involved in stroke care therefore also need to be aware of the treatments for CVT (with varying degrees of supporting evidence): the mainstay is prompt anticoagulation but patients who deteriorate despite treatment can be considered for endovascular procedures (endovascular thrombolysis or thrombectomy) or neurosurgery (decompressive craniotomy). This review summarises current knowledge on the risk factors, diagnosis, treatment and prognosis of CVT in adults, and highlights some areas for future research.


## Article 4

PMID: 38050259
Title: Pathophysiology, diagnosis and management of cerebral venous thrombosis: A comprehensive review.
Journal: Medicine
Year: 2023
DOI: 10.1097/MD.0000000000036366
URL: https://pubmed.ncbi.nlm.nih.gov/38050259/

Abstract:
Cerebral venous thrombosis is a rare cause of stroke in young mostly female adults which is frequently overlooked due to its variable clinical and radiological presentation. This review summarizes current knowledge on it risk factors, management and outcome in adults and highlights areas for future research. Females are 3 times more commonly affected and are significantly younger than males. The presenting symptoms can range from headache to loss of consciousness. However, the often-nebulous nature of symptoms can make the diagnosis challenging. Magnetic resonance imaging with venography is often the diagnostic imaging of choice. While unfractionated or low molecular-weight heparin is the mainstay of treatment, endovascular intervention with thrombolysis or thrombectomy and decompressive craniectomy may be required depending on clinical status. Nevertheless, approximately 80% of patients have a good recovery but mortality rates of -5% to 10% are not uncommon. Diagnosing cerebral venous thrombosis can be challenging but with vigilance and expert care patients have the best chance of a good clinical outcome.

