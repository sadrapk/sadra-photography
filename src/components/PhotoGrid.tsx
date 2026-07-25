"use client";

import { useState } from "react";
import Lightbox from "./Lightbox";

interface Photo {
  id: number;
  title: string;
  description?: string | null;
  url: string;
  categoryName?: string | null;
  categorySlug?: string | null;
  featured?: boolean | null;
}

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openPhoto = (index: number) => setSelectedIndex(index);
  const closePhoto = () => setSelectedIndex(null);
  const prevPhoto = () => setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const nextPhoto = () =>
    setSelectedIndex((i) => (i !== null && i < photos.length - 1 ? i + 1 : i));

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-6xl mb-4">📷</div>
        <p className="text-lg">هنوز عکسی بارگذاری نشده است</p>
      </div>
    );
  }

  return (
    <>
      <div className="masonry-grid">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="masonry-item photo-card relative cursor-pointer group rounded-lg overflow-hidden bg-gray-900"
            onClick={() => openPhoto(index)}
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="photo-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-white font-semibold text-sm">{photo.title}</h3>
              {photo.categoryName && (
                <span className="text-yellow-400 text-xs mt-1">{photo.categoryName}</span>
              )}
            </div>
            {photo.featured && (
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-yellow-500/90 text-black text-xs font-bold">
                ویژه
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          photo={photos[selectedIndex]}
          onClose={closePhoto}
          onPrev={prevPhoto}
          onNext={nextPhoto}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < photos.length - 1}
        />
      )}
    </>
  );
}
