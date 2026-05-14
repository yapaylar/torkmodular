import { tenders } from "./data.js";

const STATUS_LABELS = {
  open: { className: "status--open", text: "Teklif vermeye açık" },
  eval: { className: "status--eval", text: "Değerlendirme aşamasında" },
  signed: { className: "status--signed", text: "Sözleşme imzalanmış" },
};

function formatDateTR(iso) {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
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

function renderProducts(rows) {
  const head = `<thead><tr><th>Ürün</th><th>Miktar</th></tr></thead>`;
  const body = rows
    .map(
      (p) =>
        `<tr><th scope="row">${escapeHtml(p.name)}</th><td>${escapeHtml(
          p.qty
        )}</td></tr>`
    )
    .join("");
  return `<table class="product-table">${head}<tbody>${body}</tbody></table>`;
}

function renderParties(list) {
  return list
    .map((p) => {
      const tagClass = p.winner ? "party__tag party__tag--winner" : "party__tag";
      return `<li class="party">
        <div class="party__row">
          <span class="party__name">${escapeHtml(p.name)}</span>
          <span class="${tagClass}">${escapeHtml(p.role)}</span>
        </div>
        <p class="party__note">${escapeHtml(p.note)}</p>
      </li>`;
    })
    .join("");
}

function renderTender(t) {
  const st = STATUS_LABELS[t.status] || STATUS_LABELS.open;
  const dateLabel = formatDateTR(t.dateISO);

  return `<article class="tender-card" aria-labelledby="t-${escapeHtml(t.id)}">
    <div class="tender-card__top">
      <div>
        <p class="tender-card__id">${escapeHtml(t.id)}</p>
        <h2 class="tender-card__name" id="t-${escapeHtml(t.id)}">${escapeHtml(
    t.title
  )}</h2>
      </div>
      <div class="tender-card__meta">
        <span class="status ${st.className}">${escapeHtml(st.text)}</span>
        <p class="tender-card__date"><strong>İhale tarihi</strong> · ${escapeHtml(
          dateLabel
        )}</p>
      </div>
    </div>
    <div class="tender-card__body">
      <div class="panel panel--products">
        <h3 class="panel__title">Tedarik edilebilecek ürünler</h3>
        ${renderProducts(t.products)}
      </div>
      <div class="panel panel--parties">
        <h3 class="panel__title">Katılımcılar ve kazanan</h3>
        <ul class="party-list">${renderParties(t.parties)}</ul>
      </div>
    </div>
  </article>`;
}

function main() {
  const root = document.getElementById("tender-list");
  if (!root) return;
  root.innerHTML = tenders.map(renderTender).join("");
}

main();
