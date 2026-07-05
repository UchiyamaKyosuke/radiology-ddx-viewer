# Disease Card Extraction Prompt

You are extracting a radiology disease card for a personal, physician-reviewed database.

Return only JSON matching the source-input shape consumed by `scripts/generate-draft.js`.

Required top-level fields:

- `disease_id`
- `disease_name.ja`
- `disease_name.en`
- `disease_aliases.ja`
- `disease_aliases.en`
- `clinical.overview`
- `clinical.treatment`
- `clinical.epidemiology`
- `keywords`: compact disease-level searchable terms such as named imaging signs. Keep this array small.
- `demographics.sex.applicable`
- `demographics.sex.predominance`
- `demographics.sex.predilection`: one of `female_only`, `female_predominant`, `no_sex_predilection`, `male_predominant`, `male_only`, `unknown`
- `demographics.sex.summary`
- `demographics.age.typical_min`
- `demographics.age.typical_max`
- `demographics.age.peak_decade`: use compact Japanese such as `50-70歳代`, `60歳代`, or `未確認`
- `demographics.age.summary`: use compact Japanese such as `40-80歳に多い。`
- `frequency.label`
- `frequency.summary`
- `findings`
- `references`

Each finding must include:

- `finding_text`
- `modality`: `MRI` or `CT`
- `acquisition_type`: `sequence` or `phase`
- `acquisition_code`
- `anatomy.body_region`
- `anatomy.organ`
- `anatomy.subregion`
- `anatomy.laterality`
- `target`
- `modifiers`
- `keywords`: compact finding-level searchable terms such as `dural tail sign`, `bridging vessel sign`, or `T2 shading`
- `typicality`
- `diagnostic_weight`

Do not invent certainty. If evidence is weak, keep confidence low in the downstream card.

References must contain source metadata only. Do not put explanatory notes, interpretation, or workflow comments in `references`; put those in `clinical.overview`, `clinical.epidemiology`, or finding text instead.
