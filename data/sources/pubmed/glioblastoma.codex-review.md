# Codex Literature Extraction Packet

Disease: Glioblastoma
Japanese name: 膠芽腫
PubMed query: glioblastoma MRI imaging findings ring enhancement necrosis diffusion

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\glioblastoma.source.json
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

PMID: 30114544
Title: Frontal Tumefactive Demyelinating Lesion Mimicking Glioblastoma Differentiated by Methionine Positron Emission Tomography.
Journal: World neurosurgery
Year: 2018
DOI: 10.1016/j.wneu.2018.08.027
URL: https://pubmed.ncbi.nlm.nih.gov/30114544/

Abstract:
Tumefactive demyelinating lesion (TDL) is often reported as a rare variation of multiple sclerosis (MS). TDL is difficult to diagnose solely by magnetic resonance imaging (MRI) in patients with no history of MS. This is because the lesion often shows ring enhancement with perifocal brain edema on gadolinium MRI, thus mimicking glioblastoma multiforme (GBM).
A 54-year-old healthy woman complained of headache 1 month before admission. She developed a decline in cognitive function, decreased attention, and executive function disorder 10 days before admission. Gadolinium magnetic resonance imaging showed a ring-shaped enhancement accompanied by massive brain edema in the left frontal lobe. This suggested GBM, but methionine positron emission tomography (MET PET), surprisingly, showed no uptake with a tumor-to-normal brain ratio of 1.18. Accordingly, we eliminated GBM and suspected brain abscess because diffusion-weighted images showed high signal intensity in the lesion. Although we performed drainage, we could not demonstrate the presence of pus. Pathologic analysis of a specimen obtained by needle biopsy revealed broad necrosis and a small number of inflammatory cells. We therefore prescribed steroid therapy, by which symptoms gradually improved. No relapse occurred for 2 years. We finally diagnosed the patient as having TDL.
MET PET is considered a possible diagnostic modality for demyelinating disease as it can appropriately reflect pathologic findings. MET PET will facilitate decision making regarding surgery in patients with TDL.


## Article 2

PMID: 29482953
Title: Primary central nervous system lymphoma in immunocompetent patients: spectrum of findings and differential characteristics.
Journal: Radiologia
Year: 2019
DOI: 10.1016/j.rx.2017.12.009
URL: https://pubmed.ncbi.nlm.nih.gov/29482953/

Abstract:
Primary central nervous system (CNS) lymphomas are uncommon and their management differs significantly from that of other malignant tumors involving the CNS. This article explains how the imaging findings often suggest the diagnosis early. The typical findings in immunocompetent patients consist of a supratentorial intraaxial mass that enhances homogeneously. Other findings to evaluate include multifocality and incomplete ring enhancement. The differential diagnosis of primary CNS lymphomas should consider mainly other malignant tumors of the CNS such as glioblastomas or metastases. Primary CNS lymphomas tend to have less edema and less mass effect; they also tend to spare the adjacent cortex. Necrosis, hemorrhage, and calcification are uncommon in primary CNS lymphomas. Although the findings in morphologic sequences are characteristic, they are not completely specific and atypical types are sometimes encountered. Advanced imaging techniques such as diffusion or especially perfusion provide qualitative and quantitative data that play an important role in differentiating primary CNS lymphomas from other brain tumors.


## Article 3

PMID: 40010714
Title: [A case of multifocal glioblastoma with ring enhancement, mimicking cerebral toxoplasmosis with ring-enhanced lesions].
Journal: Rinsho shinkeigaku = Clinical neurology
Year: 2025
DOI: 10.5692/clinicalneurol.cn-002019
URL: https://pubmed.ncbi.nlm.nih.gov/40010714/

Abstract:
A 57-year-old male patient with a history of daily contact with stray cats was transferred to our hospital with weakness in the left limb and mild disturbance of consciousness. At presentation, he had no fever or signs of meningeal irritation. Cerebrospinal fluid examination revealed lymphocytic pleocytosis; however, the cerebrospinal culture was negative. Computed tomography of the thorax and abdomen showed no abnormalities. Gadolinium-enhanced brain MRI revealed multiple contrast-enhanced lesions in the periventricular white matter and enhanced lateral ventricles. Under the suspicion of cerebral toxoplasmosis, trimethoprim-sulfamethoxazole was administered, but his symptoms gradually worsened. Histopathological findings of the first brain biopsy did not reach the definitive diagnosis. The tissue culture detected Propionibacterium acnes. Despite changes in antibiotics (ceftriaxone and ampicillin), his symptoms progressed. The second brain biopsy revealed diffuse proliferation of atypical glial cells with irregular size of nuclei and necrosis. The diagnosis was glioblastoma, IDH-wild type, CNS WHO grade 4. The radiological findings in this case were initially recognized as isolated multiple lesions with surrounding vasogenic edema, but we authors should have suspected the brain tumor which spreads through the corpus callosum. Multifocal glioblastomas, a rare type of glioblastoma, has worse prognosis than unifocal glioblastoma. This case also emphasizes the importance of the appropriate timing of brain biopsy and careful validation of biopsy sampling.

