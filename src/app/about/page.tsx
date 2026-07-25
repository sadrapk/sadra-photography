import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { settings, pages } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getData() {
  const allSettings = await db.select().from(settings);
  const settingsMap: Record<string, string> = {};
  for (const s of allSettings) settingsMap[s.key] = s.value || "";

  const page = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, "about"))
    .limit(1);

  return { settingsMap, page: page[0] || null };
}

export default async function AboutPage() {
  const { settingsMap, page } = await getData();

  const teamMembers = [
    { name: "درباره خودم", role: "علاقه من به عکاسی از سال ها پیش شروع شد و هنوز هر عکس فرصتی برای یادگیری وخلق یک قاب تازه است", emoji: "👤" },
    { name: "چرا عکاسی؟", role: "برای من، هر تصویر ثبت کننده یک خاطره و روایتگر داستانی خاص است", emoji: "📷" },
    { name: "چرا عکاسی تبلیغاتی؟", role: "چون ترکیب خلاقیت و دقت و آزادی بیشتر، میتواند هویت یک محصول را به بهترین شکل نمایش دهد.", emoji: "🎯" },
    { name: "هدف از ساخت Lumos چیه؟", role: "ساخت آرشیوی از آثارم و نمونه کارها برای نشان دادن به دیگران و کارفرما ها در یک فضای حرفه ای و ساده", emoji: "💡" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar siteTitle={settingsMap.site_title} />

      {/* Hero */}
<div className="relative pt-32 pb-20 overflow-hidden">
  {/* تصویر پس‌زمینه دینامیک از پنل مدیریت */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-500"
    style={{
      backgroundImage: `url(${page?.heroImage || '/images/about-bg.jpg'})`,
    }}
  />
  
  {/* لایه اورلی برای خوانا ماندن متن‌ها */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />

  <div className="relative z-10 text-center px-4">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm mb-4">
      درباره من
    </div>
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
  {page?.title ? (
    (() => {
      const parts = page.title.split("|");
      const whiteText = parts[0] || "";
      const goldText = parts[1] || "";
      return (
        <>
          {whiteText}
          {goldText && (
            <span className="gold-gradient ms-3">
              {goldText}
            </span>
          )}
        </>
      );
    })()
  ) : (
    <>
      پشت <span className="gold-gradient ms-3">هر قاب</span>
    </>
  )}
</h1>
    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
      {settingsMap.about_text ||
        "ما تیمی از عکاسان حرفه‌ای هستیم که با عشق لحظات را ثبت می‌کنیم"}
    </p>
  </div>
</div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {page?.content && (
          <div className="glass rounded-2xl p-8 mb-12 text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
            {page.content}
          </div>
        )}

{/* Values */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
  {[
    {
      icon: "🍽️",
      title: "غذا و نوشیدنی",
      desc: "ثبت رنگ، بافت و جزئیات برای خلق تصاویری اشتهاآور و چشم‌نواز.",
      bgImage: "/uploads/food.jpg", // آدرس عکس غذا و نوشیدنی
    },
    {
      icon: "📦",
      title: "محصولات",
      desc: "نمایش هویت و کیفیت محصولات با نورپردازی، ترکیب‌بندی و ویرایش حرفه‌ای.",
      bgImage: "/uploads/product.jpg", // آدرس عکس محصولات
    },
    {
      icon: "🌳",
      title: "طبیعت",
      desc: "ثبت زیبایی طبیعت با تمرکز بر نور، رنگ و حس لحظه.",
      bgImage: "/uploads/nature.jpg", // آدرس عکس طبیعت
    },
  ].map((val) => (
    <div
      key={val.title}
      className="glass rounded-2xl p-6 text-center relative overflow-hidden group"
    >
      {/* تصویر پس‌زمینه در صورت وجود */}
      {val.bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-300 z-0"
            style={{ backgroundImage: `url("${val.bgImage}")` }}
          />
          <div className="absolute inset-0 bg-black/40 z-0" />
        </>
      )}

      {/* محتوای اصلی کارت */}
      <div className="relative z-10">
        <div className="text-4xl mb-4">{val.icon}</div>
        <h3 className="text-white font-bold text-lg mb-2">{val.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{val.desc}</p>
      </div>
    </div>
  ))}
</div>

       {/* Team / About Cards */}
<div className="mb-16">
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
    <span className="gold-gradient">کمی بیشتر درباره من</span>
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {teamMembers.map((member) => (
      <div key={member.name} className="glass rounded-xl p-6 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-500/40 flex items-center justify-center text-3xl mx-auto mb-4">
          {member.emoji}
        </div>
        {/* تیتر طلایی بزرگ‌تر */}
        <h3 className="text-yellow-400 font-bold text-xl md:text-2xl mb-2">{member.name}</h3>
        {/* متن سفید خواناتر با فاصله بین سطرها */}
        <p className="text-gray-200 text-sm leading-relaxed mt-2">{member.role}</p>
      </div>
    ))}
  </div>
</div>

      </div>

      <Footer settings={settingsMap} />
    </div>
  );
}
