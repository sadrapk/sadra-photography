import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, photos } from "@/db/schema";
import { eq, count, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { categories, photoCategories } from "@/db/schema";

export async function GET() {
  try {
    const cats = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        coverImage: categories.coverImage,
        order: categories.order,
        createdAt: categories.createdAt,
      })
      .from(categories)
      .orderBy(asc(categories.order), asc(categories.name));

    // Get photo count per category
    // Get photo count per category
const photoCounts = await db
  .select({
    categoryId: photoCategories.categoryId,
    count: count(),
  })
  .from(photoCategories)
  .groupBy(photoCategories.categoryId);
    const countMap = new Map(
      photoCounts.map((p) => [p.categoryId, p.count])
    );

    const result = cats.map((cat) => ({
      ...cat,
      photoCount: countMap.get(cat.id) || 0,
    }));

    return NextResponse.json({ categories: result });
  } catch (error) {
    console.error("Categories GET error:", error);
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
    const { name, slug, description, coverImage, order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "نام و شناسه دسته‌بندی الزامی است" },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(categories)
      .values({
        name,
        slug,
        description: description || null,
        coverImage: coverImage || null,
        order: order || 0,
      })
      .returning();

    return NextResponse.json({ success: true, category: inserted[0] });
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
