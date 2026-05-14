import { tenders } from "./data.js";

const STATUS_LABELS = {
  open: { className: "status--open", text: "Teklif vermeye açık" },
  eval: { className: "status--eval", text: "Değerlendirme aşamasında" },
  signed: { className: "status--signed", text: "Sözleşme imzalanmış" },
};

const PARTIES_HEADINGS = {
  open: "Muhtemel katılımcılar",
  eval: "Katılımcılar ve muhtemel kazanan",
  signed: "Kazanan ve katılımcılar",
};

const FILTER_DEFS = [
  { key: "all", label: "Hepsi", tabClass: "" },
  { key: "open", label: "Teklif vermeye açık", tabClass: "filter-tab--open" },
  { key: "eval", label: "Değerlendirme aşamasında", tabClass: "filter-tab--eval" },
  { key: "signed", label: "Sözleşme imzalanmış", tabClass: "filter-tab--signed" },
];

const PANEL_ID = "tender-list";

let activeFilter = "all";

let lastFocusBeforeModal = null;
let modalTrapHandler = null;

function tenderDomSlug(ikn) {
  return String(ikn).replace(/[^a-zA-Z0-9_-]/g, "-");
}

function formatDateTR(iso) {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatTenderDateTime(t) {
  const datePart = formatDateTR(t.dateISO);
  const time = (t.timeLocal || "").trim();
  if (time) return `${datePart}, ${time}`;
  return datePart;
}

function escapeHtml(s) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(s).replace(/[&<>"']/g, (ch) => map[ch]);
}

/** Bağlaçlar küçük; kısa başlıklar (ürün adı, rol, sekme). Parantezli/ölçülü tokenlara dokunmaz. */
const TITLE_SMALL_WORDS = new Set([
  "ve",
  "ile",
  "veya",
  "ya",
  "da",
  "de",
  "ki",
  "için",
  "mı",
  "mi",
  "mu",
  "mü",
]);

function titleCaseTr(s) {
  if (s == null || s === "") return "";
  return String(s)
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word) return word;
      if (word.startsWith("(")) return word;
      if (/[=+]/.test(word) && /\d/.test(word)) return word;
      if (/^[([{]?[\d%./+-]/.test(word) || /^\d{2,}\//.test(word)) return word;
      const wLower = word.toLocaleLowerCase("tr-TR");
      if (TITLE_SMALL_WORDS.has(wLower)) return wLower;
      const lower = word.toLocaleLowerCase("tr-TR");
      return lower.charAt(0).toLocaleUpperCase("tr-TR") + lower.slice(1);
    })
    .join(" ");
}

function capitalizeFirstTr(str) {
  const lower = String(str).toLocaleLowerCase("tr-TR");
  const idx = lower.search(/[a-zğüşıöçı]/i);
  if (idx === -1) return lower;
  return (
    lower.slice(0, idx) +
    lower.charAt(idx).toLocaleUpperCase("tr-TR") +
    lower.slice(idx + 1)
  );
}

/** Uzun metin / ihale başlığı: yalnızca ilk harf büyük, Türkçe i/ı uyumu */
function sentenceCaseTr(s) {
  if (s == null || s === "") return "";
  return capitalizeFirstTr(String(s).trim());
}

function getTenderById(ikn) {
  return tenders.find((t) => t.ikn === ikn);
}

function getCounts() {
  const counts = { all: tenders.length, open: 0, eval: 0, signed: 0 };
  for (const t of tenders) {
    if (counts[t.status] !== undefined) counts[t.status] += 1;
  }
  return counts;
}

function filterTenders(key) {
  if (key === "all") return tenders;
  return tenders.filter((t) => t.status === key);
}

function partyTagClasses(party) {
  let c = "party__tag";
  if (party.winner) return `${c} party__tag--winner`;
  if (party.probableWinner) return `${c} party__tag--probable`;
  return c;
}

function renderProducts(rows) {
  const head = `<thead><tr><th>${escapeHtml(titleCaseTr("Ürün"))}</th><th>${escapeHtml(
    titleCaseTr("Miktar")
  )}</th></tr></thead>`;
  const body = rows
    .map(
      (p) =>
        `<tr><th scope="row">${escapeHtml(titleCaseTr(p.name))}</th><td>${escapeHtml(
          titleCaseTr(p.qty)
        )}</td></tr>`
    )
    .join("");
  return `<table class="product-table">${head}<tbody>${body}</tbody></table>`;
}

function renderBidPdfBlock(t) {
  const pdf = t.bidPdf;
  if (!pdf || !String(pdf.href || "").trim()) return "";
  const href = String(pdf.href).trim();
  const download = pdf.download ? String(pdf.download).trim() : "";
  const dlAttr = download ? ` download="${escapeHtml(download)}"` : "";
  const label = titleCaseTr("Teklif dosyamız");
  const aria = escapeHtml(`${label} — PDF`);
  return `<div class="tender-card__pdf">
    <span class="tender-card__pdf-label">${escapeHtml(label)}:</span>
    <a class="tender-card__pdf-link" href="${escapeHtml(href)}"${dlAttr} target="_blank" rel="noopener noreferrer" aria-label="${aria}">PDF</a>
  </div>`;
}

function contactFieldInnerHtml(label, raw) {
  const v = (raw || "").trim();
  if (!v) return "";
  const display =
    label === "Adres" ? sentenceCaseTr(v) : v;
  if (/^—\s*güncellenecek$/i.test(v) || v === "—" || /^—\s*$/u.test(v)) {
    return escapeHtml(display);
  }
  if (label === "Telefon") {
    const digits = v.replace(/[^\d+]/g, "");
    if (digits.length >= 10) {
      return `<a href="tel:${escapeHtml(digits)}">${escapeHtml(display)}</a>`;
    }
    return escapeHtml(display);
  }
  if (label === "E-posta" && v.includes("@")) {
    return `<a href="mailto:${escapeHtml(v)}">${escapeHtml(display)}</a>`;
  }
  if (label === "Web") {
    const href = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
      display
    )}</a>`;
  }
  return escapeHtml(display);
}

function buildContactHtml(contact) {
  if (!contact) return "";
  const spec = [
    ["Telefon", contact.phone],
    ["E-posta", contact.email],
    ["Adres", contact.address],
    ["Web", contact.web],
  ];
  const rows = [];
  for (const [label, raw] of spec) {
    const inner = contactFieldInnerHtml(label, raw);
    if (!inner) continue;
    rows.push(
      `<div class="party-modal__row"><span class="party-modal__row-label">${escapeHtml(
        titleCaseTr(label)
      )}</span><span class="party-modal__row-value">${inner}</span></div>`
    );
  }
  if (!rows.length) return "";
  return `<h3 class="party-modal__subheading">${escapeHtml(
    titleCaseTr("İletişim")
  )}</h3><div class="party-modal__rows party-modal__rows--contact">${rows.join(
    ""
  )}</div>`;
}

function buildPartyDetailBody(party) {
  const d = party.detail || {};
  const contactBlock = buildContactHtml(party.contact);
  const hasStructured = !!(
    d.intro ||
    (d.rows && d.rows.length) ||
    (d.paragraphs && d.paragraphs.length)
  );

  let html = "";

  if (d.intro) {
    html += `<p class="party-modal__intro">${escapeHtml(sentenceCaseTr(d.intro))}</p>`;
  }

  if (contactBlock) {
    html += contactBlock;
  }

  if (d.rows?.length) {
    html += '<div class="party-modal__rows">';
    for (const r of d.rows) {
      html += `<div class="party-modal__row"><span class="party-modal__row-label">${escapeHtml(
        titleCaseTr(r.label)
      )}</span><span class="party-modal__row-value">${escapeHtml(r.value)}</span></div>`;
    }
    html += "</div>";
  }

  if (d.paragraphs?.length) {
    for (const par of d.paragraphs) {
      html += `<p class="party-modal__para">${escapeHtml(sentenceCaseTr(par))}</p>`;
    }
  }

  if (!hasStructured && !contactBlock) {
    html += `<p class="party-modal__intro">${escapeHtml(sentenceCaseTr(party.note))}</p>`;
    return html;
  }

  html += `<div class="party-modal__note-ref"><strong>${escapeHtml(
    titleCaseTr("Liste notu")
  )}</strong> — ${escapeHtml(sentenceCaseTr(party.note))}</div>`;

  return html;
}

function renderParties(tenderIkn, list) {
  return list
    .map((p, idx) => {
      const tagClass = partyTagClasses(p);
      const label = `${titleCaseTr(p.name)} — ${titleCaseTr("firma detayı")}`;
      return `<li class="party-list__item">
        <button
          type="button"
          class="party party--actionable"
          data-party-trigger
          data-tender-id="${escapeHtml(tenderIkn)}"
          data-party-index="${idx}"
          aria-haspopup="dialog"
          aria-label="${escapeHtml(label)}"
        >
          <div class="party__row">
            <span class="party__name">${escapeHtml(titleCaseTr(p.name))}</span>
            <span class="${tagClass}">${escapeHtml(titleCaseTr(p.role))}</span>
          </div>
          <p class="party__note">${escapeHtml(sentenceCaseTr(p.note))}</p>
        </button>
      </li>`;
    })
    .join("");
}

function partiesHeading(status) {
  return PARTIES_HEADINGS[status] || PARTIES_HEADINGS.open;
}

function renderTender(t) {
  const st = STATUS_LABELS[t.status] || STATUS_LABELS.open;
  const useContractDate = t.status === "signed" && t.contractDateISO;
  const dateCaption = sentenceCaseTr(
    useContractDate ? "Sözleşme tarihi" : "İhale tarihi"
  );
  const dateValue = useContractDate
    ? formatTenderDateTime({
        dateISO: t.contractDateISO,
        timeLocal: t.contractTimeLocal || "",
      })
    : formatTenderDateTime(t);
  const domId = tenderDomSlug(t.ikn);
  const heading = partiesHeading(t.status);

  const cityHtml =
    t.city && String(t.city).trim()
      ? `<span class="tender-card__city">${escapeHtml(sentenceCaseTr(t.city))}</span>`
      : "";

  return `<article class="tender-card" aria-labelledby="t-${escapeHtml(domId)}">
    <div class="tender-card__top">
      <div>
        <div class="tender-card__id-row">
          <p class="tender-card__id">İKN ${escapeHtml(t.ikn)}</p>
          ${cityHtml}
        </div>
        <h2 class="tender-card__name" id="t-${escapeHtml(domId)}">${escapeHtml(
    sentenceCaseTr(t.title)
  )}</h2>
      </div>
      <div class="tender-card__meta">
        <span class="status ${st.className}">${escapeHtml(sentenceCaseTr(st.text))}</span>
        <p class="tender-card__date"><strong>${escapeHtml(
          dateCaption
        )}</strong> · ${escapeHtml(dateValue)}</p>
      </div>
    </div>
    <div class="tender-card__body">
      <div class="panel panel--products">
        <h3 class="panel__title">${escapeHtml(titleCaseTr("Tedarik edilebilecek ürünler"))}</h3>
        ${renderProducts(t.products)}
        ${renderBidPdfBlock(t)}
      </div>
      <div class="panel panel--parties">
        <h3 class="panel__title">${escapeHtml(titleCaseTr(heading))}</h3>
        <ul class="party-list">${renderParties(t.ikn, t.parties)}</ul>
      </div>
    </div>
  </article>`;
}

function renderFilterBar(counts) {
  return FILTER_DEFS.map((def) => {
    const selected = def.key === activeFilter;
    const classes = ["filter-tab", def.tabClass].filter(Boolean).join(" ");
    const id = `filter-tab-${def.key}`;
    return `<button
      type="button"
      class="${classes}"
      role="tab"
      id="${id}"
      data-filter="${escapeHtml(def.key)}"
      aria-selected="${selected ? "true" : "false"}"
      aria-controls="${PANEL_ID}"
      tabindex="${selected ? "0" : "-1"}"
    >${escapeHtml(sentenceCaseTr(def.label))}<span class="filter-tab__count" aria-label="Kayıt sayısı">${counts[def.key]}</span></button>`;
  }).join("");
}

function renderList() {
  const list = filterTenders(activeFilter);
  if (list.length === 0) {
    const def = FILTER_DEFS.find((d) => d.key === activeFilter);
    const label = def ? def.label.toLowerCase() : "bu filtrede";
    return `<p class="tender-list__empty">Şu an <strong>${escapeHtml(
      label
    )}</strong> kayıt bulunmuyor.</p>`;
  }
  return list.map(renderTender).join("");
}

function syncTabIndexes(bar) {
  const tabs = [...bar.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab) => {
    tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
  });
}

function mountFilterBar(bar) {
  const counts = getCounts();
  bar.innerHTML = renderFilterBar(counts);

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn || !bar.contains(btn)) return;
    const key = btn.getAttribute("data-filter");
    if (!key || key === activeFilter) return;
    activeFilter = key;
    bar.querySelectorAll('[role="tab"]').forEach((tab) => {
      tab.setAttribute("aria-selected", tab === btn ? "true" : "false");
    });
    syncTabIndexes(bar);
    render();
  });

  bar.addEventListener("keydown", (e) => {
    const tabs = [...bar.querySelectorAll('[role="tab"]')];
    if (!tabs.length) return;
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;

    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (i + 1) % tabs.length;
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = (i - 1 + tabs.length) % tabs.length;
      e.preventDefault();
    } else if (e.key === "Home") {
      next = 0;
      e.preventDefault();
    } else if (e.key === "End") {
      next = tabs.length - 1;
      e.preventDefault();
    }
    if (next < 0) return;

    const key = tabs[next].getAttribute("data-filter");
    if (!key) return;
    activeFilter = key;
    tabs.forEach((tab, idx) => {
      tab.setAttribute("aria-selected", idx === next ? "true" : "false");
    });
    syncTabIndexes(bar);
    tabs[next].focus();
    render();
  });
}

function getFocusableElements(container) {
  const sel = [
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");
  return [...container.querySelectorAll(sel)].filter(
    (el) => el.offsetParent !== null || el.getClientRects().length > 0
  );
}

function openPartyModal(tender, party) {
  const modal = document.getElementById("party-modal");
  const panel = modal?.querySelector(".party-modal__panel");
  const ctxEl = document.getElementById("party-modal-context");
  const titleEl = document.getElementById("party-modal-title");
  const roleEl = document.getElementById("party-modal-role");
  const bodyEl = document.getElementById("party-modal-body");
  const closeBtn = modal?.querySelector(".party-modal__close");
  if (!modal || !panel || !ctxEl || !titleEl || !roleEl || !bodyEl || !closeBtn) return;

  lastFocusBeforeModal = document.activeElement;

  const cityPart =
    tender.city && String(tender.city).trim()
      ? `${sentenceCaseTr(tender.city)} · `
      : "";
  ctxEl.textContent = `İKN ${tender.ikn} · ${cityPart}${sentenceCaseTr(tender.title)}`;

  titleEl.textContent = titleCaseTr(party.name);

  const tagClass = partyTagClasses(party);
  roleEl.innerHTML = `<span class="${tagClass} party-modal__role-tag">${escapeHtml(
    titleCaseTr(party.role)
  )}</span>`;

  bodyEl.innerHTML = buildPartyDetailBody(party);

  modal.removeAttribute("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    closeBtn.focus();
  });

  if (!modalTrapHandler) {
    modalTrapHandler = (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closePartyModal();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = getFocusableElements(panel);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    modal.addEventListener("keydown", modalTrapHandler);
  }
}

function closePartyModal() {
  const modal = document.getElementById("party-modal");
  if (!modal || modal.hidden) return;

  modal.setAttribute("hidden", "");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusBeforeModal && typeof lastFocusBeforeModal.focus === "function") {
    lastFocusBeforeModal.focus();
  }
  lastFocusBeforeModal = null;
}

function initPartyModal(mainEl) {
  const modal = document.getElementById("party-modal");
  if (!modal || !mainEl) return;

  mainEl.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-party-trigger]");
    if (!trigger || !mainEl.contains(trigger)) return;
    const tid = trigger.getAttribute("data-tender-id");
    const idx = parseInt(trigger.getAttribute("data-party-index"), 10);
    if (!tid || Number.isNaN(idx)) return;
    const tender = getTenderById(tid);
    const party = tender?.parties?.[idx];
    if (!tender || !party) return;
    openPartyModal(tender, party);
  });

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-modal]")) closePartyModal();
  });
}

function render() {
  const root = document.getElementById(PANEL_ID);
  const bar = document.getElementById("filter-bar");
  if (!root || !bar) return;

  if (!bar.dataset.mounted) {
    mountFilterBar(bar);
    bar.dataset.mounted = "1";
  } else {
    const counts = getCounts();
    bar.querySelectorAll("[data-filter]").forEach((btn) => {
      const k = btn.getAttribute("data-filter");
      const countEl = btn.querySelector(".filter-tab__count");
      if (countEl && k && counts[k] !== undefined) countEl.textContent = counts[k];
      btn.setAttribute("aria-selected", k === activeFilter ? "true" : "false");
    });
    syncTabIndexes(bar);
  }

  root.innerHTML = renderList();
}

function main() {
  render();
  const mainEl = document.querySelector("main");
  initPartyModal(mainEl);
}

main();
