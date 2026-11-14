(() => {
  "use strict";
  const STORAGE_KEY = "clientflow-v1";
  const stages = [
    { id: "lead", label: "Por contactar", color: "#9b9cf5" },
    { id: "proposal", label: "Propuesta", color: "#6d9be9" },
    { id: "negotiation", label: "Negociación", color: "#e8ad5d" },
    { id: "won", label: "Ganada", color: "#4bbd91" },
    { id: "lost", label: "Perdida", color: "#d68c98" }
  ];
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const currency = value => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(value) || 0);
  const dateLabel = value => value ? new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value + "T12:00:00")) : "Sin fecha";
  const makeId = () => globalThis.crypto?.randomUUID?.() || "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  const demo = {
    clients: [
      { id: "c1", name: "Laura Gómez", company: "Café Alba", email: "laura@cafealba.co", phone: "+57 300 123 4567", status: "lead", notes: "Interesada en una página web para su cafetería.", createdAt: "2026-10-22" },
      { id: "c2", name: "Mateo Ríos", company: "Ríos Distribuciones", email: "mateo@rios.co", phone: "+57 310 456 7890", status: "customer", notes: "Cliente recurrente. Revisar catálogo digital.", createdAt: "2026-10-18" },
      { id: "c3", name: "Valentina Cruz", company: "VC Studio", email: "hola@vcstudio.co", phone: "+57 315 222 3344", status: "lead", notes: "Solicitó propuesta para automatizar reservas.", createdAt: "2026-10-15" },
      { id: "c4", name: "Santiago Pérez", company: "SP Soluciones", email: "santiago@sp.co", phone: "+57 320 555 0101", status: "customer", notes: "Seguimiento de mantenimiento.", createdAt: "2026-10-10" }
    ],
    deals: [
      { id: "d1", title: "Sitio web para cafetería", clientId: "c1", value: 1800000, stage: "proposal", closeDate: "2026-12-10" },
      { id: "d2", title: "Catálogo digital", clientId: "c2", value: 950000, stage: "won", closeDate: "2026-11-01" },
      { id: "d3", title: "Sistema de reservas", clientId: "c3", value: 2400000, stage: "negotiation", closeDate: "2026-12-18" },
      { id: "d4", title: "Soporte y mejoras web", clientId: "c4", value: 450000, stage: "lead", closeDate: "2026-12-22" }
    ]
  };
  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.clients) && Array.isArray(parsed.deals)) return parsed;
      }
    } catch (error) { console.warn("No fue posible leer los datos guardados:", error); }
    return structuredClone(demo);
  }
  let state = loadData();
  let toastTimer;
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { notify("No se pudieron guardar los cambios en este navegador."); console.error(error); }
  };
  function notify(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  const clientById = id => state.clients.find(client => client.id === id);
  const initials = name => name.split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
  function renderOverview() {
    const openDeals = state.deals.filter(deal => !["won", "lost"].includes(deal.stage));
    $("#stat-clients").textContent = state.clients.length;
    $("#stat-open").textContent = openDeals.length;
    $("#stat-value").textContent = currency(openDeals.reduce((sum, deal) => sum + Number(deal.value), 0));
    $("#stat-won").textContent = state.deals.filter(deal => deal.stage === "won").length;
    $("#client-nav-count").textContent = state.clients.length;
    $("#getting-started").classList.toggle("hidden", state.clients.length > 0);
    const total = state.deals.length || 1;
    $("#pipeline-summary").innerHTML = stages.map(stage => {
      const count = state.deals.filter(deal => deal.stage === stage.id).length;
      return count ? `<span class="pipeline-segment" style="width:${count / total * 100}%;background:${stage.color}" title="${stage.label}: ${count}"></span>` : "";
    }).join("");
    $("#pipeline-legend").innerHTML = stages.map(stage => {
      const count = state.deals.filter(deal => deal.stage === stage.id).length;
      return `<div class="legend-item"><span class="legend-dot" style="background:${stage.color}"></span>${stage.label}<strong>${count}</strong></div>`;
    }).join("");
    const recent = [...state.clients].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
    $("#recent-list").innerHTML = recent.length ? recent.map(client => `<div class="recent-item"><div class="person-avatar">${escapeHTML(initials(client.name))}</div><div class="recent-info"><strong>${escapeHTML(client.name)}</strong><small>${escapeHTML(client.company || "Sin empresa")}</small></div><span class="recent-date">${dateLabel(client.createdAt)}</span></div>`).join("") : '<p class="muted">Todavía no hay actividad. Agrega un contacto para comenzar.</p>';
  }
  function renderClients() {
    const query = $("#client-search").value.trim().toLocaleLowerCase("es");
    const filter = $("#client-filter").value;
    const clients = state.clients.filter(client => {
      const haystack = [client.name, client.company, client.email, client.phone].join(" ").toLocaleLowerCase("es");
      return haystack.includes(query) && (filter === "all" || client.status === filter);
    });
    $("#clients-table").innerHTML = clients.map(client => `<tr>
      <td><div class="person-cell"><div class="person-avatar">${escapeHTML(initials(client.name))}</div><div><strong>${escapeHTML(client.name)}</strong><small>${escapeHTML(client.email || "Sin correo")}</small></div></div></td>
      <td>${escapeHTML(client.company || "—")}</td><td><span class="status-pill status-${client.status}">${client.status === "customer" ? "Cliente" : "Prospecto"}</span></td>
      <td>${escapeHTML(client.phone || "—")}</td><td>${dateLabel(client.createdAt)}</td>
      <td><div class="row-actions"><button class="mini-action" data-edit-client="${client.id}" aria-label="Editar ${escapeHTML(client.name)}" title="Editar">✎</button><button class="mini-action" data-delete-client="${client.id}" aria-label="Eliminar ${escapeHTML(client.name)}" title="Eliminar">×</button></div></td>
    </tr>`).join("");
    $("#clients-empty").classList.toggle("hidden", clients.length > 0);
  }
  function renderPipeline() {
    $("#pipeline-board").innerHTML = stages.map(stage => {
      const deals = state.deals.filter(deal => deal.stage === stage.id);
      return `<section class="pipeline-column"><div class="column-heading"><span><span class="legend-dot" style="display:inline-block;background:${stage.color};margin-right:6px"></span>${stage.label}</span><span class="column-count">${deals.length}</span></div>
      ${deals.length ? deals.map(deal => {
        const client = clientById(deal.clientId);
        const next = stages[(stages.findIndex(item => item.id === stage.id) + 1) % stages.length];
        return `<article class="deal-card"><strong>${escapeHTML(deal.title)}</strong><small>${escapeHTML(client?.name || "Contacto eliminado")}</small><div class="deal-value">${currency(deal.value)}</div><small>Cierre: ${dateLabel(deal.closeDate)}</small><div class="deal-actions"><button data-next-stage="${deal.id}" data-stage="${next.id}">Mover a ${next.label}</button><button data-delete-deal="${deal.id}" aria-label="Eliminar oportunidad">Eliminar</button></div></article>`;
      }).join("") : '<div class="column-empty">Sin oportunidades</div>'}</section>`;
    }).join("");
  }
  function renderAll() { renderOverview(); renderClients(); renderPipeline(); }
  function showView(name) {
    const valid = ["overview", "clients", "pipeline"].includes(name) ? name : "overview";
    $$(".view").forEach(view => view.classList.toggle("active-view", view.id === "view-" + valid));
    $$(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.view === valid));
    $("#breadcrumb-current").textContent = ({ overview: "Resumen", clients: "Clientes", pipeline: "Oportunidades" })[valid];
    $("#sidebar").classList.remove("open");
    if (location.hash !== "#" + valid) history.replaceState(null, "", "#" + valid);
  }
  function openClientModal(client) {
    $("#client-form").reset();
    $("#client-id").value = client?.id || "";
    $("#client-modal-title").textContent = client ? "Editar contacto" : "Nuevo contacto";
    if (client) {
      $("#client-name").value = client.name;
      $("#client-company").value = client.company || "";
      $("#client-email").value = client.email || "";
      $("#client-phone").value = client.phone || "";
      $("#client-status").value = client.status;
      $("#client-notes").value = client.notes || "";
    }
    $("#client-modal").showModal();
  }
  function openDealModal() {
    if (!state.clients.length) { notify("Primero agrega un contacto para asociar la oportunidad."); showView("clients"); openClientModal(); return; }
    $("#deal-form").reset();
    $("#deal-client").innerHTML = state.clients.map(client => `<option value="${client.id}">${escapeHTML(client.name)} · ${escapeHTML(client.company || "Sin empresa")}</option>`).join("");
    $("#deal-modal").showModal();
  }
  function exportCSV() {
    const headers = ["Nombre", "Empresa", "Correo", "Teléfono", "Tipo", "Notas", "Fecha de registro"];
    const rows = state.clients.map(client => [client.name, client.company, client.email, client.phone, client.status === "customer" ? "Cliente" : "Prospecto", client.notes, client.createdAt]);
    const csv = [headers, ...rows].map(row => row.map(value => '"' + String(value || "").replace(/"/g, '""') + '"').join(";")).join("\r\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "clientflow-contactos.csv"; link.click();
    URL.revokeObjectURL(url);
    notify("Archivo CSV exportado.");
  }
  $$(".nav-link,[data-view]").forEach(link => link.addEventListener("click", event => {
    const view = link.dataset.view;
    if (view) { event.preventDefault(); showView(view); }
  }));
  $("#menu-toggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#add-top").addEventListener("click", () => { showView("clients"); openClientModal(); });
  $("#add-client").addEventListener("click", () => openClientModal());
  $("#start-add").addEventListener("click", () => openClientModal());
  $("#empty-add").addEventListener("click", () => openClientModal());
  $("#add-deal").addEventListener("click", openDealModal);
  $("#client-search").addEventListener("input", renderClients);
  $("#client-filter").addEventListener("change", renderClients);
  $("#export-csv").addEventListener("click", exportCSV);
  $$(".close-modal").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
  $("#client-form").addEventListener("submit", event => {
    event.preventDefault();
    const id = $("#client-id").value;
    const previous = id ? clientById(id) : null;
    const client = {
      id: id || makeId(), name: $("#client-name").value.trim(), company: $("#client-company").value.trim(),
      email: $("#client-email").value.trim(), phone: $("#client-phone").value.trim(),
      status: $("#client-status").value, notes: $("#client-notes").value.trim(),
      createdAt: previous?.createdAt || new Date().toISOString().slice(0, 10)
    };
    if (!client.name) return;
    if (previous) state.clients = state.clients.map(item => item.id === id ? client : item);
    else state.clients.push(client);
    save(); renderAll(); $("#client-modal").close(); notify(previous ? "Contacto actualizado." : "Contacto agregado.");
  });
  $("#deal-form").addEventListener("submit", event => {
    event.preventDefault();
    state.deals.push({ id: makeId(), title: $("#deal-title").value.trim(), clientId: $("#deal-client").value, value: Number($("#deal-value").value), stage: $("#deal-stage").value, closeDate: $("#deal-date").value });
    save(); renderAll(); $("#deal-modal").close(); notify("Oportunidad creada.");
  });
  $("#clients-table").addEventListener("click", event => {
    const edit = event.target.closest("[data-edit-client]");
    const remove = event.target.closest("[data-delete-client]");
    if (edit) openClientModal(clientById(edit.dataset.editClient));
    if (remove) {
      const client = clientById(remove.dataset.deleteClient);
      if (!client || !confirm(`¿Eliminar a ${client.name}? También se eliminarán sus oportunidades asociadas.`)) return;
      state.clients = state.clients.filter(item => item.id !== client.id);
      state.deals = state.deals.filter(deal => deal.clientId !== client.id);
      save(); renderAll(); notify("Contacto eliminado.");
    }
  });
  $("#pipeline-board").addEventListener("click", event => {
    const move = event.target.closest("[data-next-stage]");
    const remove = event.target.closest("[data-delete-deal]");
    if (move) {
      const deal = state.deals.find(item => item.id === move.dataset.nextStage);
      if (deal) { deal.stage = move.dataset.stage; save(); renderAll(); notify("Etapa de oportunidad actualizada."); }
    }
    if (remove) {
      if (!confirm("¿Eliminar esta oportunidad?")) return;
      state.deals = state.deals.filter(deal => deal.id !== remove.dataset.deleteDeal);
      save(); renderAll(); notify("Oportunidad eliminada.");
    }
  });
  $("#today-label").textContent = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date());
  showView(location.hash.slice(1));
  renderAll();
})();