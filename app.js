/* ============================================================
   KAIA Agenda — app (UI, rotas, agenda, admin)
   ============================================================ */
(function () {
  "use strict";
  const Data = window.KAIA_DATA;
  const CFG = window.KAIA_CONFIG || {};
  const $ = (id) => document.getElementById(id);

  /* ---------- ícones ---------- */
  const I = {
    calendar:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="2"/></svg>',
    home:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 11l8-6 8 6v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    key:'<svg viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="4.5" stroke="currentColor" stroke-width="2"/><path d="M11 11l8 8m-3-3l2-2m-4 0l2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tag:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 4h7l9 9-7 7-9-9V4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/></svg>',
    doc:'<svg viewBox="0 0 24 24" fill="none"><path d="M6 2h8l4 4v16H6V2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 2v4h4M9 13h6M9 17h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H9l-4 4V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    note:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 5h14v10H9l-4 3.4V5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 9h7M8.5 12h4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    more:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="19" r="1.6" fill="currentColor"/></svg>',
    x:'<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    calPlus:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M8 2v4M16 2v4M12 13v4M10 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    trend:'<svg viewBox="0 0 24 24" fill="none"><path d="M3 17l6-6 4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    hourglass:'<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    users:'<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.4" stroke="currentColor" stroke-width="2"/><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 4.5a3.4 3.4 0 010 7M18 20c0-3-1-4.6-3-5.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    eye:'<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>',
    eyeOff:'<svg viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 6.2A9.7 9.7 0 0112 6c6.5 0 10 6 10 6a17 17 0 01-3.2 3.9M6.2 6.2A17 17 0 002 12s3.5 7 10 7a9.6 9.6 0 004-.9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    reset:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 108-8 8 8 0 00-6 2.7M4 4v4h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    whats:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 20l1.3-3.9A8 8 0 1112 20a8 8 0 01-4.1-1.1L4 20z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9.2 8.6c-.2 0-.5 0-.7.4-.2.4-.8 1-.8 2s.8 2.2 1 2.4c.1.2 1.6 2.6 4 3.5 1.9.7 2.3.6 2.7.5.4 0 1.3-.5 1.5-1s.2-1 .1-1l-.6-.3-1.4-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.1-.3.2-.5.1-.6-.2-1.3-.6-2-1.4-.5-.6-.9-1.3-1-1.5-.1-.2 0-.3.1-.4l.4-.5c.1-.2.1-.3 0-.5l-.7-1.6c-.1-.4-.3-.4-.5-.4z" fill="currentColor"/></svg>',
    userplus:'<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5" stroke="currentColor" stroke-width="2"/><path d="M3 20c0-3.3 2.7-5 6-5 1.2 0 2.4.3 3.3.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 14v6M15 17h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  };

  const TYPES = {
    visita: { label: "Visita", color: "#7C5CFC", icon: I.home },
    avaliacao: { label: "Avaliação", color: "#00E5CC", icon: I.tag },
    reuniao: { label: "Reunião", color: "#FFB547", icon: I.chat },
    assinatura: { label: "Assinatura", color: "#00E5A0", icon: I.doc },
    captacao: { label: "Captação", color: "#FF4D6D", icon: I.key },
  };
  const HORAS = ["08:00","09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00","19:00"];

  /* ---------- datas ---------- */
  const DOW = ["dom","seg","ter","qua","qui","sex","sáb"];
  const DOW_FULL = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  const MON = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  const MON_FULL = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const pad = (n) => String(n).padStart(2, "0");
  const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const atTime = (base, hh, mm, add = 0) => { const d = new Date(base); d.setDate(d.getDate() + add); d.setHours(hh, mm, 0, 0); return d; };
  const startOfWeek = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - x.getDay()); return x; };
  const sameDay = (a, b) => dayKey(a) === dayKey(b);
  const longDate = (d) => `${DOW_FULL[d.getDay()]}, ${d.getDate()} de ${MON_FULL[d.getMonth()]}`;
  function relDay(d) {
    const diff = Math.round((new Date(dayKey(d)) - new Date(dayKey(new Date()))) / 86400000);
    if (diff === 0) return "Hoje · " + d.getDate() + " " + MON[d.getMonth()];
    if (diff === 1) return "Amanhã · " + d.getDate() + " " + MON[d.getMonth()];
    return `${DOW_FULL[d.getDay()]} · ${d.getDate()} ${MON[d.getMonth()]}`;
  }
  function relDayShort(d) {
    const diff = Math.round((new Date(dayKey(d)) - new Date(dayKey(new Date()))) / 86400000);
    if (diff === 0) return "hoje"; if (diff === 1) return "amanhã";
    return `${DOW[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`;
  }
  function fromNow(ts) {
    if (!ts) return "—"; const diff = Date.now() - ts;
    if (diff < 60000) return "agora"; if (diff < 3600000) return "há " + Math.floor(diff / 60000) + " min";
    if (diff < 86400000) return "há " + Math.floor(diff / 3600000) + "h";
    const days = Math.floor(diff / 86400000); if (days === 1) return "ontem"; if (days < 7) return "há " + days + " dias";
    const d = new Date(ts); return `${d.getDate()} ${MON[d.getMonth()]}`;
  }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const initials = (n) => (n || "?").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const statusLabel = (s) => ({ confirmado: "Confirmado", pendente: "A confirmar", concluido: "Concluído", faltou: "Não compareceu", cancelado: "Cancelado" }[s] || s);

  /* ---------- links de compartilhamento (1 toque, sem configuração) ---------- */
  function calStamp(d) { return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z"; }
  const imovelFull = (a) => [a.imovel_endereco, a.imovel_bairro].filter(Boolean).join(" · ") || "o imóvel combinado";
  function calUrl(a) {
    const t = TYPES[a.tipo] || TYPES.visita, s = new Date(a.dt), e = new Date(a.dt + a.dur * 60000);
    const details = `Imóvel: ${imovelFull(a)}\nCliente: ${a.cliente}${a.telefone && a.telefone !== "—" ? " · " + a.telefone : ""}${a.nota ? "\n" + a.nota : ""}`;
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(`${t.label} — ${a.cliente}`) +
      "&dates=" + calStamp(s) + "/" + calStamp(e) + "&details=" + encodeURIComponent(details) + "&location=" + encodeURIComponent(a.imovel_endereco || "");
  }
  function mailUrl(a) {
    const t = TYPES[a.tipo] || TYPES.visita, d = new Date(a.dt);
    const su = `${t.label} — ${relDayShort(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const body = `Olá ${a.cliente},\n\nConfirmando sua ${t.label.toLowerCase()} com a RE/MAX Londero:\n\n• Imóvel: ${imovelFull(a)}\n• Data: ${relDayShort(d)} às ${pad(d.getHours())}:${pad(d.getMinutes())}\n\nQualquer dúvida, estou à disposição.`;
    return "https://mail.google.com/mail/?view=cm&fs=1&su=" + encodeURIComponent(su) + "&body=" + encodeURIComponent(body);
  }
  function phoneDigits(f) { let d = (f || "").replace(/\D/g, ""); if (!d) return ""; if (d.length === 10 || d.length === 11) d = "55" + d; return d; }
  function waUrl(a) {
    const t = TYPES[a.tipo] || TYPES.visita, d = new Date(a.dt);
    const msg = `Olá ${a.cliente}! Passando pra confirmar sua ${t.label.toLowerCase()} com a RE/MAX Londero ${relDayShort(d)} às ${pad(d.getHours())}:${pad(d.getMinutes())}, no imóvel ${imovelFull(a)}. Podemos confirmar?`;
    return "https://wa.me/" + phoneDigits(a.telefone) + "?text=" + encodeURIComponent(msg);
  }

  /* ---------- estado ---------- */
  let CUR = null;                 // usuário logado
  let appts = [];                 // agendamentos em memória
  let corretores = [];            // lista de corretores
  let view = "hoje", selDay = null, corrFilter = null;
  let form = { tipo: "visita", corr: null, hora: null, dur: 45 };
  let cdTimer = null, clockTimer = null;

  const corrById = (id) => corretores.find((c) => c.id === id) || { id: id, nome: "—", cor: "#4A5568" };
  const isActive = (a) => a.status !== "cancelado";
  const isUpcoming = (a) => a.dt > Date.now() && isActive(a) && a.status !== "concluido" && a.status !== "faltou";
  const nextAppt = () => appts.filter(isUpcoming).sort((a, b) => a.dt - b.dt)[0] || null;

  /* ============================================================
     ROTAS
     ============================================================ */
  function showView(name) {
    ["auth", "app", "admin"].forEach((v) => $("view-" + v).classList.toggle("active", v === name));
    window.scrollTo(0, 0);
  }

  /* ============================================================
     AUTH UI
     ============================================================ */
  function initAuthUI() {
    document.querySelectorAll(".pw-toggle").forEach((b) => { b.innerHTML = I.eye; });
    document.querySelectorAll(".auth-tab").forEach((t) => t.addEventListener("click", () => switchAuth(t.dataset.auth)));
    document.querySelectorAll(".pw-toggle").forEach((b) => b.addEventListener("click", () => {
      const inp = $(b.dataset.pw); const show = inp.type === "password";
      inp.type = show ? "text" : "password"; b.innerHTML = show ? I.eyeOff : I.eye;
    }));
    $("formLogin").addEventListener("submit", doLogin);
    $("formReg").addEventListener("submit", doRegister);
    updateDemoHint();
  }
  function switchAuth(which) {
    document.querySelectorAll(".auth-tab").forEach((t) => t.classList.toggle("active", t.dataset.auth === which));
    $("formLogin").style.display = which === "login" ? "" : "none";
    $("formReg").style.display = which === "register" ? "" : "none";
    clearAuthMsg();
  }
  function authErr(msg) { const e = $("authErr"); e.textContent = msg; e.classList.add("show"); $("authOk").classList.remove("show"); }
  function authOk(msg) { const e = $("authOk"); e.textContent = msg; e.classList.add("show"); $("authErr").classList.remove("show"); }
  function clearAuthMsg() { $("authErr").classList.remove("show"); $("authOk").classList.remove("show"); }
  function updateDemoHint() {
    const el = $("authDemo");
    if (Data.mode === "demo") {
      el.innerHTML = `<b>Modo demonstração</b> — dados salvos só neste navegador.<br>Entre como dono: <b>${esc(Data.ownerEmail || "londero@remax.com")}</b> · senha <b>demo1234</b> · <a href="#" id="demoFill">preencher</a>`;
      const f = $("demoFill"); if (f) f.addEventListener("click", (e) => { e.preventDefault(); switchAuth("login"); $("liEmail").value = Data.ownerEmail || "londero@remax.com"; $("liPass").value = "demo1234"; });
    } else {
      el.innerHTML = `<b>Sistema no ar</b> — login e dados protegidos no servidor 24/7.`;
    }
  }
  async function doLogin(e) {
    e.preventDefault(); clearAuthMsg();
    const btn = $("btnLogin"); btn.disabled = true; btn.textContent = "Entrando…";
    try {
      await Data.auth.signIn($("liEmail").value, $("liPass").value);
      CUR = await Data.auth.currentUser();
      if (!CUR) throw new Error("Não foi possível carregar seu perfil.");
      if (CUR.ativo === false) { await Data.auth.signOut(); throw new Error("Seu acesso está desativado. Fale com o gestor."); }
      await enterApp();
    } catch (err) { authErr(err.message || "Falha ao entrar."); }
    finally { btn.disabled = false; btn.textContent = "Entrar"; }
  }
  async function doRegister(e) {
    e.preventDefault(); clearAuthMsg();
    const nome = $("rgNome").value.trim(), email = $("rgEmail").value.trim(), pass = $("rgPass").value;
    if (nome.length < 2) return authErr("Digite seu nome.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return authErr("Digite um e-mail válido.");
    if (pass.length < 6) return authErr("A senha precisa ter pelo menos 6 caracteres.");
    const btn = $("btnReg"); btn.disabled = true; btn.textContent = "Criando…";
    try {
      await Data.auth.signUp(nome, email, pass);
      CUR = await Data.auth.currentUser();
      if (CUR) { await enterApp(); }
      else { authOk("Conta criada! Confirme seu e-mail e depois entre."); switchAuth("login"); $("liEmail").value = email; }
    } catch (err) { authErr(err.message || "Falha ao cadastrar."); }
    finally { btn.disabled = false; btn.textContent = "Criar conta"; }
  }

  /* ============================================================
     ENTRAR NO APP
     ============================================================ */
  async function enterApp() {
    refreshUserChip();
    try {
      corretores = await Data.corretores.list();
      appts = await Data.appointments.list();
    } catch (err) { toast("Erro ao carregar", err.message, "warn"); corretores = corretores || []; appts = appts || []; }
    form.corr = corretores[0] ? corretores[0].id : null;
    showView("app");
    renderAll();
    startClock();
  }
  function refreshUserChip() {
    if (!CUR) return;
    $("wsName").textContent = CFG.ESCRITORIO || "RE/MAX";
    $("ucName").textContent = (CUR.nome || "").split(" ")[0] || "Você";
    $("ucRole").textContent = CUR.role === "admin" ? "Gestor" : CUR.role === "gestor" ? "Gestor" : "Corretor";
    $("ucAv").textContent = initials(CUR.nome);
    const isAdmin = CUR.role === "admin";
    $("btnAdmin").style.display = isAdmin ? "" : "none";
    $("umAdmin").style.display = isAdmin ? "" : "none";
    $("umName").textContent = CUR.nome || "—";
    $("umMail").textContent = CUR.email || "—";
  }

  /* ============================================================
     RENDER — agenda
     ============================================================ */
  function renderAll() { renderGreeting(); renderKPIs(); renderAgenda(); renderSpot(); renderWeek(); renderCorr(); renderFree(); }

  function renderGreeting() {
    const now = new Date(), h = now.getHours();
    const g = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
    $("greetEyebrow").textContent = CUR ? `${g}, ${(CUR.nome || "").split(" ")[0]}` : g;
    const el = $("greetLine");
    const today = appts.filter((a) => isActive(a) && sameDay(new Date(a.dt), now));
    if (!today.length) { el.innerHTML = `Nenhum compromisso pra hoje. Bom momento pra prospectar e <span class="accent">agendar novas visitas</span>.`; return; }
    const conf = today.filter((a) => a.status === "confirmado").length;
    const pend = today.filter((a) => a.status === "pendente").length;
    const done = today.filter((a) => a.status === "concluido").length;
    const parts = [];
    if (conf) parts.push(`<b>${conf}</b> confirmad${conf > 1 ? "os" : "o"}`);
    if (pend) parts.push(`<b>${pend}</b> a confirmar`);
    if (done) parts.push(`<b>${done}</b> concluíd${done > 1 ? "os" : "o"}`);
    let s = `Você tem <b>${today.length} compromisso${today.length > 1 ? "s" : ""}</b> hoje`;
    if (parts.length) s += ` — ${parts.join(", ")}`;
    s += ".";
    const taken = takenSet(now);
    const free = HORAS.filter((x) => { const p = x.split(":").map(Number); return !taken.has(x) && atTime(now, p[0], p[1]) > now; }).length;
    if (free > 0) s += ` Ainda dá pra encaixar mais <span class="accent">${free} visita${free > 1 ? "s" : ""}</span> hoje.`;
    el.innerHTML = s;
  }

  function renderKPIs() {
    const now = new Date(), wk0 = startOfWeek(now), wk1 = new Date(wk0); wk1.setDate(wk1.getDate() + 7);
    const hoje = appts.filter((a) => isActive(a) && sameDay(new Date(a.dt), now)).length;
    const semana = appts.filter((a) => { const d = new Date(a.dt); return isActive(a) && d >= wk0 && d < wk1; }).length;
    const pend = appts.filter((a) => a.status === "pendente" && a.dt > Date.now()).length;
    const conc = appts.filter((a) => a.status === "concluido").length, falt = appts.filter((a) => a.status === "faltou").length;
    const taxa = conc + falt > 0 ? Math.round((conc / (conc + falt)) * 100) : 100;
    const cards = [
      { c: "var(--primary)", ico: I.calendar, val: hoje, suf: "", lbl: "Compromissos hoje", pill: "agenda" },
      { c: "var(--teal)", ico: I.trend, val: semana, suf: "", lbl: "Nesta semana", pill: "7 dias" },
      { c: "var(--warning)", ico: I.hourglass, val: pend, suf: "", lbl: "A confirmar", pill: "pendentes" },
      { c: "var(--success)", ico: I.check, val: taxa, suf: "%", lbl: "Comparecimento", pill: "histórico" },
    ];
    const el = $("kpis");
    el.innerHTML = cards.map((k, i) => `<div class="kpi reveal" style="--kc:${k.c};animation-delay:${i * 60}ms">
      <div class="top"><div class="ico">${k.ico}</div><span class="pill">${k.pill}</span></div>
      <div class="val tnum"><span data-count="${k.val}">0</span><span class="suf">${k.suf}</span></div>
      <div class="lbl">${k.lbl}</div></div>`).join("");
    animateCounts(el);
  }
  function animateCounts(scope) {
    scope.querySelectorAll("[data-count]").forEach((n) => {
      const target = +n.getAttribute("data-count"), dur = 1000, t0 = performance.now();
      (function step(t) { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); n.textContent = Math.round(target * e); if (p < 1) requestAnimationFrame(step); })(t0);
    });
  }

  function apptCard(a, idx, isNext) {
    const t = TYPES[a.tipo] || TYPES.visita, c = corrById(a.corretor_id), d = new Date(a.dt);
    return `<div class="appt reveal${isNext ? " is-next" : ""}" data-id="${a.id}" style="animation-delay:${Math.min(idx * 45, 360)}ms">
      <div class="time"><div class="h tnum">${pad(d.getHours())}:${pad(d.getMinutes())}</div><div class="dur">${a.dur}min</div></div>
      <div class="body">
        <div class="row1"><span class="cli">${esc(a.cliente)}</span><span class="type-chip" style="background:color-mix(in srgb,${t.color} 15%,transparent);color:${t.color}">${t.icon}${t.label}</span></div>
        <div class="meta">${I.pin}<span class="addr">${esc(a.imovel_endereco || "Local a definir")}</span>${a.imovel_bairro ? `<span class="code">${esc(a.imovel_bairro)}</span>` : ""}</div>
        ${a.nota ? `<div class="note">${I.note}<span>${esc(a.nota)}</span></div>` : ""}
        <div class="foot"><span class="avatar" style="background:linear-gradient(135deg,${c.cor},color-mix(in srgb,${c.cor} 55%,#000))">${initials(c.nome)}</span>
          <span class="corretor">${esc((c.nome || "").split(" ")[0])}</span>
          <span class="status st-${a.status}"><span class="sd"></span>${statusLabel(a.status)}</span></div>
        <div class="appt-share">
          <button class="ash" data-share="cal" data-id="${a.id}" title="Adicionar ao Google Agenda">${I.calendar}<span>Agenda</span></button>
          <button class="ash" data-share="mail" data-id="${a.id}" title="Enviar e-mail ao cliente">${I.mail}<span>E-mail</span></button>
          <button class="ash wa" data-share="wa" data-id="${a.id}" title="Lembrar no WhatsApp">${I.whats}<span>WhatsApp</span></button>
        </div>
      </div>
      <button class="menu-btn" data-menu="${a.id}" aria-label="Opções">${I.more}</button>
      <div class="cardmenu" id="menu-${a.id}">
        <button data-act="confirmar" data-id="${a.id}">${I.check} Confirmar</button>
        <button data-act="concluir" data-id="${a.id}">${I.check} Marcar concluído</button>
        <button class="danger" data-act="cancelar" data-id="${a.id}">${I.x} Cancelar</button>
      </div></div>`;
  }

  function renderAgenda() {
    const el = $("agenda"), now = new Date();
    let list = appts.filter(isActive).slice();
    if (corrFilter) list = list.filter((a) => a.corretor_id === corrFilter);
    let title = "Agenda", sub = "";
    if (view === "hoje") { list = list.filter((a) => sameDay(new Date(a.dt), now)); title = "Hoje"; sub = longDate(now); }
    else if (view === "semana") { const w0 = startOfWeek(now), w1 = new Date(w0); w1.setDate(w1.getDate() + 7); list = list.filter((a) => { const d = new Date(a.dt); return d >= w0 && d < w1; }); title = "Esta semana"; sub = "Próximos 7 dias"; }
    else if (view === "dia") { list = list.filter((a) => sameDay(new Date(a.dt), selDay)); title = longDate(selDay); sub = "Dia selecionado"; }
    else { title = "Todos os compromissos"; sub = list.length + " no total"; }
    if (corrFilter) sub += " · " + corrById(corrFilter).nome;
    $("agendaTitle").textContent = title; $("agendaSub").textContent = sub;
    list.sort((a, b) => a.dt - b.dt);
    const nx = nextAppt();
    if (!list.length) {
      el.innerHTML = `<div class="empty reveal"><div class="ei">${I.calPlus}</div><h3>Nada agendado ${view === "hoje" ? "para hoje" : "aqui"}</h3><p>Sua agenda está livre. Toque em “Novo agendamento” para marcar uma visita.</p></div>`;
      return;
    }
    if (view === "hoje" || view === "dia") {
      el.innerHTML = `<div class="daygroup">` + list.map((a, i) => apptCard(a, i, nx && a.id === nx.id)).join("") + `</div>`;
    } else {
      const groups = {}; list.forEach((a) => { const k = dayKey(new Date(a.dt)); (groups[k] = groups[k] || []).push(a); });
      let idx = 0, html = "";
      Object.keys(groups).sort().forEach((k) => { const g = groups[k], d = new Date(g[0].dt);
        html += `<div class="daygroup"><div class="day-label"><span>${relDay(d)}</span><span class="cnt">${g.length}</span><span class="line"></span></div>` + g.map((a) => apptCard(a, idx++, nx && a.id === nx.id)).join("") + `</div>`; });
      el.innerHTML = html;
    }
  }

  function renderSpot() {
    const el = $("spot"), a = nextAppt();
    if (!a) { el.innerHTML = `<div class="glow"></div><div class="eyebrow"><span class="live"></span> Sua próxima visita</div><div class="cd">—</div><div class="when">Nenhuma visita futura agendada</div>`; if (cdTimer) clearInterval(cdTimer); return; }
    const t = TYPES[a.tipo] || TYPES.visita, c = corrById(a.corretor_id), d = new Date(a.dt);
    el.innerHTML = `<div class="glow"></div><div class="eyebrow"><span class="live"></span> Sua próxima ${t.label.toLowerCase()}</div>
      <div class="cd tnum" id="cd">—</div><div class="when" id="cdWhen">${relDay(d)} · ${pad(d.getHours())}:${pad(d.getMinutes())}</div>
      <div class="sp-cli">${esc(a.cliente)}</div>
      <div class="sp-line">${I.pin}<span>${esc(a.imovel_endereco || "Local a definir")}</span></div>
      ${a.imovel_bairro ? `<div class="sp-line">${I.home}<span>${esc(a.imovel_bairro)}</span></div>` : ""}
      <div class="sp-line"><span class="avatar" style="width:16px;height:16px;font-size:8px;background:linear-gradient(135deg,${c.cor},color-mix(in srgb,${c.cor} 55%,#000))">${initials(c.nome)}</span><span>${esc(c.nome)}</span></div>
      ${a.nota ? `<div class="sp-line">${I.note}<span>${esc(a.nota)}</span></div>` : ""}
      <div class="sp-actions"><button class="sp-btn" data-act="confirmar" data-id="${a.id}">${I.check} Confirmar</button><button class="sp-btn go" data-act="reagendar" data-id="${a.id}">${I.clock} Reagendar</button></div>`;
    tickCountdown(); if (cdTimer) clearInterval(cdTimer); cdTimer = setInterval(tickCountdown, 1000);
  }
  function tickCountdown() {
    const cd = $("cd"); if (!cd) return; const a = nextAppt(); if (!a) { renderSpot(); return; }
    let ms = a.dt - Date.now(); if (ms < 0) { renderAll(); return; }
    const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
    if (h >= 24) { const days = Math.floor(h / 24); cd.innerHTML = `em ${days}<small> dia${days > 1 ? "s" : ""}</small>`; }
    else if (h >= 1) cd.innerHTML = `${h}<small>h</small> ${pad(m)}<small>min</small>`;
    else cd.innerHTML = `${pad(m)}<small>min</small> ${pad(s)}<small>s</small>`;
  }

  function renderWeek() {
    const el = $("week"), now = new Date(), w0 = startOfWeek(now); let html = "";
    for (let i = 0; i < 7; i++) {
      const d = new Date(w0); d.setDate(d.getDate() + i);
      const cnt = appts.filter((a) => isActive(a) && sameDay(new Date(a.dt), d)).length;
      const isToday = sameDay(d, now), isSel = view === "dia" && selDay && sameDay(d, selDay);
      html += `<div class="wd${isToday ? " today" : ""}${isSel ? " sel" : ""}" data-day="${d.getTime()}"><div class="dow">${DOW[d.getDay()]}</div><div class="dnum tnum">${d.getDate()}</div><div class="dcnt">${cnt ? `<span class="badge tnum">${cnt}</span>` : `<span class="dot"></span>`}</div></div>`;
    }
    el.innerHTML = html;
  }
  function renderCorr() {
    const el = $("corretores");
    if (!corretores.length) { el.innerHTML = `<div style="font-size:12.5px;color:var(--txt-2)">Nenhum corretor cadastrado ainda.</div>`; return; }
    el.innerHTML = corretores.map((c) => {
      const cnt = appts.filter((a) => isActive(a) && a.corretor_id === c.id && a.dt >= startOfWeek(new Date())).length;
      const on = corrFilter === c.id;
      return `<div class="corr${on ? " active" : ""}" data-corr="${c.id}"><span class="avatar" style="background:linear-gradient(135deg,${c.cor},color-mix(in srgb,${c.cor} 55%,#000))">${initials(c.nome)}</span><span class="cn">${esc(c.nome)}</span><span class="cc tnum">${cnt}</span></div>`;
    }).join("");
  }
  function takenSet(dateObj) {
    const s = new Set();
    appts.filter((a) => isActive(a) && sameDay(new Date(a.dt), dateObj)).forEach((a) => { const d = new Date(a.dt); s.add(pad(d.getHours()) + ":" + pad(d.getMinutes())); });
    return s;
  }
  function renderFree() {
    const el = $("freeSlots"), now = new Date(), taken = takenSet(now);
    const free = HORAS.filter((h) => { if (taken.has(h)) return false; const [hh, mm] = h.split(":").map(Number); return atTime(now, hh, mm) > now; }).slice(0, 6);
    if (!free.length) { el.innerHTML = `<span style="font-size:12.5px;color:var(--txt-2)">Nenhum horário livre hoje</span>`; return; }
    el.innerHTML = free.map((h) => `<button class="slot" data-slot="${h}">${h}</button>`).join("");
  }

  /* ============================================================
     TOAST
     ============================================================ */
  function toast(title, sub, variant) {
    const el = document.createElement("div"); el.className = "toast" + (variant === "warn" ? " warn" : "");
    el.innerHTML = `<div class="ti">${variant === "warn" ? I.hourglass : I.check}</div><div><div class="tt">${esc(title)}</div>${sub ? `<div class="ts">${esc(sub)}</div>` : ""}</div>`;
    $("toastWrap").appendChild(el); requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 400); }, 3200);
  }

  /* ============================================================
     SLIDE-OVER (novo agendamento)
     ============================================================ */
  async function lookupCep() {
    const raw = ($("fCep").value || "").replace(/\D/g, "");
    if (raw.length !== 8) return;
    $("cepHint").textContent = "Buscando endereço…";
    try {
      const r = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const j = await r.json();
      if (j && !j.erro) {
        if (j.logradouro) $("fRua").value = j.logradouro;
        $("fBairro").value = [j.bairro, j.localidade ? j.localidade + (j.uf ? "/" + j.uf : "") : ""].filter(Boolean).join(" · ");
        $("cepHint").textContent = "Endereço preenchido — confira e coloque o número.";
        $("fNumero").focus();
      } else { $("cepHint").textContent = "CEP não encontrado — pode digitar o endereço na mão."; }
    } catch (e) { $("cepHint").textContent = "Não consegui buscar agora — digite o endereço na mão."; }
  }
  function maskCep() {
    let v = ($("fCep").value || "").replace(/\D/g, "").slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
    $("fCep").value = v;
    if (v.replace(/\D/g, "").length === 8) lookupCep();
  }
  function renderTypeSegs() { $("typeSegs").innerHTML = Object.entries(TYPES).map(([k, t]) => `<button class="seg${form.tipo === k ? " on" : ""}" data-type="${k}" style="--sc:${t.color}">${t.icon}${t.label}</button>`).join(""); }
  function renderCorrSegs() { $("corrSegs").innerHTML = corretores.length ? corretores.map((c) => `<button class="seg${form.corr === c.id ? " on" : ""}" data-cseg="${c.id}" style="--sc:${c.cor}">${esc((c.nome || "").split(" ")[0])}</button>`).join("") : `<span style="font-size:12.5px;color:var(--txt-2)">Cadastre corretores no painel do dono.</span>`; }
  function renderTimeGrid() {
    const dv = $("fData").value, dateObj = dv ? new Date(dv + "T00:00:00") : new Date(), taken = takenSet(dateObj), now = new Date();
    $("timeGrid").innerHTML = HORAS.map((h) => {
      const [hh, mm] = h.split(":").map(Number), slot = new Date(dateObj); slot.setHours(hh, mm, 0, 0);
      const dis = taken.has(h) || slot < now;
      return `<button class="tslot${form.hora === h ? " on" : ""}" data-time="${h}" ${dis ? "disabled" : ""}>${h}</button>`;
    }).join("");
  }
  function openSheet(prefill) {
    form = { tipo: "visita", corr: corretores[0] ? corretores[0].id : null, hora: prefill && prefill.hora ? prefill.hora : null, dur: 45 };
    $("fCliente").value = ""; $("fFone").value = ""; $("fNota").value = ""; $("fDur").value = "45"; $("fData").value = dayKey(new Date());
    $("fCep").value = ""; $("fRua").value = ""; $("fNumero").value = ""; $("fBairro").value = "";
    $("cepHint").textContent = "Digite o CEP que eu preencho a rua e o bairro pra você.";
    renderTypeSegs(); renderCorrSegs(); renderTimeGrid();
    $("errCliente").classList.remove("show"); $("errHora").classList.remove("show");
    $("scrim").classList.add("open"); $("sheet").classList.add("open");
    setTimeout(() => $("fCliente").focus(), 340);
  }
  function closeSheet() { $("scrim").classList.remove("open"); $("sheet").classList.remove("open"); }

  async function saveAppt() {
    const cli = $("fCliente").value.trim(); let ok = true;
    if (!cli) { $("errCliente").classList.add("show"); ok = false; } else $("errCliente").classList.remove("show");
    if (!form.hora) { $("errHora").classList.add("show"); ok = false; } else $("errHora").classList.remove("show");
    if (!form.corr) { toast("Sem corretor", "Cadastre um corretor primeiro.", "warn"); ok = false; }
    if (!ok) return;
    const rua = $("fRua").value.trim(), numero = $("fNumero").value.trim(), bairro = $("fBairro").value.trim(), cep = $("fCep").value.trim();
    if (!rua) { toast("Falta o endereço", "Informe a rua/avenida do imóvel (o CEP ajuda a preencher).", "warn"); return; }
    const endereco = numero ? `${rua}, ${numero}` : rua;
    const dv = $("fData").value, [hh, mm] = form.hora.split(":").map(Number), dt = new Date(dv + "T00:00:00"); dt.setHours(hh, mm, 0, 0);
    const btn = $("saveAppt"); btn.disabled = true;
    try {
      const rec = await Data.appointments.add({
        corretor_id: form.corr, cliente: cli, telefone: $("fFone").value.trim() || "—", tipo: form.tipo,
        imovel_cod: null, imovel_cep: cep, imovel_endereco: endereco, imovel_bairro: bairro, imovel_preco: null,
        dt: dt.getTime(), dur: +$("fDur").value, status: "confirmado", nota: $("fNota").value.trim(),
      });
      appts.push(rec); closeSheet();
      if (sameDay(dt, new Date())) { view = "hoje"; setActiveTab("hoje"); } else { view = "dia"; selDay = dt; setActiveTab(""); }
      corrFilter = null; renderAll();
      toast("Agendamento confirmado", `${(TYPES[form.tipo] || TYPES.visita).label} · ${cli} · ${relDay(dt)} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`);
    } catch (err) { toast("Não deu pra salvar", err.message, "warn"); }
    finally { btn.disabled = false; }
  }

  async function act(id, action) {
    const a = appts.find((x) => x.id === id); if (!a) return;
    if (action === "reagendar") { openSheet(); return; }
    const map = { confirmar: "confirmado", concluir: "concluido", cancelar: "cancelado" };
    const st = map[action]; if (!st) return;
    try { await Data.appointments.update(id, { status: st }); a.status = st; renderAll();
      toast(action === "confirmar" ? "Visita confirmada" : action === "concluir" ? "Compromisso concluído" : "Agendamento cancelado", a.cliente);
    } catch (err) { toast("Falhou", err.message, "warn"); }
  }
  function setActiveTab(v) { document.querySelectorAll("#tabs .tab").forEach((t) => t.classList.toggle("active", t.dataset.view === v)); }

  /* ============================================================
     ADMIN
     ============================================================ */
  async function showAdmin() {
    if (!CUR || CUR.role !== "admin") { toast("Sem permissão", "Só o dono acessa o painel.", "warn"); return; }
    showView("admin"); await renderAdmin();
  }
  async function renderAdmin() {
    let users = [];
    try { users = await Data.users.list(); } catch (err) { toast("Erro", err.message, "warn"); }
    const total = users.length, admins = users.filter((u) => u.role === "admin").length,
      corr = users.filter((u) => u.role === "corretor" || u.role === "gestor").length, ativos = users.filter((u) => u.ativo).length;
    $("adminStats").innerHTML = [
      { c: "var(--primary)", ico: I.users, v: total, l: "Usuários" },
      { c: "var(--teal)", ico: I.users, v: corr, l: "Corretores" },
      { c: "var(--success)", ico: I.check, v: ativos, l: "Ativos" },
      { c: "var(--warning)", ico: I.shield, v: admins, l: "Admins" },
    ].map((k) => `<div class="kpi" style="--kc:${k.c}"><div class="top"><div class="ico">${k.ico}</div></div><div class="val tnum">${k.v}</div><div class="lbl">${k.l}</div></div>`).join("");

    $("uBody").innerHTML = users.map((u) => {
      const self = CUR && u.id === CUR.id;
      return `<tr data-uid="${u.id}">
        <td data-l="Usuário"><div class="u-user"><span class="avatar" style="background:linear-gradient(135deg,${u.cor || "#7C5CFC"},color-mix(in srgb,${u.cor || "#7C5CFC"} 55%,#000))">${initials(u.nome)}</span><div><div class="un">${esc(u.nome)}${self ? " · você" : ""}</div><div class="ue">${esc(u.email || "")}</div></div></div></td>
        <td data-l="Cargo"><select class="input u-role" data-uid="${u.id}" style="padding:7px 9px;font-size:12.5px;width:auto" ${self ? "disabled" : ""}>
            <option value="corretor" ${u.role === "corretor" ? "selected" : ""}>Corretor</option>
            <option value="gestor" ${u.role === "gestor" ? "selected" : ""}>Gestor</option>
            <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option></select></td>
        <td data-l="Status"><span class="dot-status ${u.ativo ? "dot-on" : "dot-off"}"><span class="d"></span>${u.ativo ? "Ativo" : "Desativado"}</span></td>
        <td data-l="Último acesso">${fromNow(typeof u.last_sign_in === "string" ? new Date(u.last_sign_in).getTime() : u.last_sign_in)}</td>
        <td data-l="Ações"><div class="u-actions">
          <button class="u-act" data-uact="reset" data-uid="${u.id}" title="Resetar senha">${I.reset}</button>
          <button class="u-act ${u.ativo ? "danger" : ""}" data-uact="toggle" data-uid="${u.id}" ${self ? "disabled" : ""}>${u.ativo ? "Desativar" : "Ativar"}</button>
        </div></td></tr>`;
    }).join("");
  }
  async function addCorretor() {
    const nome = $("acNome").value.trim(), email = $("acEmail").value.trim(), senha = $("acSenha").value;
    const err = $("acErr");
    const fail = (m) => { err.textContent = m; err.classList.add("show"); };
    if (nome.length < 2) return fail("Digite o nome do corretor.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("Digite um e-mail válido.");
    if (senha.length < 6) return fail("A senha inicial precisa de pelo menos 6 caracteres.");
    err.classList.remove("show");
    const btn = $("acBtn"); btn.disabled = true; btn.textContent = "Adicionando…";
    try {
      await Data.users.create(nome, email, senha);
      $("acNome").value = ""; $("acEmail").value = ""; $("acSenha").value = "";
      corretores = await Data.corretores.list();
      toast("Corretor adicionado", `${nome} já pode entrar com a senha inicial.`);
      await renderAdmin();
    } catch (e) { fail(e.message || "Não foi possível adicionar."); }
    finally { btn.disabled = false; btn.textContent = "Adicionar"; }
  }
  async function adminAction(uid, action, value) {
    try {
      if (action === "role") { await Data.users.update(uid, { role: value }); toast("Cargo atualizado"); }
      else if (action === "toggle") { const users = await Data.users.list(); const u = users.find((x) => x.id === uid); await Data.users.update(uid, { ativo: !u.ativo }); toast(u.ativo ? "Acesso desativado" : "Acesso reativado", u.nome); }
      else if (action === "reset") { const r = await Data.users.resetPassword(uid); if (r.temp) toast("Senha temporária gerada", "Nova senha: " + r.temp); else toast("E-mail de redefinição enviado"); }
      await renderAdmin();
    } catch (err) { toast("Falhou", err.message, "warn"); }
  }

  /* ============================================================
     RELÓGIO
     ============================================================ */
  function startClock() {
    if (clockTimer) clearInterval(clockTimer);
    const tick = () => { const d = new Date(); $("clockDate").textContent = `${DOW_FULL[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`; $("clockTime").textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
    tick(); clockTimer = setInterval(tick, 10000);
  }

  /* ============================================================
     EVENTOS
     ============================================================ */
  function wireAppEvents() {
    $("openNew").addEventListener("click", () => openSheet());
    $("closeSheet").addEventListener("click", closeSheet);
    $("cancelSheet").addEventListener("click", closeSheet);
    $("saveAppt").addEventListener("click", saveAppt);
    $("scrim").addEventListener("click", closeSheet);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });

    $("tabs").addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (!b) return; view = b.dataset.view; selDay = null; setActiveTab(view); renderAgenda(); renderWeek(); });
    $("typeSegs").addEventListener("click", (e) => { const b = e.target.closest("[data-type]"); if (!b) return; form.tipo = b.dataset.type; renderTypeSegs(); });
    $("corrSegs").addEventListener("click", (e) => { const b = e.target.closest("[data-cseg]"); if (!b) return; form.corr = b.dataset.cseg; renderCorrSegs(); });
    $("timeGrid").addEventListener("click", (e) => { const b = e.target.closest("[data-time]"); if (!b || b.disabled) return; form.hora = b.dataset.time; renderTimeGrid(); $("errHora").classList.remove("show"); });
    $("fData").addEventListener("change", () => { form.hora = null; renderTimeGrid(); });
    $("fCep").addEventListener("input", maskCep);
    $("fCep").addEventListener("blur", lookupCep);

    // topbar
    $("userChip").addEventListener("click", (e) => { e.stopPropagation(); $("userMenu").classList.toggle("open"); });
    $("btnAdmin").addEventListener("click", showAdmin);
    $("umAdmin").addEventListener("click", () => { $("userMenu").classList.remove("open"); showAdmin(); });
    $("umLogout").addEventListener("click", doLogout);
    $("adminBack").addEventListener("click", async () => { showView("app"); renderAll(); });
    $("acBtn").addEventListener("click", addCorretor);
    $("acSenha").addEventListener("keydown", (e) => { if (e.key === "Enter") addCorretor(); });

    // admin delegation
    $("uBody").addEventListener("click", (e) => { const b = e.target.closest("[data-uact]"); if (!b || b.disabled) return; adminAction(b.dataset.uid, b.dataset.uact); });
    $("uBody").addEventListener("change", (e) => { const s = e.target.closest(".u-role"); if (!s) return; adminAction(s.dataset.uid, "role", s.value); });

    // delegação global (semana, corretores, slots, cards, menus)
    document.body.addEventListener("click", (e) => {
      const wd = e.target.closest("[data-day]"); if (wd) { view = "dia"; selDay = new Date(+wd.dataset.day); setActiveTab(""); renderAgenda(); renderWeek(); return; }
      const cf = e.target.closest("[data-corr]"); if (cf) { corrFilter = corrFilter === cf.dataset.corr ? null : cf.dataset.corr; renderCorr(); renderAgenda(); return; }
      const sl = e.target.closest("[data-slot]"); if (sl) { openSheet({ hora: sl.dataset.slot }); return; }
      const mb = e.target.closest("[data-menu]"); if (mb) { e.stopPropagation(); const m = $("menu-" + mb.dataset.menu); document.querySelectorAll(".cardmenu.open").forEach((x) => { if (x !== m) x.classList.remove("open"); }); m.classList.toggle("open"); return; }
      const sh = e.target.closest("[data-share]"); if (sh) { e.stopPropagation(); const a = appts.find((x) => x.id === sh.dataset.id); if (a) { const u = sh.dataset.share === "cal" ? calUrl(a) : sh.dataset.share === "mail" ? mailUrl(a) : waUrl(a); if (sh.dataset.share === "wa" && !phoneDigits(a.telefone)) { toast("Sem telefone", "Esse cliente não tem telefone cadastrado.", "warn"); } else { window.open(u, "_blank", "noopener"); } } document.querySelectorAll(".cardmenu.open").forEach((x) => x.classList.remove("open")); return; }
      const ab = e.target.closest("[data-act]"); if (ab) { e.stopPropagation(); act(ab.dataset.id, ab.dataset.act); document.querySelectorAll(".cardmenu.open").forEach((x) => x.classList.remove("open")); return; }
      if (!e.target.closest("#userChip") && !e.target.closest("#userMenu")) $("userMenu").classList.remove("open");
      document.querySelectorAll(".cardmenu.open").forEach((x) => x.classList.remove("open"));
    });
  }

  async function doLogout() {
    $("userMenu").classList.remove("open");
    try { await Data.auth.signOut(); } catch (e) {}
    CUR = null; if (cdTimer) clearInterval(cdTimer); if (clockTimer) clearInterval(clockTimer);
    $("liPass").value = ""; showView("auth"); clearAuthMsg(); switchAuth("login");
  }

  /* ============================================================
     BOOT
     ============================================================ */
  async function boot() {
    initAuthUI(); wireAppEvents();
    try {
      const u = await Data.auth.currentUser();
      if (u && u.ativo !== false) { CUR = u; await enterApp(); }
      else { if (u) await Data.auth.signOut(); showView("auth"); }
    } catch (e) { showView("auth"); }
    $("boot").classList.add("hide");
  }
  boot();
})();
