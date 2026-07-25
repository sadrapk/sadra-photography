"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("خطا در ارسال پیام");

      setSent(true);
    } catch (err: any) {
      setError(err.message || "مشکلی پیش آمد، دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="glass rounded-2xl p-8 text-center space-y-4">
        <div className="text-3xl">✅</div>
        <h3 className="text-white font-bold text-xl">پیام شما با موفقیت ارسال شد</h3>
        <p className="text-gray-400 text-sm">در اولین فرصت با شما تماس خواهم گرفت.</p>
        <button
          onClick={() => setSent(false)}
          className="text-yellow-400 text-sm hover:underline"
        >
          ارسال پیام جدید
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-white font-bold text-xl mb-6">ارسال پیام</h2>
      {error && (
        <div className="mb-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">نام</label>
            <input
              required
              name="name"
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500/50 transition-colors outline-none"
              placeholder="نام شما"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">ایمیل</label>
            <input
              required
              name="email"
              type="email"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500/50 transition-colors outline-none"
              placeholder="ایمیل شما"
              dir="ltr"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">موضوع</label>
          <input
            required
            name="subject"
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500/50 transition-colors outline-none"
            placeholder="موضوع پیام"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">پیام</label>
          <textarea
            required
            name="message"
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-yellow-500/50 transition-colors resize-none outline-none"
            placeholder="پیام خود را بنویسید..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50"
        >
          {loading ? "در حال ارسال..." : "ارسال پیام"}
        </button>
      </form>
    </div>
  );
}