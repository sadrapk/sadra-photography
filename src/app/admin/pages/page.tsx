import { db } from "@/db";
import { pages } from "@/db/schema";
import AdminPagesClient from "./AdminPagesClient";

async function getData() {
  const allPages = await db.select().from(pages);
  return { pages: allPages };
}

export default async function AdminPagesPage() {
  const { pages } = await getData();
  return <AdminPagesClient initialPages={pages} />;
}
