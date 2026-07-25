import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { photos, categories, photoCategories } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "100");

    // ۱. دریافت تمام عکس‌ها
    const allPhotos = await db.select().from(photos);

    // ۲. دریافت تمام دسته‌بندی‌ها و روابط
    const allCategories = await db.select().from(categories);
    const allRelations = photoCategories ? await db.select().from(photoCategories) : [];

    // ۳. ترکیب داده‌ها در جاوااسکریپت
    let results = allPhotos.map((photo) => {
      // پیدا کردن رابطه عکس با دسته‌ها
      const matchedRelIds = allRelations
        .filter((r) => r.photoId === photo.id)
        .map((r) => r.categoryId);

      const matchedCats = allCategories.filter((c) => matchedRelIds.includes(c.id));

      return {
        ...photo,
        categories: matchedCats.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        })),
      };
    });

    // مرتب‌سازی
    results.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // فیلترها
    if (categoryId) {
      const targetCatId = parseInt(categoryId);
      results = results.filter((p) =>
        p.categories.some((cat) => cat.id === targetCatId)
      );
    }

    if (featured === "true") {
      results = results.filter((p) => p.featured === true);
    }

    return NextResponse.json({ photos: results.slice(0, limit) });
  } catch (error) {
    console.error("Photos GET error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, url, filename, categoryIds, featured, order } = body;

    if (!title || !url || !filename) {
      return NextResponse.json(
        { error: "عنوان و تصویر الزامی است" },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(photos)
      .values({
        title,
        description: description || null,
        url,
        filename,
        featured: featured || false,
        order: order || 0,
      })
      .returning();

    const newPhoto = inserted[0];

    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      const relations = categoryIds.map((catId: number | string) => ({
        photoId: newPhoto.id,
        categoryId: typeof catId === "string" ? parseInt(catId) : catId,
      }));

      await db.insert(photoCategories).values(relations);
    }

    return NextResponse.json({ success: true, photo: newPhoto });
  } catch (error) {
    console.error("Photos POST error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}