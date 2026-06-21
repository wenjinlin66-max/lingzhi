import type { ReactNode } from 'react'

import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { MotionReveal } from '@/components/motion/MotionReveal'

type AppShellProps = {
  badge?: string
  title: string
  description: string
  backgroundVariant?: 'home' | 'analyze' | 'match' | 'room'
  hideHero?: boolean
  fullBleed?: boolean
  topbarAction?: ReactNode
  children: ReactNode
}

export function AppShell({
  badge,
  title,
  description,
  backgroundVariant = 'home',
  hideHero = false,
  fullBleed = false,
  topbarAction,
  children,
}: AppShellProps) {
  return (
    <main className={`page-shell page-shell--${backgroundVariant}${fullBleed ? ' page-shell--full' : ''}`}>
      <AmbientBackground variant={backgroundVariant} />
      <MotionReveal className="topbar" y={16}>
        <div className="brand-mark">
          <span className="brand-mark__dot" />
          <div>
            <strong>VibeChat</strong>
            <small>匿名情绪社交</small>
          </div>
        </div>
        <div className="topbar__right">
          {topbarAction}
          <div className="topbar__signal">pink anonymous comfort room</div>
        </div>
      </MotionReveal>
      {hideHero ? null : (
        <section className="hero hero--compact hero-shell">
          <MotionReveal className="hero__text" delay={0.06} y={24}>
            {badge ? <span className="hero__badge">{badge}</span> : null}
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="hero-ribbon">
              <span>写下一句情绪</span>
              <span>AI 理解心境</span>
              <span>进入匿名同频房间</span>
            </div>
          </MotionReveal>
        </section>
      )}
      {children}
    </main>
  )
}
