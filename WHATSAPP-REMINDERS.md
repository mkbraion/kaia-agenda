# 🤖 Robô de lembrete automático no WhatsApp

O robô já está **montado e agendado** no seu Supabase. Ele roda sozinho a cada
15 minutos, procura visitas que vão acontecer nas próximas horas e manda um
lembrete no WhatsApp do cliente pela **API oficial da Meta**. Depois de mandar,
marca a visita como "lembrada" pra nunca mandar duas vezes.

Ele está **inerte** (não manda nada) até você fazer os 2 passos abaixo.

---

## Passo 1 — Colar as credenciais da Meta (secrets)

No Supabase: **Edge Functions → send-reminders → Secrets** (ou *Project
Settings → Edge Functions → Manage secrets*). Adicione:

| Secret | Valor | Obrigatório |
|---|---|---|
| `WHATSAPP_TOKEN` | O token da sua API (o mesmo do seu KAIA WhatsApp) | ✅ |
| `WHATSAPP_PHONE_ID` | O *Phone Number ID* do WhatsApp Business | ✅ |
| `CRON_SECRET` | `kaia_cron_7f3a9c21b8e4d605` | 🔒 recomendado |
| `WHATSAPP_TEMPLATE` | `lembrete_visita` | opcional (já é o padrão) |
| `WHATSAPP_LANG` | `pt_BR` | opcional |
| `REMINDER_HOURS` | `3` (quantas horas antes avisar) | opcional |

> **Importante:** use um **token permanente** (System User token), não o token
> temporário de 24h do painel de testes da Meta — senão o robô para no dia seguinte.
> O `CRON_SECRET` já está configurado no agendador; se você definir esse secret
> com o valor acima, só o agendador consegue disparar o robô.

## Passo 2 — Criar o modelo de mensagem na Meta

A Meta **exige um template aprovado** pra mandar mensagem "do nada". No
**WhatsApp Manager → Modelos de mensagem → Criar modelo**:

- **Nome:** `lembrete_visita`  *(tem que ser idêntico ao `WHATSAPP_TEMPLATE`)*
- **Categoria:** `Utilidade` (Utility)
- **Idioma:** `Português (BR)`
- **Corpo** (com 3 variáveis, nesta ordem):

  > Olá {{1}}! 👋 Passando pra lembrar da sua visita com a RE/MAX Londero em {{2}}, no imóvel {{3}}. Podemos confirmar sua presença?

  As variáveis são preenchidas automaticamente pelo robô:
  `{{1}}` = nome do cliente · `{{2}}` = dia e hora · `{{3}}` = código + endereço.

A aprovação da Meta costuma levar de alguns minutos a algumas horas (às vezes
mais). **Assim que for aprovado e os secrets estiverem colados, o robô começa a
avisar sozinho** — sem você fazer mais nada.

---

## Como testar / operar

**Testar na hora** (depois de configurar), pelo terminal:
```bash
curl -s -X POST https://nqcnnyodlnrjeqnyhdps.supabase.co/functions/v1/send-reminders \
  -H "x-cron-secret: kaia_cron_7f3a9c21b8e4d605"
```
Resposta esperada: `{"ok":true,"configured":true,"checked":N,"sent":N,...}`.

**Mudar a antecedência** (ex.: avisar 24h antes): mude o secret `REMINDER_HOURS` para `24`.

**Ver/mudar o agendador** (no SQL Editor):
```sql
-- ver os jobs
select * from cron.job;
-- ver as últimas execuções
select * from cron.job_run_details order by start_time desc limit 10;
-- pausar o robô
select cron.unschedule('kaia-lembretes-whatsapp');
-- religar (a cada 15 min)
select cron.schedule('kaia-lembretes-whatsapp','*/15 * * * *', $$
  select net.http_post(
    url := 'https://nqcnnyodlnrjeqnyhdps.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','kaia_cron_7f3a9c21b8e4d605'),
    body := '{}'::jsonb);
$$);
```

## Como funciona (resumo)
1. A cada 15 min o `pg_cron` chama a função `send-reminders`.
2. A função busca visitas com `status` confirmado/pendente que acontecem dentro de
   `REMINDER_HOURS` horas e que ainda **não** foram lembradas (`reminded_at is null`).
3. Para cada uma, envia o template no WhatsApp do cliente e grava `reminded_at`.
4. Nunca manda duas vezes a mesma; se o cliente não tem telefone, apenas pula.
