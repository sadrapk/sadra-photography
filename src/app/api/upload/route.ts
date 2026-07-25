import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "فایل یافت نشد" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "فرمت فایل پشتیبانی نمی‌شود. فقط مجاز است JPEG, PNG, WEBP" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${uuidv4()}.${ext}`;

    // آپلود روی Vercel Blob به صورت خصوصی
    const blob = await put(filename, file, {
      access: "private",
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "خطا در آپلود فایل" }, { status: 500 });
  }
}