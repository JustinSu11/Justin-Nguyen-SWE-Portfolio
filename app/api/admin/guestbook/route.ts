import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guestbookMessages } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const messages = await db
    .select()
    .from(guestbookMessages)
    .orderBy(desc(guestbookMessages.createdAt));

  return NextResponse.json(messages);
}
