import type { EmotionAnalyzeResponse } from '@/lib/types'
import { getEmotionAnalysisNarrative, getEmotionLabel, getEmotionThemeFromAnalysis } from '@/lib/theme'

type EmotionSummaryCardProps = {
  analysis: EmotionAnalyzeResponse
}

export function EmotionSummaryCard({ analysis }: EmotionSummaryCardProps) {
  const theme = getEmotionThemeFromAnalysis(analysis)
  const primaryEmotionLabel = getEmotionLabel(analysis.primary_emotion)
  const secondaryEmotionLabel = getEmotionLabel(analysis.secondary_emotion)
  const narrative = getEmotionAnalysisNarrative(analysis, primaryEmotionLabel, secondaryEmotionLabel)

  return (
    <article
      className="emotion-card"
      style={{
        ['--emotion-gradient' as string]: theme.gradient,
        ['--emotion-accent' as string]: theme.accent,
        ['--emotion-accent-soft' as string]: theme.accentSoft,
        ['--emotion-chip-bg' as string]: theme.chipBackground,
        ['--emotion-chip-border' as string]: theme.chipBorder,
        ['--emotion-shadow' as string]: theme.shadow,
      }}
    >
      <div className="emotion-card__header">
        <span className="emotion-card__label">{primaryEmotionLabel}</span>
        <span className="emotion-card__intensity">强度 {analysis.intensity}/5</span>
      </div>
      <h3>{analysis.summary}</h3>
      <p>{narrative}</p>
      <ul className="chip-list">
        {analysis.keywords.map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>
      <div className="emotion-card__meta">
        <span>次情绪：{secondaryEmotionLabel}</span>
        <span>唤醒度：{analysis.arousal.toFixed(1)}</span>
        <span>倾向：{analysis.valence.toFixed(1)}</span>
      </div>
    </article>
  )
}
