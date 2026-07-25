"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavbarProps {
  siteTitle?: string;
}

export default function Navbar({ siteTitle = "لنز طلایی" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "خانه" },
    { href: "/gallery", label: "گالری" },
    { href: "/categories", label: "دسته‌بندی‌ها" },
    { href: "/about", label: "درباره من" },
    { href: "/contact", label: "تماس با من" },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
<div className="flex items-center gap-3">
  {/* دکمه عکس لوگو که با کلیک روی آن مدال باز می‌شود */}
  <button 
    type="button"
    onClick={() => setIsImageModalOpen(true)}
    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center focus:outline-none cursor-pointer hover:opacity-80 transition-opacity"
  >
    <img 
      src="/uploads/logo.png" 
      alt="Lumos Logo" 
      className="w-full h-full object-cover" 
    />
  </button>

  {/* متن لوگو که کماکان به صفحه اصلی لینک دارد */}
  <Link href="/">
    <span className="text-xl font-bold gold-gradient hidden sm:block">{siteTitle}</span>
  </Link>
</div>

{/* مدال بزرگنمایی تصویر لوگو */}
{isImageModalOpen && (
  <div 
    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
    onClick={() => setIsImageModalOpen(false)}
  >
    <div className="relative max-w-md max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
      <img 
        src="/uploads/logo.png" 
        alt="Lumos Logo Large" 
        className="w-auto h-auto max-w-full max-h-[80vh] rounded-2xl shadow-2xl border border-yellow-500/20 object-contain" 
      />
      <button 
        type="button"
        onClick={() => setIsImageModalOpen(false)}
        className="absolute -top-10 right-0 text-white text-sm font-bold hover:text-yellow-400"
      >
        ✕ بستن
      </button>
    </div>
  </div>
)}

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "text-yellow-400 bg-yellow-400/10"
                    : "text-gray-300 hover:text-yellow-400 hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-all"
                  >
                    🛠 پنل مدیریت
                  </Link>
                )}
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10 transition-all"
                >
                  خروج
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-lg bg-yellow-500 text-black text-sm font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/25"
              >
                ورود
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-yellow-400 p-2"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-yellow-500/10">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "text-yellow-400 bg-yellow-400/10"
                    : "text-gray-300 hover:text-yellow-400 hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10">
              {user ? (
                <div className="space-y-2">
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-medium"
                    >
                      🛠 پنل مدیریت
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-full text-right px-4 py-3 rounded-lg border border-red-500/40 text-red-400 text-sm"
                  >
                    خروج از حساب
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-yellow-500 text-black text-sm font-bold text-center"
                >
                  ورود به حساب
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
