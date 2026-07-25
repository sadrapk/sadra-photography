export const dynamic = "force-dynamic";
export const revalidate = 0;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import { db } from "@/db";
import { categories, photos, photoCategories, settings } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getData(slug: string) {
  const allSettings = await db.select().from(settings);
  const settingsMap: Record<string, string> = {};
  for (const s of allSettings) settingsMap[s.key] = s.value || "";

  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (category.length === 0) return null;

  const cat = category[0];

  const categoryPhotos = await db
    .select({
      id: photos.id,
      title: photos.title,
      description: photos.description,
      url: photos.url,
      filename: photos.filename,
      featured: photos.featured,
      order: photos.order,
      createdAt: photos.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(photoCategories)
    .innerJoin(photos, eq(photoCategories.photoId, photos.id))
    .innerJoin(categories, eq(photoCategories.categoryId, categories.id))
    .where(eq(photoCategories.categoryId, cat.id))
    .orderBy(asc(photos.order), desc(photos.createdAt));

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.order));

  return { settingsMap, category: cat, categoryPhotos, allCategories };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getData(slug);

  if (!data) return notFound();

  const { settingsMap, category, categoryPhotos, allCategories } = data;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar siteTitle={settingsMap.site_title} />

      {/* Category Hero */}
      <div className="relative pt-32 pb-12 overflow-hidden">
        {category.coverImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${category.coverImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
          </>
        )}
        <div className="relative z-10 text-center px-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            بازگشت به دسته‌بندی‌ها
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm mb-4">
            دسته‌بندی
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="gold-gradient">{category.name}</span>
          </h1>
          {category.description && (
            <p className="text-gray-400 max-w-xl mx-auto mb-4">{category.description}</p>
          )}
          <p className="text-gray-500 text-sm">{categoryPhotos.length} عکس در این دسته‌بندی</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 pb-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          <Link
            href="/gallery"
            className="px-4 py-2 rounded-full border border-white/20 text-gray-300 text-sm hover:border-yellow-400/40 hover:text-yellow-400 transition-all"
          >
            همه عکس‌ها
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cat.slug === slug
                  ? "bg-yellow-500 text-black"
                  : "border border-white/20 text-gray-300 hover:border-yellow-400/40 hover:text-yellow-400"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <PhotoGrid photos={categoryPhotos} />
      </div>

      <Footer settings={settingsMap} />
    </div>
  );
}
