'use client'

import { useState, useRef, useEffect } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import { eventsData, CosentusEvent } from '@/data/eventsData'

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

function EventCard({ event, index, isExpanded, onToggle }: {
  event: CosentusEvent
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
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
      {/* Timeline node */}
      <div className="timeline-node">
        <div className="timeline-dot" style={{ borderColor: tagColor }}>
          <div className="timeline-dot-inner" style={{ background: tagColor }} />
        </div>
        <div className="timeline-connector" />
      </div>

      {/* Card */}
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tagColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {event.location}
            </div>
          )}

          {/* Expand indicator */}
          <div className="card-expand-hint">
            <svg className={`expand-icon ${isExpanded ? 'rotated' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

export default function EventsContent() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

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
        }
      `}</style>

      {/* Stats */}
      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="container">
          <RevealOnScroll>
            <div className="events-stats">
              <div className="events-stat">
                <div className="events-stat-number">24</div>
                <div className="events-stat-label">Events & Counting</div>
              </div>
              <div className="events-stat">
                <div className="events-stat-number">6+</div>
                <div className="events-stat-label">Years Active</div>
              </div>
              <div className="events-stat">
                <div className="events-stat-number">12</div>
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

      {/* Timeline */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="timeline-river">
          {items.map((item, i) => {
            if (item.type === 'year') {
              return (
                <RevealOnScroll key={`year-${item.year}`}>
                  <YearMarker year={item.year!} />
                </RevealOnScroll>
              )
            }

            const eventIndex = item.eventIndex!
            return (
              <RevealOnScroll key={item.event!.slug} delay={Math.min((i % 3) * 0.08, 0.2)}>
                <EventCard
                  event={item.event!}
                  index={eventIndex}
                  isExpanded={expandedIndex === eventIndex}
                  onToggle={() => setExpandedIndex(expandedIndex === eventIndex ? null : eventIndex)}
                />
              </RevealOnScroll>
            )
          })}
        </div>
      </section>
    </>
  )
}
