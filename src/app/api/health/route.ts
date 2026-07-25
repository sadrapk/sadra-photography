import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    await seedDatabase();
    await db.select().from(users).limit(1);
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json({ status: "error", error: String(error) }, { status: 500 });
  }
}
