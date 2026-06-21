import type { EmotionAnalyzeResponse } from './types'

type EmotionTheme = {
  gradient: string
  accent: string
  accentSoft: string
  chipBackground: string
  chipBorder: string
  shadow: string
}

type EmotionPalette = {
  start: string
  end: string
}

const emotionPaletteMap: Record<string, EmotionPalette> = {
  calm: { start: '#72d8c8', end: '#8db8ff' },
  happy: { start: '#ffd66b', end: '#ff9d76' },
  joy: { start: '#ffd86f', end: '#ff8f7d' },
  anxious: { start: '#6d86ff', end: '#66d4d0' },
  sad: { start: '#6078bf', end: '#8769e4' },
  sadness: { start: '#6078bf', end: '#8769e4' },
  angry: { start: '#ff8672', end: '#ffbd6f' },
  lonely: { start: '#8f78e5', end: '#73a5e1' },
  loneliness: { start: '#927ae5', end: '#76a6dd' },
  overwhelm: { start: '#6880ff', end: '#4bc3ce' },
  overwhelmed: { start: '#6880ff', end: '#4bc3ce' },
  stress: { start: '#6f87ff', end: '#62cbcd' },
  pressure: { start: '#6f87ff', end: '#5ebccc' },
  frustration: { start: '#ff8c7b', end: '#ffb678' },
  comfort: { start: '#84d7c7', end: '#8fbbff' },
  excitement: { start: '#ffcf64', end: '#ff8b86' },
  relaxation: { start: '#82dcca', end: '#8cbcff' },
  mixed: { start: '#79d2c5', end: '#8d83f3' },
}

export const emotionThemeMap: Record<string, EmotionTheme> = Object.fromEntries(
  Object.entries(emotionPaletteMap).map(([key, palette]) => {
    const accent = palette.start
    const accentSoft = palette.end
    return [
      key,
      {
        gradient: `linear-gradient(135deg, ${palette.start}, ${palette.end})`,
        accent,
        accentSoft,
        chipBackground: 'rgba(255, 255, 255, 0.14)',
        chipBorder: 'rgba(255, 255, 255, 0.22)',
        shadow: '0 24px 70px rgba(36, 24, 54, 0.28)',
      },
    ]
  }),
) as Record<string, EmotionTheme>

export const emotionLabelMap: Record<string, string> = {
  calm: '平静',
  happy: '轻快',
  joy: '开心',
  anxious: '焦虑',
  sad: '失落',
  sadness: '失落',
  angry: '愤懑',
  lonely: '孤单',
  relaxation: '放松',
  mixed: '复杂',
  overwhelm: '不堪重负',
  overwhelmed: '不堪重负',
  loneliness: '孤独',
  stress: '压力',
  frustration: '挫败',
  pressure: '压力',
  comfort: '安心',
  excitement: '兴奋',
}

export function getEmotionLabel(key?: string) {
  if (!key) {
    return '复杂'
  }

  const normalizedKey = key.trim().toLowerCase()
  return emotionLabelMap[normalizedKey] ?? key
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const safeHex = normalized.length === 3
    ? normalized
        .split('')
        .map((char) => `${char}${char}`)
        .join('')
    : normalized

  const red = Number.parseInt(safeHex.slice(0, 2), 16)
  const green = Number.parseInt(safeHex.slice(2, 4), 16)
  const blue = Number.parseInt(safeHex.slice(4, 6), 16)

  return { red, green, blue }
}

function mixHexColors(first: string, second: string, weight: number) {
  const ratio = clamp(weight, 0, 1)
  const left = hexToRgb(first)
  const right = hexToRgb(second)

  const mixChannel = (start: number, end: number) => Math.round(start + (end - start) * ratio)

  return `rgb(${mixChannel(left.red, right.red)}, ${mixChannel(left.green, right.green)}, ${mixChannel(left.blue, right.blue)})`
}

function rgbaFromHex(hex: string, alpha: number) {
  const { red, green, blue } = hexToRgb(hex)
  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 1)})`
}

function getPaletteByEmotionKey(key?: string): EmotionPalette {
  if (!key) {
    return emotionPaletteMap.mixed
  }

  const normalizedKey = key.trim().toLowerCase()
  return emotionPaletteMap[normalizedKey] ?? emotionPaletteMap.mixed
}

export function getEmotionThemeFromAnalysis(analysis: EmotionAnalyzeResponse): EmotionTheme {
  const primaryPalette = getPaletteByEmotionKey(analysis.primary_emotion)
  const secondaryPalette = getPaletteByEmotionKey(analysis.secondary_emotion)

  const intensityRatio = clamp(analysis.intensity / 5, 0.2, 1)
  const arousalRatio = clamp(analysis.arousal, 0, 1)
  const valenceRatio = clamp((analysis.valence + 1) / 2, 0, 1)

  const leadStart = mixHexColors(primaryPalette.start, secondaryPalette.start, 0.22 + arousalRatio * 0.28)
  const leadEnd = mixHexColors(primaryPalette.end, secondaryPalette.end, 0.3 + intensityRatio * 0.24)
  const moodLift = mixHexColors(leadStart, '#d9e7ff', valenceRatio * 0.08)
  const shadowBase = mixHexColors('#1f2745', '#2d3762', valenceRatio * 0.26)
  const moodMid = mixHexColors(leadEnd, shadowBase, 0.36 + intensityRatio * 0.1)
  const moodDepth = mixHexColors(leadEnd, '#161d34', 0.56 + (1 - valenceRatio) * 0.16)

  return {
    gradient: `linear-gradient(135deg, ${moodLift} 0%, ${leadStart} 22%, ${moodMid} 62%, ${moodDepth} 100%)`,
    accent: moodLift,
    accentSoft: moodMid,
    chipBackground: rgbaFromHex('#0f172c', 0.2 + intensityRatio * 0.08),
    chipBorder: rgbaFromHex(secondaryPalette.end, 0.32 + arousalRatio * 0.16),
    shadow: `0 26px 78px ${rgbaFromHex(primaryPalette.end, 0.16 + intensityRatio * 0.08)}`,
  }
}

export function getEmotionAnalysisNarrative(
  analysis: EmotionAnalyzeResponse,
  primaryEmotionLabel: string,
  secondaryEmotionLabel: string,
) {
  const summary = analysis.summary.trim().replace(/。+$/u, '')
  const intensityTone = analysis.intensity >= 4 ? '已经很明显' : analysis.intensity <= 2 ? '还比较克制' : '正在慢慢浮上来'
  const valenceTone = analysis.valence <= -0.35 ? '整体更偏向消耗和压抑' : analysis.valence >= 0.35 ? '整体仍保留着一点向上的亮度' : '情绪整体处在摇摆和过渡里'
  const arousalTone = analysis.arousal >= 0.7 ? '而且情绪张力比较高' : analysis.arousal <= 0.35 ? '情绪波动相对轻一些' : '情绪起伏还在持续'

  return `${summary}。此刻最突出的主线是「${primaryEmotionLabel}」，夹带着一些「${secondaryEmotionLabel}」的余味，${intensityTone}；${valenceTone}，${arousalTone}。`
}
