import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prescient — AI SRE Agent',
  description: 'Knows before you ask. AI SRE agent that detects anomalies, generates insights, and remediates — before your on-call gets paged.',
  keywords: 'AI SRE, observability, anomaly detection, incident response, DevOps automation',
  openGraph: {
    title: 'Prescient — AI SRE Agent',
    description: 'Knows before you ask.',
    url: 'https://tryprescient.io',
    siteName: 'Prescient',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prescient — AI SRE Agent',
    description: 'Knows before you ask.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
