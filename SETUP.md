# KAIA Agenda — como colocar 24/7 no ar

O app já funciona **agora** em *modo demo* (dados só no navegador). Para virar
um sistema real, com **login e banco 24/7** que você não precisa cuidar, siga
os passos abaixo. Leva ~15 min e o plano gratuito dá conta pra começar.

> Você faz os passos que envolvem **criar conta** e **colar chaves** — eu (a IA)
> não posso criar contas nem digitar senhas em seu nome. Todo o código já está
> pronto; é só ligar.

---

## 1. Criar o banco (Supabase) — o "servidor 24/7"

1. Acesse **supabase.com** → *Start your project* → entre com o Google/GitHub.
2. **New project**: dê um nome (ex.: `kaia-agenda`), crie uma **senha do banco**
   (guarde), escolha a região mais perto (ex.: *São Paulo*). Aguarde ~2 min.
3. No menu lateral, abra **SQL Editor** → *New query* → cole **todo** o conteúdo
   do arquivo [`schema.sql`](schema.sql) → **Run**. Deve aparecer "Success".
4. Vá em **Authentication → Providers → Email** e deixe **Email** ligado.
   Se quiser que o login funcione na hora (sem confirmar e-mail), em
   **Authentication → Sign In / Providers → Email**, desligue *"Confirm email"*.

## 2. Conectar o app ao banco

1. No Supabase, abra **Project Settings → API**.
2. Copie **Project URL** e **anon public** key.
3. Abra o arquivo [`config.js`](config.js) e cole nos campos:
   ```js
   SUPABASE_URL: "https://xxxx.supabase.co",
   SUPABASE_ANON_KEY: "eyJhbGc...."
   ```
   Salvou? Pronto — o app saiu do modo demo e passou a usar o banco real.
   *(A chave `anon` é pública e pode ir pro repositório. NUNCA use a
   `service_role` no front — ela é secreta.)*

## 3. Criar sua conta de dono e virar admin

1. Abra o site → aba **Cadastrar** → crie **sua** conta (nome, e-mail, senha).
2. No Supabase, **SQL Editor**, rode uma vez (troque pelo seu e-mail):
   ```sql
   update public.profiles set role = 'admin'
   where email = 'seu-email@exemplo.com';
   ```
3. Recarregue o site. Agora você tem o botão **Admin** com a lista de usuários.

## 4. Publicar 24/7 (Vercel)

**Opção A — arrastar e soltar (mais fácil):**
1. Acesse **vercel.com** → entre com o GitHub.
2. *Add New → Project → Deploy* apontando pra esta pasta (ou suba a pasta no
   GitHub e importe). Sem build: é site estático.
3. Pronto — a Vercel te dá um link `https://...vercel.app` no ar 24/7.

**Opção B — linha de comando:**
```bash
npm i -g vercel
cd kaia-agenda
vercel        # siga o assistente; aceite os padrões
vercel --prod # publica em produção
```

## Como funciona a segurança (pode contar pro cliente)

- As senhas ficam no **Auth do Supabase, com hash** — nem você, nem eu, nem
  ninguém vê a senha de um corretor. Você **reseta**, mas não **lê**.
- O acesso ao banco é protegido por **RLS** (Row Level Security): só quem está
  logado enxerga a agenda, e só o **admin** enxerga a lista de usuários.

## Dúvidas comuns
- **"Fiz tudo e o login não entra":** confira se desligou *Confirm email* (passo
  1.4) ou confirme o e-mail que o Supabase enviou.
- **"Quero voltar pro modo demo":** apague as duas chaves em `config.js`.
- **Custo:** o plano free do Supabase e da Vercel atende bem no começo; se
  crescer, dá pra subir de plano sem trocar o código.
