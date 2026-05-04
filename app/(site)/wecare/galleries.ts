/**
 * WeCare gallery master data.
 *
 * Single source of truth for both the /wecare overview page and the
 * dynamic /wecare/[slug] gallery pages. The order here defines the order
 * of cards on the overview page (most recent events first).
 *
 * Photos and videos are locally hosted in /public/images/wecare/galleries/<slug>/.
 * Sourced from cosentus.com/we-care/<slug>/ via curl (full-resolution
 * versions, with WordPress thumbnail size-suffixes stripped).
 */

export type GalleryItem =
  | { type: 'image'; src: string }
  | { type: 'video'; src: string; poster?: string }

export interface GalleryEvent {
  slug: string
  title: string
  /** Cover image shown on the /wecare overview card. */
  cover: string
  /** Items shown inside the per-event gallery page, in display order. */
  items: GalleryItem[]
}

export const galleries: GalleryEvent[] = [
  {
    slug: 'harmony-house-india-2026',
    title: 'Harmony House – India, 2026',
    cover: '/images/wecare/harmony-house-india-2026.webp',
    items: [
      { type: 'video', src: '/images/wecare/galleries/harmony-house-india-2026/video.mp4', poster: '/images/wecare/galleries/harmony-house-india-2026/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2026/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2026/02.webp' },
    ],
  },
  {
    slug: 'orange-county-second-harvest-2025',
    title: 'Orange County Second Harvest Food Bank – USA, 2025',
    cover: '/images/wecare/orange-county-second-harvest-2025.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/orange-county-second-harvest-2025/01.jpeg' },
      { type: 'image', src: '/images/wecare/galleries/orange-county-second-harvest-2025/02.jpeg' },
      { type: 'image', src: '/images/wecare/galleries/orange-county-second-harvest-2025/03.jpeg' },
      { type: 'image', src: '/images/wecare/galleries/orange-county-second-harvest-2025/04.jpeg' },
      { type: 'image', src: '/images/wecare/galleries/orange-county-second-harvest-2025/05.jpeg' },
      { type: 'image', src: '/images/wecare/galleries/orange-county-second-harvest-2025/06.jpeg' },
      { type: 'image', src: '/images/wecare/galleries/orange-county-second-harvest-2025/07.jpeg' },
      { type: 'image', src: '/images/wecare/galleries/orange-county-second-harvest-2025/08.jpeg' },
      { type: 'image', src: '/images/wecare/galleries/orange-county-second-harvest-2025/09.jpeg' },
      { type: 'image', src: '/images/wecare/galleries/orange-county-second-harvest-2025/10.jpeg' },
    ],
  },
  {
    slug: 'harmony-house-india-2025',
    title: 'Harmony House – India, 2025',
    cover: '/images/wecare/harmony-house-india-2025.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2025/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2025/02.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2025/03.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2025/04.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2025/05.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2025/06.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2025/07.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2025/08.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2025/09.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2025/10.webp' },
    ],
  },
  {
    slug: 'in-concert-with-hope-2025',
    title: 'In Concert With Hope 2025: A Proud Moment for Cosentus',
    cover: '/images/wecare/in-concert-with-hope-2025.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-2025/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-2025/02.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-2025/03.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-2025/04.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-2025/05.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-2025/06.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-2025/07.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-2025/08.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-2025/09.webp' },
    ],
  },
  {
    slug: 'harmony-house-india-2024',
    title: 'Harmony House – India, 2024',
    cover: '/images/wecare/harmony-house-india-2024.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2024/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2024/02.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2024/03.webp' },
    ],
  },
  {
    slug: 'in-concert-with-hope-saratoga-2024',
    title: 'In Concert With Hope – Saratoga, 2024',
    cover: '/images/wecare/in-concert-with-hope-saratoga-2024.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-saratoga-2024/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-saratoga-2024/02.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-saratoga-2024/03.webp' },
      { type: 'image', src: '/images/wecare/galleries/in-concert-with-hope-saratoga-2024/04.webp' },
    ],
  },
  {
    slug: 'bill-wilson-center-2024',
    title: 'Bill Wilson Center – Building Dreams Celebration, 2024',
    cover: '/images/wecare/bill-wilson-center-2024.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/bill-wilson-center-2024/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/bill-wilson-center-2024/02.webp' },
      { type: 'image', src: '/images/wecare/galleries/bill-wilson-center-2024/03.webp' },
      { type: 'image', src: '/images/wecare/galleries/bill-wilson-center-2024/04.webp' },
    ],
  },
  {
    slug: 'pacific-clinics-2024',
    title: 'Pacific Clinics Hearts & Hands Spring Celebration, 2024',
    cover: '/images/wecare/pacific-clinics-2024.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/pacific-clinics-2024/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/pacific-clinics-2024/02.webp' },
    ],
  },
  {
    slug: 'harmony-house-india-2023',
    title: 'Harmony House – India, 2023',
    cover: '/images/wecare/harmony-house-india-2023.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2023/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2023/02.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2023/03.webp' },
      { type: 'image', src: '/images/wecare/galleries/harmony-house-india-2023/04.webp' },
    ],
  },
  {
    slug: 'someone-cares-food-bank-2023',
    title: 'Someone Cares Food Bank – USA, 2023',
    cover: '/images/wecare/someone-cares-food-bank-2023.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/someone-cares-food-bank-2023/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/someone-cares-food-bank-2023/02.webp' },
      { type: 'image', src: '/images/wecare/galleries/someone-cares-food-bank-2023/03.webp' },
      { type: 'image', src: '/images/wecare/galleries/someone-cares-food-bank-2023/04.webp' },
      { type: 'image', src: '/images/wecare/galleries/someone-cares-food-bank-2023/05.webp' },
    ],
  },
  {
    slug: 'kids-against-hunger-2023',
    title: 'Kids Against Hunger – USA, 2023',
    cover: '/images/wecare/kids-against-hunger-2023.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/kids-against-hunger-2023/01.webp' },
    ],
  },
  {
    slug: 'beyond-blindness-2023',
    title: 'Beyond Blindness – USA, 2023',
    cover: '/images/wecare/beyond-blindness-2023.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/beyond-blindness-2023/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/beyond-blindness-2023/02.webp' },
    ],
  },
  {
    slug: 'uday-foundation-2023',
    title: 'Uday Foundation – India, 2023',
    cover: '/images/wecare/uday-foundation-2023.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/uday-foundation-2023/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/uday-foundation-2023/02.webp' },
      { type: 'image', src: '/images/wecare/galleries/uday-foundation-2023/03.webp' },
      { type: 'image', src: '/images/wecare/galleries/uday-foundation-2023/04.webp' },
      { type: 'image', src: '/images/wecare/galleries/uday-foundation-2023/05.webp' },
    ],
  },
  {
    slug: 'plantation-drive-india-2023',
    title: 'Plantation Drive – India, 2023',
    cover: '/images/wecare/plantation-drive-india-2023.webp',
    items: [
      { type: 'image', src: '/images/wecare/galleries/plantation-drive-india-2023/01.webp' },
      { type: 'image', src: '/images/wecare/galleries/plantation-drive-india-2023/02.webp' },
      { type: 'image', src: '/images/wecare/galleries/plantation-drive-india-2023/03.webp' },
    ],
  },
]

export function getGalleryBySlug(slug: string): GalleryEvent | undefined {
  return galleries.find((g) => g.slug === slug)
}
