# Codex Literature Extraction Packet

Disease: Arachnoid cyst
Japanese name: くも膜嚢胞
PubMed query: intracranial arachnoid cyst[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\arachnoid_cyst.source.json
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

PMID: 19517408
Title: Intracranial arachnoid cysts in dogs.
Journal: Compendium (Yardley, PA)
Year: 2013
DOI: 
URL: https://pubmed.ncbi.nlm.nih.gov/19517408/

Abstract:
Intracranial arachnoid cyst (IAC) is an infrequently reported developmental disorder seen primarily in small-breed dogs. It usually occurs in the caudal fossa, in the region of the quadrigeminal cistern. Although still considered uncommon, IAC is being recognized more frequently in veterinary medicine, coinciding with the increased availability of magnetic resonance imaging. In this article, clinical information from previously reported cases of canine IAC is combined with additional case information from our hospitals. Similar to IAC in people, it is thought that canine IAC is often an incidental finding. When IAC is responsible for neurologic disease in dogs, generalized seizures and cerebellovestibular dysfunction are the most common clinical presentations. Medical therapy of IAC focuses on management of increased intracranial pressure and seizures, if the latter are part of the clinical complaints. Surgical therapy of IAC involves either cyst fenestration or shunting the excess fluid to the peritoneal cavity


## Article 2

PMID: 25866381
Title: [Imaging diagnosis of arachnoid cysts].
Journal: Neurocirugia (Asturias, Spain)
Year: 2016
DOI: 10.1016/j.neucir.2015.02.009
URL: https://pubmed.ncbi.nlm.nih.gov/25866381/

Abstract:
Arachnoid cysts are malformed lesions that contain a fluid similar to the cerebrospinal fluid, and are usually located within the arachnoidal membrane. They represent 1% of all intracranial lesions, and in recent years, with the development of radiological techniques, the clinical detectability of arachnoid cysts seems to have increased. Although the majority of diagnosed arachnoid cysts are located in the cranial cavity and especially in the Sylvian fissure, a small number are located at spinal level and they can occur extra- or intra-spinally. An analysis is carried out, detailing the various tests used for the diagnosis of both intracranial and spinal arachnoids cysts, analysing the indications of each one depending on the location of the cysts and patient age.


## Article 3

PMID: 38228110
Title: Intracranial Arachnoid Cyst in Children: Clinical Presentation and Risk Factors for Surgical Intervention.
Journal: Pediatric neurosurgery
Year: 2024
DOI: 10.1159/000536284
URL: https://pubmed.ncbi.nlm.nih.gov/38228110/

Abstract:
Intracranial arachnoid cysts (IAC) in children are a common incidental finding on imaging. Most IACs are asymptomatic and can be monitored; however, a small percentage may enlarge and require surgical intervention. This study aimed to identify clinical risk factors in patients with IAC who underwent surgery versus those who did not.
We conducted a retrospective chart review from 2009 to 2021 at a free-standing children's hospital. A total of 230 patients diagnosed with an IAC aged 0-21 years of age were included in the study. Data on demographics, imaging, and neurological follow-up were analyzed.
Out of 230 patients, 45 (19.6%) underwent surgery. At time of IAC diagnosis, the surgical patients were younger (median age 1.1 years), and their median cyst volume was larger (41.7 cm3), compared to nonsurgical patients (median age 5.9 years, volume 11.8 cm3, respectively). Headache was the most common reason for initial imaging in nonsurgical patients (54/185, 29.2%) while prenatal ultrasound (11/45, 24.4%) and macrocephaly (11/45, 24.4%) were the most common reasons for surgical patients. The majority of both surgical and nonsurgical patients had the IAC incidentally found (41/45, 91.1% and 181/185, 97.8%, respectively). Surgery relieved symptoms in 38/45 (84.4%) patients. Cyst volume and age were predictors of increased odds of having surgery.
Patients who underwent surgery were younger and had larger cyst volumes at time of diagnosis. The majority of the IAC were found incidentally and remained stable over prolonged follow-up. The majority of the patients experienced relief of symptoms postsurgical intervention. There is a greater odds of having surgical treatment with decreased age and greater cyst volume at diagnosis, and therefore these patients should be monitored closely for development of symptoms indicating need for surgical intervention.


## Article 4

PMID: 26636254
Title: Sports participation with arachnoid cysts.
Journal: Journal of neurosurgery. Pediatrics
Year: 2016
DOI: 10.3171/2015.7.PEDS15189
URL: https://pubmed.ncbi.nlm.nih.gov/26636254/

Abstract:
OBJECT There is currently no consensus on the safety of sports participation for patients with an intracranial arachnoid cyst (AC). The authors' goal was to define the risk of sports participation for children with this imaging finding. METHODS A survey was prospectively administered to 185 patients with ACs during a 46-month period at a single institution. Cyst size and location, treatment, sports participation, and any injuries were recorded. Eighty patients completed at least 1 subsequent survey following their initial entry into the registry, and these patients were included in a prospective registry with a mean prospective follow-up interval of 15.9 &#xb1; 8.8 months. RESULTS A total 112 patients with ACs participated in 261 sports for a cumulative duration of 4410 months or 1470 seasons. Of these, 94 patients participated in 190 contact sports for a cumulative duration of 2818 months or 939 seasons. There were no serious or catastrophic neurological injuries. Two patients presented with symptomatic subdural hygromas following minor sports injuries. In the prospective cohort, there were no neurological injuries CONCLUSIONS Permanent or catastrophic neurological injuries are very unusual in AC patients who participate in athletic activities. In most cases, sports participation by these patients is safe.

