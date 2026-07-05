# Codex Literature Extraction Packet

Disease: Epidermoid cyst
Japanese name: 類表皮嚢胞
PubMed query: epidermoid cyst[Title/Abstract] AND (brain[Title/Abstract] OR intracranial[Title/Abstract]) AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract] OR DWI[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\epidermoid_cyst.source.json
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

PMID: 28966821
Title: Self-resolving prepontine cyst.
Journal: Surgical neurology international
Year: 2023
DOI: 10.4103/sni.sni_160_17
URL: https://pubmed.ncbi.nlm.nih.gov/28966821/

Abstract:
Intracranial prepontine cysts are rare and include epidermoid cysts, arachnoid cysts, and neurenteric cysts. Symptomatic prepontine cysts may require surgical intervention. Reports of spontaneous resolution of cysts are rare.
We describe the case of a young gentleman who presented with headache and fever. Magnetic resonance imaging of the brain identified a prepontine lesion with features consistent with epidermoid cyst. During admission, the patient received symptomatic management in addition to empirical antibiotic therapy and dexamethasone. The patient improved symptomatically in the next 48 hours and was discharged. Follow-up imaging at 6 months and 1 year showed significant reduction in size of the lesion.
For asymptomatic prepontine cysts, a close radiological and clinical follow-up may prove useful.


## Article 2

PMID: 38472390
Title: Spontaneous regression of an epidermoid cyst in a pediatric patient-Case report and review of the literature.
Journal: Child's nervous system : ChNS : official journal of the International Society for Pediatric Neurosurgery
Year: 2024
DOI: 10.1007/s00381-024-06333-8
URL: https://pubmed.ncbi.nlm.nih.gov/38472390/

Abstract:
Epidermoid cysts are infrequent, benign, slow-growing, space-occupying lesions that account for 0.5-1.8% of primary intracranial tumors. We report the case of a 17-month-old child who presented in 2015 for one episode of pallor associated with hypotonia. Epilepsy was excluded and MRI was recommended. The MRI was performed and there were no focal parenchymal lesions, but it showed an extra-axial ovoid lesion with imaging characteristics consistent with epidermoid cyst. Follow-up MRI at one year was performed and it showed minimal increased in dimensions of the cyst, without changes into the signal of the lesion. Another MRI was performed 7&#xa0;years after and it showed complete resolution of the cyst. Six months afterwards, another MRI was performed and it confirmed the complete regression of the cyst, without any extra-axial masses reported. The patient did not present any neurological anomalies. No follow-up MRI was recommended afterwards. Spontaneous regression of epidermoid cyst in pediatric population is an extremely rare event, but it should be taken into account when the patient shows no symptoms. This is the third case of spontaneous regression of an epidermoid cyst reported in pediatric patients, and the first one in the temporal region. Careful follow-up and watchful waiting could be an option to surgical treatment in epidermoid cysts.


## Article 3

PMID: 27366244
Title: Brainstem epidermoid cyst: An update.
Journal: Asian journal of neurosurgery
Year: 2016
DOI: 10.4103/1793-5482.145163
URL: https://pubmed.ncbi.nlm.nih.gov/27366244/

Abstract:
The incidence of epidermoid tumors is between 1% and 2% of all intracranial tumors. The usual locations of epidermoid tumor are the parasellar region and cerebellopontine angle, and it is less commonly located in sylvian fissure, suprasellar region, cerebral and cerebellar hemispheres, and lateral and fourth ventricles. Epidermoid cysts located in the posterior fossa usually arise in the lateral subarachnoid cisterns, and those located in the brain stem are rare. These epidermoids contain cheesy and flaky white soft putty like contents. Epidermoid cysts are very slow growing tumors having a similar growth pattern of the epidermal cells of the skin and develop from remnants of epidermal elements during closure of the neural groove and disjunction of the surface ectoderm with neural ectoderm between the third and fifth weeks of embryonic life. We are presenting an interesting case of intrinsic brainstem epidermoid cyst containing milky white liquefied material with flakes in a 5-year-old girl. Diffusion-weighted imaging is definitive for the diagnosis. Ideal treatment of choice is removal of cystic components with complete resection of capsule. Although radical resection will prevent recurrence, in view of very thin firmly adherent capsule to brainstem, it is not always possible to do complete resection of capsule without any neurological deficits.


## Article 4

PMID: 29930917
Title: Bifrontal Epidermoid Cyst.
Journal: Advanced biomedical research
Year: 2020
DOI: 10.4103/abr.abr_107_16
URL: https://pubmed.ncbi.nlm.nih.gov/29930917/

Abstract:
In this paper, we will present a case of a 63-year-old female with bifrontal epidermoid tumor who has gone under bilateral craniotomy. In a case report study, a 63-year-old female with a chief complaint of progressive headache that has been admitted to Department of Neurosurgery was studied. Magnetic resonance imaging was performed for better evaluation. After detection of bifrontal epidermoid cyst, the patient underwent surgery, and following the surgery, a cut of the tumor has been excised, sent for pathology sampling and reviewed for detection of cyst. Microscopic review of the resected part reported normal brain tissue along with sections containing parts of cyst wall covered by squamous epithelium and huge amount of irregularly stratified keratin within its lumen, which clearly emphasizes on diagnosis of a typical epidermoid tumor. Bifrontal epidermoid cyst is rare, and according to our study, the clinical symptoms and patients imaging were consistent with other studies.

