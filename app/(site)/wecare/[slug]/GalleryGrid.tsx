'use client'

import { useState } from 'react'
import GalleryLightbox from '../GalleryLightbox'
import type { GalleryItem } from '../galleries'

interface Props {
  items: GalleryItem[]
}

/**
 * Per-event gallery view. Renders a responsive thumbnail grid; clicking
 * any thumbnail opens GalleryLightbox at that index. Video items show a
 * play-button overlay on the thumbnail so the user knows it's not just
 * a static image.
 */
export default function GalleryGrid({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, i) => {
          const thumbSrc = item.type === 'video' ? (item.poster ?? '') : item.src

          return (
            <button
              key={`${item.src}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="gallery-thumb"
              aria-label={item.type === 'video' ? `Play video ${i + 1}` : `Open image ${i + 1}`}
            >
              {thumbSrc ? (
                <img
                  src={thumbSrc}
                  alt=""
                  loading="lazy"
                  className="gallery-thumb-img"
                />
              ) : (
                /* Video without poster — fall back to the first frame
                   loaded inline. preload=metadata is enough to render the
                   first frame in most browsers. */
                <video
                  src={item.src}
                  preload="metadata"
                  muted
                  className="gallery-thumb-video"
                />
              )}

              {item.type === 'video' && (
                <div className="gallery-thumb-play" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <GalleryLightbox
        items={items}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />

      <style jsx>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 720px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 420px) {
          .gallery-grid { grid-template-columns: 1fr; }
        }

        .gallery-thumb {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--gray-200);
          background: var(--gray-100);
          padding: 0;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1),
                      box-shadow 0.3s, border-color 0.3s;
        }
        .gallery-thumb:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.10);
          border-color: rgba(0, 181, 214, 0.35);
        }
        .gallery-thumb:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .gallery-thumb-img,
        .gallery-thumb-video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gallery-thumb:hover .gallery-thumb-img,
        .gallery-thumb:hover .gallery-thumb-video {
          transform: scale(1.05);
        }

        .gallery-thumb-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          border-radius: 999px;
          background: rgba(0, 181, 214, 0.92);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 4px; /* optical centering for the triangle */
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.30);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .gallery-thumb:hover .gallery-thumb-play {
          transform: translate(-50%, -50%) scale(1.08);
          background: rgba(0, 181, 214, 1);
        }
      `}</style>
    </>
  )
}
