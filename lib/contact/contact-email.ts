type ContactEmailData = {
  fullName: string;
  email: string;
  message: string;
  company?: string;
  role?: string;
  phone?: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fieldRow(label: string, value: string): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eeeeee;font-size:14px;color:#111111;font-family:Arial,Helvetica,sans-serif;">
        <strong style="color:#888888;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(label)}</strong><br />
        ${escapeHtml(value)}
      </td>
    </tr>`;
}

export function buildContactEmailHtml(data: ContactEmailData): string {
  const { fullName, email, message, company, role, phone } = data;
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New email from ${escapeHtml(fullName)}</title>
</head>
<body style="margin:0;padding:32px 16px;background-color:#f8f8f8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e5e5;">
    <tr>
      <td style="padding:28px 32px 8px 32px;">
        <p style="margin:0 0 6px 0;font-size:12px;color:#999999;text-transform:uppercase;letter-spacing:0.12em;">
          Trekuartista
        </p>
        <h1 style="margin:0;font-size:20px;font-weight:600;color:#111111;line-height:1.3;">
          New email from ${escapeHtml(fullName)}
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 0 32px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          ${fieldRow("Full name", fullName)}
          ${fieldRow("Email", email)}
          ${fieldRow("Company", company ?? "")}
          ${fieldRow("Role", role ?? "")}
          ${fieldRow("Phone", phone ?? "")}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 28px 32px;">
        <p style="margin:0 0 8px 0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">
          Message
        </p>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#333333;">
          ${safeMessage}
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 24px 32px;border-top:1px solid #eeeeee;">
        <p style="margin:0;font-size:11px;line-height:1.5;color:#aaaaaa;text-align:center;">
          This message was sent from the Trekuartista website contact form.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildContactEmailText(data: ContactEmailData): string {
  const lines = [
    `New email from ${data.fullName}`,
    "",
    `Full name: ${data.fullName}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    data.role ? `Role: ${data.role}` : null,
    data.phone ? `Phone: ${data.phone}` : null,
    "",
    "Message:",
    data.message,
    "",
    "This message was sent from the Trekuartista website contact form.",
  ].filter(Boolean);

  return lines.join("\n");
}
