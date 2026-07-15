-- ============================================================
--  KAIA Agenda — schema do banco (Supabase / Postgres)
--  Cole TUDO no SQL Editor do Supabase e clique em "Run".
--  Seguro para rodar novamente (idempotente).
-- ============================================================

-- ---------- Perfis (1 por usuário do Auth) ----------
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  nome          text not null default 'Sem nome',
  email         text,
  telefone      text,
  role          text not null default 'corretor'   -- 'corretor' | 'gestor' | 'admin'
                 check (role in ('corretor','gestor','admin')),
  cor           text not null default '#7C5CFC',
  ativo         boolean not null default true,
  created_at    timestamptz not null default now(),
  last_sign_in  timestamptz
);

-- ---------- Agendamentos ----------
create table if not exists public.appointments (
  id               uuid primary key default gen_random_uuid(),
  corretor_id      uuid references public.profiles(id) on delete set null,
  cliente          text not null,
  telefone         text,
  tipo             text not null default 'visita',   -- visita|avaliacao|reuniao|assinatura|captacao
  imovel_cod       text,
  imovel_endereco  text,
  imovel_bairro    text,
  imovel_preco     text,
  dt               timestamptz not null,
  dur              int not null default 45,
  status           text not null default 'confirmado', -- confirmado|pendente|concluido|faltou|cancelado
  nota             text,
  created_by       uuid references auth.users(id) on delete set null,
  created_at       timestamptz not null default now()
);
create index if not exists appointments_dt_idx on public.appointments (dt);

-- ============================================================
--  Segurança (Row Level Security)
--  Regra: só usuários logados acessam. Admin enxerga todos os
--  perfis; cada um enxerga o próprio. Senhas ficam no Auth do
--  Supabase (com hash) — NUNCA nesta tabela.
-- ============================================================
alter table public.profiles     enable row level security;
alter table public.appointments enable row level security;

-- Função auxiliar: o usuário atual é admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- --- Políticas: profiles ---
drop policy if exists "perfil: ver o próprio ou admin vê todos" on public.profiles;
create policy "perfil: ver o próprio ou admin vê todos"
  on public.profiles for select using ( id = auth.uid() or public.is_admin() );

drop policy if exists "perfil: atualizar o próprio ou admin" on public.profiles;
create policy "perfil: atualizar o próprio ou admin"
  on public.profiles for update using ( id = auth.uid() or public.is_admin() );

-- --- Políticas: appointments (escritório único = todos logados) ---
drop policy if exists "agenda: logados leem" on public.appointments;
create policy "agenda: logados leem"
  on public.appointments for select using ( auth.role() = 'authenticated' );

drop policy if exists "agenda: logados inserem" on public.appointments;
create policy "agenda: logados inserem"
  on public.appointments for insert with check ( auth.role() = 'authenticated' );

drop policy if exists "agenda: logados atualizam" on public.appointments;
create policy "agenda: logados atualizam"
  on public.appointments for update using ( auth.role() = 'authenticated' );

drop policy if exists "agenda: admin apaga" on public.appointments;
create policy "agenda: admin apaga"
  on public.appointments for delete using ( public.is_admin() );

-- ============================================================
--  Ao criar um usuário no Auth, cria o perfil automaticamente.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email,'@',1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  DEPOIS de criar SUA conta no site (aba Cadastrar), rode isto
--  UMA vez, trocando pelo seu e-mail, pra virar o dono/admin:
--
--     update public.profiles set role = 'admin'
--     where email = 'seu-email@exemplo.com';
-- ============================================================
