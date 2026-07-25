import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { categories, photoCategories } from "@/db/schema";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Try by slug first, then by id
    let cat = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, id))
      .limit(1);

    if (cat.length === 0) {
      const numId = parseInt(id);
      if (!isNaN(numId)) {
        cat = await db
          .select()
          .from(categories)
          .where(eq(categories.id, numId))
          .limit(1);
      }
    }

    if (cat.length === 0) {
      return NextResponse.json({ error: "دسته‌بندی یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ category: cat[0] });
  } catch (error) {
    console.error("Category GET error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

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
    const body = await req.json();
    const { name, slug, description, coverImage, order } = body;

    const updated = await db
      .update(categories)
      .set({
        name,
        slug,
        description: description || null,
        coverImage: coverImage || null,
        order: order || 0,
      })
      .where(eq(categories.id, parseInt(id)))
      .returning();

    return NextResponse.json({ success: true, category: updated[0] });
  } catch (error) {
    console.error("Category PUT error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}


export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const catId = parseInt(id);

    if (isNaN(catId)) {
      return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
    }

    // ۱. ابتدا تمام اتصالات این دسته‌بندی را از جدول واسط حذف کنید
    await db.delete(photoCategories).where(eq(photoCategories.categoryId, catId));

    // ۲. سپس خود دسته‌بندی را حذف کنید
    const deleted = await db.delete(categories).where(eq(categories.id, catId)).returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "دسته‌بندی یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category DELETE error:", error);
    return NextResponse.json({ error: "خطا در حذف از دیتابیس" }, { status: 500 });
  }
}