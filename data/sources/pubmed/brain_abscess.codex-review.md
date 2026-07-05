# Codex Literature Extraction Packet

Disease: Brain abscess
Japanese name: 脳膿瘍
PubMed query: brain abscess MRI diffusion restriction ring enhancement imaging findings

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\brain_abscess.source.json
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

PMID: 33762459
Title: [Brain Abscess].
Journal: No shinkei geka. Neurological surgery
Year: 2021
DOI: 10.11477/mf.1436204400
URL: https://pubmed.ncbi.nlm.nih.gov/33762459/

Abstract:
Although the prognosis of brain abscesses has historically improved, the mortality rate still ranges from 5 to 32%, with ventricular perforation reaching 50% and 85-100% in fungal brain abscesses. The characteristic finding of ring-like enhancement by contrast-enhanced imaging is non-specific, and DWI, SWI and MR spectroscopy are very useful in differentiating brain abcesses from necrotizing brain tumors. Brain abscesses show apparent diffusion restriction on the DWI/apparent diffusion coefficient(ADC) map, whereas necrotizing brain tumors often show a weak diffusion restriction. The "dual rim sign" on SWI is also a highly specific finding of brain abscess.


## Article 2

PMID: 15897953
Title: Neuroimaging of infections.
Journal: NeuroRx : the journal of the American Society for Experimental NeuroTherapeutics
Year: 2005
DOI: 10.1602/neurorx.2.2.324
URL: https://pubmed.ncbi.nlm.nih.gov/15897953/

Abstract:
Neuroimaging plays a crucial role in the diagnosis and therapeutic decision making in infectious diseases of the nervous system. The review summarizes imaging findings and recent advances in the diagnosis of pyogenic brain abscess, ventriculitis, viral disease including exotic and emergent viruses, and opportunistic disease. For each condition, the ensuing therapeutic steps are presented. In cases of uncomplicated meningitis, cranial computed tomography (CT) appears to be sufficient for clinical management to exclude acute brain edema, hydrocephalus, and pathology of the base of skull. Magnetic resonance imaging (MRI) is superior in depicting complications like sub-/epidural empyema and vasculitic complications notably on FLAIR (fluid-attenuated inversion recovery)-weighted images. The newer technique of diffusion-weighted imaging (DWI) shows early parenchymal complications of meningitis earlier and with more clarity and is of help in differentiation of pyogenic abscess (PA) from ring enhancing lesions of other etiology. Proton magnetic resonance spectroscopy (PMRS) seems to produce specific peak patterns in cases of abscess. The presence of lactate cytosolic amino acids and absence of choline seems to indicate PA. Also in cases of suspected opportunistic infection due to toxoplasma DWI may be of help in the differentiation from lymphoma, showing no restriction of water diffusion. In patients with herpes simplex and more exotic viruses like West Nile and Murray Valley virus DWI allows earlier lesion detection and therapeutic intervention with virustatic drugs.


## Article 3

PMID: 40958618
Title: Diffusion-Weighted Imaging of Intracranial Ring-Enhancing Lesions.
Journal: Veterinary radiology & ultrasound : the official journal of the American College of Veterinary Radiology and the International Veterinary Radiology Association
Year: 2025
DOI: 10.1111/vru.70085
URL: https://pubmed.ncbi.nlm.nih.gov/40958618/

Abstract:
Ring-enhancing magnetic resonance imaging (MRI) lesions result from various diseases, including infection, neoplasia, inflammation, and vascular etiologies. Differentiation based on standard MRI sequences can be challenging. This study aims to compare the apparent diffusion coefficient (ADC) values of intracranial ring-enhancing lesions of infectious etiology with ring-enhancing lesions caused by other etiologies. Records were reviewed for MRI studies with diffusion-weighted imaging (DWI) and post-gadolinium T1-weighted ring-enhancing lesions with a definitive histopathological diagnosis or a microbiological diagnosis of brain infection. ADC maps were generated, and regions of interest were selected to evaluate ADC values of ring-enhancing lesions. Normalized ADC values (rADC) were calculated using ADC values from lesional and contralateral brain regions of interest (rADC&#xa0;=&#xa0;ADC lesion /ADC CB ). A total of 69 cases met the inclusion criteria (68 dogs, 1 cat). Median (range) rADC was significantly lower for intraparenchymal bacterial abscesses [0.54 (0.19-0.82)] compared to ring-enhancing gliomas [1.7 (0.80-3.9); p&#xa0;=&#xa0;0.0003) and non-infectious inflammatory lesions [1.7 (0.74-3.3); p&#xa0;=&#xa0;0.024], but not significantly different compared to intraparenchymal hemorrhage [0.54 (0.33-0.87); p&#xa0;>&#xa0;0.99]. Extraparenchymal bacterial empyema and intraparenchymal fungal abscesses did not exhibit apparent restricted diffusion, with median rADC (range) of 2.8 (1.3-3.4) and 1.2 (1.1-1.8), respectively. With exclusion of hemorrhagic lesions, an rADC of 0.65 had a specificity/sensitivity of 98%/78% for intraparenchymal bacterial abscess. Apparent restricted diffusion on DWI and ADC is a useful marker for identifying intraparenchymal bacterial abscesses among ring-enhancing lesions. However, extraparenchymal bacterial empyema and fungal abscesses may not exhibit this feature.

