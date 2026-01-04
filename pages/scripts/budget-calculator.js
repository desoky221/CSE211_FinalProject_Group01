(() => {
  "use strict";

  const DISTANCE_TO_CAPITAL_KM = {
    Cairo: 0,
    Giza: 20,
    Alexandria: 220,
    "Port Said": 200,
    Suez: 140,
    Ismailia: 120,
    Sharqia: 80,
    Dakahlia: 150,
    Gharbia: 120,
    "Kafr El Sheikh": 200,
    Beheira: 180,
    Minya: 250,
    Assiut: 375,
    Sohag: 460,
    Qena: 600,
    Luxor: 670,
    Aswan: 880,
  };

  function toInt(n, def = 0) {
    const x = Number(n);
    return Number.isFinite(x) ? Math.trunc(x) : def;
  }

  function money2(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function moneyIntSuffix(n) {
    return `${Math.round(Number(n))}$`;
  }

  // price = 5 + 0.01 * distance
  function transportPrice(fromGov) {
    const key = String(fromGov || "").trim();
    const km = DISTANCE_TO_CAPITAL_KM[key] ?? 0;
    return Math.round(5 + 0.01 * km); // integer
  }

  window.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#budgetForm");
    if (!form) return;

    const ticketPrice = Number(form.dataset.ticketPrice) || 5;

    const ticketsCount = document.querySelector("#ticketsCount");
    const ticketsTotalField = document.querySelector("#ticketsTotalField");

    const useYes = document.querySelector("#useTransportYes");
    const useNo = document.querySelector("#useTransportNo");
    const fromGov = document.querySelector("#fromGovernorate");
    const transportCost = document.querySelector("#transportCost");

    const foodCost = document.querySelector("#foodCost");
    const accommodationTotal = document.querySelector("#accommodationTotal");

    const grandTotalField = document.querySelector("#grandTotalField");
    const grandTotalSpan = document.querySelector("#grandTotal");
    const resultsBox = document.querySelector("#budgetResults");

    function updateInline() {
      const count = Math.max(1, toInt(ticketsCount?.value, 1));
      const ticketsTotal = count * ticketPrice;
      if (ticketsTotalField) ticketsTotalField.value = `Total: ${money2(ticketsTotal)}`;

      const accom = Math.max(0, Number(foodCost?.value || 0));
      if (accommodationTotal) accommodationTotal.textContent = money2(accom);

      const useTransport = !!useYes?.checked;
      if (fromGov) fromGov.disabled = !useTransport;

      let tCost = 0;
      if (useTransport) tCost = transportPrice(fromGov?.value);

      // show like: 20$
      if (transportCost) transportCost.value = moneyIntSuffix(tCost);
    }

    function calculateTotal(e) {
      e.preventDefault();

      const count = Math.max(1, toInt(ticketsCount?.value, 1));
      const ticketsTotal = count * ticketPrice;

      const accom = Math.max(0, Number(foodCost?.value || 0));

      const useTransport = !!useYes?.checked;
      const tCost = useTransport ? transportPrice(fromGov?.value) : 0;

      const total = ticketsTotal + accom + tCost;

      if (grandTotalField) grandTotalField.value = money2(total);
      if (grandTotalSpan) grandTotalSpan.textContent = money2(total);
      if (resultsBox) resultsBox.hidden = false;
    }

    // events
    ticketsCount?.addEventListener("input", updateInline);
    foodCost?.addEventListener("change", updateInline);

    useYes?.addEventListener("change", updateInline);
    useNo?.addEventListener("change", updateInline);
    fromGov?.addEventListener("change", updateInline);

    form.addEventListener("submit", calculateTotal);
    form.addEventListener("reset", () => {
      setTimeout(() => {
        if (resultsBox) resultsBox.hidden = true;
        if (grandTotalField) grandTotalField.value = "$0.00";
        updateInline();
      }, 0);
    });

    // initial
    updateInline();
  });
})();
