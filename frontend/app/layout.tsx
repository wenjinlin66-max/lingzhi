import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VibeChat',
  description: 'AI 驱动的情绪社交应用',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
