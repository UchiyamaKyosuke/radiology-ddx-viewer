# Codex Literature Extraction Packet

Disease: Brain metastasis
Japanese name: 脳転移
PubMed query: brain metastases[Title/Abstract] AND (MRI[Title/Abstract] OR magnetic resonance[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\brain_metastasis.source.json
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

PMID: 29307364
Title: Brain metastases: neuroimaging.
Journal: Handbook of clinical neurology
Year: 2018
DOI: 10.1016/B978-0-12-811161-1.00007-4
URL: https://pubmed.ncbi.nlm.nih.gov/29307364/

Abstract:
Magnetic resonance imaging (MRI) is the cornerstone for evaluating patients with brain masses such as primary and metastatic tumors. Important challenges in effectively detecting and diagnosing brain metastases and in accurately characterizing their subsequent response to treatment remain. These difficulties include discriminating metastases from potential mimics such as primary brain tumors and infection, detecting small metastases, and differentiating treatment response from tumor recurrence and progression. Optimal patient management could be benefited by improved and well-validated prognostic and predictive imaging markers, as well as early response markers to identify successful treatment prior to changes in tumor size. To address these fundamental needs, newer MRI techniques including diffusion and perfusion imaging, MR spectroscopy, and positron emission tomography (PET) tracers beyond traditionally used 18-fluorodeoxyglucose are the subject of extensive ongoing investigations, with several promising avenues of added value already identified. These newer techniques provide a wealth of physiologic and metabolic information that may supplement standard MR evaluation, by providing the ability to monitor and characterize cellularity, angiogenesis, perfusion, pH, hypoxia, metabolite concentrations, and other critical features of malignancy. This chapter reviews standard and advanced imaging of brain metastases provided by computed tomography, MRI, and amino acid PET, focusing on potential biomarkers that can serve as problem-solving tools in the clinical management of patients with brain metastases.


## Article 2

PMID: 25649387
Title: [Brain metastases imaging].
Journal: Cancer radiotherapie : journal de la Societe francaise de radiotherapie oncologique
Year: 2015
DOI: 10.1016/j.canrad.2014.11.008
URL: https://pubmed.ncbi.nlm.nih.gov/25649387/

Abstract:
The therapeutic management of brain metastases depends upon their diagnosis and characteristics. It is therefore imperative that imaging provides accurate diagnosis, identification, size and localization information of intracranial lesions in patients with presumed cerebral metastatic disease. MRI exhibits superior sensitivity to CT for small lesions identification and to evaluate their precise anatomical location. The CT-scan will be made only in case of MRI's contraindication or if MRI cannot be obtained in an acceptable delay for the management of the patient. In clinical practice, the radiologic metastasis evaluation is based on visual image analyses. Thus, a particular attention is paid to the imaging protocol with the aim to optimize the diagnosis of small lesions and to evaluate their evolution. The MRI protocol must include: 1) non-contrast T1, 2) diffusion, 3) T2* or susceptibility-weighted imaging, 4) dynamic susceptibility contrast perfusion, 5) FLAIR with contrast injection, 6) T1 with contrast injection preferentially using the 3D spin echo images. The role of the nuclear medicine imaging is still limited in the diagnosis of brain metastasis. The Tc-sestamibi brain imaging or PET with amino acid tracers can differentiate local brain metastasis recurrence from radionecrosis but still to be evaluated.


## Article 3

PMID: 33388292
Title: [Not Available].
Journal: Revista espanola de medicina nuclear e imagen molecular
Year: 2024
DOI: 10.1016/j.remn.2020.10.011
URL: https://pubmed.ncbi.nlm.nih.gov/33388292/

Abstract:
To evaluate the utility of brain  18 F-DOPA PET/CT in the differential diagnosis of brain lesions with inconclusive MRI.
Twelve patients were studied, with a total of 16 lesions, without definitive diagnosis after brain MRI. A double acquisition PET/CT brain scan was acquired at 20 and 90 minutes. Visual and semiquantitative assessment was performed with SUV max  calculation of the lesions and calculation of the T/S ratio (tumor/contralateral striatum) and T/N ratio (tumor/contralateral healthy parenchyma) for each time.
Based on the visual assessment scale and using T/S ratio &#x2265; 1 and T/N ratio &#x2265; 1.3 to determine malignancy, the values of sensitivity (S), specificity (E) and positive predictive value (PPV) were: visual assessment (S 100%, E 33.3%, VPP 71.4%), T/S ratio (S 90%, E 100%, VPP 100%) and T/N ratio (S 100%, E 16.6%, VPP 66.6%). No lesion showed an increase in SUV max  in late acquisition.  18 F-DOPA PET/CT modified treatment in 75% of the patients.
 18 F-DOPA PET/CT is a useful tool in the study of brain lesions with inconclusive MRI. Late imaging (dual-point) has no added value in the final diagnosis. F-DOPA has an impact on patient management modifying therapeutic behavior.


## Article 4

PMID: 31214496
Title: Advanced Magnetic Resonance Imaging Techniques in Management of Brain Metastases.
Journal: Frontiers in oncology
Year: 2020
DOI: 10.3389/fonc.2019.00440
URL: https://pubmed.ncbi.nlm.nih.gov/31214496/

Abstract:
Brain metastases are the most common intracranial tumors and occur in 20-40% of all cancer patients. Lung cancer, breast cancer, and melanoma are the most frequent primary cancers to develop brain metastases. Treatment options include surgical resection, whole brain radiotherapy, stereotactic radiosurgery, and systemic treatment such as targeted or immune therapy. Anatomical magnetic resonance imaging (MRI) of the tumor (in particular post-Gadolinium T 1 -weighted and T 2 -weighted FLAIR) provide information about lesion morphology and structure, and are routinely used in clinical practice for both detection and treatment response evaluation for brain metastases. Advanced MRI biomarkers that characterize the cellular, biophysical, micro-structural and metabolic features of tumors have the potential to improve the management of brain metastases from early detection and diagnosis, to evaluating treatment response. Magnetic resonance spectroscopy (MRS), chemical exchange saturation transfer (CEST), quantitative magnetization transfer (qMT), diffusion-based tissue microstructure imaging, trans-membrane water exchange mapping, and magnetic susceptibility weighted imaging (SWI) are advanced MRI techniques that will be reviewed in this article as they pertain to brain metastases.


## Article 5

PMID: 37563948
Title: Brain metastases from breast cancer using magnetic resonance imaging: A systematic review.
Journal: Journal of medical radiation sciences
Year: 2024
DOI: 10.1002/jmrs.715
URL: https://pubmed.ncbi.nlm.nih.gov/37563948/

Abstract:
Despite improvements in imaging and treatment approaches, brain metastases (BMs) continue to be the primary cause of mortality and morbidity in about 20% of adult cancer patients. This research aimed to review the magnetic resonance imaging (MRI) and clinical characteristics of BMs resulting from breast cancer (BC). A systematic review of original research articles published from January 2000 to June 2023. We selected studies that reported MRI findings of BMs in BC patients. We excluded reviews, case reports, books/book chapters, animal studies and irrelevant records. We identified 24 studies that included 1580&#x2009;BC patients with BMs. T1-weighted (T1-w) (pre- and postcontrast), T2-weighted (T2-w), fluid-attenuated inversion recovery (FLAIR) and T2*-weighted (T2*-w) was used to measure the lesion size, shape and area. In other studies, advanced structural techniques including diffusion-weighted imaging (DWI), diffusion tensor imaging (DTI) and susceptibility-weighted imaging (SWI) were used to more precisely and sensitively evaluate the pathological area. Furthermore, functional and metabolic techniques like functional MRI (fMRI), magnetic resonance spectroscopy (MRS) and perfusion-weighted imaging (PWI) have also been utilised. The MRI findings of BMs varied depending on the MRI technique, the BC subtype, the lesion size and shape, the presence of haemorrhage or necrosis and the comparison with other brain tumours. Some MRI findings were associated with prognosis, recurrence or cognitive impairment in BC patients with BMs. MRI detects, characterises and monitors BMs from BC. Findings vary by MRI technique, BC subtype, lesion characteristics and comparison with other brain tumours. More research should validate emerging MRI techniques, determine the clinical implications of findings and explore the underlying mechanisms and biology of BMs from BC. MRI is a valuable tool for diagnosis, targeted therapy and studying BC metastasis.

