"use client";

import { useState, useRef } from "react";

interface Page {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  heroImage: string | null;
  updatedAt: Date;
}

interface Props {
  initialPages: Page[];
}

export default function AdminPagesClient({ initialPages }: Props) {
  const [pages] = useState(initialPages);
  const [editPage, setEditPage] = useState<Page | null>(null);
  const [form, setForm] = useState({ titleWhite: "", titleGold: "", content: "", heroImage: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

 const handleEdit = (page: Page) => {
  setEditPage(page);
  const parts = (page.title || "").split("|");
  setForm({
    titleWhite: parts[0] || "",
    titleGold: parts[1] || "",
    content: page.content || "",
    heroImage: page.heroImage || "",
  });
};

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, heroImage: data.url }));
      showToast("تصویر آپلود شد");
    } catch (err) {
      showToast((err as Error).message || "خطا", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPage) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${editPage.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  ...form,
  title: `${form.titleWhite}|${form.titleGold}`,
}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("صفحه با موفقیت ذخیره شد");
      setEditPage(null);
    } catch (err) {
      showToast((err as Error).message || "خطا", "error");
    } finally {
      setSaving(false);
    }
  };

  const PAGE_LABELS: Record<string, string> = {
  about: "درباره ما",
  contact: "تماس با ما",
  categories: "دسته‌بندی‌ها",
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

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">مدیریت صفحات</h1>
        <p className="text-gray-400 text-sm mt-1">ویرایش محتوای صفحات ثابت سایت</p>
      </div>

      {/* Pages List */}
      {!editPage ? (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-6 hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xl">
                    📄
                  </div>
                  <div>
                    <div className="text-white font-medium">{PAGE_LABELS[page.slug] || page.title}</div>
                    <div className="text-gray-500 text-xs" dir="ltr">/{page.slug}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(page)}
                  className="px-4 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm hover:bg-yellow-500/30 transition-colors"
                >
                  ویرایش
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Edit Form */
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg">
              ویرایش: {PAGE_LABELS[editPage.slug] || editPage.title}
            </h2>
            <button
              onClick={() => setEditPage(null)}
              className="text-gray-400 hover:text-white w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-gray-400 text-sm mb-2">عنوان (بخش سفید)</label>
    <input
      type="text"
      value={form.titleWhite}
      onChange={(e) => setForm({ ...form, titleWhite: e.target.value })}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
      placeholder="مثلاً: بیایید"
    />
  </div>

  <div>
    <label className="block text-gray-400 text-sm mb-2">عنوان (بخش طلایی)</label>
    <input
      type="text"
      value={form.titleGold}
      onChange={(e) => setForm({ ...form, titleGold: e.target.value })}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-yellow-400 text-sm"
      placeholder="مثلاً: صحبت کنیم"
    />
  </div>
</div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">محتوای صفحه</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none"
                rows={8}
                placeholder="محتوای صفحه را وارد کنید..."
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">تصویر هدر (اختیاری)</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-xl p-4 cursor-pointer hover:border-yellow-400/50 transition-colors"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                  className="hidden"
                />
                {uploading ? (
                  <p className="text-yellow-400 text-sm text-center">در حال آپلود...</p>
                ) : form.heroImage ? (
                  <div className="flex items-center gap-3">
                    <img src={form.heroImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="text-green-400 text-sm">✓ تصویر آپلود شده - کلیک برای تغییر</span>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center">کلیک برای آپلود تصویر هدر</p>
                )}
              </div>
              <input
                type="text"
                value={form.heroImage}
                onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-400 text-xs"
                placeholder="یا URL تصویر را وارد کنید"
                dir="ltr"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all disabled:opacity-50"
              >
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
              <button
                type="button"
                onClick={() => setEditPage(null)}
                className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
