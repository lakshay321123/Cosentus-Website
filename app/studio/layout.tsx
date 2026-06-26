import type { Metadata } from 'next'

// Sanity CMS admin — must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ height: '100vh' }}>{children}</div>
}
