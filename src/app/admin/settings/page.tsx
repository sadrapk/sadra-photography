import { db } from "@/db";
import { settings } from "@/db/schema";
import AdminSettingsClient from "./AdminSettingsClient";

async function getData() {
  const allSettings = await db.select().from(settings);
  const settingsMap: Record<string, string> = {};
  for (const s of allSettings) settingsMap[s.key] = s.value || "";
  return { settings: settingsMap };
}

export default async function AdminSettingsPage() {
  const { settings } = await getData();
  return <AdminSettingsClient initialSettings={settings} />;
}
