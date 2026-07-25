"use client";

import { useState, useRef } from "react";

interface Props {
  initialSettings: Record<string, string>;
}

const SETTING_GROUPS = [
  {
    title: "اطلاعات سایت",
    icon: "🌐",
    fields: [
      { key: "site_title", label: "عنوان سایت", type: "text" },
      { key: "site_subtitle", label: "زیرعنوان", type: "text" },
      { key: "site_description", label: "توضیحات سایت", type: "textarea" },
    ],
  },
  {
    title: "بخش هیرو (صفحه اصلی)",
    icon: "🖼️",
    fields: [
      { key: "hero_title", label: "عنوان هیرو", type: "text" },
      { key: "hero_subtitle", label: "زیرعنوان هیرو", type: "text" },
      { key: "hero_image", label: "تصویر پس‌زمینه هیرو", type: "image" },
    ],
  },
  {
    title: "درباره ما",
    icon: "ℹ️",
    fields: [
      { key: "about_title", label: "عنوان بخش درباره ما", type: "text" },
      { key: "about_text", label: "متن درباره ما", type: "textarea" },
    ],
  },
  {
    title: "اطلاعات تماس",
    icon: "📞",
    fields: [
      { key: "contact_email", label: "ایمیل", type: "text" },
      { key: "contact_phone", label: "شماره تلفن", type: "text" },
      { key: "contact_address", label: "آدرس", type: "text" },
    ],
  },
  {
    title: "شبکه‌های اجتماعی",
    icon: "📱",
    fields: [
      { key: "instagram", label: "لینک اینستاگرام", type: "text" },
      { key: "telegram", label: "لینک یا آیدی تلگرام", type: "text" },
      { key: "whatsapp", label: "لینک یا شماره واتس‌اپ", type: "text" },
    { key: "linkedin", label: "لینک یا آیدی لینکدین", type: "text" },
    ],
  },
];

export default function AdminSettingsClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("خطا در ذخیره");
      showToast("تنظیمات با موفقیت ذخیره شد");
    } catch {
      showToast("خطا در ذخیره تنظیمات", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploading((u) => ({ ...u, [key]: true }));
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSettings((s) => ({ ...s, [key]: data.url }));
      showToast("تصویر آپلود شد");
    } catch (err) {
      showToast((err as Error).message || "خطا", "error");
    } finally {
      setUploading((u) => ({ ...u, [key]: false }));
    }
  };

  return (
    <div className="page-enter">
      {toast && (
        <div className={`fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-xl text-sm font-medium shadow-lg toast-enter ${
          toast.type === "success" ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">تنظیمات سایت</h1>
          <p className="text-gray-400 text-sm mt-1">ویرایش اطلاعات و محتوای سایت</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50"
        >
          {saving ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <span>💾</span>
          )}
          <span>{saving ? "در حال ذخیره..." : "ذخیره تمام تغییرات"}</span>
        </button>
      </div>

      <div className="space-y-6">
        {SETTING_GROUPS.map((group) => (
          <div key={group.title} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{group.icon}</span>
              <h2 className="text-white font-bold text-lg">{group.title}</h2>
            </div>

            <div className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-gray-400 text-sm mb-2">{field.label}</label>

                  {field.type === "textarea" ? (
                    <textarea
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none transition-colors"
                      rows={3}
                    />
                  ) : field.type === "image" ? (
                    <div>
                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => fileRefs.current[field.key]?.click()}
                          className="flex-1 border-2 border-dashed border-white/20 rounded-xl p-4 text-center cursor-pointer hover:border-yellow-400/50 transition-colors"
                        >
                          <input
                            ref={(el) => { fileRefs.current[field.key] = el; }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(field.key, file);
                            }}
                            className="hidden"
                          />
                          {uploading[field.key] ? (
                            <div className="flex items-center justify-center gap-2 text-yellow-400">
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              <span className="text-sm">آپلود...</span>
                            </div>
                          ) : settings[field.key] ? (
                            <div className="flex items-center gap-3">
                              <img src={settings[field.key]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                              <span className="text-green-400 text-sm">✓ تصویر انتخاب شده - کلیک برای تغییر</span>
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm">کلیک برای آپلود تصویر</p>
                          )}
                        </div>
                        {settings[field.key] && (
                          <button
                            onClick={() => setSettings({ ...settings, [field.key]: "" })}
                            className="px-3 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={settings[field.key] || ""}
                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                        className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-400 text-xs"
                        placeholder="یا URL تصویر را وارد کنید"
                        dir="ltr"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50"
        >
          {saving ? "در حال ذخیره..." : "💾 ذخیره تمام تغییرات"}
        </button>
      </div>
    </div>
  );
}
