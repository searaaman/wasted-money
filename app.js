(function () {
  "use strict";

  const caseGrid = document.getElementById("caseGrid");
  const builder = document.getElementById("builder");
  const caseDetail = document.getElementById("caseDetail");
  const buildGrid = document.getElementById("buildGrid");
  const budgetCaseName = document.getElementById("budgetCaseName");
  const budgetRemaining = document.getElementById("budgetRemaining");
  const budgetFill = document.getElementById("budgetFill");
  const resetBtn = document.getElementById("resetBtn");
  const tally = document.getElementById("tally");
  const tallyList = document.getElementById("tallyList");

  let activeCase = null;
  let counts = {}; // build item id -> count

  const PICTOGRAM_CAP = 24; // render at most this many icon units per tile

  function iconSvg(path, cls) {
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  }

  function formatRupees(n) {
    // Indian digit grouping (##,##,###), no external lib needed.
    const rounded = Math.round(n);
    const isNeg = rounded < 0;
    let s = Math.abs(rounded).toString();
    let last3 = s.slice(-3);
    let rest = s.slice(0, -3);
    if (rest !== "") last3 = "," + last3;
    rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return (isNeg ? "-" : "") + "₹" + rest + last3;
  }

  function crFormat(rupees) {
    return (rupees / 1e7).toLocaleString("en-IN", { maximumFractionDigits: 1 }) + " crore";
  }

  function renderCaseGrid() {
    caseGrid.innerHTML = "";
    CASES.forEach((c) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "case-card";
      card.dataset.id = c.id;
      card.innerHTML = `
        ${iconSvg(c.icon, "case-card-icon")}
        <span class="status-pill" data-status="${c.status}">${c.statusLabel}</span>
        <span class="case-card-name">${c.name}</span>
        <span class="case-card-who">${c.party}</span>
        <span class="case-card-amount">${crFormat(c.amount)}</span>
      `;
      card.addEventListener("click", () => selectCase(c.id));
      caseGrid.appendChild(card);
    });
  }

  function selectCase(id) {
    activeCase = CASES.find((c) => c.id === id);
    counts = {};
    document.querySelectorAll(".case-card").forEach((el) => {
      el.classList.toggle("is-selected", el.dataset.id === id);
    });

    budgetCaseName.textContent = activeCase.name;
    caseDetail.innerHTML = `
      <div class="case-detail-head">
        ${iconSvg(activeCase.icon, "case-detail-icon")}
        <p class="case-detail-blurb">${activeCase.blurb}</p>
      </div>
      <a class="case-detail-source" href="${activeCase.source}" target="_blank" rel="noopener">${activeCase.sourceLabel} →</a>
    `;

    renderBuildGrid();
    updateBudget();
    builder.hidden = false;
    tally.hidden = true;
    builder.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function spentSoFar() {
    return BUILD_ITEMS.reduce((sum, item) => sum + (counts[item.id] || 0) * item.cost, 0);
  }

  function remaining() {
    return activeCase.amount - spentSoFar();
  }

  function renderBuildGrid() {
    buildGrid.innerHTML = "";
    BUILD_ITEMS.forEach((item) => {
      const tile = document.createElement("div");
      tile.className = "build-tile";
      tile.dataset.id = item.id;
      tile.style.setProperty("--tile-accent", item.color);
      tile.innerHTML = `
        <div class="build-tile-head">
          <span class="build-icon-badge" style="background:${item.color}2a; color:${item.color}">
            ${iconSvg(item.icon, "build-tile-icon")}
          </span>
          <div>
            <span class="build-tile-name">${item.name}</span>
            <span class="build-tile-cost">${item.costLabel}</span>
          </div>
        </div>
        <div class="pictogram" aria-hidden="true"></div>
        <span class="build-tile-note${item.sourced ? "" : " unverified"}">${item.sourced ? "" : "⚠ "}${item.note}</span>
        <div class="build-controls">
          <div class="stepper">
            <button type="button" class="step-minus" aria-label="Remove one">−</button>
            <span class="stepper-count">0</span>
            <button type="button" class="step-plus" aria-label="Add one">+</button>
          </div>
        </div>
      `;
      tile.querySelector(".step-plus").addEventListener("click", () => changeCount(item.id, 1));
      tile.querySelector(".step-minus").addEventListener("click", () => changeCount(item.id, -1));
      buildGrid.appendChild(tile);
    });
  }

  function changeCount(itemId, delta) {
    const item = BUILD_ITEMS.find((i) => i.id === itemId);
    const current = counts[itemId] || 0;
    const next = current + delta;
    if (next < 0) return;
    if (delta > 0 && next * item.cost > remaining() + current * item.cost) return; // can't afford
    counts[itemId] = next;
    updateBudget();
  }

  function updateBudget() {
    const rem = remaining();
    const pct = Math.max(0, Math.min(100, (rem / activeCase.amount) * 100));
    budgetRemaining.textContent = formatRupees(rem);
    budgetFill.style.width = pct + "%";
    budgetFill.style.background = rem <= 0 ? "var(--text-faint)" : "var(--positive)";

    BUILD_ITEMS.forEach((item) => {
      const tile = buildGrid.querySelector(`.build-tile[data-id="${item.id}"]`);
      if (!tile) return;
      const count = counts[item.id] || 0;
      tile.querySelector(".stepper-count").textContent = count;
      tile.querySelector(".step-minus").disabled = count <= 0;
      const canAffordOneMore = rem >= item.cost;
      tile.querySelector(".step-plus").disabled = !canAffordOneMore;

      const shown = Math.min(count, PICTOGRAM_CAP);
      const overflow = count - shown;
      const unit = `<span class="pictogram-unit" style="color:${item.color}">${iconSvg(item.icon, "")}</span>`;
      const units = new Array(shown).fill(unit).join("");
      const overflowLabel = overflow > 0 ? `<span class="pictogram-overflow">+${overflow.toLocaleString("en-IN")}</span>` : "";
      tile.querySelector(".pictogram").innerHTML = units + overflowLabel;
    });

    renderTally();
  }

  function renderTally() {
    const entries = BUILD_ITEMS.filter((i) => (counts[i.id] || 0) > 0);
    if (entries.length === 0) {
      tally.hidden = true;
      return;
    }
    tally.hidden = false;
    tallyList.innerHTML = entries
      .map((i) => {
        const n = counts[i.id];
        const plural = i.unit !== "km" && n !== 1 ? "s" : "";
        return `<li>${n.toLocaleString("en-IN")} × ${i.name}${plural}</li>`;
      })
      .join("");
  }

  resetBtn.addEventListener("click", () => {
    counts = {};
    updateBudget();
  });

  renderCaseGrid();
})();
