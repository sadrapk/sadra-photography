import { db } from "@/db";
import { photos, categories, users } from "@/db/schema";
import { count } from "drizzle-orm";
import Link from "next/link";

async function getData() {
  const photoCount = await db.select({ count: count() }).from(photos);
  const categoryCount = await db.select({ count: count() }).from(categories);
  const userCount = await db.select({ count: count() }).from(users);

  const latestPhotos = await db
    .select()
    .from(photos)
    .orderBy(photos.createdAt)
    .limit(5);

  return {
    photoCount: photoCount[0]?.count || 0,
    categoryCount: categoryCount[0]?.count || 0,
    userCount: userCount[0]?.count || 0,
    latestPhotos,
  };
}

export default async function AdminDashboard() {
  const { photoCount, categoryCount, userCount, latestPhotos } = await getData();

  const stats = [
    {
      label: "تعداد عکس‌ها",
      value: photoCount,
      icon: "🖼️",
      href: "/admin/photos",
      color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
    },
    {
      label: "دسته‌بندی‌ها",
      value: categoryCount,
      icon: "📂",
      href: "/admin/categories",
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    },
    {
      label: "کاربران",
      value: userCount,
      icon: "👥",
      href: "#",
      color: "from-green-500/20 to-green-600/10 border-green-500/30",
    },
  ];

  const quickActions = [
    { href: "/admin/photos", label: "افزودن عکس جدید", icon: "➕", color: "bg-yellow-500 text-black" },
    { href: "/admin/categories", label: "افزودن دسته‌بندی", icon: "📁", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
    { href: "/admin/settings", label: "ویرایش تنظیمات", icon: "⚙️", color: "bg-purple-500/20 text-purple-400 border border-purple-500/30" },
    { href: "/", label: "مشاهده سایت", icon: "🌐", color: "bg-green-500/20 text-green-400 border border-green-500/30" },
  ];

  return (
    <div className="page-enter">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">داشبورد</h1>
        <p className="text-gray-400 mt-1">خوش آمدید به پنل مدیریت لنز طلایی</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`glass rounded-2xl p-6 bg-gradient-to-br ${stat.color} hover:-translate-y-1 transition-all`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
            <div className="text-gray-300 text-sm">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.color} rounded-xl p-4 text-center text-sm font-medium hover:-translate-y-0.5 transition-all`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div>{action.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Photos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">آخرین عکس‌های آپلود شده</h2>
          <Link href="/admin/photos" className="text-yellow-400 text-sm hover:text-yellow-300">
            مشاهده همه ←
          </Link>
        </div>
        <div className="glass rounded-2xl overflow-hidden">
          {latestPhotos.length > 0 ? (
            <div className="divide-y divide-white/5">
              {latestPhotos.map((photo) => (
                <div key={photo.id} className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{photo.title}</div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      {new Date(photo.createdAt).toLocaleDateString("fa-IR")}
                    </div>
                  </div>
                  {photo.featured && (
                    <span className="px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs">
                      ویژه
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📷</div>
              <p>هنوز عکسی آپلود نشده</p>
              <Link href="/admin/photos" className="text-yellow-400 text-sm mt-2 inline-block hover:underline">
                اولین عکس را آپلود کنید
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
