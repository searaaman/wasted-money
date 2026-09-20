(function () {
  "use strict";

  const CR = 1e7;

  const caseSelect = document.getElementById("caseSelect");
  const lossValue = document.getElementById("lossValue");
  const lossUsd = document.getElementById("lossUsd");
  const infoIcon = document.getElementById("infoIcon");
  const itemsGrid = document.getElementById("itemsGrid");
  const corruptionValueStat = document.getElementById("corruptionValueStat");
  const totalValue = document.getElementById("totalValue");
  const ctaBtn = document.getElementById("ctaBtn");
  const ctaHint = document.getElementById("ctaHint");

  const selectionView = document.getElementById("selectionView");
  const impactView = document.getElementById("impactView");
  const backBtn = document.getElementById("backBtn");
  const restartBtn = document.getElementById("restartBtn");
  const impactGrid = document.getElementById("impactGrid");
  const impactBannerImg = document.getElementById("impactBannerImg");
  const impactAmount = document.getElementById("impactAmount");
  const impactAmountInline = document.getElementById("impactAmountInline");
  const impactUsd = document.getElementById("impactUsd");
  const peopleBenefited = document.getElementById("peopleBenefited");

  let activeCase = CASES[0];
  let counts = {}; // item id -> count

  function crFormat(rupees) {
    return "₹" + (rupees / 1e7).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " Crore";
  }

  function countFormat(n) {
    return Math.round(n).toLocaleString("en-IN");
  }

  function renderCaseOptions() {
    caseSelect.innerHTML = CASES.map(
      (c) => `<option value="${c.id}">${c.icon} ${c.name}</option>`
    ).join("");
    caseSelect.addEventListener("change", () => {
      activeCase = CASES.find((c) => c.id === caseSelect.value);
      updateCaseDisplay();
      updateSummary();
    });
    updateCaseDisplay();
  }

  function updateCaseDisplay() {
    lossValue.textContent = crFormat(activeCase.amount);
    lossUsd.textContent = "(≈ " + activeCase.usdApprox + ")";
    infoIcon.href = activeCase.source;
    infoIcon.title = activeCase.statusLabel + " — source: " + activeCase.source;
  }

  function renderItems() {
    itemsGrid.innerHTML = "";
    BUILD_ITEMS.forEach((item) => {
      const card = document.createElement("div");
      card.className = "item-card";
      card.dataset.id = item.id;
      card.innerHTML = `
        <img class="item-photo" src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="item-body">
          <span class="item-name">${item.name}</span>
          <span class="item-cost">${item.costLabel}</span>
          <span class="item-desc">${item.desc}</span>
          <div class="item-controls">
            <button type="button" class="qty-btn minus" aria-label="Decrease">−</button>
            <input type="text" inputmode="numeric" class="qty-input" value="0" aria-label="${item.name} quantity">
            <button type="button" class="qty-btn plus" aria-label="Increase">+</button>
          </div>
        </div>
      `;
      const minus = card.querySelector(".minus");
      const plus = card.querySelector(".plus");
      const input = card.querySelector(".qty-input");

      minus.addEventListener("click", () => setCount(item.id, (counts[item.id] || 0) - 1));
      plus.addEventListener("click", () => setCount(item.id, (counts[item.id] || 0) + 1));
      input.addEventListener("change", () => {
        const n = Math.max(0, Math.floor(Number(input.value) || 0));
        setCount(item.id, n);
      });

      itemsGrid.appendChild(card);
    });
  }

  function setCount(id, n) {
    counts[id] = Math.max(0, n);
    updateSummary();
  }

  function updateSummary() {
    let selected = 0;
    let total = 0;

    BUILD_ITEMS.forEach((item) => {
      const count = counts[item.id] || 0;
      const card = itemsGrid.querySelector(`.item-card[data-id="${item.id}"]`);
      if (!card) return;
      card.querySelector(".qty-input").value = count;
      card.querySelector(".minus").disabled = count <= 0;
      card.classList.toggle("is-active", count > 0);
      if (count > 0) selected += 1;
      total += count * item.cost;
    });

    corruptionValueStat.textContent = crFormat(activeCase.amount);
    totalValue.textContent = crFormat(total);

    const hasSelection = selected > 0;
    ctaBtn.disabled = !hasSelection;
    ctaHint.textContent = hasSelection
      ? `${crFormat(total)} of ${crFormat(activeCase.amount)} allocated`
      : "Select one or more items to continue";
  }

  // ---------- Impact view ----------
  // The 8 categories are a fixed illustrative breakdown defined at
  // IMPACT_REFERENCE_AMOUNT and scaled proportionally to whichever case is
  // active, so quantities stay plausible instead of literal for every case.
  function renderImpactGrid() {
    const ratio = activeCase.amount / IMPACT_REFERENCE_AMOUNT;
    impactGrid.innerHTML = "";
    IMPACT_CATEGORIES.forEach((cat) => {
      const qty = Math.max(1, Math.round(cat.qty * ratio));
      const sub = cat.subN != null
        ? cat.subLabel.replace("{n}", countFormat(cat.subN * ratio))
        : cat.subLabel;
      const people = Math.max(1, Math.round(cat.peopleBenefited * ratio));

      const card = document.createElement("div");
      card.className = "impact-card";
      card.innerHTML = `
        <div class="impact-photo-wrap">
          <img class="impact-photo" src="${cat.img}" alt="${cat.badgeLabel}" loading="lazy">
          <span class="impact-badge">${cat.badgeIcon} ${cat.badgeLabel}</span>
        </div>
        <div class="impact-body">
          <span class="impact-title">${countFormat(qty)} ${cat.unitLabel}</span>
          <span class="impact-sub">${sub}</span>
          <span class="impact-desc">${cat.desc}</span>
          <div class="impact-people">
            <span class="mini-icon">👥</span>
            <span class="impact-people-count">${countFormat(people)}</span>
            <span class="impact-people-caption">${cat.peopleCaption}</span>
          </div>
        </div>
      `;
      impactGrid.appendChild(card);
    });
  }

  function showImpactView() {
    impactBannerImg.src = IMPACT_CATEGORIES[0].img;
    impactAmount.textContent = crFormat(activeCase.amount);
    impactAmountInline.textContent = crFormat(activeCase.amount);
    impactUsd.textContent = "(≈ " + activeCase.usdApprox + ")";
    const ratio = activeCase.amount / IMPACT_REFERENCE_AMOUNT;
    const people = IMPACT_REFERENCE_PEOPLE_BENEFITED * ratio;
    peopleBenefited.textContent = (people / CR).toLocaleString("en-IN", { maximumFractionDigits: 1 }) + " Crore+";

    renderImpactGrid();

    selectionView.hidden = true;
    impactView.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function showSelectionView() {
    impactView.hidden = true;
    selectionView.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  ctaBtn.addEventListener("click", () => {
    if (!ctaBtn.disabled) showImpactView();
  });
  backBtn.addEventListener("click", showSelectionView);
  restartBtn.addEventListener("click", () => {
    counts = {};
    updateSummary();
    showSelectionView();
  });

  renderCaseOptions();
  renderItems();
  updateSummary();
})();
