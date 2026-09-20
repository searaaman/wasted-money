(function () {
  "use strict";

  const caseSelect = document.getElementById("caseSelect");
  const lossValue = document.getElementById("lossValue");
  const lossUsd = document.getElementById("lossUsd");
  const infoIcon = document.getElementById("infoIcon");
  const itemsGrid = document.getElementById("itemsGrid");
  const selectedCount = document.getElementById("selectedCount");
  const totalValue = document.getElementById("totalValue");
  const ctaBtn = document.getElementById("ctaBtn");
  const ctaHint = document.getElementById("ctaHint");

  let activeCase = CASES[0];
  let counts = {}; // item id -> count

  function crFormat(rupees) {
    return "₹" + (rupees / 1e7).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " Crore";
  }

  function renderCaseOptions() {
    caseSelect.innerHTML = CASES.map(
      (c) => `<option value="${c.id}">${c.icon} ${c.name}</option>`
    ).join("");
    caseSelect.addEventListener("change", () => {
      activeCase = CASES.find((c) => c.id === caseSelect.value);
      updateCaseDisplay();
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

    selectedCount.textContent = selected;
    totalValue.textContent = crFormat(total);

    const hasSelection = selected > 0;
    ctaBtn.disabled = !hasSelection;
    ctaHint.textContent = hasSelection
      ? `${crFormat(total)} of ${crFormat(activeCase.amount)} allocated`
      : "Select one or more items to continue";
  }

  renderCaseOptions();
  renderItems();
  updateSummary();
})();
