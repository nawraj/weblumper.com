// functions/api/contact.js
export async function onRequestPost({ request }) {
  const {
    name,
    email,
    subject,
    comments,
    budget,
    timeline,
  } = await request.json();

  // ---- BASIC VALIDATION ----
  if (
    !name ||
    !email ||
    !subject ||
    !comments ||
    !email.includes('@')
  ) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ---- RATE LIMIT (optional, uses KV if you bind one) ----
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  // (skip KV for now – you can add later)

  // ---- BUILD EMAIL ----
  const emailBody = `
New contact form submission – Web179Lumper

Name:      ${name}
Email:     ${email}
Project:   ${subject}
Budget:    ${budget || 'Not specified'}
Timeline:  ${timeline || 'Not specified'}

Description:
${comments}

---
WebLumper – Business websites, portfolios, Shopify e‑commerce & eBay marketplace management.
`;

  const mail = {
    personalizations: [{ to: [{ email: 'hello@weblumper.com' }] }], // <-- YOUR EMAIL
    from: { email: 'noreply@weblumper.com', name: 'WebLumper' },
    subject: `New Lead: ${subject}`,
    content: [{ type: 'text/plain', value: emailBody }],
  };

  const mailRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mail),
  });

  if (!mailRes.ok) {
    console.error('MailChannels error:', await mailRes.text());
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}