"use client";

import Link from "next/link";

interface FooterProps {
  settings?: Record<string, string>;
}

export default function Footer({ settings = {} }: FooterProps) {
  return (
    <footer className="bg-black border-t border-yellow-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
  <img 
    src="/uploads/logo.png" 
    alt="Lumos Logo" 
    className="w-full h-full object-cover" 
  />
</div>
              <span className="text-xl font-bold gold-gradient">
                {settings.site_title || "لنز طلایی"}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {settings.site_description || "جادوی لحظه‌ها در قاب تصویر"}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4">لینک‌های سریع</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "خانه" },
                { href: "/gallery", label: "گالری" },
                { href: "/categories", label: "دسته‌بندی‌ها" },
                { href: "/about", label: "درباره ما" },
                { href: "/contact", label: "تماس" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4">تماس با ما</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {settings.contact_email && (
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <span>{settings.contact_email}</span>
                </li>
              )}
              {settings.contact_phone && (
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>{settings.contact_phone}</span>
                </li>
              )}
              {settings.contact_address && (
                <li className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{settings.contact_address}</span>
                </li>
              )}
            </ul>
           <div className="flex gap-3 mt-4">
  {/* Instagram */}
{settings?.instagram && settings.instagram !== "#" && (
  <a 
    href={
      settings.instagram.startsWith("http")
        ? settings.instagram
        : `https://instagram.com/${settings.instagram.replace("@", "")}`
    } 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-all"
    title="اینستاگرام"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  </a>
)}

  {/* Telegram */}
  <a 
    href={settings.telegram || "https://t.me/spk47"} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-all"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.128.832.942z"/>
    </svg>
  </a>

  {/* WhatsApp */}
  <a 
    href={settings.whatsapp || "https://wa.me/989044772207"} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-all"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
    </svg>
  </a>
  {/* LinkedIn */}
{settings?.linkedin && settings.linkedin !== "#" && (
  <a 
    href={settings.linkedin} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-all"
    title="لینکدین"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  </a>
)}
</div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} لوموس | تمامی حقوق این سایت برای صدرا پورکلهر محفوظ است</p>
        </div>
      </div>
    </footer>
  );
}
