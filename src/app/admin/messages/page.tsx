import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc } from "drizzle-orm";

export const revalidate = 0; // دریافت لحظه‌ای داده‌ها

export default async function AdminMessagesPage() {
  const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt));

  return (
    <div className="p-8 text-white min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">پیام‌های دریافتی ({allMessages.length})</h1>
        </div>

        {allMessages.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-gray-400">
            هنوز هیچ پیامی دریافت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {allMessages.map((msg) => (
              <div key={msg.id} className="glass rounded-2xl p-6 space-y-3 border border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3">
                  <div>
                    <span className="font-bold text-yellow-400 text-lg">{msg.name}</span>
                    <span className="text-gray-400 text-sm dir-ltr mr-2">({msg.email})</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-300">موضوع: {msg.subject}</div>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-xl">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}