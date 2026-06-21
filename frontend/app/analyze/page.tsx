import { AppShell } from '../../components/layout/AppShell' // 👈 听从 TypeScript 的话，加回花括号
import { AnalyzeResultFlow } from '../../features/analyze/AnalyzeResultFlow'

export default function AnalyzePage() {
  return (
    <AppShell
      badge="情绪识别结果"
      title="先被理解，再被送去同频空间。"
      description="你的情绪不会只停留在标签上，它会继续影响接下来要进入的房间。"
      backgroundVariant="analyze"
      hideHero
    >
      <AnalyzeResultFlow />
    </AppShell>
  )
}
