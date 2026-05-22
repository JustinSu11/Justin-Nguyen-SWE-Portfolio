import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guestbookMessages } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db
    .update(guestbookMessages)
    .set({ status: "approved" })
    .where(eq(guestbookMessages.id, Number(id)));

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db
    .delete(guestbookMessages)
    .where(eq(guestbookMessages.id, Number(id)));

  return NextResponse.json({ ok: true });
}
