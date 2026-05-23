'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { eventsData } from '@/data/eventsData'

const tagColors: Record<string, string> = {
  Conference: '#00B5D6', Summit: '#36C2DE', Company: '#005F73',
  Webinar: '#68D1E6', Sponsorship: '#0090AB', 'Golf Event': '#2A9D8F',
}

function ImageCarousel({ images, onZoom }: { images: string[]; onZoom: (src: string) => void }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (images.length > 1) timerRef.current = setInterval(() => setCurrent(p => (p + 1) % images.length), 4000)
  }, [images.length])
  useEffect(() => { startAuto(); return () => { if (timerRef.current) clearInterval(timerRef.current) } }, [startAuto])
  const go = (dir: number) => { setCurrent(p => (p + dir + images.length) % images.length); startAuto() }

  return (
    <div className="evt-carousel">
      <div className="evt-carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((src, i) => (
          <img key={i} src={src} alt={`Event photo ${i + 1}`} className="evt-carousel-img" loading="lazy" onClick={() => onZoom(src)} />
        ))}
      </div>
      {images.length > 1 && (<>
        <button className="evt-arrow evt-arrow-left" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Previous"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button className="evt-arrow evt-arrow-right" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Next"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
        <div className="evt-dots">{images.map((_, i) => (<button key={i} className={`evt-dot${i === current ? ' active' : ''}`} onClick={(e) => { e.stopPropagation(); setCurrent(i); startAuto() }} aria-label={`Photo ${i + 1}`} />))}</div>
      </>)}
    </div>
  )
}

export default function EventsContent() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { const slug = entry.target.getAttribute('data-slug'); if (slug) setExpandedSlug(slug) } })
    }, { threshold: 0.4, rootMargin: '-10% 0px -30% 0px' })
    Object.values(rowRefs.current).forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!lightboxSrc) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxSrc(null) }
    document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h)
  }, [lightboxSrc])

  const sortedEvents = [...eventsData].sort((a, b) => b.sortDate.localeCompare(a.sortDate))
  const items: { type: 'year' | 'event'; year?: string; event?: typeof sortedEvents[0]; idx?: number }[] = []
  let lastYear = '', eventIdx = 0
  sortedEvents.forEach(event => {
    const year = event.sortDate.split('-')[0]
    if (year !== lastYear) { items.push({ type: 'year', year }); lastYear = year }
    items.push({ type: 'event', event, idx: eventIdx++ })
  })

  return (<>
    <style>{`
      .evt-timeline{max-width:1100px;margin:0 auto;padding:0 24px}
      .evt-year{display:flex;align-items:center;gap:16px;padding:48px 0 24px;font-size:28px;font-weight:200;color:var(--primary);font-family:var(--font-display);letter-spacing:-0.02em}
      .evt-year::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,var(--primary),transparent)}
      .evt-row{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-bottom:2px;border-radius:12px;overflow:hidden;border:1px solid var(--gray-200);transition:box-shadow 0.4s,border-color 0.4s;cursor:pointer;min-height:420px}
      .evt-row.active{border-color:var(--primary);box-shadow:0 8px 40px rgba(0,181,214,0.1);min-height:520px}
      .evt-text{padding:clamp(28px,4vw,48px);display:flex;flex-direction:column;justify-content:center;background:white}
      .evt-tag{display:inline-block;font-size:var(--text-xxs);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:4px 12px;border-radius:4px;margin-bottom:12px;width:fit-content}
      .evt-title{font-size:clamp(18px,2vw,24px);font-weight:600;color:var(--gray-900);line-height:1.3;margin-bottom:8px}
      .evt-date{font-size:var(--text-xs);color:var(--gray-500);margin-bottom:4px}
      .evt-location{font-size:var(--text-xs);color:var(--gray-500);display:flex;align-items:center;gap:6px;margin-bottom:16px}
      .evt-desc{max-height:0;overflow:hidden;transition:max-height 0.6s cubic-bezier(0.16,1,0.3,1),opacity 0.4s;opacity:0}
      .evt-row.active .evt-desc{max-height:300px;opacity:1}
      .evt-desc-inner{font-size:var(--text-base);line-height:1.7;color:var(--gray-600);padding-top:8px}
      .evt-link{display:inline-flex;align-items:center;gap:6px;font-size:var(--text-xs);font-weight:500;margin-top:12px;text-decoration:none;transition:gap 0.3s}
      .evt-link:hover{gap:10px}
      .evt-img-panel{background:var(--gray-50);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
      .evt-img-panel.empty{background:linear-gradient(135deg,#f0f9fb,#e8f4f8)}
      .evt-no-img{display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--gray-300)}
      .evt-carousel{width:100%;height:100%;position:relative;overflow:hidden}
      .evt-carousel-track{display:flex;height:100%;transition:transform 0.5s cubic-bezier(0.16,1,0.3,1)}
      .evt-carousel-img{min-width:100%;height:100%;object-fit:cover;cursor:zoom-in}
      .evt-arrow{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.9);border:1px solid rgba(0,0,0,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2;transition:all 0.2s;color:var(--gray-700);box-shadow:0 2px 8px rgba(0,0,0,0.1)}
      .evt-arrow:hover{background:white;box-shadow:0 4px 16px rgba(0,0,0,0.15)}
      .evt-arrow-left{left:12px}.evt-arrow-right{right:12px}
      .evt-dots{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px}
      .evt-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.8);cursor:pointer;padding:0;transition:all 0.3s}
      .evt-dot.active{background:white;transform:scale(1.3)}
      .evt-lightbox{position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:10000;display:flex;align-items:center;justify-content:center;cursor:pointer;animation:evtFadeIn 0.3s}
      .evt-lightbox img{max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px;cursor:default;animation:evtScaleIn 0.3s}
      .evt-lightbox-close{position:absolute;top:24px;right:24px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;font-size:var(--text-2xl);display:flex;align-items:center;justify-content:center;cursor:pointer}
      @keyframes evtFadeIn{from{opacity:0}to{opacity:1}}
      @keyframes evtScaleIn{from{transform:scale(0.9);opacity:0}to{transform:scale(1);opacity:1}}
      .evt-stats{display:flex;justify-content:center;gap:48px;padding:40px 24px;flex-wrap:wrap}
      .evt-stat-num{font-family:var(--font-display);font-size:clamp(32px,5vw,48px);font-weight:400;color:var(--primary);line-height:1;letter-spacing:-0.02em}
      .evt-stat-label{font-family:var(--font-display);font-size:var(--text-xxs);color:var(--gray-500);margin-top:8px;text-transform:uppercase;letter-spacing:0.1em;font-weight:400}
      @media(max-width:768px){
        .evt-row{grid-template-columns:1fr;min-height:auto}
        .evt-row.active{min-height:auto}
        .evt-row .evt-img-panel{min-height:240px}
        .evt-row .evt-img-panel.order-first{order:-1}
        .evt-stats{gap:24px}
      }
    `}</style>

    {lightboxSrc && (
      <div className="evt-lightbox" onClick={() => setLightboxSrc(null)}>
        <button className="evt-lightbox-close" onClick={() => setLightboxSrc(null)} aria-label="Close">✕</button>
        <img src={lightboxSrc} alt="Event photo" onClick={e => e.stopPropagation()} />
      </div>
    )}

    <section style={{ background: 'white' }}>
      <div className="container">
        <div className="evt-stats">
          <div style={{ textAlign: 'center' }}><div className="evt-stat-num">{eventsData.length}</div><div className="evt-stat-label">Events & Counting</div></div>
          <div style={{ textAlign: 'center' }}><div className="evt-stat-num">{(() => { const y = eventsData.map(e => parseInt(e.sortDate.slice(0, 4))); return Math.max(...y) - Math.min(...y) + 1 })()}+</div><div className="evt-stat-label">Years Active</div></div>
          <div style={{ textAlign: 'center' }}><div className="evt-stat-num">{eventsData.filter(e => e.tag === 'Conference').length}</div><div className="evt-stat-label">Conferences</div></div>
          <div style={{ textAlign: 'center' }}><div className="evt-stat-num">5</div><div className="evt-stat-label">Countries</div></div>
        </div>
      </div>
    </section>

    <section className="section" style={{ paddingTop: 0 }}>
      <div className="evt-timeline">
        {items.map((item) => {
          if (item.type === 'year') return <div key={`y-${item.year}`} className="evt-year">{item.year}</div>
          const event = item.event!
          const idx = item.idx!
          const isReversed = idx % 2 === 1
          const images = event.photos || []
          const hasImages = images.length > 0
          const isActive = expandedSlug === event.slug
          const tagColor = tagColors[event.tag] || '#00B5D6'

          const textPanel = (
            <div className="evt-text">
              <span className="evt-tag" style={{ background: `${tagColor}15`, color: tagColor }}>{event.tag}</span>
              <div className="evt-date">{event.date}</div>
              <h3 className="evt-title">{event.title}</h3>
              {event.location && <div className="evt-location"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tagColor} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{event.location}</div>}
              <div className="evt-desc"><div className="evt-desc-inner">{event.description}{event.learnMoreUrl && <a href={event.learnMoreUrl} target="_blank" rel="noopener noreferrer" className="evt-link" style={{ color: tagColor }} onClick={e => e.stopPropagation()}>Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></a>}</div></div>
            </div>
          )

          const imagePanel = (
            <div className={`evt-img-panel ${!hasImages ? 'empty' : ''} ${isReversed ? 'order-first' : ''}`}>
              {hasImages ? <ImageCarousel images={images} onZoom={setLightboxSrc} /> : <div className="evt-no-img"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>}
            </div>
          )

          return (
            <div key={event.slug} ref={el => { rowRefs.current[event.slug] = el }} data-slug={event.slug}
              className={`evt-row ${isActive ? 'active' : ''}`}
              onClick={() => setExpandedSlug(isActive ? null : event.slug)}
              role="button" tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedSlug(isActive ? null : event.slug) } }}
            >
              {isReversed ? <>{imagePanel}{textPanel}</> : <>{textPanel}{imagePanel}</>}
            </div>
          )
        })}
      </div>
    </section>
  </>)
}
