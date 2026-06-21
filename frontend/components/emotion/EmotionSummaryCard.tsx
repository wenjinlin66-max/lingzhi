import type { EmotionAnalyzeResponse } from '../../lib/types' // 👈 优化为安全的相对路径，防止别名报错
import { getEmotionAnalysisNarrative, getEmotionLabel, getEmotionThemeFromAnalysis } from '../../lib/theme'

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
        {/* 1. 为上方的标签文字设定高对比度深灰色，确保不被背景融掉 */}
        <span className="emotion-card__label" style={{ color: '#2d333e', fontWeight: 500 }}>
          {primaryEmotionLabel}
        </span>
        <span className="emotion-card__intensity" style={{ color: '#505a69' }}>
          强度 {analysis.intensity}/5
        </span>
      </div>

      {/* 2. 主标题：设定高清晰度的优雅黑灰色，确保在亮色卡片背景上无比醒目 */}
      <h3 style={{ color: '#161920', fontWeight: 600, fontSize: '1.25rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
        {analysis.summary}
      </h3>

      {/* 3. 描述内容正文：使用高对比度、阅读体验极佳的灰黑色 */}
      <p style={{ color: '#3c4350', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1rem' }}>
        {narrative}
      </p>

      {/* 4. 关键词标签列表：让标签里的字同样保持清晰深色 */}
      <ul className="chip-list">
        {analysis.keywords.map((keyword) => (
          <li key={keyword} style={{ color: '#2d333e', fontWeight: 500 }}>
            {keyword}
          </li>
        ))}
      </ul>

      {/* 5. 底部元数据信息：使用优雅的次级灰黑色进行排版，并追加一条淡淡的顶部分割线 */}
      <div 
        className="emotion-card__meta" 
        style={{ 
          color: '#505a69', 
          fontSize: '0.875rem', 
          borderTop: '1px solid rgba(0,0,0,0.06)', 
          paddingTop: '0.75rem',
          marginTop: '0.5rem' 
        }}
      >
        <span>次情绪：{secondaryEmotionLabel}</span>
        <span>唤醒度：{analysis.arousal.toFixed(1)}</span>
        <span>倾向：{analysis.valence.toFixed(1)}</span>
      </div>
    </article>
  )
}