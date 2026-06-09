import {
  buildContactEmailHtml,
  buildContactEmailText,
} from "@/lib/contact/contact-email";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  fullName: string;
  company?: string;
  role?: string;
  phone?: string;
  email: string;
  message: string;
};

function getMailConfig() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!user || !pass || !to) {
    throw new Error("Email is not configured.");
  }

  return { user, pass, to };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactPayload>;
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    const company = String(body.company ?? "").trim();
    const role = String(body.role ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full name, email, and message are required." },
        { status: 400 }
      );
    }

    const { user, pass, to } = getMailConfig();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const payload = { fullName, email, message, company, role, phone };

    await transporter.sendMail({
      from: `"Trekuartista" <${user}>`,
      to,
      replyTo: email,
      subject: `New email from ${fullName} — Trekuartista`,
      text: buildContactEmailText(payload),
      html: buildContactEmailHtml(payload),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send message.";
    console.error("Contact form error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
