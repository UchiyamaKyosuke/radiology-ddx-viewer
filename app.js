(function () {
  const VIEWER_VERSION = "1.0.0";
  const DB_NAME = "radiology-ddx-viewer";
  const DB_VERSION = 1;
  const PACK_TYPE = "radiology-ddx-mobile-pack";

  const el = {
    query: document.getElementById("query"),
    clearButton: document.getElementById("clearButton"),
    results: document.getElementById("results"),
    details: document.getElementById("details"),
    chips: document.getElementById("chips"),
    suggestions: document.getElementById("suggestions"),
    status: document.getElementById("status"),
    packInput: document.getElementById("packInput"),
    clearPackButton: document.getElementById("clearPackButton"),
    packMeta: document.getElementById("packMeta"),
    sexButtons: Array.from(document.querySelectorAll(".sex-option")),
    ageButtons: Array.from(document.querySelectorAll(".age-option")),
    regionFilters: document.getElementById("regionFilters"),
    regionButtons: []
  };

  const WEIGHTS = {
    supportBase: 9,
    diagnostic: 2.4,
    importance: 1.0,
    prevalence: 0.15,
    text: 1.2,
    exactFinding: 3,
    namedSignDefault: 5,
    conflictBase: 18,
    sex: {
      female: { female_only: 6, female_predominant: 2, no_sex_predilection: 0, male_predominant: -2, male_only: -14, unknown: 0 },
      male: { female_only: -14, female_predominant: -2, no_sex_predilection: 0, male_predominant: 2, male_only: 6, unknown: 0 }
    },
    age: { strong: 4, partial: 1, mismatch: -4, farMismatch: -10, unknown: 0 },
    region: { match: 4, organ: 5, mismatch: -2 }
  };

  const KEY_FINDING_BOOSTS = {
    "finding:dural_tail_sign": 12,
    "finding:bridging_vessel_sign": 12,
    "finding:ring_enhancement": 8,
    "finding:thick_irregular_ring_enhancement": 12,
    "finding:open_ring_enhancement": 10,
    "finding:t2_shading": 10,
    "finding:fat_present": 11,
    "finding:central_diffusion_restriction": 9,
    "finding:vascular_territory_restricted_diffusion": 10,
    "finding:periventricular_ovoid_lesions": 9,
    "finding:papillary_projection": 8,
    "finding:multilocular_cystic_mass": 6,
    "finding:extra_axial_dural_based_mass": 8,
    "finding:avid_homogeneous_enhancement": 6,
    "finding:enhancing_solid_component": 6
  };

  const GENERIC_SIGNAL_TERMS = new Set([
    "高信号",
    "軽度高信号",
    "低信号",
    "軽度低信号",
    "等信号",
    "hyperintensity",
    "hyperintense",
    "mild hyperintensity",
    "mild hyperintense",
    "high signal",
    "hypointensity",
    "hypointense",
    "mild hypointensity",
    "mild hypointense",
    "low signal",
    "isointensity",
    "isointense",
    "iso signal",
    "hypoattenuation",
    "mild hypoattenuation",
    "isoattenuation",
    "hyperattenuation",
    "mild hyperattenuation",
    "低吸収",
    "軽度低吸収",
    "等吸収",
    "高吸収",
    "軽度高吸収"
  ]);

  const AGE_GROUPS = {
    child: { label: "小児", min: 0, max: 14 },
    young: { label: "若年", min: 15, max: 39 },
    middle: { label: "中年", min: 40, max: 64 },
    elderly: { label: "高齢", min: 65, max: 120 }
  };

  const REGION_FILTER_GROUPS = [
    { title: "全体", open: true, items: [
      ["指定なし", "", []],
      ["脳全体", "brain", ["brain", "intracranial", "cerebral", "meninges"]]
    ] },
    { title: "脳実質", open: false, items: [
      ["皮質/皮質下", "cortical_subcortical", ["cortex", "cortical", "subcortical", "cortical_subcortical", "gray-white junction", "gray_white_junction"]],
      ["白質/脳室周囲", "white_matter", ["white_matter", "white matter", "periventricular", "external_capsule", "anterior_temporal_pole"]],
      ["脳梁", "corpus_callosum", ["corpus_callosum", "corpus callosum", "callosal"]],
      ["基底核/視床", "deep_gray", ["basal_ganglia", "basal ganglia", "globus_pallidus", "thalami", "thalamus", "deep gray"]],
      ["海馬/側頭葉内側", "mesial_temporal", ["hippocampus", "mesial_temporal_lobe", "medial temporal", "limbic_system", "amygdala"]],
      ["島皮質", "insula", ["insula", "insular"]],
      ["脳幹", "brainstem", ["brainstem", "pons", "midbrain", "medulla"]],
      ["小脳", "cerebellum", ["cerebellum", "cerebellar", "dentate"]]
    ] },
    { title: "髄膜/髄液腔", open: false, items: [
      ["髄膜/硬膜", "meninges", ["meninges", "dura", "dural", "pachymeningeal", "leptomeningeal"]],
      ["くも膜下腔/脳槽", "subarachnoid", ["subarachnoid", "basal_cistern", "basal cistern", "cistern", "sulci"]],
      ["硬膜外/硬膜下", "extra_axial", ["extra_axial", "extra-axial", "subdural", "epidural"]]
    ] },
    { title: "脳室/正中", open: false, items: [
      ["脳室", "ventricle", ["ventricle", "ventricular", "lateral ventricle", "third ventricle"]],
      ["脈絡叢", "choroid_plexus", ["choroid_plexus", "choroid plexus"]],
      ["Monro孔", "foramen_of_monro", ["foramen_of_monro", "foramen of monro", "monro"]],
      ["松果体部", "pineal_region", ["pineal_region", "pineal gland", "pineal"]]
    ] },
    { title: "鞍部/頭蓋底", open: false, items: [
      ["鞍内/鞍上部", "sellar_suprasellar", ["sellar", "suprasellar", "sellar_region", "suprasellar_region", "pituitary"]],
      ["下垂体茎", "pituitary_stalk", ["pituitary_stalk", "pituitary stalk"]],
      ["海綿静脈洞", "cavernous_sinus", ["cavernous_sinus", "cavernous sinus"]],
      ["斜台/頭蓋底", "skull_base", ["skull_base", "skull base", "clivus", "clival"]],
      ["小脳橋角部/内耳道", "cpa_iac", ["cerebellopontine_angle", "cerebellopontine angle", "CPA", "internal_auditory_canal", "IAC"]]
    ] },
    { title: "血管", open: false, items: [
      ["動脈/血管", "cerebral_vessel", ["cerebral_vessel", "cerebral vessel", "artery", "arterial", "MRA_TOF"]],
      ["静脈洞", "dural_venous_sinus", ["dural_venous_sinus", "dural venous sinus", "venous sinus", "MRV"]],
      ["血管奇形", "vascular_malformation", ["vascular", "nidus", "flow void", "arteriovenous"]]
    ] },
    { title: "骨盤", open: false, items: [
      ["卵巣", "ovary", ["ovary", "ovarian", "adnexa", "adnexal"]],
      ["骨盤", "pelvis", ["pelvis", "ovary", "ovarian", "uterus", "adnexa"]]
    ] }
  ];

  const CHIP_GROUPS = [
    { title: "CT", type: "ct", open: false, groups: [
      { title: "吸収値", items: [
        ["脂肪吸収", "fat attenuation"],
        ["低吸収", "hypoattenuation"],
        ["軽度低吸収", "mild hypoattenuation"],
        ["等吸収", "isoattenuation"],
        ["軽度高吸収", "mild hyperattenuation"],
        ["高吸収", "hyperattenuation"],
        ["石灰化", "calcification"]
      ] }
    ] },
    { title: "MRI", type: "mri", open: false, groups: [
      { title: "T1WI", items: [
        ["低信号", "T1 hypointensity"],
        ["軽度低信号", "mild T1 hypointensity"],
        ["等信号", "T1 isointensity"],
        ["軽度高信号", "mild T1 hyperintensity"],
        ["高信号", "T1 hyperintensity"]
      ] },
      { title: "T2WI", items: [
        ["低信号", "T2 hypointensity"],
        ["軽度低信号", "mild T2 hypointensity"],
        ["等信号", "T2 isointensity"],
        ["軽度高信号", "mild T2 hyperintensity"],
        ["高信号", "T2 hyperintensity"],
        ["T2 shading", "T2 shading"]
      ] },
      { title: "FLAIR", items: [
        ["高信号", "FLAIR hyperintensity"]
      ] },
      { title: "DWI / ADC", items: [
        ["拡散制限あり（DWI高信号＋ADC低値）", "restricted diffusion"],
        ["拡散制限なし（ADC低下なし）", "no diffusion restriction"],
        ["DWI高信号", "DWI hyperintensity"],
        ["DWI等信号", "DWI isointensity"],
        ["ADC低値", "low ADC"],
        ["ADC等値", "similar ADC"],
        ["ADC高値", "high ADC"]
      ] },
      { title: "造影", items: [
        ["造影効果なし", "no enhancement"],
        ["軽度造影", "mild enhancement"],
        ["強い均一造影", "avid homogeneous enhancement"],
        ["リング状造影", "ring enhancement"],
        ["open-ring", "open-ring enhancement"]
      ] },
      { title: "SWI / T2*", items: [
        ["磁化率低信号 / blooming", "susceptibility blooming"],
        ["微小出血", "microbleeds"]
      ] },
      { title: "MRA / MRV", items: [
        ["flow void", "flow void"],
        ["動脈狭窄・閉塞", "arterial stenosis or occlusion"],
        ["血管nidus", "vascular nidus"],
        ["静脈洞血栓", "venous sinus thrombosis"],
        ["empty delta sign", "empty delta sign"]
      ] },
      { title: "灌流", items: [
        ["過灌流", "hyperperfusion"],
        ["低灌流", "hypoperfusion"],
        ["CBV上昇", "elevated CBV"],
        ["CBV低下", "reduced CBV"]
      ] },
      { title: "MRS", items: [
        ["コリンピーク上昇", "elevated choline peak"],
        ["乳酸ピーク", "lactate peak"],
        ["脂質ピーク", "lipid peak"]
      ] }
    ] }
  ];

  let db = null;
  let data = null;
  let selectedChips = new Map();
  let selectedSex = "";
  let selectedAge = "";
  let selectedRegion = "";
  let selectedDiseaseId = "";
  let lastResults = [];
  let suggestionItems = [];
  let chipPanelOpenState = new Map();

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        for (const name of ["meta", "dictionaries", "search", "summary", "graph", "diseases"]) {
          if (!database.objectStoreNames.contains(name)) database.createObjectStore(name);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function store(name, mode = "readonly") {
    return db.transaction(name, mode).objectStore(name);
  }

  function idbGet(name, key) {
    return new Promise((resolve, reject) => {
      const req = store(name).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function idbPut(name, key, value) {
    return new Promise((resolve, reject) => {
      const req = store(name, "readwrite").put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  function idbClear(name) {
    return new Promise((resolve, reject) => {
      const req = store(name, "readwrite").clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  function idbPutMany(name, entries) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(name, "readwrite");
      const s = tx.objectStore(name);
      for (const [key, value] of entries) s.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async function loadData() {
    const manifest = await idbGet("meta", "manifest");
    if (!manifest) return null;
    return {
      manifest,
      dictionaries: await idbGet("dictionaries", "main"),
      searchIndex: await idbGet("search", "items"),
      summaryIndex: await idbGet("summary", "items"),
      differentialGraph: await idbGet("graph", "main")
    };
  }

  async function importPack(file) {
    setStatus("データ読込中...");
    let pack;
    try {
      pack = JSON.parse(await file.text());
    } catch (error) {
      throw new Error(`.rddx をJSONとして読めません: ${error.message}`);
    }
    validatePack(pack);
    if (compareVersion(VIEWER_VERSION, pack.manifest.min_viewer_version || "0.0.0") < 0) {
      throw new Error(`viewerが古いです。必要バージョン: ${pack.manifest.min_viewer_version}`);
    }

    const counts = pack.manifest.counts || {};
    const message = [
      `${counts.diseases ?? pack.payload.summaryIndex.length}疾患を読み込みます。`,
      `${counts.searchable_findings ?? pack.payload.searchIndex.length}件の所見indexを保存します。`,
      "端末内の既存データは置き換えられます。"
    ].join("\n");
    if (!confirm(message)) {
      setStatus(data ? `${data.searchIndex.length} findings` : "データ未読込");
      return;
    }

    await clearStores();
    await idbPut("meta", "manifest", pack.manifest);
    await idbPut("dictionaries", "main", pack.payload.dictionaries);
    await idbPut("search", "items", pack.payload.searchIndex);
    await idbPut("summary", "items", pack.payload.summaryIndex);
    await idbPut("graph", "main", pack.payload.differentialGraph);

    const diseaseEntries = [];
    for (const chunk of pack.payload.diseaseChunks) {
      for (const card of chunk.items || []) diseaseEntries.push([card.disease_id, card]);
    }
    await idbPutMany("diseases", diseaseEntries);

    data = await loadData();
    enableSearch(true);
    selectedDiseaseId = "";
    selectedChips = new Map();
    selectedSex = "";
    selectedAge = "";
    selectedRegion = "";
    suggestionItems = buildSuggestionItems();
    renderAll();
    setStatus(`${data.searchIndex.length} findings`);
  }

  function validatePack(pack) {
    const errors = [];
    if (pack?.manifest?.pack_type !== PACK_TYPE) errors.push("対応していない .rddx です。");
    if (!pack?.payload) errors.push("payload がありません。");
    if (!pack?.payload?.dictionaries?.findingConcepts) errors.push("findingConcepts がありません。");
    if (!Array.isArray(pack?.payload?.searchIndex)) errors.push("searchIndex がありません。");
    if (!Array.isArray(pack?.payload?.summaryIndex)) errors.push("summaryIndex がありません。");
    if (!Array.isArray(pack?.payload?.diseaseChunks)) errors.push("diseaseChunks がありません。");
    if (!pack?.payload?.differentialGraph?.edges) errors.push("differentialGraph がありません。");
    if (errors.length) throw new Error(errors.join(" "));
  }

  async function clearStoredPack() {
    if (!confirm("このiPhone内に保存した検索データを削除しますか？")) return;
    await clearStores();
    data = null;
    selectedDiseaseId = "";
    selectedChips = new Map();
    selectedSex = "";
    selectedAge = "";
    selectedRegion = "";
    suggestionItems = [];
    enableSearch(false);
    renderAll();
    setStatus("データ未読込");
  }

  async function clearStores() {
    for (const name of ["meta", "dictionaries", "search", "summary", "graph", "diseases"]) {
      await idbClear(name);
    }
  }

  function enableSearch(enabled) {
    el.query.disabled = !enabled;
    el.clearButton.disabled = !enabled;
    for (const button of [...el.sexButtons, ...el.ageButtons, ...el.regionButtons]) button.disabled = !enabled;
  }

  function renderAll() {
    renderPackMeta();
    renderChips();
    renderRegionFilters();
    renderSexButtons();
    renderAgeButtons();
    renderRegionButtons();
    renderSuggestions();
    resetDetails();
    runSearch();
  }

  function renderPackMeta() {
    if (!data?.manifest) {
      el.packMeta.textContent = "まだ .rddx は読み込まれていません。OneDrive/ファイルアプリから選択してください。";
      return;
    }
    const counts = data.manifest.counts || {};
    el.packMeta.textContent = [
      `保存済み: ${counts.diseases ?? data.summaryIndex.length}疾患`,
      `${counts.searchable_findings ?? data.searchIndex.length}所見`,
      `作成: ${formatDate(data.manifest.generated_at)}`,
      `schema ${data.manifest.pack_schema_version || "unknown"}`
    ].join(" / ");
  }

  function renderChips() {
    rememberChipPanelState();
    el.chips.innerHTML = "";
    if (!data) {
      el.chips.innerHTML = '<div class="muted">.rddx 読み込み後に所見チップが使えます。</div>';
      return;
    }
    for (const panel of CHIP_GROUPS) {
      const panelKey = panel.type || panel.title;
      const hasSelectedChip = panel.groups.some((group) => group.items.some(([, term]) => selectedChips.has(term)));
      const details = document.createElement("details");
      details.className = "modality-panel";
      details.dataset.panelKey = panelKey;
      details.open = chipPanelOpenState.has(panelKey) ? chipPanelOpenState.get(panelKey) : (panel.open || hasSelectedChip);
      details.addEventListener("toggle", () => {
        chipPanelOpenState.set(panelKey, details.open);
      });
      details.innerHTML = `<summary>${escapeHtml(panel.title)}</summary>`;

      const body = document.createElement("div");
      body.className = "modality-body";
      for (const group of panel.groups) {
        const wrap = document.createElement("div");
        wrap.className = "chip-group";
        wrap.innerHTML = `<div class="chip-group-title">${escapeHtml(group.title)}</div>`;
        const row = document.createElement("div");
        row.className = "chip-row";
        for (const [label, term] of group.items) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = `chip${selectedChips.has(term) ? " active" : ""}`;
          button.textContent = label;
          button.addEventListener("click", () => {
            if (selectedChips.has(term)) selectedChips.delete(term);
            else selectedChips.set(term, label);
            renderChips();
            runSearch();
          });
          row.appendChild(button);
        }
        wrap.appendChild(row);
        body.appendChild(wrap);
      }
      details.appendChild(body);
      el.chips.appendChild(details);
    }
  }

  function rememberChipPanelState() {
    if (!el.chips) return;
    for (const details of el.chips.querySelectorAll("details.modality-panel[data-panel-key]")) {
      chipPanelOpenState.set(details.dataset.panelKey, details.open);
    }
  }

  function runSearch() {
    if (!data) {
      renderResults([]);
      return;
    }
    const query = buildQuery();
    if (!query.hasInput && !selectedSex && !selectedAge && !selectedRegion) {
      renderResults([]);
      return;
    }

    const byDisease = new Map();
    for (const item of data.searchIndex) {
      const scored = scoreFinding(item, query);
      if (scored.score === 0) continue;
      const current = byDisease.get(item.disease_id) || {
        disease_id: item.disease_id,
        disease_name: item.disease_name,
        review_status: item.review_status,
        demographics: item.demographics,
        prevalence_rank: item.prevalence_rank || 0,
        score: 0,
        evidence: []
      };
      current.score += scored.score;
      current.evidence.push({ ...item, relation: scored.relation, score: scored.score });
      byDisease.set(item.disease_id, current);
    }

    for (const result of byDisease.values()) {
      const sex = sexAdjustment(result.demographics);
      const age = ageAdjustment(result.demographics);
      result.sex_adjustment = sex;
      result.age_adjustment = age;
      result.score += sex.score + age.score;
    }

    lastResults = Array.from(byDisease.values())
      .filter((item) => item.score !== 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
    renderResults(lastResults);
    setStatus(`${lastResults.length} candidates`);
  }

  function buildQuery() {
    const rawTerms = new Set();
    for (const term of selectedChips.keys()) rawTerms.add(norm(term));
    const raw = norm(el.query.value);
    if (raw) {
      rawTerms.add(raw);
      for (const part of raw.split(/[,\s、　]+/).filter(Boolean)) rawTerms.add(norm(part));
    }
    const conceptIds = new Set();
    const textTerms = new Set(rawTerms);
    for (const term of rawTerms) {
      for (const id of conceptIdsFromTerm(term)) {
        conceptIds.add(id);
        textTerms.add(id);
        const concept = data.dictionaries.findingConcepts[id];
        if (concept?.canonical_label?.en) textTerms.add(norm(concept.canonical_label.en));
        if (concept?.canonical_label?.ja) textTerms.add(norm(concept.canonical_label.ja));
        for (const token of concept?.tokens || []) {
          const normalizedToken = norm(token);
          if (!isGenericSignalTerm(normalizedToken)) textTerms.add(normalizedToken);
        }
      }
    }
    return {
      hasInput: rawTerms.size > 0,
      rawTerms: Array.from(rawTerms),
      conceptIds,
      textTerms: Array.from(textTerms).filter(Boolean)
    };
  }

  function conceptIdsFromTerm(term) {
    const found = new Set();
    const concepts = data.dictionaries.findingConcepts || {};
    const synonyms = data.dictionaries.synonymMap || {};
    const constraints = termConstraints(term);
    for (const [synonym, ids] of Object.entries(synonyms)) {
      const key = norm(synonym);
      if (fuzzyTermMatch(key, term, constraints)) {
        for (const id of ids) {
          const concept = concepts[id];
          if (conceptMatchesConstraints(concept, constraints)) found.add(id);
        }
      }
    }
    for (const [id, concept] of Object.entries(concepts)) {
      if (!conceptMatchesConstraints(concept, constraints)) continue;
      const labelEn = norm(concept?.canonical_label?.en);
      const labelJa = norm(concept?.canonical_label?.ja);
      if (
        id === term ||
        labelTermMatch(labelEn, term, constraints) ||
        labelTermMatch(labelJa, term, constraints)
      ) found.add(id);
      for (const token of concept?.tokens || []) {
        const t = norm(token);
        if (fuzzyTermMatch(t, term, constraints)) found.add(id);
      }
    }
    return Array.from(found);
  }

  function fuzzyTermMatch(candidate, term, constraints = termConstraints(term)) {
    if (!candidate || !term) return false;
    if (isGenericSignalTerm(candidate) && !constraints.acquisitions.size && !constraints.modality) return false;
    if (candidate === term) return true;
    if (candidate.length >= 4 && (candidate.includes(term) || term.includes(candidate))) return true;
    return false;
  }

  function labelTermMatch(label, term, constraints) {
    if (!label || !term) return false;
    if (label === term || term.includes(label)) return true;
    if (isGenericSignalTerm(term) && !constraints.acquisitions.size && !constraints.modality) return false;
    return label.includes(term);
  }

  function termConstraints(term) {
    const value = norm(term);
    const acquisitions = new Set();
    let modality = "";
    if (/\bflair\b/.test(value)) {
      modality = "MRI";
      acquisitions.add("FLAIR");
    }
    if (/\bstir\b/.test(value)) {
      modality = "MRI";
      acquisitions.add("STIR");
    }
    if (/\bt1(?:wi|w| weighted)?\b/.test(value) || value.includes("t1")) {
      modality = "MRI";
      acquisitions.add("T1WI");
      if (value.includes("fat-sat") || value.includes("fat suppressed") || value.includes("fat-suppressed")) {
        acquisitions.add("T1WI_fat_suppressed");
      }
      if (value.includes("contrast") || value.includes("enhanced") || value.includes("postcontrast") || value.includes("ce-t1")) {
        acquisitions.add("contrast_enhanced_T1WI");
      }
      if (
        (value.includes("fat-sat") || value.includes("fat suppressed") || value.includes("fat-suppressed")) &&
        (value.includes("contrast") || value.includes("enhanced") || value.includes("postcontrast") || value.includes("ce-t1"))
      ) {
        acquisitions.add("contrast_enhanced_T1WI_fat_suppressed");
      }
    }
    if (/\bt2(?:wi|w| weighted)?\b/.test(value) || value.includes("t2") || value.includes("shading")) {
      modality = "MRI";
      acquisitions.add("T2WI");
      if (value.includes("fat-sat") || value.includes("fat suppressed") || value.includes("fat-suppressed")) {
        acquisitions.add("T2WI_fat_suppressed");
      }
      if (value.includes("t2*") || value.includes("t2star") || value.includes("t2 star")) {
        acquisitions.add("T2STAR");
      }
    }
    if (/\bdwi\b/.test(value)) {
      modality = "MRI";
      acquisitions.add("DWI");
    }
    if (/\badc\b/.test(value)) {
      modality = "MRI";
      acquisitions.add("ADC");
    }
    if (value.includes("拡散制限") || value.includes("diffusion restriction") || value.includes("restricted diffusion")) {
      modality = "MRI";
      acquisitions.add("DWI");
      acquisitions.add("ADC");
    }
    if (/\bswi\b/.test(value) || value.includes("susceptibility") || value.includes("blooming")) {
      modality = "MRI";
      acquisitions.add("SWI");
      acquisitions.add("T2STAR");
      acquisitions.add("GRE_T2STAR");
    }
    if (/\bgre\b/.test(value) || value.includes("gradient echo")) {
      modality = "MRI";
      acquisitions.add("GRE_T2STAR");
    }
    if (/\bmra\b/.test(value) || value.includes("tof")) {
      modality = "MRI";
      acquisitions.add("MRA_TOF");
      if (value.includes("contrast") || value.includes("enhanced") || value.includes("ce-mra")) {
        acquisitions.add("MRA_contrast_enhanced");
      }
    }
    if (/\bmrv\b/.test(value) || value.includes("venography") || value.includes("venous sinus")) {
      modality = "MRI";
      acquisitions.add("MRV");
    }
    if (/\basl\b/.test(value)) {
      modality = "MRI";
      acquisitions.add("ASL");
    }
    if (/\bdsc\b/.test(value) || value.includes("cbv") || value.includes("rcbv") || value.includes("perfusion")) {
      modality = "MRI";
      acquisitions.add("DSC_perfusion");
    }
    if (/\bdce\b/.test(value) || value.includes("dynamic enhancement")) {
      modality = "MRI";
      acquisitions.add("DCE_MRI");
    }
    if (/\bmrs\b/.test(value) || value.includes("spectroscopy") || value.includes("choline") || value.includes("lactate peak") || value.includes("lipid peak")) {
      modality = "MRI";
      acquisitions.add("MRS");
    }
    if (value.includes("ciss") || value.includes("fiesta") || value.includes("bssfp")) {
      modality = "MRI";
      acquisitions.add("CISS_FIESTA");
    }
    if (value.includes("dixon") || value.includes("opposed-phase") || value.includes("out-of-phase") || value.includes("in-phase")) {
      modality = "MRI";
      if (value.includes("opposed") || value.includes("out-of-phase")) acquisitions.add("DIXON_opposed_phase");
      else if (value.includes("in-phase")) acquisitions.add("DIXON_in_phase");
      else {
        acquisitions.add("DIXON_water");
        acquisitions.add("DIXON_fat");
      }
    }
    if (/\bmrcp\b/.test(value)) {
      modality = "MRI";
      acquisitions.add("MRCP");
    }
    if (
      /\bct\b/.test(value) ||
      value.includes("attenuation") ||
      value.includes("吸収") ||
      value.includes("石灰化") ||
      value.includes("calcification")
    ) {
      modality = "CT";
    }
    return { modality, acquisitions };
  }

  function conceptMatchesConstraints(concept, constraints) {
    if (!concept) return false;
    const modalities = concept.allowed_modalities || [];
    const acquisitions = concept.allowed_acquisitions || [];
    if (constraints.modality && modalities.length && !modalities.includes(constraints.modality)) return false;
    if (constraints.acquisitions.size) {
      return acquisitions.some((code) => constraints.acquisitions.has(code));
    }
    return true;
  }

  function isGenericSignalTerm(term) {
    const value = norm(term);
    return GENERIC_SIGNAL_TERMS.has(value);
  }

  function scoreFinding(item, query) {
    const regionScore = regionMatchScore(item);
    if (!query.hasInput) {
      if (selectedRegion && regionScore > 0) {
        return { score: regionScore + (item.prevalence_rank || 0) * WEIGHTS.prevalence, relation: "context" };
      }
      if (selectedSex || selectedAge) {
        return { score: Math.max(0.1, (item.prevalence_rank || 0) * WEIGHTS.prevalence), relation: "context" };
      }
      return { score: 0, relation: "context" };
    }
    const relation = relationFor(item.finding_code, query.conceptIds);
    const textScore = textMatchScore(item, query.textTerms);
    const specificityBoost = findingSpecificityBoost(item, query, relation, textScore);

    if (relation === "support") {
      return {
        relation,
        score: WEIGHTS.supportBase +
          (item.diagnostic_weight || 0) * WEIGHTS.diagnostic +
          (item.contextual_importance_rank || 0) * WEIGHTS.importance +
          (item.prevalence_rank || 0) * WEIGHTS.prevalence +
          textScore * WEIGHTS.text +
          specificityBoost +
          regionScore
      };
    }
    if (relation === "conflict") {
      return {
        relation,
        score: -1 * (WEIGHTS.conflictBase + (item.diagnostic_weight || 0) * WEIGHTS.diagnostic)
      };
    }
    if (!textScore && !regionScore) return { score: 0, relation: "context" };
    return {
      relation: "context",
      score: textScore * WEIGHTS.text + specificityBoost + regionScore + (item.prevalence_rank || 0) * WEIGHTS.prevalence
    };
  }

  function findingSpecificityBoost(item, query, relation, textScore) {
    const explicit = query.conceptIds.has(item.finding_code);
    const base = KEY_FINDING_BOOSTS[item.finding_code] || 0;
    const namedSign = hasNamedSign(item) ? WEIGHTS.namedSignDefault : 0;
    const boost = Math.max(base, namedSign);
    if (!boost) return explicit ? WEIGHTS.exactFinding : 0;
    if (relation === "support" && explicit) return boost + WEIGHTS.exactFinding;
    if (relation === "context" && textScore > 0) return Math.round(boost * 0.5);
    return 0;
  }

  function hasNamedSign(item) {
    const haystack = norm([
      item.finding_code,
      item.canonical_label?.en,
      item.canonical_label?.ja,
      item.finding_text,
      ...(item.keywords || []),
      ...(item.tokens || [])
    ].filter(Boolean).join(" "));
    return /\bsign\b/.test(haystack) ||
      haystack.includes("ring enhancement") ||
      haystack.includes("open-ring") ||
      haystack.includes("t2 shading") ||
      haystack.includes("fat-containing");
  }

  function regionMatchScore(item) {
    if (!selectedRegion) return 0;
    const region = regionFilter(selectedRegion);
    if (!region) return 0;
    const anatomy = item.anatomy || {};
    const haystack = norm([
      anatomy.body_region,
      anatomy.organ,
      anatomy.subregion,
      item.modality,
      item.acquisition_code,
      item.target,
      ...(item.tokens || [])
    ].filter(Boolean).join(" "));
    if (!haystack) return 0;
    const terms = region.terms.map(norm).filter(Boolean);
    const exactFields = [anatomy.body_region, anatomy.organ, anatomy.subregion].map(norm);
    if (exactFields.includes(selectedRegion)) return WEIGHTS.region.organ;
    if (terms.some((term) => exactFields.includes(term))) return WEIGHTS.region.organ;
    if (terms.some((term) => haystack.includes(term))) return WEIGHTS.region.match;
    return WEIGHTS.region.mismatch;
  }

  function relationFor(findingCode, requestedConcepts) {
    if (requestedConcepts.has(findingCode)) return "support";
    const findingConcept = data.dictionaries.findingConcepts[findingCode] || {};
    for (const id of requestedConcepts) {
      const requestedConcept = data.dictionaries.findingConcepts[id] || {};
      if (
        requestedConcept.relation_group &&
        findingConcept.relation_group &&
        requestedConcept.relation_group === findingConcept.relation_group
      ) {
        if (requestedConcept.relation_state && findingConcept.relation_state && requestedConcept.relation_state === findingConcept.relation_state) {
          return "support";
        }
        if (requestedConcept.relation_state && findingConcept.relation_state && requestedConcept.relation_state !== findingConcept.relation_state) {
          return "conflict";
        }
      }
      const equivalents = requestedConcept.related_equivalents || [];
      if (equivalents.includes(findingCode)) return "support";
      const opposites = requestedConcept.opposites || [];
      if (opposites.includes(findingCode)) return "conflict";
    }
    return "context";
  }

  function textMatchScore(item, terms) {
    const haystackText = norm([
      item.finding_code,
      item.canonical_label?.en,
      item.canonical_label?.ja,
      item.finding_text,
      item.modality,
      item.acquisition_code,
      item.target,
      ...Object.values(item.modifiers || {}),
      ...(item.tokens || [])
    ].filter(Boolean).join(" "));
    const haystackTokens = new Set(haystackText.split(/[^a-z0-9_:+-]+/).filter(Boolean));
    let score = 0;
    for (const term of terms) {
      if (!term || term.length < 2 || term.startsWith("finding:")) continue;
      if (matchesHaystack(term, haystackText, haystackTokens)) score += term.length >= 4 ? 2 : 1;
    }
    return score;
  }

  function matchesHaystack(term, haystackText, haystackTokens) {
    if (term.length <= 3) return haystackTokens.has(term);
    return haystackText.includes(term);
  }

  function sexAdjustment(demographics) {
    if (!selectedSex) return { score: 0, label: "" };
    const pred = demographics?.sex?.predilection || "unknown";
    const score = WEIGHTS.sex[selectedSex]?.[pred] ?? 0;
    return { score, label: `性別: ${sexLabel(pred)} ${formatScore(score)}` };
  }

  function ageAdjustment(demographics) {
    if (!selectedAge) return { score: 0, label: "" };
    const group = AGE_GROUPS[selectedAge];
    const min = demographics?.age?.typical_min;
    const max = demographics?.age?.typical_max;
    if (!group || min == null || max == null) return { score: WEIGHTS.age.unknown, label: "年齢: 情報なし 0" };
    const overlap = Math.max(0, Math.min(max, group.max) - Math.max(min, group.min) + 1);
    const ratio = overlap / (group.max - group.min + 1);
    let score = WEIGHTS.age.mismatch;
    if (ratio >= 0.5) score = WEIGHTS.age.strong;
    else if (ratio > 0) score = WEIGHTS.age.partial;
    else {
      const gap = group.max < min ? min - group.max : group.min - max;
      const pediatricAdultGap = (group.max <= 14 && min >= 40) || (group.min >= 40 && max <= 14);
      score = pediatricAdultGap || gap >= 40 ? WEIGHTS.age.farMismatch : WEIGHTS.age.mismatch;
    }
    return { score, label: `年齢: ${group.label} / 好発 ${min}-${max}歳 ${formatScore(score)}` };
  }

  function renderResults(results) {
    if (!data) {
      el.results.innerHTML = '<div class="details empty">先に .rddx を読み込んでください。</div>';
      return;
    }
    if (!results.length) {
      el.results.innerHTML = '<div class="details empty">所見を入力、またはチップを選択してください。</div>';
      return;
    }
    el.results.innerHTML = "";
    for (const result of results) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `result-card${result.disease_id === selectedDiseaseId ? " selected" : ""}`;
      const support = result.evidence.filter((x) => x.relation === "support");
      const conflict = result.evidence.filter((x) => x.relation === "conflict");
      const context = result.evidence.filter((x) => x.relation === "context");
      button.innerHTML = `
        <div class="result-title">
          <span>${escapeHtml(displayDiseaseName(result))} ${reviewBadge(result.review_status)}</span>
          <span class="score">${result.score.toFixed(1)}</span>
        </div>
        <div class="muted">${escapeHtml(result.disease_name?.en || result.disease_id)}</div>
        <div class="match-list">
          ${support.slice(0, 3).map((x) => findingBadge(x, "support")).join("")}
          ${conflict.slice(0, 3).map((x) => findingBadge(x, "conflict")).join("")}
          ${adjustmentBadge(result.sex_adjustment)}
          ${adjustmentBadge(result.age_adjustment)}
          ${context.slice(0, 2).map((x) => findingBadge(x, "context")).join("")}
        </div>
      `;
      button.addEventListener("click", async () => {
        selectedDiseaseId = result.disease_id;
        await renderDetails(result);
        renderResults(lastResults);
      });
      el.results.appendChild(button);
    }
  }

  async function renderDetails(result) {
    const card = await idbGet("diseases", result.disease_id);
    const related = relatedEdges(result.disease_id);
    const support = (result.evidence || []).filter((x) => x.relation === "support");
    const conflict = (result.evidence || []).filter((x) => x.relation === "conflict");
    const context = (result.evidence || []).filter((x) => x.relation === "context");
    el.details.className = "details";
    el.details.innerHTML = `
      <h3>${escapeHtml(displayDiseaseName(result))}</h3>
      <p class="muted">${escapeHtml(card?.disease_name?.en || result.disease_id)} ${reviewBadge(card?.review?.status || result.review_status)}</p>
      ${section("概要", card?.clinical?.overview || card?.frequency?.summary || "未登録")}
      ${section("治療", card?.clinical?.treatment || "未登録")}
      ${section("頻度", `${card?.frequency?.label || "unknown"} / ${card?.frequency?.summary || ""}`)}
      ${section("好発", demographicsText(card?.demographics || result.demographics))}
      ${adjustmentText(result.sex_adjustment)}
      ${adjustmentText(result.age_adjustment)}
      ${result.evidence?.length ? `<div class="section">
        <strong>検索所見との関係</strong>
        ${evidenceBlock("加点", support, "support")}
        ${evidenceBlock("減点", conflict, "conflict")}
        ${evidenceBlock("文脈一致", context, "context")}
      </div>` : ""}
      ${allImagingFindings(card)}
      <div class="section">
        <strong>関連鑑別</strong>
        ${related.length ? related.map((edge) => graphEdge(edge, result.disease_id)).join("") : '<p class="muted">関連疾患グラフにはまだ候補がありません。</p>'}
      </div>
      <div class="section">
        <strong>出典</strong>
        ${card?.evidence?.summary ? `<p class="warning">${escapeHtml(card.evidence.summary)}</p>` : ""}
        ${references(card?.references || [])}
      </div>
    `;
    bindRelatedDiseaseButtons();
  }

  function evidenceBlock(title, items, relation) {
    if (!items.length) return "";
    return `
      <div class="evidence-block">
        <div class="evidence-title ${relation}">${escapeHtml(title)}</div>
        ${items.map((item) => `
          <div class="finding ${relation}">
            <strong>${escapeHtml(findingLabel(item))}</strong>
            <div>${escapeHtml(item.finding_text || "")}</div>
            <div class="muted">${escapeHtml(item.modality)} / ${escapeHtml(item.acquisition_code)} / weight ${escapeHtml(item.diagnostic_weight ?? "")} / ${formatScore(item.score)}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function graphEdge(edge, diseaseId) {
    const otherId = edge.source_disease_id === diseaseId ? edge.target_disease_id : edge.source_disease_id;
    const shared = (edge.shared_findings || []).map((item) => findingLabel(item)).join(", ");
    return `
      <button type="button" class="graph-item" data-disease-id="${escapeHtml(otherId)}">
        <strong>${escapeHtml(diseaseName(otherId))}</strong>
        <div class="muted">similarity ${escapeHtml(edge.similarity_score ?? "")}</div>
        <div>共有所見: ${escapeHtml(shared || "なし")}</div>
      </button>
    `;
  }

  function allImagingFindings(card) {
    if (!card?.imaging) return "";
    const ctGroups = card.imaging.ct?.findings_by_phase || [];
    const mriGroups = card.imaging.mri?.findings_by_sequence || [];
    const ctCount = ctGroups.reduce((sum, group) => sum + (group.findings || []).length, 0);
    const mriCount = mriGroups.reduce((sum, group) => sum + (group.findings || []).length, 0);
    if (!ctCount && !mriCount) return "";
    return `
      <div class="section">
        <strong>CT/MRI所見一覧</strong>
        ${card.imaging.ct?.summary ? `<p class="muted">${escapeHtml(card.imaging.ct.summary)}</p>` : ""}
        ${imagingGroups("CT", ctGroups)}
        ${card.imaging.mri?.summary ? `<p class="muted">${escapeHtml(card.imaging.mri.summary)}</p>` : ""}
        ${imagingGroups("MRI", mriGroups)}
      </div>
    `;
  }

  function imagingGroups(modality, groups) {
    const nonEmpty = (groups || []).filter((group) => (group.findings || []).length);
    if (!nonEmpty.length) return "";
    return `
      <div class="imaging-modality">
        <div class="imaging-modality-title">${escapeHtml(modality)}</div>
        ${nonEmpty.map((group) => {
          const code = modality === "CT" ? group.phase?.code : group.sequence?.code;
          return `
            <details class="imaging-group" open>
              <summary>${escapeHtml(sequenceLabel(code))} <span class="muted">${escapeHtml(code || "")}</span></summary>
              ${(group.findings || []).map((item) => imagingFinding(item)).join("")}
            </details>
          `;
        }).join("")}
      </div>
    `;
  }

  function imagingFinding(item) {
    return `
      <div class="finding imaging-finding">
        <strong>${escapeHtml(findingLabel(item))}</strong>
        <div>${escapeHtml(item.finding_text || "")}</div>
        <div class="muted">${escapeHtml(item.modality || "")} / ${escapeHtml(acquisitionCode(item))} / typicality ${escapeHtml(item.typicality || "")} / weight ${escapeHtml(item.diagnostic_weight ?? "")}</div>
        ${item.keywords?.length ? `<div class="keyword-row">${item.keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}</div>` : ""}
      </div>
    `;
  }

  function bindRelatedDiseaseButtons() {
    for (const button of el.details.querySelectorAll(".graph-item[data-disease-id]")) {
      button.addEventListener("click", async () => {
        const diseaseId = button.dataset.diseaseId;
        const summary = data.summaryIndex.find((item) => item.disease_id === diseaseId);
        if (!summary) return;
        selectedDiseaseId = diseaseId;
        await renderDetails({
          disease_id: diseaseId,
          disease_name: summary.disease_name,
          review_status: summary.review_status,
          demographics: summary.demographics,
          evidence: []
        });
        renderResults(lastResults);
        el.details.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    }
  }

  function references(items) {
    if (!items.length) return '<p class="muted">出典未登録</p>';
    return `<ul class="reference-list">${items.slice(0, 8).map((ref) => `
      <li>${escapeHtml(ref.title || ref.source_id || "")} ${ref.url ? `<a href="${escapeHtml(ref.url)}" target="_blank" rel="noopener">link</a>` : ""}</li>
    `).join("")}</ul>`;
  }

  function section(title, body) {
    return `<div class="section"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body || "")}</p></div>`;
  }

  function findingBadge(item, relation) {
    const prefix = relation === "support" ? "加点" : relation === "conflict" ? "減点" : "一致";
    return `<span class="match ${relation}">${prefix}: ${escapeHtml(findingLabel(item))}</span>`;
  }

  function adjustmentBadge(adjustment) {
    if (!adjustment?.label) return "";
    const klass = adjustment.score > 0 ? "adjust-positive" : adjustment.score < 0 ? "adjust-negative" : "sex";
    return `<span class="match ${klass}">${escapeHtml(adjustment.label)}</span>`;
  }

  function adjustmentText(adjustment) {
    if (!adjustment?.label) return "";
    const klass = adjustment.score > 0 ? "support-text" : adjustment.score < 0 ? "conflict-text" : "muted";
    return `<p class="${klass}">補正: ${escapeHtml(adjustment.label)}</p>`;
  }

  function reviewBadge(status) {
    if (!status || status === "approved") return "";
    return `<span class="review-badge">${escapeHtml(status)}</span>`;
  }

  function resetDetails() {
    selectedDiseaseId = "";
    el.details.className = "details empty";
    el.details.textContent = data ? "候補を選択してください。" : "先に .rddx を読み込んでください。";
  }

  function relatedEdges(diseaseId) {
    return (data?.differentialGraph?.edges || [])
      .filter((edge) => edge.source_disease_id === diseaseId || edge.target_disease_id === diseaseId)
      .sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0))
      .slice(0, 6);
  }

  function diseaseName(id) {
    const item = data.summaryIndex.find((x) => x.disease_id === id);
    return displayDiseaseName(item || { disease_id: id });
  }

  function displayDiseaseName(item) {
    const ja = item?.disease_name?.ja || "";
    const en = item?.disease_name?.en || "";
    return readable(ja) ? ja : en || item?.disease_id || "";
  }

  function findingLabel(item) {
    const ja = item?.canonical_label?.ja || "";
    const en = item?.canonical_label?.en || "";
    if (readable(ja)) return ja;
    if (en) return en;
    const concept = data?.dictionaries?.findingConcepts?.[item?.finding_code];
    const conceptJa = concept?.canonical_label?.ja || "";
    const conceptEn = concept?.canonical_label?.en || "";
    return readable(conceptJa) ? conceptJa : conceptEn || item?.finding_code || "";
  }

  function acquisitionCode(item) {
    return item?.acquisition_code || item?.acquisition?.code || "";
  }

  function sequenceLabel(code) {
    const sequence = data?.dictionaries?.sequenceMap?.[code];
    const phase = data?.dictionaries?.phaseMap?.[code];
    return sequence?.label?.ja || sequence?.label?.en || phase?.label?.ja || phase?.label?.en || code || "";
  }

  function demographicsText(d) {
    if (!d) return "未登録";
    const sex = sexLabel(d.sex?.predilection);
    const age = d.age?.typical_min != null && d.age?.typical_max != null ? `${d.age.typical_min}-${d.age.typical_max}歳` : "";
    const peak = d.age?.peak_decade ? `peak ${d.age.peak_decade}` : "";
    return [sex, age, peak].filter(Boolean).join(" / ") || "未登録";
  }

  function sexLabel(value) {
    return {
      female_only: "女性のみ",
      female_predominant: "女性に多い",
      no_sex_predilection: "性差なし",
      male_predominant: "男性に多い",
      male_only: "男性のみ",
      unknown: "性差不明"
    }[value] || value || "性差不明";
  }

  function renderSexButtons() {
    for (const button of el.sexButtons) button.classList.toggle("active", button.dataset.sex === selectedSex);
  }

  function renderAgeButtons() {
    for (const button of el.ageButtons) button.classList.toggle("active", button.dataset.age === selectedAge);
  }

  function renderRegionFilters() {
    if (!el.regionFilters) return;
    el.regionFilters.innerHTML = "";
    for (const group of REGION_FILTER_GROUPS) {
      const details = document.createElement("details");
      details.className = "region-panel";
      details.open = group.open || group.items.some(([, value]) => value === selectedRegion);
      details.innerHTML = `<summary>${escapeHtml(group.title)}</summary>`;
      const row = document.createElement("div");
      row.className = "region-row";
      for (const [label, value] of group.items) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `region-option${value === selectedRegion ? " active" : ""}`;
        button.dataset.region = value;
        button.textContent = label;
        button.disabled = !data;
        button.addEventListener("click", () => {
          selectedRegion = value;
          renderRegionFilters();
          runSearch();
        });
        row.appendChild(button);
      }
      details.appendChild(row);
      el.regionFilters.appendChild(details);
    }
    el.regionButtons = Array.from(el.regionFilters.querySelectorAll(".region-option"));
  }

  function renderRegionButtons() {
    for (const button of el.regionButtons) button.classList.toggle("active", button.dataset.region === selectedRegion);
  }

  function regionFilter(value) {
    for (const group of REGION_FILTER_GROUPS) {
      for (const [label, id, terms] of group.items) {
        if (id === value) return { label, id, terms };
      }
    }
    return null;
  }

  function compareVersion(a, b) {
    const aa = String(a).split(".").map(Number);
    const bb = String(b).split(".").map(Number);
    for (let i = 0; i < Math.max(aa.length, bb.length); i += 1) {
      const av = aa[i] || 0;
      const bv = bb[i] || 0;
      if (av !== bv) return av > bv ? 1 : -1;
    }
    return 0;
  }

  function formatDate(value) {
    if (!value) return "不明";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("ja-JP");
  }

  function formatScore(value) {
    const n = Number(value || 0);
    return `${n > 0 ? "+" : ""}${n.toFixed(1)}`;
  }

  function setStatus(message) {
    el.status.textContent = message;
  }

  function buildSuggestionItems() {
    if (!data) return [];
    const items = new Map();
    const add = (label, value, type = "keyword", priority = 1) => {
      const display = String(label || value || "").trim();
      const insertValue = String(value || label || "").trim();
      const normalized = norm(insertValue);
      if (!display || !insertValue || normalized.length < 3) return;
      if (normalized.startsWith("finding:")) return;
      if (isGenericSignalTerm(normalized)) return;
      const existing = items.get(normalized);
      if (!existing || priority > existing.priority) {
        items.set(normalized, { label: display, value: insertValue, type, priority });
      }
    };

    for (const [id, concept] of Object.entries(data.dictionaries.findingConcepts || {})) {
      add(concept?.canonical_label?.ja, concept?.canonical_label?.ja, "finding", 5);
      add(concept?.canonical_label?.en, concept?.canonical_label?.en, "finding", 5);
      for (const list of Object.values(concept?.synonyms || {})) {
        for (const synonym of list || []) add(synonym, synonym, "synonym", 4);
      }
      for (const token of concept?.tokens || []) add(token, token, "keyword", 2);
      add(id, concept?.canonical_label?.en || id, "finding", 1);
    }

    for (const [code, sequence] of Object.entries(data.dictionaries.sequenceMap || {})) {
      add(sequence?.label?.ja, code, "sequence", 3);
      add(sequence?.label?.en, code, "sequence", 3);
      for (const synonym of sequence?.synonyms || []) add(synonym, synonym, "sequence", 3);
    }

    for (const [code, phase] of Object.entries(data.dictionaries.phaseMap || {})) {
      add(phase?.label?.ja, code, "ct", 3);
      add(phase?.label?.en, code, "ct", 3);
      for (const synonym of phase?.synonyms || []) add(synonym, synonym, "ct", 3);
    }

    for (const item of data.searchIndex || []) {
      add(item.finding_text, item.finding_text, "finding", 2);
      add(item.canonical_label?.ja, item.canonical_label?.ja, "finding", 3);
      add(item.canonical_label?.en, item.canonical_label?.en, "finding", 3);
      for (const keyword of item.keywords || []) add(keyword, keyword, "keyword", 2);
      for (const token of item.tokens || []) add(token, token, "keyword", 1);
    }

    return Array.from(items.values()).sort((a, b) =>
      b.priority - a.priority || a.label.length - b.label.length || a.label.localeCompare(b.label, "ja")
    );
  }

  function renderSuggestions() {
    if (!el.suggestions) return;
    const fragment = activeQueryFragment();
    if (!data || !fragment || fragment.length < 2) {
      hideSuggestions();
      return;
    }
    const normalized = norm(fragment);
    const matches = suggestionItems
      .filter((item) => {
        const label = norm(item.label);
        const value = norm(item.value);
        return label.includes(normalized) || value.includes(normalized);
      })
      .slice(0, 8);
    if (!matches.length) {
      hideSuggestions();
      return;
    }
    el.suggestions.innerHTML = matches.map((item) => `
      <button type="button" class="suggestion" data-value="${escapeHtml(item.value)}">
        <span>${escapeHtml(item.label)}</span>
        <small>${escapeHtml(suggestionTypeLabel(item.type))}</small>
      </button>
    `).join("");
    el.suggestions.hidden = false;
  }

  function hideSuggestions() {
    if (!el.suggestions) return;
    el.suggestions.hidden = true;
    el.suggestions.innerHTML = "";
  }

  function activeQueryFragment() {
    const value = el.query.value || "";
    const cursor = el.query.selectionStart ?? value.length;
    const before = value.slice(0, cursor);
    const parts = before.split(/[,\s、　]+/);
    return parts[parts.length - 1] || "";
  }

  function applySuggestion(value) {
    const current = el.query.value || "";
    const cursor = el.query.selectionStart ?? current.length;
    const before = current.slice(0, cursor);
    const after = current.slice(cursor);
    const match = before.match(/^(.*?)([^,\s、　]*)$/);
    const prefix = match?.[1] || "";
    const separator = prefix && !/[,\s、　]$/.test(prefix) ? " " : "";
    el.query.value = `${prefix}${separator}${value} ${after}`.replace(/\s+/g, " ").trimStart();
    el.query.focus();
    hideSuggestions();
    runSearch();
  }

  function suggestionTypeLabel(type) {
    return {
      finding: "finding",
      synonym: "synonym",
      sequence: "sequence",
      ct: "CT",
      keyword: "keyword"
    }[type] || type || "";
  }

  function norm(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function readable(value) {
    const text = String(value || "");
    if (!text) return false;
    const mojibakeMarks = (text.match(/[縺繧荳蜿鬮螟]/g) || []).length;
    return mojibakeMarks < Math.max(2, text.length / 5);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  el.packInput.addEventListener("change", async () => {
    const file = el.packInput.files?.[0];
    if (!file) return;
    try {
      await importPack(file);
    } catch (error) {
      setStatus("読込失敗");
      alert(error.message);
    } finally {
      el.packInput.value = "";
    }
  });

  el.clearPackButton.addEventListener("click", () => clearStoredPack().catch((error) => alert(error.message)));
  el.query.addEventListener("input", () => {
    renderSuggestions();
    runSearch();
  });
  el.query.addEventListener("focus", renderSuggestions);
  el.clearButton.addEventListener("click", () => {
    el.query.value = "";
    selectedChips = new Map();
    selectedSex = "";
    selectedAge = "";
    selectedRegion = "";
    hideSuggestions();
    renderAll();
  });
  el.suggestions?.addEventListener("pointerdown", (event) => {
    const button = event.target.closest(".suggestion");
    if (!button) return;
    event.preventDefault();
    applySuggestion(button.dataset.value || "");
  });
  document.addEventListener("pointerdown", (event) => {
    if (event.target === el.query || el.suggestions?.contains(event.target)) return;
    hideSuggestions();
  });
  for (const button of el.sexButtons) {
    button.addEventListener("click", () => {
      selectedSex = button.dataset.sex || "";
      renderSexButtons();
      runSearch();
    });
  }
  for (const button of el.ageButtons) {
    button.addEventListener("click", () => {
      selectedAge = button.dataset.age || "";
      renderAgeButtons();
      runSearch();
    });
  }
  for (const button of el.regionButtons) {
    button.addEventListener("click", () => {
      selectedRegion = button.dataset.region || "";
      renderRegionButtons();
      runSearch();
    });
  }

  async function init() {
    try {
      db = await openDb();
      data = await loadData();
      suggestionItems = buildSuggestionItems();
      enableSearch(Boolean(data));
      renderAll();
      if (data) setStatus(`${data.searchIndex.length} findings`);
    } catch (error) {
      setStatus("初期化失敗");
      el.packMeta.textContent = error.message;
    }

    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  init();
})();
