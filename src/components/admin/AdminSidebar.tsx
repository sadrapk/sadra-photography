"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface AdminSidebarProps {
  username: string;
}

const navItems = [
  { href: "/admin", label: "داشبورد", icon: "📊" },
  { href: "/admin/photos", label: "مدیریت عکس‌ها", icon: "🖼️" },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: "📁" },
  { href: "/admin/settings", label: "تنظیمات سایت", icon: "⚙️" },
  { href: "/admin/pages", label: "صفحات", icon: "📄" },
  { href: "/admin/messages", label: "پیام‌های دریافتی", icon: "📬" }, // <-- این خط را اضافه کنید
];

export default function AdminSidebar({ username }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
           <img
  src="/uploads/logo.png" /* مسیر عکس شما در پوشه public */
  alt="لوگو"
  className="w-full h-full object-cover rounded-full"
/>
          </div>
          <div>
            <div className="text-white font-bold text-sm">لوموس | Lumos</div>
            <div className="text-yellow-500 text-xs">پنل مدیریت</div>
          </div>
        </Link>
      </div>

      {/* User */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="w-9 h-9 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 font-bold text-sm">
            {username[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-white font-medium text-sm">{username}</div>
            <div className="text-yellow-500 text-xs">مدیر سیستم</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 admin-sidebar overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-yellow-500/20 border border-yellow-500/40 text-yellow-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span className="mr-auto w-1.5 h-1.5 rounded-full bg-yellow-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <span>🌐</span>
          <span>مشاهده سایت</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span>🚪</span>
          <span>خروج از حساب</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 right-0 h-full w-64 bg-[#111111] border-l border-white/5 flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 right-0 left-0 z-50 bg-[#111111] border-b border-white/5 flex items-center justify-between px-4 h-16">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold text-sm">لوموس | Lumos</span>
          <span className="text-gray-500 text-xs">| پنل مدیریت</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 font-bold text-sm">
          {username[0]?.toUpperCase()}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute top-0 right-0 h-full w-64 bg-[#111111] border-l border-white/5 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Mobile top padding */}
      <div className="md:hidden h-16" />
    </>
  );
  
}
