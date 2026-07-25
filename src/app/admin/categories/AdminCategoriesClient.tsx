
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  order: number | null;
  createdAt: Date;
  photoCount: number;
}

interface Props {
  initialCategories: Category[];
}

interface CatForm {
  name: string;
  slug: string;
  description: string;
  order: string;
}

function slugify(text: string): string {
  const persianToEnglish: Record<string, string> = {};
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "") || text.toLowerCase().replace(/\s+/g, "-");
}

export default function AdminCategoriesClient({ initialCategories }: Props) {
  const router = useRouter();
  const [cats, setCats] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState<CatForm>({ name: "", slug: "", description: "", order: "0" });
  const [coverPreview, setCoverPreview] = useState("");
  const [coverFile, setCoverFile] = useState<{ url: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCoverFile({ url: data.url });
      showToast("تصویر کاور آپلود شد");
    } catch (err) {
      showToast((err as Error).message || "خطا در آپلود", "error");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", order: "0" });
    setCoverPreview("");
    setCoverFile(null);
    setShowForm(false);
    setEditCat(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      showToast("نام و شناسه الزامی است", "error");
      return;
    }

    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        coverImage: coverFile?.url || (editCat?.coverImage || null),
        order: parseInt(form.order) || 0,
      };

      if (editCat) {
        const res = await fetch(`/api/categories/${editCat.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        showToast("دسته‌بندی ویرایش شد");
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        showToast("دسته‌بندی اضافه شد");
      }

      resetForm();
      router.refresh();
      const catsRes = await fetch("/api/categories");
      const catsData = await catsRes.json();
      if (catsData.categories) setCats(catsData.categories);
    } catch (err) {
      showToast((err as Error).message || "خطا", "error");
    }
  };

  const handleEdit = (cat: Category) => {
    setEditCat(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      order: cat.order?.toString() || "0",
    });
    setCoverPreview(cat.coverImage || "");
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
  if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;

  try {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();

    // اگر سرور نتوانست پاک کند، پیغام خطا بدهد و صفحه را رفرش نکند
    if (!res.ok) {
      alert(`حذف انجام نشد: ${data.error || 'خطای نا مشخص'}`);
      return;
    }

    // اگر در دیتابیس موفق بود، حالا استیت و صفحه بروزرسانی شوند
    setCats((prev) => prev.filter((c) => c.id !== id));
    window.location.reload();
  } catch (err) {
    alert("ارتباط با سرور برقرار نشد");
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
          <h1 className="text-2xl font-bold text-white">دسته‌بندی‌ها</h1>
          <p className="text-gray-400 text-sm mt-1">{cats.length} دسته‌بندی</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
        >
          <span>➕</span>
          <span>دسته‌بندی جدید</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 mb-8 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg">
              {editCat ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-white w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">نام دسته‌بندی *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm({ ...form, name, slug: editCat ? form.slug : slugify(name) });
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="مثال: مناظر طبیعی"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">شناسه (slug) *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="مثال: landscape"
                  required
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">توضیحات</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none"
                  rows={3}
                  placeholder="توضیح کوتاه..."
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">ترتیب نمایش</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">تصویر کاور (اختیاری)</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-yellow-400/50 transition-colors"
                style={{ minHeight: "180px" }}
              >
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {uploading ? (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-6 h-6 animate-spin text-yellow-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                ) : coverPreview ? (
                  <img src={coverPreview} alt="cover" className="max-h-36 mx-auto rounded-lg object-contain" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-2 h-full justify-center">
                    <span className="text-3xl">🖼️</span>
                    <p className="text-sm">کلیک برای انتخاب تصویر</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button type="submit" className="flex-1 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all">
                  {editCat ? "ذخیره تغییرات" : "افزودن دسته‌بندی"}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all">
                  انصراف
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="glass rounded-2xl overflow-hidden">
        {cats.length > 0 ? (
          <div className="divide-y divide-white/5">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs text-gray-500 uppercase">
              <div className="col-span-5">دسته‌بندی</div>
              <div className="col-span-2 text-center">تعداد عکس</div>
              <div className="col-span-2 text-center">ترتیب</div>
              <div className="col-span-3 text-left">عملیات</div>
            </div>
            {cats.map((cat) => (
              <div key={cat.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/2 transition-colors">
                <div className="col-span-5 flex items-center gap-3">
                  {cat.coverImage ? (
                    <img src={cat.coverImage} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-xl">
                      📂
                    </div>
                  )}
                  <div>
                    <div className="text-white font-medium text-sm">{cat.name}</div>
                    <div className="text-gray-500 text-xs" dir="ltr">{cat.slug}</div>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs">
                    {cat.photoCount} عکس
                  </span>
                </div>
                <div className="col-span-2 text-center text-gray-400 text-sm">{cat.order}</div>
                <div className="col-span-3 flex items-center gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs hover:bg-yellow-500/30 transition-colors"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📂</div>
            <p>دسته‌بندی‌ای وجود ندارد</p>
            <button onClick={() => setShowForm(true)} className="mt-4 px-6 py-3 rounded-xl bg-yellow-500 text-black font-bold">
              اولین دسته‌بندی را بسازید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
