import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const page = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1);

    if (page.length === 0) {
      return NextResponse.json({ error: "صفحه یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ page: page[0] });
  } catch (error) {
    console.error("Page GET error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { slug } = await params;
    const body = await req.json();
    const { title, content, heroImage } = body;

    const existing = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      const inserted = await db
        .insert(pages)
        .values({ slug, title, content, heroImage, updatedAt: new Date() })
        .returning();
      return NextResponse.json({ success: true, page: inserted[0] });
    }

    const updated = await db
      .update(pages)
      .set({ title, content, heroImage, updatedAt: new Date() })
      .where(eq(pages.slug, slug))
      .returning();

    return NextResponse.json({ success: true, page: updated[0] });
  } catch (error) {
    console.error("Page PUT error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
