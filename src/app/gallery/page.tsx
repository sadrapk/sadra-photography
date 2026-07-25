import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import { db } from "@/db";
import { photos, categories, settings, photoCategories, pages } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import Link from "next/link";

async function getData() {
  const allSettings = await db.select().from(settings);
  const settingsMap: Record<string, string> = {};
  for (const s of allSettings) settingsMap[s.key] = s.value || "";

  // خواندن اطلاعات صفحه گالری از جدول pages
  const pageResult = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, "gallery"))
    .limit(1);

  const page = pageResult[0] || null;

  const allPhotos = await db
    .select({
      id: photos.id,
      title: photos.title,
      description: photos.description,
      url: photos.url,
      filename: photos.filename,
      categoryId: photoCategories.categoryId,
      featured: photos.featured,
      order: photos.order,
      createdAt: photos.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(photos)
    .leftJoin(photoCategories, eq(photos.id, photoCategories.photoId))
    .leftJoin(categories, eq(photoCategories.categoryId, categories.id))
    .orderBy(asc(photos.order), desc(photos.createdAt));

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.order));

  return { settingsMap, page, allPhotos, allCategories };
}

export default async function GalleryPage() {
  const { settingsMap, page, allPhotos, allCategories } = await getData();

  const titleParts = (page?.title || "تمام|آثار").split("|");
  const whiteTitle = titleParts[0] || "";
  const goldTitle = titleParts[1] || "";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar siteTitle={settingsMap.site_title || "لنز طلایی"} />

      {/* Page Header با پشتیبانی از تصویر شناور و متن پویا */}
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
            گالری
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
            {page?.content || "مجموعه کاملی از عکاسی حرفه‌ای در قالب‌های متنوع"}
          </p>
        </div>
      </main>

      {/* Category Filter */}
      <div className="px-4 pb-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap gap-2 justify-center">
          <Link
            href="/gallery"
            className="px-4 py-2 rounded-full bg-yellow-500 text-black text-sm font-medium transition-all"
          >
            همه عکس‌ها
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="px-4 py-2 rounded-full border border-white/20 text-gray-300 text-sm hover:border-yellow-500/40 hover:text-yellow-400 transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-grow">
        <PhotoGrid photos={allPhotos} />
      </div>

      <Footer settings={settingsMap} />
    </div>
  );
}