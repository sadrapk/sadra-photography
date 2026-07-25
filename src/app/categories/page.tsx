import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { categories, photoCategories, settings, pages } from "@/db/schema";
import { eq, count, asc } from "drizzle-orm";
import Link from "next/link";

async function getData() {
  const allSettings = await db
    .select({ key: settings.key, value: settings.value })
    .from(settings);

  const settingsMap: Record<string, string> = {};
  for (const s of allSettings) settingsMap[s.key] = s.value || "";

  const pageResult = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, "categories"))
    .limit(1);

  const page = pageResult[0] || null;

  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      coverImage: categories.coverImage,
      order: categories.order,
    })
    .from(categories)
    .orderBy(asc(categories.order), asc(categories.name));

  const photoCounts = await db
    .select({
      categoryId: photoCategories.categoryId,
      count: count(),
    })
    .from(photoCategories)
    .groupBy(photoCategories.categoryId);

  const countMap = new Map(photoCounts.map((p) => [p.categoryId, p.count]));

  const categoriesWithCount = allCategories.map((cat) => ({
    ...cat,
    photoCount: countMap.get(cat.id) || 0,
  }));

  return { settingsMap, page, categories: categoriesWithCount };
}

export default async function CategoriesPage() {
  const { settingsMap, page, categories } = await getData();

  const titleParts = (page?.title || "کالکشن و|مجموعه‌های ما").split("|");
  const whiteTitle = titleParts[0] || "";
  const goldTitle = titleParts[1] || "";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar siteTitle={settingsMap.site_title || "لنز طلایی"} />

      <main className="relative pt-32 pb-12 text-center px-4 min-h-[450px] flex items-center justify-center overflow-hidden">
        {page?.heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url(${page.heroImage})`,
              filter: "grayscale(100%)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />

        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/35 bg-yellow-500/10 text-yellow-400 font-bold text-sm mb-4">
            دسته‌بندی‌ها
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {whiteTitle}
            {goldTitle && (
              <span className="gold-gradient ms-3">
                {goldTitle}
              </span>
            )}
          </h1>

          <p className="text-gray-400 text-lg">
            {page?.content || "هر دسته‌بندی دنیایی از هنر را در خود جای داده است"}
          </p>
        </div>
      </main>

      <div className="max-w-7xl mx-auto px-4 py-12 flex-grow w-full">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="category-card group relative aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-white/5 hover:border-yellow-500/50 transition-all duration-300 block"
              >
                {cat.coverImage ? (
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <span className="text-gray-500 text-sm">{cat.name}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-6">
                  <h3 className="text-white font-bold text-xl mb-1">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                      {cat.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl text-yellow-400 text-sm font-medium">
                      {cat.photoCount} عکس
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm group-hover:translate-x-[-4px] transition-transform">
                      <span>مشاهده</span>
                      <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-lg">هیچ دسته‌بندی‌ای هنوز ایجاد نشده است</p>
          </div>
        )}
      </div>

      <Footer settings={settingsMap} />
    </div>
  );
}