'use client'

import React, { useState, useRef, useEffect } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import { eventsData, CosentusEvent } from '@/data/eventsData'

// Gallery photos — replace gradients with real photos when provided
// Just add { src: '/images/events/gallery/photo1.jpg', alt: 'Event photo' }
const placeholderGradients = [
  'linear-gradient(135deg, #00B5D6 0%, #005F73 100%)',
  'linear-gradient(135deg, #36C2DE 0%, #0090AB 100%)',
  'linear-gradient(135deg, #005F73 0%, #00B5D6 100%)',
  'linear-gradient(135deg, #0090AB 0%, #68D1E6 100%)',
  'linear-gradient(135deg, #2A9D8F 0%, #00B5D6 100%)',
  'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)',
  'linear-gradient(135deg, #005F73 0%, #2A9D8F 100%)',
  'linear-gradient(135deg, #68D1E6 0%, #005F73 100%)',
  'linear-gradient(135deg, #0090AB 0%, #00B5D6 100%)',
  'linear-gradient(135deg, #36C2DE 0%, #005F73 100%)',
  'linear-gradient(135deg, #00B5D6 0%, #2A9D8F 100%)',
  'linear-gradient(135deg, #005F73 0%, #68D1E6 100%)',
  'linear-gradient(135deg, #2A9D8F 0%, #0090AB 100%)',
  'linear-gradient(135deg, #00B5D6 0%, #005F73 100%)',
  'linear-gradient(135deg, #68D1E6 0%, #36C2DE 100%)',
  'linear-gradient(135deg, #0090AB 0%, #2A9D8F 100%)',
  'linear-gradient(135deg, #005F73 0%, #00B5D6 100%)',
  'linear-gradient(135deg, #36C2DE 0%, #68D1E6 100%)',
  'linear-gradient(135deg, #00B5D6 0%, #0090AB 100%)',
  'linear-gradient(135deg, #2A9D8F 0%, #005F73 100%)',
]

const tagColors: Record<string, string> = {
  Conference: '#00B5D6',
  Summit: '#36C2DE',
  Company: '#005F73',
  Webinar: '#68D1E6',
  Sponsorship: '#0090AB',
  'Golf Event': '#2A9D8F',
}

function getTagColor(tag: string) {
  return tagColors[tag] || '#00B5D6'
}

function getYearFromSort(sortDate: string) {
  return sortDate.split('-')[0]
}

interface EventCardProps {
  event: CosentusEvent
  index: number
  isExpanded: boolean
  onToggle: () => void
}

function EventCard({ event, index, isExpanded, onToggle }: EventCardProps) {
  const isLeft = index % 2 === 0
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [isExpanded])

  const tagColor = getTagColor(event.tag)

  return (
    <div className={`timeline-item ${isLeft ? 'timeline-left' : 'timeline-right'}`}>
      {/* Card first in DOM so CSS ~ selector reaches node */}
      <div
        className={`timeline-card ${isExpanded ? 'expanded' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
        aria-expanded={isExpanded}
      >
        {/* Gradient accent strip */}
        <div className="card-accent" style={{ background: `linear-gradient(135deg, ${tagColor}, ${tagColor}88)` }} />

        <div className="card-body">
          {/* Header row */}
          <div className="card-header">
            <span className="card-tag" style={{ background: `${tagColor}18`, color: tagColor }}>{event.tag}</span>
            <span className="card-date">{event.date}</span>
          </div>

          {/* Title */}
          <h3 className="card-title">{event.title}</h3>

          {/* Location */}
          {event.location && (
            <div className="card-location">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tagColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {event.location}
            </div>
          )}

          {/* Expand indicator */}
          <div className="card-expand-hint">
            <svg aria-hidden="true" className={`expand-icon ${isExpanded ? 'rotated' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Expandable content */}
          <div className="card-expand" style={{ maxHeight: isExpanded ? contentHeight + 40 : 0 }}>
            <div ref={contentRef} className="card-expand-inner">
              <p className="card-description">{event.description}</p>
              {event.learnMoreUrl && (
                <a
                  href={event.learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-link"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: tagColor }}
                >
                  Learn More
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              )}
              {/* Photo gallery placeholder — ready for when images are provided */}
              {event.photos.length > 0 && (
                <div className="card-photos">
                  {event.photos.map((photo, i) => (
                    <div key={i} className="card-photo">
                      <img src={`/images/events/${event.slug}/${photo}`} alt={`${event.title} photo ${i + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline node after card for CSS ~ selector */}
      <div className="timeline-node">
        <div className="timeline-dot" style={{ borderColor: tagColor }}>
          <div className="timeline-dot-inner" style={{ background: tagColor }} />
        </div>
        <div className="timeline-connector" />
      </div>
    </div>
  )
}

function YearMarker({ year }: { year: string }) {
  return (
    <div className="year-marker">
      <div className="year-marker-line" />
      <div className="year-marker-badge">{year}</div>
      <div className="year-marker-line" />
    </div>
  )
}

export default function EventsContent({ galleryPhotos = [] }: { galleryPhotos?: string[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  // Build film frames: real photos first, pad with gradients if needed (min 20 frames)
  const minFrames = 20
  const filmFrames: { src?: string; gradient?: string }[] = galleryPhotos.map(src => ({ src }))
  while (filmFrames.length < minFrames) {
    filmFrames.push({ gradient: placeholderGradients[filmFrames.length % placeholderGradients.length] })
  }

  // Group events by year for year markers
  const sortedEvents = [...eventsData].sort((a, b) => b.sortDate.localeCompare(a.sortDate))

  // Build items with year separators
  const items: { type: 'year' | 'event'; year?: string; event?: CosentusEvent; eventIndex?: number }[] = []
  let lastYear = ''

  sortedEvents.forEach((event, i) => {
    const year = getYearFromSort(event.sortDate)
    if (year !== lastYear) {
      items.push({ type: 'year', year })
      lastYear = year
    }
    items.push({ type: 'event', event, eventIndex: i })
  })

  return (
    <>
      {/* Timeline CSS */}
      <style>{`
        .timeline-river {
          position: relative;
          padding: 0 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* The vertical line */
        .timeline-river::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, var(--primary) 0%, #A1DEED 50%, var(--primary) 100%);
          transform: translateX(-50%);
          opacity: 0.3;
        }

        .timeline-item {
          display: grid;
          grid-template-columns: 1fr 60px 1fr;
          align-items: start;
          margin-bottom: 24px;
          position: relative;
        }

        .timeline-left .timeline-card { grid-column: 1; grid-row: 1; }
        .timeline-left .timeline-node { grid-column: 2; grid-row: 1; }

        .timeline-right .timeline-card { grid-column: 3; grid-row: 1; }
        .timeline-right .timeline-node { grid-column: 2; grid-row: 1; }

        .timeline-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-self: center;
          position: relative;
          z-index: 2;
        }

        .timeline-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid var(--primary);
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
          margin-top: 28px;
        }

        .timeline-dot-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .timeline-card:hover ~ .timeline-node .timeline-dot,
        .timeline-card.expanded ~ .timeline-node .timeline-dot {
          transform: scale(1.3);
          box-shadow: 0 0 12px rgba(0, 181, 214, 0.4);
        }

        .timeline-connector {
          width: 2px;
          flex: 1;
          min-height: 20px;
        }

        .timeline-card {
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          position: relative;
        }

        .timeline-card:hover {
          border-color: var(--primary);
          box-shadow: 0 8px 30px rgba(0, 181, 214, 0.1);
          transform: translateY(-2px);
        }

        .timeline-card.expanded {
          border-color: var(--primary);
          box-shadow: 0 12px 40px rgba(0, 181, 214, 0.15);
        }

        .card-accent {
          height: 4px;
          width: 100%;
        }

        .card-body {
          padding: 24px;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 8px;
          flex-wrap: wrap;
        }

        .card-tag {
          padding: 3px 10px;
          border-radius: var(--radius-sm);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .card-date {
          font-size: 13px;
          color: var(--gray-500);
          font-weight: 400;
        }

        .card-title {
          font-size: 18px;
          font-weight: 500;
          color: var(--gray-900);
          line-height: 1.35;
          margin-bottom: 8px;
          font-family: var(--font-display);
        }

        .card-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--gray-500);
          margin-bottom: 4px;
        }

        .card-expand-hint {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }

        .expand-icon {
          color: var(--gray-400);
          transition: all 0.3s ease;
        }

        .expand-icon.rotated {
          transform: rotate(180deg);
          color: var(--primary);
        }

        .card-expand {
          overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-expand-inner {
          padding-top: 16px;
          border-top: 1px solid var(--gray-100);
          margin-top: 8px;
        }

        .card-description {
          font-size: 15px;
          line-height: 1.75;
          color: var(--gray-600);
          white-space: pre-line;
        }

        .card-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 500;
          margin-top: 16px;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .card-link:hover { opacity: 0.7; }

        .card-photos {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 8px;
          margin-top: 20px;
        }

        .card-photo {
          border-radius: var(--radius-sm);
          overflow: hidden;
          aspect-ratio: 4/3;
        }

        .card-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Year markers */
        .year-marker {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px 0 16px;
          position: relative;
          z-index: 2;
        }

        .year-marker-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gray-200), transparent);
        }

        .year-marker-badge {
          background: var(--primary);
          color: white;
          font-size: 14px;
          font-weight: 600;
          padding: 6px 24px;
          border-radius: var(--radius-full);
          letter-spacing: 0.05em;
          font-family: var(--font-display);
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0, 181, 214, 0.25);
        }

        /* Stats row */
        .events-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          padding: 40px 0;
          flex-wrap: wrap;
        }

        .events-stat {
          text-align: center;
        }

        .events-stat-number {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 300;
          color: var(--primary);
          line-height: 1;
          font-family: var(--font-display);
        }

        .events-stat-label {
          font-size: 13px;
          color: var(--gray-500);
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Film Reel */
        .film-reel-sticky {
          position: sticky;
          top: 64px;
          z-index: 10;
          background: white;
          overflow: hidden;
          border-top: 1px solid var(--gray-200);
          border-bottom: 1px solid var(--gray-200);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }

        .film-strip {
          position: relative;
          height: 110px;
          overflow: hidden;
        }

        .film-strip + .film-strip {
          border-top: 1px solid var(--gray-200);
        }

        /* Sprocket holes */
        .film-strip::before,
        .film-strip::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 12px;
          z-index: 3;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 14px,
            rgba(0,181,214,0.08) 14px,
            rgba(0,181,214,0.08) 22px,
            transparent 22px,
            transparent 50px
          );
          pointer-events: none;
        }

        .film-strip::before { top: 0; }
        .film-strip::after { bottom: 0; }

        /* Sprocket punch holes */
        .film-sprockets {
          position: absolute;
          left: 0;
          right: 0;
          height: 12px;
          z-index: 4;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 18px,
            white 18px,
            white 26px,
            transparent 26px,
            transparent 50px
          );
          pointer-events: none;
        }

        .film-sprockets.top { top: 0; }
        .film-sprockets.bottom { bottom: 0; }

        .film-track {
          display: flex;
          gap: 6px;
          padding: 16px 0;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          width: max-content;
        }

        .film-track-left {
          animation: scrollLeft 60s linear infinite;
        }

        .film-track-right {
          animation: scrollRight 60s linear infinite;
        }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .film-frame {
          width: 130px;
          height: 78px;
          border-radius: 3px;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
        }

        .film-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s ease;
        }

        .film-frame:hover img {
          transform: scale(1.05);
          cursor: pointer;
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          animation: fadeIn 0.25s ease;
          backdrop-filter: blur(8px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-img {
          max-width: 90vw;
          max-height: 85vh;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
        }

        @keyframes scaleIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .lightbox-close {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .lightbox-close:hover {
          background: rgba(255,255,255,0.2);
        }

        /* Gradient placeholder for frames without images */
        .film-frame-placeholder {
          width: 100%;
          height: 100%;
          opacity: 0.5;
        }

        /* Edge fade on the reel */
        .film-reel-sticky::before,
        .film-reel-sticky::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          z-index: 5;
          pointer-events: none;
        }

        .film-reel-sticky::before {
          left: 0;
          background: linear-gradient(90deg, white, transparent);
        }

        .film-reel-sticky::after {
          right: 0;
          background: linear-gradient(270deg, white, transparent);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .timeline-river::before {
            left: 20px;
          }

          .timeline-item {
            grid-template-columns: 40px 1fr;
          }

          .timeline-left .timeline-card,
          .timeline-right .timeline-card {
            grid-column: 2;
          }

          .timeline-left .timeline-node,
          .timeline-right .timeline-node {
            grid-column: 1;
          }

          .timeline-dot {
            margin-top: 24px;
          }

          .card-body {
            padding: 18px;
          }

          .card-title {
            font-size: 16px;
          }

          .events-stats {
            gap: 24px;
          }

          .film-strip {
            height: 90px;
          }

          .film-frame {
            width: 100px;
            height: 60px;
          }

          .film-track-left {
            animation-duration: 40s;
          }

          .film-track-right {
            animation-duration: 40s;
          }
        }
      `}</style>

      {/* Stats */}
      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="container">
          <RevealOnScroll>
            <div className="events-stats">
              <div className="events-stat">
                <div className="events-stat-number">{eventsData.length}</div>
                <div className="events-stat-label">Events & Counting</div>
              </div>
              <div className="events-stat">
                <div className="events-stat-number">{new Set(eventsData.map(e => e.sortDate.slice(0, 4))).size}</div>
                <div className="events-stat-label">Years Active</div>
              </div>
              <div className="events-stat">
                <div className="events-stat-number">{eventsData.filter(e => e.tag === 'Conference').length}</div>
                <div className="events-stat-label">Conferences</div>
              </div>
              <div className="events-stat">
                <div className="events-stat-number">5</div>
                <div className="events-stat-label">Countries</div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)} aria-label="Close">✕</button>
          <img
            className="lightbox-img"
            src={lightboxSrc}
            alt="Event photo"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Sticky Film Reel */}
      <div className="film-reel-sticky">
        {/* Strip 1 — scrolls left */}
        <div className="film-strip">
          <div className="film-sprockets top" />
          <div className="film-track film-track-left">
            {/* Duplicate the set for seamless loop */}
            {[...Array(2)].map((_, setIdx) => (
              <React.Fragment key={setIdx}>
                {filmFrames.map((frame, i) => (
                  <div className="film-frame" key={`l-${setIdx}-${i}`} onClick={() => frame.src && setLightboxSrc(frame.src)}>
                    {frame.src ? (
                      <img src={frame.src} alt="Cosentus event" loading="lazy" />
                    ) : (
                      <div className="film-frame-placeholder" style={{ background: frame.gradient }} />
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="film-sprockets bottom" />
        </div>

        {/* Strip 2 — scrolls right */}
        <div className="film-strip">
          <div className="film-sprockets top" />
          <div className="film-track film-track-right">
            {[...Array(2)].map((_, setIdx) => (
              <React.Fragment key={setIdx}>
                {[...filmFrames].reverse().map((frame, i) => (
                  <div className="film-frame" key={`r-${setIdx}-${i}`} onClick={() => frame.src && setLightboxSrc(frame.src)}>
                    {frame.src ? (
                      <img src={frame.src} alt="Cosentus event" loading="lazy" />
                    ) : (
                      <div className="film-frame-placeholder" style={{ background: frame.gradient }} />
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="film-sprockets bottom" />
        </div>
      </div>

      {/* Timeline */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="timeline-river">
          {items.map((item, i) => {
            if (item.type === 'year' && item.year) {
              return (
                <RevealOnScroll key={`year-${item.year}`}>
                  <YearMarker year={item.year} />
                </RevealOnScroll>
              )
            }

            if (item.type === 'event' && item.event && item.eventIndex !== undefined) {
              const idx = item.eventIndex
              return (
                <RevealOnScroll key={item.event.slug} delay={Math.min((i % 3) * 0.08, 0.2)}>
                  <EventCard
                    event={item.event}
                    index={idx}
                    isExpanded={expandedIndex === idx}
                    onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  />
                </RevealOnScroll>
              )
            }

            return null
          })}
        </div>
      </section>
    </>
  )
}
