# Codex Literature Extraction Packet

Disease: Ovarian mucinous cystadenoma
Japanese name: 卵巣粘液性嚢胞腺腫
PubMed query: Ovarian mucinous cystadenoma AND (MRI OR magnetic resonance OR CT OR computed tomography OR imaging OR radiology)

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\ovarian_mucinous_cystadenoma.source.json
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

## PubMed Abstracts

## Article 1

PMID: 36410423
Title: Adnexal masses during pregnancy: diagnosis, treatment, and prognosis.
Journal: American journal of obstetrics and gynecology
Year: 2023
DOI: 10.1016/j.ajog.2022.11.1291
URL: https://pubmed.ncbi.nlm.nih.gov/36410423/

Abstract:
Adnexal masses are identified in pregnant patients at a rate of 2 to 20 in 1000, approximately 2 to 20 times more frequently than in the age-matched general population. The most common types of adnexal masses in pregnancy requiring surgical management are dermoid cysts (32%), endometriomas (15%), functional cysts (12%), serous cystadenomas (11%), and mucinous cystadenomas (8%). Approximately 2% of adnexal masses in pregnancy are malignant. Although most adnexal masses in pregnancy can be safely observed and approximately 70% spontaneously resolve, a minority of cases warrant surgical intervention because of symptoms, risk of torsion, or suspicion of malignancy. Ultrasound is the mainstay of evaluation of adnexal masses in pregnancy because of accuracy, safety, and availability. Several ultrasound mass scoring systems, including the Sassone, Lerner, International Ovarian Tumor Analysis Simple Rules, and International Ovarian Tumor Analysis Assessment of Different NEoplasias in the adneXa scoring systems have been validated specifically in pregnant populations. Decisions regarding expectant vs surgical management of adnexal masses in pregnancy must balance the risks of torsion or malignancy with the likelihood of spontaneous resolution and the risks of surgery. Laparoscopic surgery is preferred over open surgery when possible because of consistently demonstrated shorter hospital length of stay and less postoperative pain and some data demonstrating shorter operative time, lower blood loss, and lower risks of fetal loss, preterm birth, and low birthweight. The best practices for laparoscopic surgery during pregnancy include left lateral decubitus positioning after the first trimester of pregnancy, port placement with respect to uterine size and pathology location, insufflation pressure of less than 12 to 15 mm Hg, intraoperative maternal capnography, pre- and postoperative fetal heart rate and contraction monitoring, and appropriate mechanical and chemical thromboprophylaxes. Although planning surgery for the second trimester of pregnancy generally affords time for mass resolution while optimizing visualization with regards to uterine size and pathology location, necessary surgery should not be delayed because of gestational age. When performed at a facility with appropriate obstetrical, anesthetic, and neonatal support, adnexal surgery in pregnancy generally results in excellent outcomes for pregnant patients and fetuses.

