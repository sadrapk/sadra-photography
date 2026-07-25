import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { db } from "@/db";
import { settings, pages } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getData() {
  const allSettings = await db.select().from(settings);
  const settingsMap: Record<string, string> = {};
  for (const s of allSettings) settingsMap[s.key] = s.value || "";

  const page = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, "contact"))
    .limit(1);

  return { settingsMap, page: page[0] || null };
}

export default async function ContactPage() {
  const { settingsMap, page } = await getData();
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* پس‌زمینه شناور */}
      {page?.heroImage && (
        <>
          <div
            className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none z-0"
            style={{ backgroundImage: `url("${page.heroImage}")` }}
          />
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] pointer-events-none z-0" />
        </>
      )}

      <div className="relative z-10">
        <Navbar siteTitle={settingsMap.site_title} />

        <div className="pt-32 pb-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm mb-4">
                ارتباط با من
              </div>
              {/* ... (سایر کدهای داخل return) */}
<div className="text-center mb-12">
  {/* ... (ارتباط با من) */}
  
  {/* شروع تغییر اصلی عنوان طلایی */}
  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
    {page?.title ? (
  (() => {
    const parts = page.title.split("|");
    const whiteText = parts[0] || "";
    const goldText = parts[1] || "";
    return (
      <>
        {whiteText}
        {goldText && (
          <span className="gold-gradient ms-2">
            {goldText}
          </span>
        )}
      </>
    );
  })()
) : (
  <>
    بیایید <span className="gold-gradient ms-2">صحبت کنیم</span>
  </>
)}
  </h1>
  {/* پایان تغییر اصلی عنوان طلایی */}

  {/* ... (بخش محتوا/توضیحات) */}
</div>
{/* ... */}
             <p className="text-gray-400 max-w-xl mx-auto whitespace-pre-line">
  {page?.content}
</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-white font-bold text-xl mb-6">اطلاعات تماس</h2>
                  <div className="space-y-4">
                    {[
                      { icon: "📧", label: "ایمیل", value: settingsMap.contact_email || "info@photography.com" },
                      { icon: "📞", label: "تلفن", value: settingsMap.contact_phone || "+98 912 345 6789" },
                      { icon: "📍", label: "آدرس", value: settingsMap.contact_address || "تهران، ایران" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-lg flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-yellow-400 text-sm font-medium">{item.label}</div>
                          <div className="text-gray-300 mt-1">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">شبکه‌های اجتماعی</h3>
                  <div className="space-y-3 text-sm">
                    {settingsMap.instagram && (
                      <a
                        href={
                          settingsMap.instagram.startsWith("http")
                            ? settingsMap.instagram
                            : `https://instagram.com/${settingsMap.instagram.replace("@", "")}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-yellow-500/30 transition-all text-gray-300 hover:text-white group"
                      >
                        <span className="font-medium">اینستاگرام</span>
                        <span className="text-yellow-400 text-xs font-mono bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 dir-ltr">
                          {settingsMap.instagram.startsWith("@") ? settingsMap.instagram : `@${settingsMap.instagram}`}
                        </span>
                      </a>
                    )}

                    {settingsMap.telegram && (
                      <a
                        href={
                          settingsMap.telegram.startsWith("http")
                            ? settingsMap.telegram
                            : `https://t.me/${settingsMap.telegram.replace("@", "")}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-yellow-500/30 transition-all text-gray-300 hover:text-white group"
                      >
                        <span className="font-medium">تلگرام</span>
                        <span className="text-yellow-400 text-xs font-mono bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 dir-ltr">
                          {settingsMap.telegram.startsWith("@") ? settingsMap.telegram : `@${settingsMap.telegram}`}
                        </span>
                      </a>
                    )}

                    {settingsMap.whatsapp && (
                      <a
                        href={
                          settingsMap.whatsapp.startsWith("http")
                            ? settingsMap.whatsapp
                            : `https://wa.me/${settingsMap.whatsapp.replace(/[^0-9]/g, "")}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-yellow-500/30 transition-all text-gray-300 hover:text-white group"
                      >
                        <span className="font-medium">واتس‌اپ</span>
                        <span className="text-yellow-400 text-xs font-mono bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 dir-ltr">
                          {settingsMap.whatsapp}
                        </span>
                      </a>
                    )}

                    {settingsMap.linkedin && (
                      <a
                        href={
                          settingsMap.linkedin.startsWith("http")
                            ? settingsMap.linkedin
                            : `https://linkedin.com/in/${settingsMap.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-yellow-500/30 transition-all text-gray-300 hover:text-white group"
                      >
                        <span className="font-medium">لینکدین</span>
                        <span className="text-yellow-400 text-xs font-mono bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 dir-ltr">
                          {settingsMap.linkedin}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <ContactForm />
            </div>
          </div>
        </div>

        <Footer settings={settingsMap} />
      </div>
    </div>
  );
}