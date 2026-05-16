const API = "/api";

const $ = (sel) => document.querySelector(sel);

function toast(msg, kind = "ok") {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.style.borderColor =
    kind === "danger" ? "rgba(255,92,122,.55)" : "rgba(110,231,255,.45)";
  el.classList.add("show");
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => el.classList.remove("show"), 2800);
}

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text || res.statusText };
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function resetForm(formEl) {
  formEl.reset();
  // Ensure hidden id doesn't get reset to "undefined"
  const idInput = formEl.querySelector('input[name="id"]');
  if (idInput) idInput.value = "";
}

function formToPayload(formEl) {
  const fd = new FormData(formEl);
  const payload = {};
  for (const [k, v] of fd.entries()) {
    if (k === "id") continue;
    if (v === "") continue;
    payload[k] = v;
  }
  // Cast numeric fields where needed
  if (payload.capacity !== undefined) payload.capacity = Number(payload.capacity);
  return payload;
}

function setFormId(formEl, id) {
  const idInput = formEl.querySelector('input[name="id"]');
  if (idInput) idInput.value = id || "";
}

function getFormId(formEl) {
  const idInput = formEl.querySelector('input[name="id"]');
  return idInput ? idInput.value : "";
}

function escHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dateToInputValue(s) {
  // API stores date as string (often "YYYY-MM-DD"). Ensure it works with <input type="date">
  if (!s) return "";
  return String(s).slice(0, 10);
}

// ---------------- Tabs ----------------
function setupTabs() {
  const tabButtons = document.querySelectorAll("[data-tab]");
  const panels = document.querySelectorAll("[data-panel]");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("is-active"));
      panels.forEach((p) => p.classList.remove("is-active"));
      btn.classList.add("is-active");
      const target = btn.getAttribute("data-tab");
      document.querySelector(`[data-panel="${target}"]`).classList.add("is-active");
    });
  });
}

// ---------------- Parents ----------------
async function loadParents() {
  const status = $("#parents-status");
  status.textContent = "Loading parents...";
  try {
    const data = await apiFetch(`${API}/parents/getallparents`);
    const list = data?.data || [];
    const tbody = $("#parents-tbody");
    tbody.innerHTML = "";

    if (!list.length) {
      status.textContent = "No parents found.";
      return;
    }

    status.textContent = `${list.length} parent(s) loaded.`;
    for (const p of list) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escHtml(p.name || "")}</td>
        <td>${escHtml(p.email || "")}</td>
        <td>${escHtml(p.phone || "")}</td>
        <td>${escHtml(p.relationship || "")}</td>
        <td>
          <div class="actions" style="margin:0;gap:8px;">
            <button class="btn small" data-edit-parent="${p._id}">Edit</button>
            <button class="btn small danger" data-del-parent="${p._id}">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    }
  } catch (e) {
    status.textContent = "Failed to load parents.";
    toast(e.message, "danger");
  }
}

function fillParentForm(p) {
  const form = $("#parent-form");
  setFormId(form, p._id);
  form.elements["name"].value = p.name || "";
  form.elements["email"].value = p.email || "";
  form.elements["phone"].value = p.phone || "";
  form.elements["address"].value = p.address || "";
  form.elements["relationship"].value = p.relationship || "";
}

function setupParentHandlers() {
  const form = $("#parent-form");
  const resetBtn = $("#parent-reset");
  const tbody = $("#parents-tbody");

  resetBtn.addEventListener("click", () => {
    resetForm(form);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = getFormId(form);
    const payload = formToPayload(form);

    try {
      if (id) {
        await apiFetch(`${API}/parents/update/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast("Parent updated successfully.");
      } else {
        await apiFetch(`${API}/parents/create`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast("Parent created successfully.");
      }
      resetForm(form);
      await loadParents();
      await loadParentClassSelections();
    } catch (err) {
      toast(err.message, "danger");
    }
  });

  tbody.addEventListener("click", async (e) => {
    const editBtn = e.target?.closest?.('button[data-edit-parent]');
    const delBtn = e.target?.closest?.('button[data-del-parent]');
    const editId = editBtn?.getAttribute("data-edit-parent");
    const delId = delBtn?.getAttribute("data-del-parent");

    if (editId) {
      const status = $("#parents-status");
      status.textContent = "Loading selected parent...";
      try {
        const data = await apiFetch(`${API}/parents/getparent/${editId}`);
        fillParentForm(data);
        status.textContent = "Editing mode enabled.";
      } catch (err) {
        toast(err.message, "danger");
      }
    }

    if (delId) {
      if (!confirm("Delete this parent?")) return;
      try {
        await apiFetch(`${API}/parents/delete/${delId}`, { method: "DELETE" });
        toast("Parent deleted.");
        await loadParents();
        await loadChildren();
        await loadParentClassSelections();
      } catch (err) {
        toast(err.message, "danger");
      }
    }
  });
}

// ---------------- Classes ----------------
async function loadClasses() {
  const status = $("#classes-status");
  status.textContent = "Loading classes...";
  try {
    const data = await apiFetch(`${API}/classes/getallclasses`);
    const list = data?.data || [];
    const tbody = $("#classes-tbody");
    tbody.innerHTML = "";

    if (!list.length) {
      status.textContent = "No classes found.";
      return;
    }

    status.textContent = `${list.length} class(es) loaded.`;
    for (const c of list) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escHtml(c.className || "")}</td>
        <td>${escHtml(c.ageGroup || "")}</td>
        <td>${escHtml(c.capacity ?? "")}</td>
        <td>${escHtml(c.teacher || "")}</td>
        <td>
          <div class="actions" style="margin:0;gap:8px;">
            <button class="btn small" data-edit-class="${c._id}">Edit</button>
            <button class="btn small danger" data-del-class="${c._id}">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    }
  } catch (e) {
    status.textContent = "Failed to load classes.";
    toast(e.message, "danger");
  }
}

function fillClassForm(c) {
  const form = $("#class-form");
  setFormId(form, c._id);
  form.elements["className"].value = c.className || "";
  form.elements["ageGroup"].value = c.ageGroup || "";
  form.elements["capacity"].value = c.capacity ?? "";
  form.elements["teacher"].value = c.teacher || "";
  form.elements["schedule"].value = c.schedule || "";
}

function setupClassHandlers() {
  const form = $("#class-form");
  const resetBtn = $("#class-reset");
  const tbody = $("#classes-tbody");

  resetBtn.addEventListener("click", () => {
    resetForm(form);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = getFormId(form);
    const payload = formToPayload(form);

    try {
      if (id) {
        await apiFetch(`${API}/classes/update/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast("Class updated successfully.");
      } else {
        await apiFetch(`${API}/classes/create`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast("Class created successfully.");
      }
      resetForm(form);
      await loadClasses();
      await loadParentClassSelections();
    } catch (err) {
      toast(err.message, "danger");
    }
  });

  tbody.addEventListener("click", async (e) => {
    const editBtn = e.target?.closest?.('button[data-edit-class]');
    const delBtn = e.target?.closest?.('button[data-del-class]');
    const editId = editBtn?.getAttribute("data-edit-class");
    const delId = delBtn?.getAttribute("data-del-class");

    if (editId) {
      try {
        const data = await apiFetch(`${API}/classes/getclass/${editId}`);
        fillClassForm(data);
      } catch (err) {
        toast(err.message, "danger");
      }
    }

    if (delId) {
      if (!confirm("Delete this class?")) return;
      try {
        await apiFetch(`${API}/classes/delete/${delId}`, { method: "DELETE" });
        toast("Class deleted.");
        await loadClasses();
        await loadChildren();
        await loadParentClassSelections();
      } catch (err) {
        toast(err.message, "danger");
      }
    }
  });
}

async function loadParentClassSelections() {
  const parentSelect = $("#child-parent");
  const classSelect = $("#child-class");
  parentSelect.innerHTML = "";
  classSelect.innerHTML = "";

  try {
    const parentsData = await apiFetch(`${API}/parents/getallparents`);
    const parents = parentsData?.data || [];
    if (!parents.length) parentSelect.innerHTML = `<option value="">Add parent first...</option>`;
    for (const p of parents) {
      const opt = document.createElement("option");
      opt.value = p._id;
      opt.textContent = `${p.name} (${p.relationship})`;
      parentSelect.appendChild(opt);
    }

    const classesData = await apiFetch(`${API}/classes/getallclasses`);
    const classes = classesData?.data || [];
    if (!classes.length) classSelect.innerHTML = `<option value="">Add class first...</option>`;
    for (const c of classes) {
      const opt = document.createElement("option");
      opt.value = c._id;
      opt.textContent = `${c.className} (Age: ${c.ageGroup})`;
      classSelect.appendChild(opt);
    }
  } catch (e) {
    // Don't hard-fail child editing if selects can't load.
    toast("Failed to load parent/class dropdowns.", "danger");
  }
}

// ---------------- Children ----------------
async function loadChildren() {
  const status = $("#children-status");
  status.textContent = "Loading child enrollments...";
  try {
    const data = await apiFetch(`${API}/children/getallchildren`);
    const list = data?.data || [];
    const tbody = $("#children-tbody");
    tbody.innerHTML = "";

    if (!list.length) {
      status.textContent = "No children found.";
      return;
    }

    status.textContent = `${list.length} child enrollment(s) loaded.`;
    for (const ch of list) {
      const tr = document.createElement("tr");
      const parentName = ch.parentId?.name || "";
      const className = ch.classId?.className || "";
      tr.innerHTML = `
        <td>
          ${escHtml(ch.firstName || "")} ${escHtml(ch.lastName || "")}
          <div class="muted" style="margin-top:4px;font-size:12px;">${escHtml(ch.gender || "")}</div>
        </td>
        <td>${escHtml(ch.dateOfBirth || "")}</td>
        <td>${escHtml(ch.status || "")}</td>
        <td>${escHtml(parentName)}</td>
        <td>${escHtml(className)}</td>
        <td>
          <div class="actions" style="margin:0;gap:8px;">
            <button class="btn small" data-edit-child="${ch._id}">Edit</button>
            <button class="btn small danger" data-del-child="${ch._id}">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    }
  } catch (e) {
    status.textContent = "Failed to load children.";
    toast(e.message, "danger");
  }
}

function fillChildForm(ch) {
  const form = $("#child-form");
  setFormId(form, ch._id);

  form.elements["firstName"].value = ch.firstName || "";
  form.elements["lastName"].value = ch.lastName || "";
  form.elements["dateOfBirth"].value = dateToInputValue(ch.dateOfBirth);
  form.elements["gender"].value = ch.gender || "";
  form.elements["medicalNotes"].value = ch.medicalNotes || "";
  form.elements["enrollmentDate"].value = dateToInputValue(ch.enrollmentDate);
  form.elements["status"].value = ch.status || "";

  const parentId = ch.parentId?._id || ch.parentId || "";
  const classId = ch.classId?._id || ch.classId || "";
  form.elements["parentId"].value = parentId;
  form.elements["classId"].value = classId;
}

function setupChildHandlers() {
  const form = $("#child-form");
  const resetBtn = $("#child-reset");
  const tbody = $("#children-tbody");

  resetBtn.addEventListener("click", () => {
    resetForm(form);
    // Keep dropdown contents
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = getFormId(form);
    const payload = formToPayload(form);

    // Ensure dropdowns set correct ids (required by backend).
    payload.parentId = form.elements["parentId"].value;
    payload.classId = form.elements["classId"].value;

    // Keep date strings in a backend-friendly format.
    payload.dateOfBirth = payload.dateOfBirth ? String(payload.dateOfBirth).slice(0, 10) : payload.dateOfBirth;
    payload.enrollmentDate = payload.enrollmentDate ? String(payload.enrollmentDate).slice(0, 10) : payload.enrollmentDate;

    try {
      if (id) {
        await apiFetch(`${API}/children/update/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast("Child updated successfully.");
      } else {
        await apiFetch(`${API}/children/create`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast("Child enrolled successfully.");
      }
      resetForm(form);
      await loadChildren();
      await loadParentClassSelections();
    } catch (err) {
      toast(err.message, "danger");
    }
  });

  tbody.addEventListener("click", async (e) => {
    const editBtn = e.target?.closest?.('button[data-edit-child]');
    const delBtn = e.target?.closest?.('button[data-del-child]');
    const editId = editBtn?.getAttribute("data-edit-child");
    const delId = delBtn?.getAttribute("data-del-child");

    if (editId) {
      try {
        await loadParentClassSelections();
        const data = await apiFetch(`${API}/children/getchildren/${editId}`);
        fillChildForm(data);
      } catch (err) {
        toast(err.message, "danger");
      }
    }

    if (delId) {
      if (!confirm("Delete this child enrollment?")) return;
      try {
        await apiFetch(`${API}/children/delete/${delId}`, { method: "DELETE" });
        toast("Child deleted.");
        await loadChildren();
      } catch (err) {
        toast(err.message, "danger");
      }
    }
  });
}

// ---------------- Boot ----------------
async function init() {
  setupTabs();

  setupParentHandlers();
  setupClassHandlers();
  setupChildHandlers();

  // Initial load
  await Promise.all([loadParents(), loadClasses(), loadChildren(), loadParentClassSelections()]);
}

document.addEventListener("DOMContentLoaded", () => {
  init().catch((e) => {
    console.error(e);
    toast("UI failed to initialize.", "danger");
  });
});

// Refresh buttons
$("#refresh-parents")?.addEventListener("click", loadParents);
$("#refresh-classes")?.addEventListener("click", loadClasses);
$("#refresh-children")?.addEventListener("click", loadChildren);

