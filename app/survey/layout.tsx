import type { Metadata } from 'next'

// Utility survey instances — not content, must not be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  return children
}
