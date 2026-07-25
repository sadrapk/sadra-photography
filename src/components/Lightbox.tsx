"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

interface Photo {
  id: number;
  title: string;
  description?: string | null;
  url: string;
  categoryName?: string | null;
}

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function Lightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev && hasPrev) onPrev();
      if (e.key === "ArrowRight" && onNext && hasNext) onNext();
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center lightbox-overlay"
      style={{ background: "rgba(0,0,0,0.95)" }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev button */}
      {hasPrev && onPrev && (
        <button
          onClick={onPrev}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {hasNext && onNext && (
        <button
          onClick={onNext}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl max-h-screen p-4 w-full">
        <div className="relative w-full" style={{ maxHeight: "80vh" }}>
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-full object-contain rounded-lg shadow-2xl"
            style={{ maxHeight: "80vh" }}
          />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-white font-semibold text-lg">{photo.title}</h3>
          {photo.description && (
            <p className="text-gray-400 text-sm mt-1">{photo.description}</p>
          )}
          {photo.categoryName && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs">
              {photo.categoryName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
