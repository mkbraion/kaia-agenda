/* ============================================================
   KAIA Agenda — configuração
   ------------------------------------------------------------
   Enquanto as chaves abaixo estiverem VAZIAS, o app roda em
   MODO DEMO (dados salvos só no navegador — ótimo pra testar e
   fazer pitch, mas não é 24/7).

   Para ligar o modo REAL (login + banco 24/7 no Supabase),
   siga o passo a passo em SETUP.md e cole aqui:
     - SUPABASE_URL       (Settings → API → Project URL)
     - SUPABASE_ANON_KEY  (Settings → API → anon public)
   ============================================================ */
window.KAIA_CONFIG = {
  SUPABASE_URL: "https://nqcnnyodlnrjeqnyhdps.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_o3sSBkN8QKNzQ9Hmm9KAfA_Xg5gKZF0",

  // Nome do escritório mostrado no topo.
  ESCRITORIO: "RE/MAX Londero",

  // E-mail do DONO/desenvolvedor. Em modo demo, esta conta entra
  // automaticamente como admin (acesso ao painel de usuários).
  // Em modo real, o cargo 'admin' vem do banco (veja SETUP.md).
  OWNER_EMAIL: "mkbraion@gmail.com"
};
