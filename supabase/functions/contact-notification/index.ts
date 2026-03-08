import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    if (!SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY não configurado');
    }

    const CONTACT_NOTIFICATION_EMAIL = Deno.env.get('CONTACT_NOTIFICATION_EMAIL');
    if (!CONTACT_NOTIFICATION_EMAIL) {
      throw new Error('CONTACT_NOTIFICATION_EMAIL não configurado');
    }

    // Remetente verificado no SendGrid (Sender Identity)
    const SENDGRID_FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL') || CONTACT_NOTIFICATION_EMAIL;

    const payload = await req.json();

    // Supabase Database Webhook payload
    const record = payload.record;
    if (!record) {
      throw new Error('Payload inválido: campo "record" ausente');
    }

    const { name, email, message, created_at } = record;

    const formattedDate = new Date(created_at).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 20px; }
            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
            .header { background: #1d4ed8; color: #ffffff; padding: 24px 32px; }
            .header h1 { margin: 0; font-size: 20px; }
            .body { padding: 28px 32px; }
            .field { margin-bottom: 16px; }
            .label { font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600; letter-spacing: 0.05em; }
            .value { font-size: 15px; color: #111827; margin-top: 4px; }
            .message-box { background: #f3f4f6; border-radius: 6px; padding: 16px; white-space: pre-wrap; line-height: 1.6; color: #374151; font-size: 14px; }
            .footer { padding: 16px 32px; background: #f3f4f6; font-size: 12px; color: #9ca3af; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 Nova mensagem de contato</h1>
            </div>
            <div class="body">
              <div class="field">
                <div class="label">Nome</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">E-mail</div>
                <div class="value"><a href="mailto:${email}" style="color:#1d4ed8;">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Data e hora</div>
                <div class="value">${formattedDate}</div>
              </div>
              <div class="field">
                <div class="label">Mensagem</div>
                <div class="message-box">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              </div>
            </div>
            <div class="footer">Fix-on — Sistema de notificação automática</div>
          </div>
        </body>
      </html>
    `;

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: CONTACT_NOTIFICATION_EMAIL }],
          },
        ],
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: 'Fix-on Contato',
        },
        reply_to: {
          email: email,
          name: name,
        },
        subject: `Nova mensagem de contato: ${name}`,
        content: [
          {
            type: 'text/plain',
            value: `Nova mensagem de contato\n\nNome: ${name}\nEmail: ${email}\nData: ${formattedDate}\n\nMensagem:\n${message}`,
          },
          {
            type: 'text/html',
            value: htmlBody,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`SendGrid erro [${response.status}]: ${errorBody}`);
    }

    console.log(`✅ Notificação enviada para ${CONTACT_NOTIFICATION_EMAIL} sobre mensagem de ${name}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('❌ Erro na notificação de contato:', message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
