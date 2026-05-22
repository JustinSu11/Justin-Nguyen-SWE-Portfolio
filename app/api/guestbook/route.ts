import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guestbookMessages } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const messages = await db
    .select()
    .from(guestbookMessages)
    .where(eq(guestbookMessages.status, "approved"))
    .orderBy(desc(guestbookMessages.createdAt));

  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const { name, message } = await req.json();

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }

  const [created] = await db
    .insert(guestbookMessages)
    .values({ name: name.trim(), message: message.trim(), status: "pending" })
    .returning();

  // Notify Justin — fire and forget, don't block the response
  resend.emails.send({
    from: "Guestbook <onboarding@resend.dev>",
    to: process.env.NOTIFY_EMAIL!,
    subject: `Guestbook message from ${name.trim()} — pending your approval`,
    html: `
      <p><strong>${name.trim()}</strong> signed your guestbook and is waiting for your approval:</p>
      <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555">
        ${message.trim()}
      </blockquote>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/admin/guestbook">Approve or remove it here →</a></p>
    `,
  }).catch((err) => console.error("[Resend]", err)); // swallow errors — email is non-critical

  return NextResponse.json(created, { status: 201 });
}
