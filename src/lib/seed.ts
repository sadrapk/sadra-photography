import { db } from "@/db";
import { users, settings, pages, categories } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Create admin user
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.username, "admin"))
      .limit(1);

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash("S@dr@PK47", 12);
      await db.insert(users).values({
        username: "admin",
        email: "admin@photography.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin user created");
    }

    // Seed default settings
    const defaultSettings = [
      { key: "site_title", value: " لوموس | نوری در تاریکی  " },
      { key: "site_subtitle", value: "جادوی لحظه‌ها در قاب تصویر" },
      { key: "site_description", value: "خوش آمدید به گالری عکاسی حرفه‌ای ما. هر تصویر روایتی است از زیبایی جهان." },
      { key: "hero_title", value: "جادوی لحظه‌ها را با ما تجربه کنید" },
      { key: "hero_subtitle", value: "عکاسی حرفه‌ای، هنر دیدن جهان از زاویه‌ای دیگر" },
      { key: "about_title", value: "درباره ما" },
      { key: "about_text", value: "ما تیمی از عکاسان حرفه‌ای هستیم که با عشق و اشتیاق لحظات ناب را ثبت می‌کنیم. با بیش از ۱۰ سال تجربه در عکاسی مناظر، پرتره، معماری و رویدادها، هر تصویر را به اثری هنری تبدیل می‌کنیم." },
      { key: "contact_email", value: "info@photography.com" },
      { key: "contact_phone", value: "+98 912 345 6789" },
      { key: "contact_address", value: "تهران، ایران" },
      { key: "instagram", value: "#" },
      { key: "twitter", value: "#" },
      { key: "facebook", value: "#" },
      { key: "hero_image", value: "" },
    ];

    for (const setting of defaultSettings) {
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, setting.key))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(settings).values(setting);
      }
    }

    // Seed default categories
    const defaultCategories = [
      { name: "مناظر طبیعی", slug: "landscape", description: "تصاویر خیره‌کننده از طبیعت بکر", order: 1 },
      { name: "پرتره", slug: "portrait", description: "عکاسی چهره و احساسات انسانی", order: 2 },
      { name: "معماری", slug: "architecture", description: "زیبایی سازه‌ها و فضاهای شهری", order: 3 },
      { name: "حیات وحش", slug: "wildlife", description: "دنیای شگفت‌انگیز جانوران", order: 4 },
      { name: "سیاه و سفید", slug: "black-white", description: "هنر کلاسیک در قاب تک‌رنگ", order: 5 },
      { name: "رویداد", slug: "event", description: "ثبت لحظات ماندگار رویدادها", order: 6 },
    ];

    

    // Seed pages
    const defaultPages = [
      {
        slug: "about",
        title: "درباره ما",
        content: "ما تیمی از عکاسان حرفه‌ای هستیم که با عشق و اشتیاق لحظات ناب را ثبت می‌کنیم.",
      },
      {
        slug: "contact",
        title: "تماس با ما",
        content: "برای ارتباط با ما از فرم زیر استفاده کنید.",
      },
    ];

    for (const page of defaultPages) {
      const existing = await db
        .select()
        .from(pages)
        .where(eq(pages.slug, page.slug))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(pages).values(page);
      }
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Seed error:", error);
  }
}
