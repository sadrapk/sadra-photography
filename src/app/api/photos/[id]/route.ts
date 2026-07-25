import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { photos, photoCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { unlink } from "fs/promises";
import { join } from "path";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const photoId = parseInt(id);
    if (isNaN(photoId)) {
      return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, url, filename, categoryIds, featured, order } = body;

    // ۱. به‌روزرسانی اطلاعات عکس در جدول اصلی
    const updated = await db
      .update(photos)
      .set({
        title,
        description: description || null,
        url,
        filename,
        featured: featured || false,
        order: order || 0,
      })
      .where(eq(photos.id, photoId))
      .returning();

    // ۲. پاک کردن روابط قدیمی دسته‌بندی
    await db
      .delete(photoCategories)
      .where(eq(photoCategories.photoId, photoId));

    // ۳. درج روابط جدید در جدول واسط
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      const newRelations = categoryIds.map((catId: number) => ({
        photoId,
        categoryId: Number(catId),
      }));
      await db.insert(photoCategories).values(newRelations);
    }

    return NextResponse.json({ success: true, photo: updated[0] });
  } catch (error) {
    console.error("Photos PUT error:", error);
    return NextResponse.json({ error: "خطا در ویرایش عکس" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;

    // Get photo to delete file
    const photo = await db
      .select()
      .from(photos)
      .where(eq(photos.id, parseInt(id)))
      .limit(1);

    if (photo[0]) {
      // Delete file from disk
      try {
        const filePath = join(process.cwd(), "public", photo[0].url);
        await unlink(filePath);
      } catch {
        // File might not exist
      }
    }

    await db.delete(photos).where(eq(photos.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Photos DELETE error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
