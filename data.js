/* ============================================================
   KAIA Agenda — camada de dados (Data)
   API única para auth / agendamentos / usuários.
   - Se config.js tiver as chaves do Supabase  -> modo REAL (24/7)
   - Caso contrário                             -> modo DEMO (localStorage)
   ============================================================ */
(function () {
  "use strict";
  const CFG = window.KAIA_CONFIG || {};
  const SUPA_ON = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase);
  const OWNER = (CFG.OWNER_EMAIL || "").toLowerCase();

  let sb = null;
  if (SUPA_ON) sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);

  /* ---------- utils ---------- */
  const rid = (p) => (p || "id") + Math.random().toString(36).slice(2, 10);
  async function hash(txt) {
    try {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("kaia::" + txt));
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      // fallback (contexto não seguro) — só demo
      let h = 0; for (const c of "kaia::" + txt) h = (h * 31 + c.charCodeAt(0)) | 0;
      return "f" + (h >>> 0).toString(16);
    }
  }

  /* ============================================================
     MODO DEMO (localStorage)
     ============================================================ */
  const LS_USERS = "kaia_users_v1";
  const LS_APPTS = "kaia_appts_v3";
  const LS_SESSION = "kaia_session_v1";

  const DEMO_CORRETORES = [
    { id: "c1", nome: "Nelson Neto", cor: "#7C5CFC" },
    { id: "c2", nome: "Pedro Nunes", cor: "#00E5CC" },
    { id: "c3", nome: "Gustavo Vieira", cor: "#FFB547" },
  ];

  async function demoSeedUsers() {
    const pass = await hash("demo1234");
    const now = Date.now();
    const users = [
      { id: "admin1", nome: "Londero", email: OWNER || "londero@remax.com", telefone: "", role: "admin", cor: "#7C5CFC", ativo: true, created_at: now - 86400000 * 40, last_sign_in: now, passHash: pass },
      { id: "c1", nome: "Nelson Neto", email: "nelson@remaxlondero.com", telefone: "", role: "corretor", cor: "#7C5CFC", ativo: true, created_at: now - 86400000 * 30, last_sign_in: now - 3600000 * 5, passHash: pass },
      { id: "c2", nome: "Pedro Nunes", email: "pedro@remaxlondero.com", telefone: "", role: "corretor", cor: "#00E5CC", ativo: true, created_at: now - 86400000 * 24, last_sign_in: now - 3600000 * 26, passHash: pass },
      { id: "c3", nome: "Gustavo Vieira", email: "gustavo@remaxlondero.com", telefone: "", role: "corretor", cor: "#FFB547", ativo: true, created_at: now - 86400000 * 18, last_sign_in: now - 3600000 * 2, passHash: pass },
    ];
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    return users;
  }
  async function demoUsers() {
    try { const r = JSON.parse(localStorage.getItem(LS_USERS) || "null"); if (Array.isArray(r) && r.length) return r; } catch (e) {}
    return demoSeedUsers();
  }
  function demoSaveUsers(u) { localStorage.setItem(LS_USERS, JSON.stringify(u)); }

  function demoSeedAppts() {
    const now = new Date();
    const at = (h, m, addDays) => { const d = new Date(now); d.setDate(d.getDate() + addDays); d.setHours(h, m, 0, 0); return d.getTime(); };
    const NOTES = {
      "Patrícia Gomes": "Busca 3 dormitórios nos Jardins, até R$ 1,3 mi.",
      "Ricardo Salles": "Quer avaliar pra vender — imóvel de herança.",
      "Família Andrade": "Segunda visita, vêm com as crianças ver a área de lazer.",
      "Investidor · Grupo Vega": "Analisando 3 salas na Paulista pra locação.",
      "Juliana Reis": "Primeiro imóvel, financiamento pela Caixa.",
      "Marcelo Duarte": "Transferência de cidade — precisa fechar em 30 dias.",
      "Proprietário · Ed. Aurora": "Quer colocar o apto pra captação nesta semana.",
      "Tânia & Roberto": "Assinatura do contrato, crédito já aprovado.",
      "Eduardo Pires": "Comparando com o RX-3310, foco no custo de condomínio.",
      "Sra. Vera Lúcia": "Avaliação pra inventário, pediu laudo detalhado.",
      "Rodrigo Antunes": "Investidor iniciante, busca boa liquidez de revenda.",
      "Fernanda Lima": "Gostou muito do apto, aguardando a proposta.",
      "Sr. Otávio Prado": "Avaliação concluída, vai pensar no valor.",
      "Casal Menezes": "Fecharam a visita, seguem bem interessados.",
      "Bruno Tavares": "Não compareceu na última — vale reconfirmar antes.",
      "Helena Costa": "Contrato assinado, cliente satisfeita.",
    };
    const mk = (off, h, m, tipo, corr, cli, fone, imv, status) => ({
      id: rid("a"), dt: at(h, m, off), dur: tipo === "reuniao" ? 60 : tipo === "assinatura" ? 90 : 45,
      tipo, corretor_id: corr, cliente: cli, telefone: fone, imovel_cod: imv, status, nota: NOTES[cli] || "", created_by: "admin1",
    });
    const rows = [
      mk(-2, 10, 0, "visita", "c1", "Fernanda Lima", "(11) 9 8123-4567", "RX-1042", "concluido"),
      mk(-2, 15, 0, "avaliacao", "c2", "Sr. Otávio Prado", "(11) 9 9871-2200", "RX-2087", "concluido"),
      mk(-1, 9, 30, "visita", "c3", "Casal Menezes", "(11) 9 9440-1188", "RX-1188", "concluido"),
      mk(-1, 14, 0, "visita", "c1", "Bruno Tavares", "(11) 9 9333-0021", "RX-2455", "faltou"),
      mk(-1, 17, 0, "assinatura", "c3", "Helena Costa", "(11) 9 9002-7781", "RX-1975", "concluido"),
      mk(0, 9, 0, "visita", "c1", "Patrícia Gomes", "(11) 9 9556-3412", "RX-1042", "confirmado"),
      mk(0, 11, 0, "avaliacao", "c2", "Ricardo Salles", "(11) 9 9880-1122", "RX-3310", "confirmado"),
      mk(0, 14, 30, "visita", "c3", "Família Andrade", "(11) 9 9671-4590", "RX-1188", "pendente"),
      mk(0, 16, 0, "reuniao", "c1", "Investidor · Grupo Vega", "(11) 9 9701-8834", "RX-4021", "confirmado"),
      mk(0, 18, 0, "visita", "c2", "Juliana Reis", "(11) 9 9245-6677", "RX-1975", "pendente"),
      mk(1, 10, 0, "visita", "c2", "Marcelo Duarte", "(11) 9 9812-3390", "RX-2087", "confirmado"),
      mk(1, 15, 0, "captacao", "c3", "Proprietário · Ed. Aurora", "(11) 9 9134-5567", "RX-2455", "pendente"),
      mk(2, 9, 30, "assinatura", "c1", "Tânia & Roberto", "(11) 9 9008-4412", "RX-1042", "confirmado"),
      mk(2, 16, 30, "visita", "c1", "Eduardo Pires", "(11) 9 9670-2231", "RX-3310", "confirmado"),
      mk(3, 11, 0, "avaliacao", "c2", "Sra. Vera Lúcia", "(11) 9 9345-9987", "RX-1975", "pendente"),
      mk(4, 14, 0, "visita", "c3", "Rodrigo Antunes", "(11) 9 9556-0098", "RX-1188", "confirmado"),
    ];
    localStorage.setItem(LS_APPTS, JSON.stringify(rows));
    return rows;
  }
  function demoAppts() {
    try { const r = JSON.parse(localStorage.getItem(LS_APPTS) || "null"); if (Array.isArray(r)) return r; } catch (e) {}
    return demoSeedAppts();
  }
  function demoSaveAppts(a) { localStorage.setItem(LS_APPTS, JSON.stringify(a)); }

  /* ============================================================
     API pública
     ============================================================ */
  const Data = {
    mode: SUPA_ON ? "supabase" : "demo",
    ownerEmail: OWNER,

    auth: {
      /* devolve {id,nome,email,role,cor} ou null */
      async currentUser() {
        if (SUPA_ON) {
          const { data } = await sb.auth.getUser();
          if (!data || !data.user) return null;
          const u = data.user;
          const { data: p } = await sb.from("profiles").select("*").eq("id", u.id).maybeSingle();
          return p ? { id: u.id, email: u.email, nome: p.nome, role: p.role, cor: p.cor, ativo: p.ativo } : { id: u.id, email: u.email, nome: (u.email || "").split("@")[0], role: "corretor", cor: "#7C5CFC", ativo: true };
        }
        const sid = localStorage.getItem(LS_SESSION); if (!sid) return null;
        const u = (await demoUsers()).find((x) => x.id === sid); if (!u) return null;
        return { id: u.id, email: u.email, nome: u.nome, role: u.role, cor: u.cor, ativo: u.ativo };
      },

      async signIn(email, password) {
        email = (email || "").trim().toLowerCase();
        if (SUPA_ON) {
          const { error } = await sb.auth.signInWithPassword({ email, password });
          if (error) throw new Error(mapErr(error.message));
          return true;
        }
        const users = await demoUsers();
        const u = users.find((x) => (x.email || "").toLowerCase() === email);
        if (!u) throw new Error("E-mail não encontrado.");
        if (!u.ativo) throw new Error("Este acesso está desativado. Fale com o gestor.");
        if (u.passHash !== (await hash(password))) throw new Error("Senha incorreta.");
        u.last_sign_in = Date.now(); demoSaveUsers(users);
        localStorage.setItem(LS_SESSION, u.id);
        return true;
      },

      async signUp(nome, email, password) {
        nome = (nome || "").trim(); email = (email || "").trim().toLowerCase();
        if (SUPA_ON) {
          const { error } = await sb.auth.signUp({ email, password, options: { data: { nome } } });
          if (error) throw new Error(mapErr(error.message));
          // tenta logar em seguida (se confirmação de e-mail estiver desligada)
          await sb.auth.signInWithPassword({ email, password }).catch(() => {});
          return true;
        }
        const users = await demoUsers();
        if (users.some((x) => (x.email || "").toLowerCase() === email)) throw new Error("Já existe uma conta com este e-mail.");
        const cores = ["#7C5CFC", "#00E5CC", "#FFB547", "#00E5A0", "#FF4D6D"];
        const u = { id: rid("u"), nome, email, telefone: "", role: email === OWNER ? "admin" : "corretor",
          cor: cores[users.length % cores.length], ativo: true, created_at: Date.now(), last_sign_in: Date.now(), passHash: await hash(password) };
        users.push(u); demoSaveUsers(users); localStorage.setItem(LS_SESSION, u.id);
        return true;
      },

      async signOut() {
        if (SUPA_ON) { await sb.auth.signOut(); return; }
        localStorage.removeItem(LS_SESSION);
      },
    },

    corretores: {
      /* usuários que podem ser responsáveis por um agendamento */
      async list() {
        if (SUPA_ON) {
          const { data } = await sb.from("profiles").select("*").in("role", ["corretor", "gestor"]).eq("ativo", true).order("nome");
          return (data || []).map((p) => ({ id: p.id, nome: p.nome, cor: p.cor }));
        }
        const users = await demoUsers();
        return users.filter((u) => u.ativo && (u.role === "corretor" || u.role === "gestor")).map((u) => ({ id: u.id, nome: u.nome, cor: u.cor }));
      },
    },

    appointments: {
      async list() {
        if (SUPA_ON) {
          const { data, error } = await sb.from("appointments").select("*").order("dt");
          if (error) throw new Error(error.message);
          return (data || []).map((r) => ({ ...r, dt: new Date(r.dt).getTime() }));
        }
        return demoAppts().sort((a, b) => a.dt - b.dt);
      },
      async add(a) {
        if (SUPA_ON) {
          const row = { corretor_id: a.corretor_id, cliente: a.cliente, telefone: a.telefone, tipo: a.tipo,
            imovel_cod: a.imovel_cod, imovel_endereco: a.imovel_endereco, imovel_bairro: a.imovel_bairro, imovel_preco: a.imovel_preco,
            dt: new Date(a.dt).toISOString(), dur: a.dur, status: a.status, nota: a.nota };
          const { data, error } = await sb.from("appointments").insert(row).select().single();
          if (error) throw new Error(error.message);
          return { ...data, dt: new Date(data.dt).getTime() };
        }
        const all = demoAppts(); const rec = { id: rid("a"), created_by: (localStorage.getItem(LS_SESSION) || ""), ...a };
        all.push(rec); demoSaveAppts(all); return rec;
      },
      async update(id, patch) {
        if (SUPA_ON) {
          const p = { ...patch }; if (p.dt) p.dt = new Date(p.dt).toISOString();
          const { error } = await sb.from("appointments").update(p).eq("id", id);
          if (error) throw new Error(error.message);
          return true;
        }
        const all = demoAppts(); const r = all.find((x) => x.id === id); if (r) Object.assign(r, patch); demoSaveAppts(all); return true;
      },
    },

    /* ---------- painel do dono (admin) ---------- */
    users: {
      /* admin cria o acesso de um corretor. No modo real usa um cliente
         Supabase temporário (sem persistir sessão) para NÃO deslogar o admin. */
      async create(nome, email, senha) {
        nome = (nome || "").trim(); email = (email || "").trim().toLowerCase();
        const cores = ["#7C5CFC", "#00E5CC", "#FFB547", "#00E5A0", "#FF4D6D", "#9E82FF"];
        if (SUPA_ON) {
          const tmp = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY,
            { auth: { persistSession: false, autoRefreshToken: false, storageKey: "kaia_tmp_" + rid("") } });
          const { data, error } = await tmp.auth.signUp({ email, password: senha, options: { data: { nome } } });
          if (error) throw new Error(mapErr(error.message));
          try {
            const { count } = await sb.from("profiles").select("*", { count: "exact", head: true }).in("role", ["corretor", "gestor"]);
            const cor = cores[(count || 0) % cores.length];
            if (data && data.user) await sb.from("profiles").update({ nome, cor }).eq("id", data.user.id);
          } catch (e) {}
          await tmp.auth.signOut().catch(() => {});
          return true;
        }
        const users = await demoUsers();
        if (users.some((x) => (x.email || "").toLowerCase() === email)) throw new Error("Já existe uma conta com este e-mail.");
        const n = users.filter((u) => u.role === "corretor" || u.role === "gestor").length;
        users.push({ id: rid("u"), nome, email, telefone: "", role: "corretor", cor: cores[n % cores.length], ativo: true, created_at: Date.now(), last_sign_in: null, passHash: await hash(senha) });
        demoSaveUsers(users); return true;
      },
      async list() {
        if (SUPA_ON) {
          const { data, error } = await sb.from("profiles").select("*").order("created_at");
          if (error) throw new Error(error.message);
          return data || [];
        }
        return (await demoUsers()).map((u) => { const c = { ...u }; delete c.passHash; return c; });
      },
      async update(id, patch) {
        if (SUPA_ON) {
          const { error } = await sb.from("profiles").update(patch).eq("id", id);
          if (error) throw new Error(error.message);
          return true;
        }
        const users = await demoUsers(); const u = users.find((x) => x.id === id); if (u) Object.assign(u, patch); demoSaveUsers(users); return true;
      },
      async resetPassword(id) {
        // Em produção: dispara e-mail de redefinição (Supabase). Aqui devolve uma senha temporária no demo.
        if (SUPA_ON) {
          const users = await Data.users.list(); const u = users.find((x) => x.id === id);
          if (u && u.email) await sb.auth.resetPasswordForEmail(u.email);
          return { emailed: true };
        }
        const users = await demoUsers(); const u = users.find((x) => x.id === id);
        const temp = "kaia" + Math.floor(1000 + Math.random() * 9000);
        if (u) { u.passHash = await hash(temp); demoSaveUsers(users); }
        return { temp };
      },
    },
  };

  function mapErr(m) {
    m = (m || "").toLowerCase();
    if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
    if (m.includes("already registered") || m.includes("already exists")) return "Já existe uma conta com este e-mail.";
    if (m.includes("password") && m.includes("6")) return "A senha precisa ter pelo menos 6 caracteres.";
    if (m.includes("email") && m.includes("confirm")) return "Confirme seu e-mail antes de entrar.";
    return m || "Não foi possível concluir. Tente de novo.";
  }

  window.KAIA_DATA = Data;
})();
