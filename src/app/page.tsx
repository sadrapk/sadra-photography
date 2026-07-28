import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import { db } from "@/db";
import { photos, categories, settings } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { seedDatabase } from "@/lib/seed";

async function getData() {
  await seedDatabase();

  const allSettings = await db.select().from(settings);
  const settingsMap: Record<string, string> = {};
  for (const s of allSettings) {
    settingsMap[s.key] = s.value || "";
  }

  const featuredPhotos = await db
    .select({
      id: photos.id,
      title: photos.title,
      description: photos.description,
      url: photos.url,
      filename: photos.filename,
      
      featured: photos.featured,
      order: photos.order,
      createdAt: photos.createdAt,
    })
    .from(photos)
    .where(eq(photos.featured, true))
    .orderBy(asc(photos.order), desc(photos.createdAt))
    .limit(9);

  const latestPhotos = await db
    .select({
      id: photos.id,
      title: photos.title,
      description: photos.description,
      url: photos.url,
      filename: photos.filename,
      
      featured: photos.featured,
      order: photos.order,
      createdAt: photos.createdAt,
    })
    .from(photos)
    .orderBy(desc(photos.createdAt))
    .limit(6);

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.order), asc(categories.name));

  return { settingsMap, featuredPhotos, latestPhotos, allCategories };
}

export default async function HomePage() {
  const { settingsMap, featuredPhotos, latestPhotos, allCategories } =
    await getData();

  const displayPhotos = featuredPhotos.length > 0 ? featuredPhotos : latestPhotos;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar siteTitle={settingsMap.site_title || "لوموس"} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: settingsMap.hero_image
              ? `url(${settingsMap.hero_image})`
              : `url(/images/hero-bg.jpg)`,
          }}
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-yellow-400/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            گالری عکاسی حرفه ای
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-shadow">
            {settingsMap.hero_title || "جادوی لحظه‌ها را"}
            <br />
            <span className="gold-gradient">صدرا پورکلهر</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            {settingsMap.hero_subtitle ||
              "عکاسی حرفه‌ای، هنر دیدن جهان از زاویه‌ای دیگر"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/gallery"
              className="px-8 py-3 rounded-full bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/30 hover:scale-105"
            >
              مشاهده گالری
            </Link>
            <Link
              href="/categories"
              className="px-8 py-3 rounded-full border border-white/30 text-white hover:border-yellow-400/50 hover:text-yellow-400 transition-all hover:scale-105"
            >
              دسته‌بندی‌ها
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 text-xs animate-bounce">
          <span>اسکرول کنید</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-black border-y border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold gold-gradient">{displayPhotos.length}+</div>
            <div className="text-gray-400 text-sm mt-1">عکس حرفه‌ای</div>
          </div>
          <div>
            <div className="text-3xl font-bold gold-gradient">{allCategories.length}</div>
            <div className="text-gray-400 text-sm mt-1">دسته‌بندی</div>
          </div>
          <div>
            <div className="text-3xl font-bold gold-gradient">3+</div>
            <div className="text-gray-400 text-sm mt-1">سال تجربه</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm mb-4">
              دسته‌بندی‌ها
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              کاوش در <span className="gold-gradient">مجموعه‌ها</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              هر دسته‌بندی داستانی منحصر به فرد از هنر عکاسی را روایت می‌کند
            </p>
          </div>

          {allCategories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {allCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="category-card group relative aspect-square rounded-xl overflow-hidden bg-gray-900 border border-white/5 hover:border-yellow-500/30 transition-all hover:-translate-y-1"
                >
                  {cat.coverImage ? (
                    <img
                      src={cat.coverImage}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  <div className="category-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-gray-300 text-xs mt-1 line-clamp-2">{cat.description}</p>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 group-hover:opacity-0 transition-opacity">
                    <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>دسته‌بندی‌ای ثبت نشده است</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 transition-all text-sm"
            >
              مشاهده همه دسته‌بندی‌ها
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Photos Section */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm mb-4">
              {featuredPhotos.length > 0 ? "عکس‌های ویژه" : "جدیدترین عکس‌ها"}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="gold-gradient">
                {featuredPhotos.length > 0 ? "برترین آثار" : "آخرین آثار"}
              </span>
            </h2>
          </div>

          <PhotoGrid photos={displayPhotos} />

          {displayPhotos.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
              >
                مشاهده همه عکس‌ها
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="/uploads/about-bg.jpg"
                  alt="درباره ما"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-xl overflow-hidden border-4 border-[#0a0a0a] shadow-xl">
                <img
                  src="/uploads/hero-bg.jpg"
                  alt="عکاسی"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold text-sm shadow-xl">
  3+ سال تجربه
</div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm mb-6">
                {settingsMap.about_title || "درباره ما"}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
               یک عکاس ،{" "}
                <span className="gold-gradient">هزاران روایت</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                {settingsMap.about_text ||
                  "ما تیمی از عکاسان حرفه‌ای هستیم که با عشق و اشتیاق لحظات ناب را ثبت می‌کنیم."}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: "🌿", label: "سبک ها", value: "محصولات، غذا، نوشیدنی" },
                  { icon: "📸", label: "عکس های ثبت شده", value: "1000+" },
                  { icon: "🎨", label: " تخصص ها", value: "Photoshop, Lightroom" },
                  { icon: "🎯", label: "هدف ", value: "ثبت لحظات با نگاهی خلاق" },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-yellow-400 font-bold text-xl">{stat.value}</div>
                    <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 transition-all"
              >
                بیشتر بدانید
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="relative rounded-3xl p-12 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(0,0,0,0.5) 100%)",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                نمونه کار ها تنها بخشی از مسیر هستند
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                این سایت آرشیوی از آثار و مسیر عکاسی من است و به مرور با پروژه ها و تصاویر جدیدبه روز رسانی خواهد شد. اگر مایل به همکاری یا گفتگو درباره یک پروژه هستید خوشحال میشوم با من در ارتباط باشید.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/30 hover:scale-105 text-lg"
              >
                ارتباط با من
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settingsMap} />
    </div>
  );
}
