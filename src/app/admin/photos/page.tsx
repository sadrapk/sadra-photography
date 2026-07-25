import { db } from "@/db";
import { photos, categories, photoCategories } from "@/db/schema";
import { eq, asc, desc, inArray } from "drizzle-orm";
import AdminPhotosClient from "./AdminPhotosClient";

async function getData() {
  // ۱. دریافت تمام عکس‌ها
  const rawPhotos = await db
    .select()
    .from(photos)
    .orderBy(asc(photos.order), desc(photos.createdAt));

  // ۲. دریافت تمام دسته‌بندی‌ها
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.order));

  const photoIds = rawPhotos.map((p) => p.id);
  let photoCategoryRelations: { photoId: number; categoryId: number; categoryName: string }[] = [];

  // ۳. دریافت اتصالات دسته‌ها از جدول واسط
  if (photoIds.length > 0) {
    photoCategoryRelations = await db
      .select({
        photoId: photoCategories.photoId,
        categoryId: categories.id,
        categoryName: categories.name,
      })
      .from(photoCategories)
      .innerJoin(categories, eq(photoCategories.categoryId, categories.id))
      .where(inArray(photoCategories.photoId, photoIds));
  }

  // ۴. ترکیب داده‌ها (پشتیبانی همزمان از ساختار قدیم و جدید)
  const allPhotos = rawPhotos.map((photo) => {
    const matchedCats = photoCategoryRelations.filter((r) => r.photoId === photo.id);
    const firstCategory = matchedCats[0];

    return {
      ...photo,
      // فیلدهای قدیمی برای حفظ سازگاری با AdminPhotosClient
      categoryId: firstCategory ? firstCategory.categoryId : null,
      categoryName: firstCategory ? firstCategory.categoryName : null,
      // فیلدهای جدید برای ساختار چند‌دسته‌ای
      categoryIds: matchedCats.map((c) => c.categoryId),
      categories: matchedCats.map((c) => ({
        id: c.categoryId,
        name: c.categoryName,
      })),
    };
  });

  return { allPhotos, allCategories };
}

export default async function AdminPhotosPage() {
  const { allPhotos, allCategories } = await getData();

  return (
    <AdminPhotosClient
      initialPhotos={allPhotos as any}
      categories={allCategories as any}
    />
  );
}