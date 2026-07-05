# Codex Literature Extraction Packet

Disease: Oligodendroglioma
Japanese name: 乏突起膠腫
PubMed query: oligodendroglioma[Title/Abstract] AND (MRI[Title/Abstract] OR CT[Title/Abstract] OR imaging[Title/Abstract] OR calcification[Title/Abstract])

## Task For Codex

Read the abstracts below and edit this source JSON:

```text
data\sources\pubmed\oligodendroglioma.source.json
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

PMID: 34117807
Title: Clinical features, diagnosis, and survival analysis of dogs with glioma.
Journal: Journal of veterinary internal medicine
Year: 2021
DOI: 10.1111/jvim.16199
URL: https://pubmed.ncbi.nlm.nih.gov/34117807/

Abstract:
Gliomas in dogs remain poorly understood.
To characterize the clinicopathologic findings, diagnostic imaging features and survival of a large sample of dogs with glioma using the Comparative Brain Tumor Consortium diagnostic classification.
Ninety-one dogs with histopathological diagnosis of glioma.
Multicentric retrospective case series. Signalment, clinicopathologic findings, diagnostic imaging characteristics, treatment, and outcome were used. Tumors were reclassified according to the new canine glioma diagnostic scheme.
No associations were found between clinicopathologic findings or survival and tumor type or grade. However, definitive treatments provided significantly (P&#xa0;=&#xa0;.03) improved median survival time (84&#x2009;days; 95% confidence interval [CI], 45-190) compared to palliative treatment (26&#x2009;days; 95% CI, 11-54). On magnetic resonance imaging (MRI), oligodendrogliomas were associated with smooth margins and T1-weighted hypointensity compared to astrocytomas (odds ratio [OR], 42.5; 95% CI, 2.42-744.97; P&#xa0;=&#xa0;.04; OR, 45.5; 95% CI, 5.78-333.33; P&#x2009;<&#x2009;.001, respectively) and undefined gliomas (OR, 84; 95% CI, 3.43-999.99; P&#xa0;=&#xa0;.02; OR, 32.3; 95% CI, 2.51-500.00; P&#xa0;=&#xa0;.008, respectively) and were more commonly in contact with the ventricles than astrocytomas (OR, 7.47; 95% CI, 1.03-53.95; P&#xa0;=&#xa0;.049). Tumor spread to neighboring brain structures was associated with high-grade glioma (OR, 6.02; 95% CI, 1.06-34.48; P&#xa0;=&#xa0;.04).
Dogs with gliomas have poor outcomes, but risk factors identified in survival analysis inform prognosis and the newly identified MRI characteristics could refine diagnosis of tumor type and grade.


## Article 2

PMID: 26849038
Title: Imaging of oligodendroglioma.
Journal: The British journal of radiology
Year: 2016
DOI: 10.1259/bjr.20150857
URL: https://pubmed.ncbi.nlm.nih.gov/26849038/

Abstract:
Oligodendroglioma are glial tumours, predominantly occurring in adults. Their hallmark molecular feature is codeletion of the 1p and 19q chromosome arms, which is not only of diagnostic but also of prognostic and predictive relevance. On imaging, these tumours characteristically show calcification, and they have a cortical-subcortical location, most commonly in the frontal lobe. Owing to their superficial location, there may be focal thinning or remodelling of the overlying skull. In contrast to other low-grade gliomas, minimal to moderate enhancement is commonly seen and perfusion may be moderately increased. This complicates differentiation from high-grade, anaplastic oligodendroglioma, in which enhancement and increased perfusion are also common. New enhancement in a previously non-enhancing, untreated tumour, however, is suggestive of malignant transformation, as is high growth rate. MR spectroscopy may further aid in the differentiation between low- and high-grade oligodendroglioma. A relatively common feature of recurrent disease is leptomeningeal dissemination, but extraneural spread is rare. Tumours with the 1p/19q codeletion more commonly show heterogeneous signal intensity, particularly on T2 weighted imaging; calcifications; an indistinct margin; and mildly increased perfusion and metabolism than 1p/19q intact tumours. For the initial diagnosis of oligodendroglioma, MRI and CT are complementary; MRI is superior to CT in assessing tumour extent and cortical involvement, whereas CT is most sensitive to calcification. Advanced and functional imaging techniques may aid in grading and assessing the molecular genotype as well as in differentiating between tumour recurrence and radiation necrosis, but so far no unequivocal method or combination of methods is available.


## Article 3

PMID: 21725645
Title: Oligodendroglial ganglioglioma.
Journal: Brain tumor pathology
Year: 2012
DOI: 10.1007/s10014-011-0047-z
URL: https://pubmed.ncbi.nlm.nih.gov/21725645/

Abstract:
Gangliogliomas are rare tumors of the central nervous system, usually containing neoplastic ganglion cells and astrocytic components. Few cases of ganglioglioma containing only oligodendrocytic tissue have been reported to date. We present a case of a 40-year-old woman with ganglioglioma consisting mostly of oligodendroglial components. Magnetic resonance imaging showed a well-demarcated cystic lesion with slight perifocal edema in the right parietal lobe. The wall of the cyst was not enhanced after administration of Gd-DTPA contrast media. The mass was totally resected. Histological examination showed a mixture of two distinct components: oligodendroglioma and dysplastic ganglions. The first component was diffusely proliferated cells with round nuclei and perinuclear halo; the second showed marked nucleoli and basophilic cytoplasm containing Nissl bodies. Immunohistochemical study of the oligodendroglial component was positive for OLIG 2 and NKX2.2 but negative for synaptophysin. In addition, LOH of 1p/19q was detected by FISH. Although no adjuvant therapy was carried out, follow-up MRI showed no recurrence of the tumor 41&#xa0;months after the operation.


## Article 4

PMID: 26948348
Title: Surgical approaches for the gliomas.
Journal: Handbook of clinical neurology
Year: 2016
DOI: 10.1016/B978-0-12-802997-8.00004-9
URL: https://pubmed.ncbi.nlm.nih.gov/26948348/

Abstract:
Neurosurgical intervention remains the first step in effective glioma management. Mounting evidence suggests that cytoreduction for low- and high-grade gliomas is associated with a survival benefit. Beyond conventional neurosurgical principles, an array of techniques have been refined in recent years to maximize the effect of the neurosurgical oncologist and facilitate the impact of subsequent adjuvant therapy. With intraoperative mapping techniques, aggressive microsurgical resection can be safely pursued even when tumors occupy essential functional pathways. Other adjunct techniques, such as intraoperative magnetic resonance imaging, intraoperative ultrasonography, and fluorescence-guided surgery, can be valuable tools to safely reduce the tumor burden of low- and high-grade gliomas. Taken together, this collection of surgical strategies has pushed glioma extent of resection towards the level of cellular resolution.

