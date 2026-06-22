(() => {
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
    status: document.getElementById("status"),
    packInput: document.getElementById("packInput"),
    clearPackButton: document.getElementById("clearPackButton"),
    packMeta: document.getElementById("packMeta"),
    sexButtons: Array.from(document.querySelectorAll(".sex-option")),
    ageButtons: Array.from(document.querySelectorAll(".age-option"))
  };

  const WEIGHTS = {
    supportBase: 14,
    diagnostic: 1.8,
    importance: 0.8,
    prevalence: 0.25,
    text: 1.4,
    conflictBase: 12,
    sex: {
      female: { female_only: 6, female_predominant: 2, no_sex_predilection: 0, male_predominant: -2, male_only: -14, unknown: 0 },
      male: { female_only: -14, female_predominant: -2, no_sex_predilection: 0, male_predominant: 2, male_only: 6, unknown: 0 }
    },
    age: { strong: 3, partial: 1, mismatch: -3, unknown: 0 }
  };

  const AGE_GROUPS = {
    child: { label: "小児", min: 0, max: 14 },
    young: { label: "若年", min: 15, max: 39 },
    middle: { label: "中年", min: 40, max: 64 },
    elderly: { label: "高齢", min: 65, max: 120 }
  };

  const CHIPS = [
    { title: "MRI T1WI", items: [["T1低信号", "T1 hypointensity"], ["T1軽度低信号", "mild T1 hypointensity"], ["T1等信号", "T1 isointensity"], ["T1軽度高信号", "mild T1 hyperintensity"], ["T1高信号", "T1 hyperintensity"]] },
    { title: "MRI T2WI", items: [["T2低信号", "T2 hypointensity"], ["T2軽度低信号", "mild T2 hypointensity"], ["T2等信号", "T2 isointensity"], ["T2軽度高信号", "mild T2 hyperintensity"], ["T2高信号", "T2 hyperintensity"], ["T2 shading", "T2 shading"]] },
    { title: "MRI DWI / ADC", items: [["DWI高信号", "DWI hyperintensity"], ["DWI等信号", "DWI isointensity"], ["拡散制限あり", "restricted diffusion"], ["拡散制限なし", "no diffusion restriction"], ["ADC低値", "low ADC"], ["ADC高値", "high ADC"]] },
    { title: "造影", items: [["造影効果なし", "no enhancement"], ["軽度造影", "mild enhancement"], ["強い均一造影", "avid homogeneous enhancement"], ["リング状造影", "ring enhancement"], ["open-ring enhancement", "open-ring enhancement"]] },
    { title: "CT", items: [["低吸収", "hypoattenuation"], ["軽度低吸収", "mild hypoattenuation"], ["等吸収", "isoattenuation"], ["軽度高吸収", "mild hyperattenuation"], ["高吸収", "hyperattenuation"], ["脂肪吸収", "fat attenuation"], ["石灰化", "calcification"]] },
    { title: "形態・部位", items: [["extra-axial mass", "extra-axial mass"], ["dural tail", "dural tail"], ["vasogenic edema", "vasogenic edema"], ["multilocular cystic mass", "multilocular cystic mass"], ["mural nodule", "mural nodule"], ["fat-containing lesion", "fat-containing lesion"]] }
  ];

  let db = null;
  let data = null;
  let selectedChips = new Map();
  let selectedSex = "";
  let selectedAge = "";
  let selectedDiseaseId = "";
  let lastResults = [];

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

  async function clearStores() {
    for (const name of ["meta", "dictionaries", "search", "summary", "graph", "diseases"]) await idbClear(name);
  }

  async function clearStoredPack() {
    if (!confirm("このiPhone内に保存した検索データを削除しますか？")) return;
    await clearStores();
    data = null;
    selectedDiseaseId = "";
    selectedChips = new Map();
    enableSearch(false);
    renderAll();
    setStatus("データ未読込");
  }

  function enableSearch(enabled) {
    el.query.disabled = !enabled;
    el.clearButton.disabled = !enabled;
    for (const button of [...el.sexButtons, ...el.ageButtons]) button.disabled = !enabled;
  }

  function renderAll() {
    renderPackMeta();
    renderChips();
    renderSexButtons();
    renderAgeButtons();
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
    el.chips.innerHTML = "";
    if (!data) {
      el.chips.innerHTML = '<div class="muted">.rddx 読み込み後に所見チップが使えます。</div>';
      return;
    }
    for (const group of CHIPS) {
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
      el.chips.appendChild(wrap);
    }
  }

  function runSearch() {
    if (!data) return renderResults([]);
    const query = buildQuery();
    if (!query.hasInput && !selectedSex && !selectedAge) return renderResults([]);

    const byDisease = new Map();
    for (const item of data.searchIndex) {
      const scored = scoreFinding(item, query);
      if (scored.score === 0) continue;
      const current = byDisease.get(item.disease_id) || {
        disease_id: item.disease_id,
        disease_name: item.disease_name,
        review_status: item.review_status,
        demographics: item.demographics,
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

    lastResults = Array.from(byDisease.values()).filter((x) => x.score !== 0).sort((a, b) => b.score - a.score).slice(0, 30);
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
        for (const token of concept?.tokens || []) textTerms.add(norm(token));
      }
    }
    return { hasInput: rawTerms.size > 0, conceptIds, textTerms: Array.from(textTerms).filter(Boolean) };
  }

  function conceptIdsFromTerm(term) {
    const found = new Set();
    const concepts = data.dictionaries.findingConcepts || {};
    const synonyms = data.dictionaries.synonymMap || {};
    for (const [synonym, ids] of Object.entries(synonyms)) {
      const key = norm(synonym);
      if (key && (key === term || key.includes(term) || term.includes(key))) for (const id of ids) found.add(id);
    }
    for (const [id, concept] of Object.entries(concepts)) {
      const labelEn = norm(concept?.canonical_label?.en);
      const labelJa = norm(concept?.canonical_label?.ja);
      if (id === term || labelEn.includes(term) || labelJa.includes(term) || term.includes(labelEn)) found.add(id);
      for (const token of concept?.tokens || []) {
        const t = norm(token);
        if (t && (t === term || t.includes(term) || term.includes(t))) found.add(id);
      }
    }
    return Array.from(found);
  }

  function scoreFinding(item, query) {
    if (!query.hasInput) return { score: 0, relation: "context" };
    const relation = relationFor(item.finding_code, query.conceptIds);
    const textScore = textMatchScore(item, query.textTerms);
    if (relation === "support") {
      return { relation, score: WEIGHTS.supportBase + (item.diagnostic_weight || 0) * WEIGHTS.diagnostic + (item.contextual_importance_rank || 0) * WEIGHTS.importance + (item.prevalence_rank || 0) * WEIGHTS.prevalence + textScore * WEIGHTS.text };
    }
    if (relation === "conflict") {
      return { relation, score: -1 * (WEIGHTS.conflictBase + (item.diagnostic_weight || 0) * WEIGHTS.diagnostic) };
    }
    if (!textScore) return { score: 0, relation: "context" };
    return { relation: "context", score: textScore * WEIGHTS.text + (item.prevalence_rank || 0) * WEIGHTS.prevalence };
  }

  function relationFor(findingCode, requestedConcepts) {
    if (requestedConcepts.has(findingCode)) return "support";
    for (const id of requestedConcepts) {
      const opposites = data.dictionaries.findingConcepts[id]?.opposites || [];
      if (opposites.includes(findingCode)) return "conflict";
    }
    return "context";
  }

  function textMatchScore(item, terms) {
    const haystack = norm([item.finding_code, item.canonical_label?.en, item.canonical_label?.ja, item.finding_text, item.modality, item.acquisition_code, item.target, ...Object.values(item.modifiers || {}), ...(item.tokens || [])].filter(Boolean).join(" "));
    let score = 0;
    for (const term of terms) {
      if (!term || term.length < 2 || term.startsWith("finding:")) continue;
      if (haystack.includes(term)) score += term.length >= 4 ? 2 : 1;
    }
    return score;
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
    const score = ratio >= 0.5 ? WEIGHTS.age.strong : ratio > 0 ? WEIGHTS.age.partial : WEIGHTS.age.mismatch;
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
      button.innerHTML = `<div class="result-title"><span>${escapeHtml(displayDiseaseName(result))} ${reviewBadge(result.review_status)}</span><span class="score">${result.score.toFixed(1)}</span></div><div class="muted">${escapeHtml(result.disease_name?.en || result.disease_id)}</div><div class="match-list">${support.slice(0, 3).map((x) => findingBadge(x, "support")).join("")}${conflict.slice(0, 3).map((x) => findingBadge(x, "conflict")).join("")}${adjustmentBadge(result.sex_adjustment)}${adjustmentBadge(result.age_adjustment)}${context.slice(0, 2).map((x) => findingBadge(x, "context")).join("")}</div>`;
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
    const support = result.evidence.filter((x) => x.relation === "support");
    const conflict = result.evidence.filter((x) => x.relation === "conflict");
    const context = result.evidence.filter((x) => x.relation === "context");
    el.details.className = "details";
    el.details.innerHTML = `<h3>${escapeHtml(displayDiseaseName(result))}</h3><p class="muted">${escapeHtml(card?.disease_name?.en || result.disease_id)} ${reviewBadge(card?.review?.status || result.review_status)}</p>${section("概要", card?.clinical?.overview || card?.frequency?.summary || "未登録")}${section("治療", card?.clinical?.treatment || "未登録")}${section("頻度", `${card?.frequency?.label || "unknown"} / ${card?.frequency?.summary || ""}`)}${section("好発", demographicsText(card?.demographics || result.demographics))}${adjustmentText(result.sex_adjustment)}${adjustmentText(result.age_adjustment)}<div class="section"><strong>検索所見との関係</strong>${evidenceBlock("加点", support, "support")}${evidenceBlock("減点", conflict, "conflict")}${evidenceBlock("文脈一致", context, "context")}</div><div class="section"><strong>関連鑑別</strong>${related.length ? related.map((edge) => graphEdge(edge, result.disease_id)).join("") : '<p class="muted">関連疾患グラフにはまだ候補がありません。</p>'}</div><div class="section"><strong>出典</strong><p class="warning">${escapeHtml(card?.evidence?.summary || "")}</p>${references(card?.references || [])}</div>`;
  }

  function evidenceBlock(title, items, relation) {
    if (!items.length) return "";
    return `<div class="evidence-block"><div class="evidence-title ${relation}">${escapeHtml(title)}</div>${items.map((item) => `<div class="finding ${relation}"><strong>${escapeHtml(findingLabel(item))}</strong><div>${escapeHtml(item.finding_text || "")}</div><div class="muted">${escapeHtml(item.modality)} / ${escapeHtml(item.acquisition_code)} / weight ${escapeHtml(item.diagnostic_weight ?? "")} / ${formatScore(item.score)}</div></div>`).join("")}</div>`;
  }

  function graphEdge(edge, diseaseId) {
    const otherId = edge.source_disease_id === diseaseId ? edge.target_disease_id : edge.source_disease_id;
    const shared = (edge.shared_findings || []).map((item) => findingLabel(item)).join(", ");
    return `<div class="graph-item"><strong>${escapeHtml(diseaseName(otherId))}</strong><div class="muted">similarity ${escapeHtml(edge.similarity_score ?? "")}</div><div>共有所見: ${escapeHtml(shared || "なし")}</div></div>`;
  }

  function references(items) {
    if (!items.length) return '<p class="muted">出典未登録</p>';
    return `<ul class="reference-list">${items.slice(0, 8).map((ref) => `<li>${escapeHtml(ref.title || ref.source_id || "")} ${ref.url ? `<a href="${escapeHtml(ref.url)}" target="_blank" rel="noopener">link</a>` : ""}</li>`).join("")}</ul>`;
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
    return (data?.differentialGraph?.edges || []).filter((edge) => edge.source_disease_id === diseaseId || edge.target_disease_id === diseaseId).sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0)).slice(0, 6);
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
    return readable(ja) ? ja : en || item?.finding_code || "";
  }

  function demographicsText(d) {
    if (!d) return "未登録";
    const sex = sexLabel(d.sex?.predilection);
    const age = d.age?.typical_min != null && d.age?.typical_max != null ? `${d.age.typical_min}-${d.age.typical_max}歳` : "";
    const peak = d.age?.peak_decade ? `peak ${d.age.peak_decade}` : "";
    return [sex, age, peak].filter(Boolean).join(" / ") || "未登録";
  }

  function sexLabel(value) {
    return { female_only: "女性のみ", female_predominant: "女性に多い", no_sex_predilection: "性差なし", male_predominant: "男性に多い", male_only: "男性のみ", unknown: "性差不明" }[value] || value || "性差不明";
  }

  function renderSexButtons() {
    for (const button of el.sexButtons) button.classList.toggle("active", button.dataset.sex === selectedSex);
  }

  function renderAgeButtons() {
    for (const button of el.ageButtons) button.classList.toggle("active", button.dataset.age === selectedAge);
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

  function setStatus(message) { el.status.textContent = message; }
  function norm(value) { return String(value || "").toLowerCase().replace(/\s+/g, " ").trim(); }
  function readable(value) {
    const text = String(value || "");
    if (!text) return false;
    const marks = (text.match(/[縺繧荳蜿鬮螟]/g) || []).length;
    return marks < Math.max(2, text.length / 5);
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  el.packInput.addEventListener("change", async () => {
    const file = el.packInput.files?.[0];
    if (!file) return;
    try { await importPack(file); }
    catch (error) { setStatus("読込失敗"); alert(error.message); }
    finally { el.packInput.value = ""; }
  });
  el.clearPackButton.addEventListener("click", () => clearStoredPack().catch((error) => alert(error.message)));
  el.query.addEventListener("input", runSearch);
  el.clearButton.addEventListener("click", () => { el.query.value = ""; selectedChips = new Map(); selectedSex = ""; selectedAge = ""; renderAll(); });
  for (const button of el.sexButtons) button.addEventListener("click", () => { selectedSex = button.dataset.sex || ""; renderSexButtons(); runSearch(); });
  for (const button of el.ageButtons) button.addEventListener("click", () => { selectedAge = button.dataset.age || ""; renderAgeButtons(); runSearch(); });

  async function init() {
    try {
      db = await openDb();
      data = await loadData();
      enableSearch(Boolean(data));
      renderAll();
      if (data) setStatus(`${data.searchIndex.length} findings`);
    } catch (error) {
      setStatus("初期化失敗");
      el.packMeta.textContent = error.message;
    }
    if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  init();
})();
