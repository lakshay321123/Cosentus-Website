import type { Metadata } from 'next'

// Utility form instances — not content, must not be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return children
}
