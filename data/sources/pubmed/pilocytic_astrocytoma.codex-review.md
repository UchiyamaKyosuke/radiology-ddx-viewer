# Codex Literature Extraction Packet

Disease: Pilocytic astrocytoma
Japanese name: 毛様細胞性星細胞腫
PubMed query: pilocytic astrocytoma[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\pilocytic_astrocytoma.source.json
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

PMID: 38194103
Title: [Orbital tumors].
Journal: Radiologie (Heidelberg, Germany)
Year: 2024
DOI: 10.1007/s00117-023-01257-x
URL: https://pubmed.ncbi.nlm.nih.gov/38194103/

Abstract:
Orbital tumours include a variety of orbital diseases of different origins. In the case of malignant orbital tumours, early detection is important so that treatment can be initiated promptly. Neuroradiological imaging, in particular magnetic resonance imaging (MRI), plays an important role in the diagnostic of orbital tumours. In adults, lymphoproliferative diseases, inflammations and secondary orbital tumours are most frequently found, whereas in children mostly dermoid cysts, optic gliomas and capillary haemangiomas are found. Optic glioma is a pilocytic astrocytoma and accounts for two thirds of all primary optic tumours. Optic nerve sheath meningiomas mostly affect middle-aged women. In childhood, retinoblastoma is the most common intraocular tumour. This is an aggressive malignant tumour which can occur unilaterally or bilaterally. Based on the imaging findings, differential diagnoses can usually be easily narrowed down using criteria such as age of manifestation, frequency, localisation and imaging characteristics.
Orbitatumoren umfassen eine Vielzahl orbitaler Erkrankungen unterschiedlichen Ursprungs. Bei malignen Orbitatumoren ist die Fr&#xfc;herkennung wichtig, damit zeitnah eine Therapie eingeleitet kann. Die neuroradiologische Bildgebung, insbesondere die Magnetresonanztomographie (MRT), spielt in der Diagnostik von Orbitatumoren eine bedeutende Rolle. Bei Erwachsenen finden sich am h&#xe4;ufigsten lymphoproliferative Erkrankungen, Entz&#xfc;ndungen und sekund&#xe4;re Orbitatumoren, bei Kindern Dermoidzysten, Optikusgliome und kapill&#xe4;re H&#xe4;mangiome. Das Optikusgliom ist ein pilozytisches Astrozytom, welches zwei Drittel aller prim&#xe4;ren Optikustumoren ausmacht. Opikusscheidenmeningeome betreffen meist Frauen mittleren Alters. Im Kindesalter stellt das Retinoblastom den h&#xe4;ufigsten intraokul&#xe4;ren Tumor dar. Hierbei handelt es sich um einen aggressiven malignen Tumor, der uni- oder bilateral auftreten kann. Anhand der Bildgebungsbefunde lassen sich Differenzialdiagnosen durch Kriterien wie Manifestationsalter, H&#xe4;ufigkeit, Lokalisation und bildgebende Charakteristika meist recht gut eingrenzen.


## Article 2

PMID: 27889018
Title: Posterior Fossa Tumors.
Journal: Neuroimaging clinics of North America
Year: 2017
DOI: 10.1016/j.nic.2016.08.001
URL: https://pubmed.ncbi.nlm.nih.gov/27889018/

Abstract:
Pediatric brain tumors are the leading cause of death from solid tumors in childhood. The most common posterior fossa tumors in children are medulloblastoma, atypical teratoid/rhabdoid tumor, cerebellar pilocytic astrocytoma, ependymoma, and brainstem glioma. Location, and imaging findings on computed tomography (CT) and conventional MR (cMR) imaging may provide important clues to the most likely diagnosis. Moreover, information obtained from advanced MR imaging techniques increase diagnostic confidence and help distinguish between different histologic tumor types. Here we discuss the most common posterior fossa tumors in children, including typical imaging findings on CT, cMR imaging, and advanced MR imaging studies.


## Article 3

PMID: 37306749
Title: [Pediatric posterior fossa tumors].
Journal: Radiologie (Heidelberg, Germany)
Year: 2023
DOI: 10.1007/s00117-023-01159-y
URL: https://pubmed.ncbi.nlm.nih.gov/37306749/

Abstract:
Tumors of the posterior fossa account for about 50-55% of brain tumors in childhood.
The most frequent tumor entities are medulloblastomas, pilocytic astrocytomas, ependymomas, diffuse midline gliomas and atypical teratoid-rhabdoid tumors. Neuroradiological differential diagnosis with magnetic resonance imaging (MRI) is of considerable importance for preoperative planning as well as planning of follow-up therapy.
Most important findings for differential diagnosis of pediatric posterior fossa tumors are tumor location, patient age and the intratumoral apparent diffusion assessed by diffusion-weighted imaging.
Advanced MR techniques like MRI perfusion and MR spectroscopy can be helpful both in the initial differential diagnosis and in tumor surveillance, but exceptional characteristics of certain tumor entities should be kept in mind.
Standard clinical MRI sequences including diffusion-weighted imaging are the main diagnostic tool in evaluating posterior fossa tumors in children. Advanced imaging methods can be helpful, but should never be interpreted separately from conventional MRI sequences.
KLINISCHES PROBLEM: Tumoren der hinteren Sch&#xe4;delgrube machen etwa 50&#x2013;55&#x202f;% der kindlichen Hirntumoren aus.
Zu den h&#xe4;ufigsten Tumorentit&#xe4;ten z&#xe4;hlen Medulloblastome, pilozytische Astrozytome, Ependymome, diffuse Mittelliniengliome und atypisch teratoid-rhabdoide Tumoren (ATRT). Der neuroradiologischen Differenzialdiagnostik mittels Magnetresonanztomographie (MRT) kommt eine erhebliche Bedeutung zu, sowohl f&#xfc;r die pr&#xe4;operative Planung als auch f&#xfc;r die Planung der Anschlusstherapie. LEISTUNGSF&#xe4;HIGKEIT: Wichtige Merkmale f&#xfc;r die Differenzialdiagnostik sind die genaue Tumorlokalisation, das Patientenalter und die intratumorale scheinbare Diffusion, die mittels diffusionsgewichteter Bildgebung quantifiziert werden kann.
Fortschrittliche MR-Techniken, wie MR-Perfusion und MR-Spektroskopie, k&#xf6;nnen sowohl f&#xfc;r die initiale Diagnostik als auch f&#xfc;r die Beurteilung des Tumorverlaufs hilfreich sein, allerdings sollten Ausnahmeverhalten bestimmter Tumorentit&#xe4;ten bekannt sein. EMPFEHLUNG F&#xfc;R DIE PRAXIS: Konventionelle MRT-Sequenzen inklusive Diffusionswichtung sind die wichtigsten diagnostischen Tools zur Evaluation p&#xe4;diatrischer Tumoren der hinteren Sch&#xe4;delgrube. Fortschrittliche MR-Techniken k&#xf6;nnen helfen, sollten allerdings nicht isoliert von den konventionellen MRT-Sequenzen interpretiert werden.


## Article 4

PMID: 37743340
Title: [Circumscribed Astrocytic Gliomas].
Journal: No shinkei geka. Neurological surgery
Year: 2023
DOI: 10.11477/mf.1436204830
URL: https://pubmed.ncbi.nlm.nih.gov/37743340/

Abstract:
In the fifth edition central nervous system tumours volume of the WHO Classification of Tumours series, gliomas, glioneuronal tumors, and neuronal tumors are divided into six groups. The term "circumscribed" is used to refer to a relatively contained growth pattern, as compared to other inherently "diffuse" tumors. Circumscribed astrocytic gliomas include six types: pilocytic astrocytoma, high-grade astrocytoma with piloid features, pleomorphic xanthoastrocytoma, subependymal giant cell astrocytoma, chordoid glioma, and astroblastoma,  MN1 -altered. The vast majority of circumscribed astrocytic gliomas harbor genetic alterations in the mitogen-activated protein kinase pathway. Here, we review the circumscribed astrocytic gliomas, including etiology, clinical and imaging features, pathology and molecular genetics, treatment, and prognosis. This study will lead to better understanding of these newly classified tumors.

