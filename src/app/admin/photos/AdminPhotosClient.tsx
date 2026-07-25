"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Photo {
  id: number;
  title: string;
  description: string | null;
  url: string;
  filename: string;
  categoryId: number | null;
  featured: boolean | null;
  order: number | null;
  createdAt: Date;
  categoryName: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  initialPhotos: Photo[];
  categories: Category[];
}

interface UploadForm {
  title: string;
  description: string;
  categoryId: string;
  featured: boolean;
  order: string;
}

export default function AdminPhotosClient({ initialPhotos, categories }: Props) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [showUpload, setShowUpload] = useState(false);
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<{ url: string; filename: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState<UploadForm>({
    title: "",
    description: "",
    categoryId: "",
    featured: false,
    order: "0",
  });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUploadedFile({ url: data.url, filename: data.filename });
      showToast("تصویر با موفقیت آپلود شد");
    } catch (err) {
      showToast((err as Error).message || "خطا در آپلود", "error");
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", categoryId: "", featured: false, order: "0" });
    setPreviewUrl("");
    setUploadedFile(null);
    setShowUpload(false);
    setEditPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      showToast("لطفاً ابتدا یک تصویر آپلود کنید", "error");
      return;
    }
    if (!form.title.trim()) {
      showToast("عنوان الزامی است", "error");
      return;
    }
try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          url: uploadedFile.url,
          filename: uploadedFile.filename,
          categoryIds: form.categoryId ? [form.categoryId] : [],
          featured: form.featured,
          order: form.order,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("عکس با موفقیت اضافه شد");
      resetForm();
      router.refresh();
      // Refresh photos list
      const photosRes = await fetch("/api/photos");
      const photosData = await photosRes.json();
      if (photosData.photos) setPhotos(photosData.photos);
    } catch (err) {
      showToast((err as Error).message || "خطا در ذخیره", "error");
    }
  };

  const handleEdit = (photo: Photo) => {
    setEditPhoto(photo);
    setForm({
      title: photo.title,
      description: photo.description || "",
      categoryId: (photo as any).categoryId?.toString() || (photo as any).categories?.[0]?.id?.toString() || "",
      featured: photo.featured || false,
      order: photo.order?.toString() || "0",
    });
    setPreviewUrl(photo.url);
    setShowUpload(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPhoto) return;

    try {
      const res = await fetch(`/api/photos/${editPhoto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          categoryIds: form.categoryId ? [parseInt(form.categoryId)] : [],
          featured: form.featured,
          order: parseInt(form.order) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("عکس با موفقیت ویرایش شد");
      resetForm();
      router.refresh();
      const photosRes = await fetch("/api/photos");
      const photosData = await photosRes.json();
      if (photosData.photos) setPhotos(photosData.photos);
    } catch (err) {
      showToast((err as Error).message || "خطا در ویرایش", "error");
    }
  };

  const handleDelete = async (id: number) => {
  if (!confirm("آیا از حذف این عکس اطمینان دارید؟")) return;

  try {
    const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // ۱. حذف عکس از لیست عکس‌ها
    setPhotos(photos.filter((p) => p.id !== id));
    
    // ۲. رفرش کش Next.js
    router.refresh();
    
    showToast("عکس با موفقیت حذف شد");
  } catch (err) {
    showToast((err as Error).message || "خطا در حذف", "error");
  }
};

  return (
    <div className="page-enter">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-xl text-sm font-medium shadow-lg toast-enter ${
            toast.type === "success"
              ? "bg-green-500/90 text-white border border-green-400/50"
              : "bg-red-500/90 text-white border border-red-400/50"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت عکس‌ها</h1>
          <p className="text-gray-400 text-sm mt-1">{photos.length} عکس در سیستم</p>
        </div>
        <button
          onClick={() => { setShowUpload(true); setEditPhoto(null); resetForm(); setShowUpload(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
        >
          <span>➕</span>
          <span>افزودن عکس</span>
        </button>
      </div>

      {/* Upload / Edit Form */}
      {(showUpload || editPhoto) && (
        <div className="glass rounded-2xl p-6 mb-8 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg">
              {editPhoto ? "ویرایش عکس" : "افزودن عکس جدید"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <form onSubmit={editPhoto ? handleSubmitEdit : handleSubmitUpload}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Upload area */}
              <div>
                {!editPhoto && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      dragOver
                        ? "border-yellow-400 bg-yellow-400/10"
                        : previewUrl
                        ? "border-green-400/50 bg-green-400/5"
                        : "border-white/20 hover:border-yellow-400/50 hover:bg-white/5"
                    }`}
                    style={{ minHeight: "200px" }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-8 h-8 animate-spin text-yellow-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p className="text-gray-400 text-sm">در حال آپلود...</p>
                      </div>
                    ) : previewUrl ? (
                      <div className="relative">
                        <img src={previewUrl} alt="preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                        <div className="mt-2 text-green-400 text-sm">✓ تصویر آپلود شد - کلیک برای تغییر</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center text-3xl">
                          📁
                        </div>
                        <div>
                          <p className="text-white font-medium">انتخاب یا کشیدن تصویر</p>
                          <p className="text-gray-400 text-sm mt-1">JPEG، PNG، WEBP تا ۱۰ مگابایت</p>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm border border-yellow-500/30">
                          انتخاب از گالری
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {editPhoto && (
                  <div className="rounded-xl overflow-hidden">
                    <img src={editPhoto.url} alt={editPhoto.title} className="w-full object-cover max-h-64" />
                  </div>
                )}
              </div>

              {/* Right: Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">عنوان عکس *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm transition-colors"
                    placeholder="عنوان عکس را وارد کنید"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">توضیحات</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none transition-colors"
                    rows={3}
                    placeholder="توضیحات اختیاری..."
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">دسته‌بندی</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm transition-colors"
                  >
                    <option value="">بدون دسته‌بندی</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">ترتیب نمایش</label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm transition-colors"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">عکس ویژه</label>
                    <div
                      onClick={() => setForm({ ...form, featured: !form.featured })}
                      className={`w-full h-[46px] rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        form.featured
                          ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                    >
                      <span>{form.featured ? "⭐ بله" : "☆ خیر"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!editPhoto && !uploadedFile}
                    className="flex-1 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
                  >
                    {editPhoto ? "ذخیره تغییرات" : "افزودن عکس"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Photos Grid */}
      <div className="glass rounded-2xl overflow-hidden">
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative rounded-xl overflow-hidden bg-gray-900 aspect-square">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-1">
                      {photo.featured && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-yellow-500/80 text-black font-bold">ویژه</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-sm transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium line-clamp-2">{photo.title}</p>
                    {photo.categoryName && (
                      <p className="text-yellow-400 text-xs mt-0.5">{photo.categoryName}</p>
                    )}
                    <button
                      onClick={() => handleEdit(photo)}
                      className="mt-2 w-full py-1.5 rounded-lg bg-yellow-500/80 text-black text-xs font-bold hover:bg-yellow-500 transition-colors"
                    >
                      ویرایش
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📷</div>
            <p className="text-lg mb-2">هنوز عکسی اضافه نشده</p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 px-6 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all"
            >
              اولین عکس را آپلود کنید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
