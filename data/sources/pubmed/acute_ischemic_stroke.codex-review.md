# Codex Literature Extraction Packet

Disease: Acute ischemic stroke
Japanese name: 急性虚血性脳梗塞
PubMed query: diffusion weighted imaging acute ischemic stroke MRI review

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\acute_ischemic_stroke.source.json
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

PMID: 32132175
Title: Reversible diffusion-weighted imaging lesions in acute ischemic stroke: A systematic review.
Journal: Neurology
Year: 2020
DOI: 10.1212/WNL.0000000000009173
URL: https://pubmed.ncbi.nlm.nih.gov/32132175/

Abstract:
To systematically review the literature for reversible diffusion-weighted imaging (DWIR) lesions and to describe its prevalence, predictors, and clinical significance.
Studies were included if the first DWI MRI was performed within 24 hours of stroke onset and follow-up DWI or fluid-attenuated inversion recovery (FLAIR)/T2 was performed within 7 or 90 days, respectively, to measure DWIR. We abstracted clinical, imaging, and outcomes data.
Twenty-three studies met the study criteria. The prevalence of DWIR was 26.5% in DWI-based studies and 6% in FLAIR/T2-based studies. DWIR was associated with recanalization or reperfusion of the ischemic tissue with or without the use of tissue plasminogen activator (t-PA) or endovascular therapy, earlier treatment with t-PA, shorter time to endovascular therapy after MRI, and absent or less severe perfusion deficit within the DWI lesion. DWIR was associated with early neurologic improvement in 5 of 6 studies (defined as improvement in the NIH Stroke Scale (NIHSS) score by 4 or 8 points from baseline or NIHSS score 0 to 2 at 24 hours after treatment or at discharge or median NIHSS score at 7 days) and long-term outcome in 6 of 7 studies (defined as NIHSS score &#x2264;1, improvement in the NIHSS score &#x2265;8 points, or modified Rankin Scale score up to &#x2264;2 at 30 or 90 days) likely due to reperfusion.
DWIR is seen in up to a quarter of patients with acute ischemic stroke, and it is associated with good clinical outcome following reperfusion. Our findings highlight the pitfalls of DWI to define ischemic core in the early hours of stroke.


## Article 2

PMID: 28551302
Title: Acute stroke differential diagnosis: Stroke mimics.
Journal: European journal of radiology
Year: 2018
DOI: 10.1016/j.ejrad.2017.05.008
URL: https://pubmed.ncbi.nlm.nih.gov/28551302/

Abstract:
Stroke mimics (SM) are non-vascular conditions that present with an acute neurological deficit simulating acute ischemic stroke and represent a significant percentage of all acute stroke hospital admissions. The most common clinical SM includes conversion/functional (psychiatric disorder); seizures and postictal paralysis; toxic-metabolic disturbances; brain tumours; infections, and migraine. Imaging is essential for SM recognition, being Diffusion weighted imaging (DWI), perfusion imaging and angiographic studies very useful. There are several disorders that may have imaging features that simulate acute ischemic stroke, mainly presenting with cytotoxic oedema and/or perfusion deficits. The imaging features of the most frequent clinical and imaging stroke mimics are reviewed.


## Article 3

PMID: 34581223
Title: Patterns of ischemic posterior circulation strokes: A clinical, anatomical, and radiological review.
Journal: International journal of stroke : official journal of the International Stroke Society
Year: 2022
DOI: 10.1177/17474930211046758
URL: https://pubmed.ncbi.nlm.nih.gov/34581223/

Abstract:
Posterior circulation and anterior circulation strokes share many clinical, pathogenetic and radiological features, although some clinical signs are highly specific to posterior circulation strokes. Arterial stenosis and occlusions occur in significant numbers in both acute posterior circulation and anterior circulation strokes, making them good candidates for endovascular treatment. Among posterior circulation strokes, basilar artery occlusions stand out because of the diagnostic and acute treatment challenges.
We reviewed the literature on clinical stroke syndromes and neuroimaging findings and systematically describe for each anatomical site of stroke the detailed clinical and radiological information (anatomical representation, diffusion weighted imaging and angiographic sequences). The principles of neuroimaging of posterior circulation strokes and the prognosis for each stroke localization are also discussed.
Stroke syndromes in the territories of the vertebral, basilar, cerebellar, and posterior cerebral arteries are presented. Features typical of posterior circulation strokes are highlighted, including patterns of basilar artery occlusions. Clinical severity and prognosis of posterior circulation strokes are highly variable, and given that they are more difficult to detect on CT-based neuroimaging, magnetic resonance imaging is the technique of choice in suspected posterior circulation strokes. Rapid identification of arterial occlusion patterns may provide prognostic information and support acute revascularization decisions.
Posterior circulation stroke syndromes tightly reflect lesion localization and arterial occlusion patterns. Although many clinical and pathogenetic features are similar to anterior circulation strokes, notable differences exist in terms of clinical presentation, stroke mechanism, prognosis, and response to acute recanalization.

