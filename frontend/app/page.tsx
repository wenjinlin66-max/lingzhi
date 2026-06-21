import { AppShell } from '@/components/layout/AppShell'
import { MotionFloat } from '@/components/motion/MotionFloat'
import { MotionReveal } from '@/components/motion/MotionReveal'
import { HomeEmotionForm } from '@/features/analyze/HomeEmotionForm'

export default function HomePage() {
  return (
    <AppShell
      badge="VibeChat · AI 驱动的情绪社交"
      title="把情绪先说出来，再进入被理解的匿名对话。"
      description="说一句你现在的状态，系统理解你的情绪，把你送进同频房间，匿名聊 10 分钟。"
      backgroundVariant="home"
    >
      <section className="home-layout">
        <MotionFloat className="home-layout__main" delay={0.16}>
          <HomeEmotionForm />
        </MotionFloat>

        <div className="home-layout__side">
          <MotionReveal className="home-fused-panel" delay={0.08}>
            <span className="home-kicker">今晚的入口，不靠身份，靠情绪</span>
            <h2>像把一张心情便笺，悄悄投进会被接住的地方。</h2>
            <p className="home-fused-panel__intro">
              这里不强调身份展示，也不需要你先变得有趣。你只要把当下的状态说出来，系统就会先理解它，再把你带去更适合开口的匿名空间。
            </p>
            <div className="flow-list">
              <div className="flow-list__item">
                <strong>01</strong>
                <div>
                  <span>写下一句现在最真实的话</span>
                  <small>不用包装，不用完整，先让情绪出现。</small>
                </div>
              </div>
              <div className="flow-list__item">
                <strong>02</strong>
                <div>
                  <span>看见情绪被理解成一张心情卡</span>
                  <small>标签、强度和解释会一起返回。</small>
                </div>
              </div>
              <div className="flow-list__item">
                <strong>03</strong>
                <div>
                  <span>进入同频匿名房间</span>
                  <small>即使房间安静，它也会先为你留住位置。</small>
                </div>
              </div>
            </div>
            <div className="home-fused-panel__footer">
              <div className="home-mini-stat">
                <span>Emotion-first</span>
                <strong>情绪决定去向</strong>
              </div>
              <div className="home-mini-stat">
                <span>Anonymous</span>
                <strong>匿名但不失温度</strong>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>
    </AppShell>
  )
}
