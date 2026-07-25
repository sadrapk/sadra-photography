export const dynamic = "force-dynamic";
export const revalidate = 0;

import { db } from "@/db";
import { categories, photoCategories } from "@/db/schema";
import { count, asc } from "drizzle-orm";
import AdminCategoriesClient from "./AdminCategoriesClient";

async function getData() {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.order), asc(categories.name));

  // شمارش تعداد عکس‌ها بر اساس جدول واسط photoCategories
  const photoCounts = await db
    .select({
      categoryId: photoCategories.categoryId,
      count: count(),
    })
    .from(photoCategories)
    .groupBy(photoCategories.categoryId);

  const countMap = new Map(photoCounts.map((p) => [p.categoryId, p.count]));

  const categoriesWithCount = allCategories.map((cat) => ({
    ...cat,
    photoCount: countMap.get(cat.id) || 0,
  }));

  return { categories: categoriesWithCount };
}

export default async function AdminCategoriesPage() {
  const { categories } = await getData();
  return <AdminCategoriesClient initialCategories={categories} />;
}
