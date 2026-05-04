'use client'

import { useEffect, useRef, useState } from 'react'
import type { GalleryItem } from './galleries'

interface Props {
  items: GalleryItem[]
  /** Currently-active index (controlled by the parent). null = closed. */
  activeIndex: number | null
  onClose: () => void
  onNavigate: (newIndex: number) => void
}

/**
 * Full-screen lightbox for the gallery. Custom-built (no library) so we
 * control the UX: keyboard arrows + Esc, click outside to close, mobile
 * swipe, and inline <video> playback for video items.
 *
 * Mounted always so we can drive open/close from a parent useState.
 * Returns null when activeIndex is null.
 */
export default function GalleryLightbox({ items, activeIndex, onClose, onNavigate }: Props) {
  const isOpen = activeIndex !== null
  const item = isOpen ? items[activeIndex] : null
  const total = items.length

  const touchStartX = useRef<number | null>(null)
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null)

  // Keyboard navigation. Bound only while open so we don't capture global keys.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && activeIndex! > 0) {
        setDirection('prev')
        onNavigate(activeIndex! - 1)
      } else if (e.key === 'ArrowRight' && activeIndex! < total - 1) {
        setDirection('next')
        onNavigate(activeIndex! + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, activeIndex, total, onClose, onNavigate])

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  if (!isOpen || !item) return null

  const goPrev = () => {
    if (activeIndex! > 0) {
      setDirection('prev')
      onNavigate(activeIndex! - 1)
    }
  }
  const goNext = () => {
    if (activeIndex! < total - 1) {
      setDirection('next')
      onNavigate(activeIndex! + 1)
    }
  }

  // Touch handlers — minimal swipe support (mobile).
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 50) return // tap, not swipe
    if (dx > 0) goPrev()
    else goNext()
  }

  return (
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Gallery viewer"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button — top right */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="lightbox-close"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Counter — top left */}
      <div className="lightbox-counter">
        {activeIndex! + 1} / {total}
      </div>

      {/* Prev arrow — only when there's a previous item */}
      {activeIndex! > 0 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="lightbox-arrow lightbox-arrow-prev"
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Next arrow */}
      {activeIndex! < total - 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="lightbox-arrow lightbox-arrow-next"
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Media. Stop propagation on the inner div so clicking the image
          itself doesn't close the lightbox; only background clicks close. */}
      <div
        className="lightbox-media"
        onClick={(e) => e.stopPropagation()}
        key={`${activeIndex}-${direction}`}
      >
        {item.type === 'image' ? (
          <img
            src={item.src}
            alt=""
            className="lightbox-img"
            draggable={false}
          />
        ) : (
          <video
            src={item.src}
            poster={item.poster}
            controls
            autoPlay
            playsInline
            className="lightbox-video"
          />
        )}
      </div>

      <style jsx>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(8, 12, 20, 0.92);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: lightboxFadeIn 0.2s ease-out;
        }
        @keyframes lightboxFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-media {
          position: relative;
          max-width: min(1200px, calc(100vw - 120px));
          max-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lightboxMediaIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes lightboxMediaIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .lightbox-img,
        .lightbox-video {
          display: block;
          max-width: 100%;
          max-height: calc(100vh - 80px);
          width: auto;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          user-select: none;
        }
        .lightbox-video {
          background: #000;
        }

        .lightbox-close,
        .lightbox-arrow {
          position: absolute;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .lightbox-close:hover,
        .lightbox-arrow:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.25);
        }
        .lightbox-close:active,
        .lightbox-arrow:active {
          transform: scale(0.95);
        }

        .lightbox-close {
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
        }
        .lightbox-arrow {
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
        }
        .lightbox-arrow-prev { left: 20px; }
        .lightbox-arrow-next { right: 20px; }
        .lightbox-arrow:active {
          transform: translateY(-50%) scale(0.95);
        }

        .lightbox-counter {
          position: absolute;
          top: 24px;
          left: 24px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          font-family: var(--font-body);
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 999px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        @media (max-width: 640px) {
          .lightbox-overlay { padding: 12px; }
          .lightbox-media { max-width: 100vw; max-height: calc(100vh - 80px); }
          .lightbox-close { top: 12px; right: 12px; width: 36px; height: 36px; }
          .lightbox-arrow { width: 40px; height: 40px; }
          .lightbox-arrow-prev { left: 8px; }
          .lightbox-arrow-next { right: 8px; }
          .lightbox-counter { top: 16px; left: 16px; font-size: 12px; }
        }
      `}</style>
    </div>
  )
}
