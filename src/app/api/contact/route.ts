import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "تمام فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    // ثبت در دیتابیس
    await db.insert(messages).values({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Database Insert Error:", err);
    return NextResponse.json(
      { error: "خطا در ثبت پیام" },
      { status: 500 }
    );
  }
}