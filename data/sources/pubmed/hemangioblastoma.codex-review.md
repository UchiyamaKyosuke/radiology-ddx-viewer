# Codex Literature Extraction Packet

Disease: Hemangioblastoma
Japanese name: 血管芽腫
PubMed query: cerebellar hemangioblastoma[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\hemangioblastoma.source.json
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

PMID: 20301636
Title: Von Hippel-Lindau Syndrome
Journal: AJR. American journal of roentgenology
Year: 1993
DOI: 10.2214/AJR.19.22447
URL: https://pubmed.ncbi.nlm.nih.gov/20301636/

Abstract:
Von Hippel-Lindau syndrome (VHL) is characterized by hemangioblastomas of the brain, spinal cord, and retina; renal cysts and clear cell renal cell carcinoma; pheochromocytoma and paraganglioma; pancreatic cysts and neuroendocrine tumors; endolymphatic sac tumors; and epididymal and broad ligament cystadenomas. Retinal hemangioblastomas may be the initial manifestation of VHL and can cause vision loss. Cerebellar hemangioblastomas may be associated with headache, vomiting, gait disturbances, or ataxia. Spinal hemangioblastomas and related syrinx usually present with pain. Sensory and motor loss may develop with cord compression. Renal cell carcinoma occurs in about 70% of individuals with VHL and is the leading cause of mortality. Pheochromocytomas can be asymptomatic but may cause sustained or episodic hypertension. Pancreatic lesions often remain asymptomatic and rarely cause endocrine or exocrine insufficiency. Endolymphatic sac tumors can cause hearing loss of varying severity, which can be a presenting symptom. Cystadenomas of the epididymis are relatively common. They rarely cause problems, unless bilateral, in which case they may result in infertility.
The diagnosis of VHL is established in a proband who fulfills existing diagnostic clinical criteria. Identification of a heterozygous germline  VHL  pathogenic variant on molecular genetic testing establishes the diagnosis if clinical features are inconclusive.
 Targeted therapies:  Pazopanib is an FDA-approved treatment for advanced renal cell carcinoma. Belzutifan is approved in many countries for the treatment of adults with VHL who do not require immediate surgery for associated renal cell carcinoma, central nervous system (CNS) hemangioblastomas, or pancreatic neuroendocrine tumors.  Supportive care:  Surgical resection for most CNS hemangioblastomas; early treatment for retinal hemangioblastomas; cryoablation or radiofrequency ablation for renal cell carcinoma; kidney transplantation following bilateral nephrectomy; removal of pheochromocytomas (partial adrenalectomy when possible); consider removal of pancreatic neuroendocrine tumors; consider surgical removal of endolymphatic sac tumors (particularly small tumors in order to preserve hearing and vestibular function); cystadenomas of the epididymis or broad ligament need treatment when symptomatic or threatening fertility; psychosocial support and care coordination as needed.  Surveillance:  For individuals with VHL and at-risk relatives of unknown genetic status: annual clinical evaluation for neurologic symptoms, vision problems, and hearing disturbances beginning in the first decade of life; brain and total spine MRI every two years starting at age 11 years; ophthalmology evaluation beginning at age one year; abdominal MRI every two years starting at age 15 years; annual blood pressure starting in the first decade of life; annual plasma or 24-hour urine for fractionated metanephrines starting at age five years; audiology assessment every two to three years starting at age 11 years; MRI of the internal auditory canal in asymptomatic individuals between age 15 and 20 years; assessment of psychosocial needs at each visit.  Agents/circumstances to avoid:  Tobacco products should be avoided, as they are considered a risk factor for kidney cancer; chemicals and industrial toxins known to affect VHL-involved organs should be avoided; contact sports should be avoided if adrenal or pancreatic lesions are present.  Evaluation of relatives at risk:  If the pathogenic variant in a family is known, molecular genetic testing can be used to clarify the genetic status of at-risk family members to eliminate the need for surveillance of family members who have not inherited the pathogenic variant.  Pregnancy management:  Intensified surveillance for cerebellar hemangioblastoma and pheochromocytoma prior to conception and during pregnancy; MRI without contrast of the cerebellum at four months' gestation.
VHL is inherited in an autosomal dominant manner. Approximately 80% of individuals with VHL have an affected parent and about 20% have VHL as the result of a pathogenic variant that occurred as a  de novo  event in the affected individual or as a postzygotic  de novo  event in a mosaic, apparently unaffected parent. The offspring of an individual with VHL are at a 50% risk of inheriting the  VHL  pathogenic variant. Once the  VHL  pathogenic variant has been identified in an affected family member, testing of at-risk asymptomatic family members, prenatal testing, and preimplantation genetic testing for VHL are possible.
 OBJECTIVE.  The existing literature lacks research into the benefits of initial screening imaging for patients with cerebellar hemangioblastoma. We aimed to evaluate the diagnostic yield of initial screening imaging using abdominal CT and whole-spine MRI in patients with cerebellar hemangioblastoma.  MATERIALS AND METHODS.  This retrospective study included 117 consecutive patients with histopathologically confirmed, newly diagnosed cerebellar hemangioblastomas at a single tertiary hospital between January 2006 and October 2018. Patients underwent contrast-enhanced abdominal CT, whole-spine MRI, or both to detect abdominal and spinal lesions of von Hippel-Lindau disease. Diagnostic yields and false referral rates for initial screening imaging were determined.  RESULTS.  After exclusion of six patients who forewent any initial imaging, 111 patients were included (53 men [mean age &#xb1; SD, 51 &#xb1; 13 years] and 58 women [mean age, 43 &#xb1; 16 years]). The diagnostic yield of abdominal CT was 3.8% (4 of 105; 95% CI, 1.1-9.3%), whereas the false referral rate was 1.0% (1 of 105; 95% CI, 0.0-5.2%). For whole-spine MRI, the corresponding values were 5.6% (4 of 71; 95% CI, 1.6-13.8%) and 2.8% (2 of 71; 95% CI, 0.3-9.8%), respectively. The respective diagnostic yields in patients with a single cerebellar hemangioblastoma were both 0% (0 of 98 and 66, respectively).  CONCLUSION.  For patients with a single cerebellar hemangioblastoma, screening examinations with abdominal CT and whole-spine MRI are unnecessary before the results of genetic testing are available.


## Article 2

PMID: 35242478
Title: A Challenge in Diagnosis of Cerebellar Hemangioblastoma.
Journal: Cureus
Year: 2022
DOI: 10.7759/cureus.21713
URL: https://pubmed.ncbi.nlm.nih.gov/35242478/

Abstract:
Hemangioblastomas are benign neoplasms, which are highly vascularized and have a slow-growing rate that typically affect the central nervous system; they account for about 1-2.5% of all intracranial tumors and for approximately 2-3% of all intramedullary neoplasms. We present a clinical case of cerebellar hemangioblastoma with six years of evolution, which illustrates the diagnostic difficulties that often arise, especially when the clinical and imaging characteristics escape those usually described and when other clinical findings appear as confounding factors. A 17-year-old female was initially admitted to the emergency department (ED) with a holocranial headache, gait imbalance, and vomiting. A brain magnetic resonance imaging (MRI) was done and a rounded lesion was detected in the left cerebellar hemisphere, hypointense in T1 and hyperintense in T2, with annular contrast&#xa0;enhancement. Several hypotheses for diagnosis were made, and the patient was subjected to several therapies, with periods of remission of symptoms interleaved with periods of worsening. After imaging suggestive of hemangioblastoma on routine brain MRI, the tumor was excised surgically and the histopathology confirmed the diagnosis. In the control brain MRI&#xa0;exams performed six and 24 months after surgery, no evidence of tumor recurrence was detected, and the patient remained asymptomatic. In conclusion, although these are rare neoplasms, it is essential to always consider hemangioblastomas in the differential diagnosis of cases with compatible clinical and radiological findings. A wrong or late diagnosis may lead to the use of unnecessary and harmful therapies as well as the appearance of potentially preventable complications if these tumors are handled correctly and timely.


## Article 3

PMID: 10547017
Title: Hemangioblastoma of the third ventricle.
Journal: Neurosurgical review
Year: 1999
DOI: 10.1007/s101430050050
URL: https://pubmed.ncbi.nlm.nih.gov/10547017/

Abstract:
A third ventricle tumor, in addition to a recurrent cerebellar hemangioblastoma, was found in a 47-year-old woman on follow-up magnetic resonance imaging (MRI) 5 years after operation of the cerebellar tumor. On MRI, the tumor was hypo- to isointense on T1-weighted images and hyperintense on T2-weighted images compared with the normal gray matter, and was strongly enhanced with gadolinium. The tumor was first treated with fractionated conventional external-beam radiation (5120 cGy in 16 fractions over a 4-week period), resulting in a slight decrease in size of the tumor. For a definite diagnosis and mass reduction, surgery was performed using an interhemispheric translamina terminalis approach, resulting in a partial removal of the tumor due to profuse bleeding. Histological diagnosis was hemangioblastoma. Hemangioblastomas of the third ventricle are extremely rare and have not been specifically discussed. We describe the detailed clinicopathological features of the present case together with the possible explanation for the development of this tumor in this rare location.

