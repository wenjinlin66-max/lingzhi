'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { EmptyState } from '@/components/common/EmptyState'
import { EmotionSummaryCard } from '@/components/emotion/EmotionSummaryCard'
import { api } from '@/lib/api'
import { getOrCreateSessionToken, loadSessionDraft, saveSessionDraft } from '@/lib/storage'
import { getEmotionLabel } from '@/lib/theme'
import type {
  EmotionAnalyzeResponse,
  MatchResponse,
  MatchRoomSuggestion,
  MatchStrategyGroup,
} from '@/lib/types'

const fallbackStrategyLabels = ['相似情绪', '互补情绪', '同频房间', '多人情绪聊天室']

export function AnalyzeResultFlow() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<EmotionAnalyzeResponse | null>(null)
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null)
  const [selectedStrategy, setSelectedStrategy] = useState('相似情绪')
  const [matching, setMatching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function runAnalysis() {
      const draft = loadSessionDraft()
      if (!draft?.text) {
        setLoading(false)
        return
      }

      if (draft.analysis) {
        setAnalysis(draft.analysis)
        setLoading(false)
        return
      }

      try {
        const sessionToken = getOrCreateSessionToken()
        const result = await api.analyzeEmotion(draft.text, sessionToken)
        saveSessionDraft({ ...draft, analysis: result })
        setAnalysis(result)
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : '分析失败')
      } finally {
        setLoading(false)
      }
    }

    void runAnalysis()
  }, [])

  useEffect(() => {
    async function runMatch() {
      if (!analysis) {
        return
      }

      const draft = loadSessionDraft()
      const savedMatch = draft?.match
      if (savedMatch) {
        setMatchResult(savedMatch)
        return
      }

      try {
        setMatching(true)
        const sessionToken = getOrCreateSessionToken()
        const result = await api.matchRoom(sessionToken, analysis)
        const nextDraft = draft ?? { text: '' }
        saveSessionDraft({ ...nextDraft, analysis, match: result })
        setMatchResult(result)
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : '匹配失败')
      } finally {
        setMatching(false)
      }
    }

    void runMatch()
  }, [analysis])

  const roomGroups = matchResult?.strategies ?? []
  const strategyLabels = roomGroups.length > 0 ? roomGroups.map((group) => group.strategy_label) : fallbackStrategyLabels

  useEffect(() => {
    if (!matchResult) {
      return
    }

    const defaultLabel =
      matchResult.strategies.find((group) => group.strategy_key === matchResult.recommended_strategy)?.strategy_label ??
      matchResult.strategies[0]?.strategy_label

    if (defaultLabel) {
      setSelectedStrategy(defaultLabel)
    }
  }, [matchResult])

  const activeRoomGroup = useMemo<MatchStrategyGroup | undefined>(() => {
    return roomGroups.find((group) => group.strategy_label === selectedStrategy) ?? roomGroups[0]
  }, [roomGroups, selectedStrategy])

  function handleJoinRoom(room: MatchRoomSuggestion) {
    const draft = loadSessionDraft()
    if (draft) {
      saveSessionDraft({ ...draft, selectedRoom: room })
    }
    router.push(`/room/${room.room_id}`)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-panel">正在理解你的情绪信号…</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-panel">正在理解你的情绪信号…</div>
      </div>
    )
  }

  // 🔴 修复 Bug：在这里插入错误优先判断，不要被 !analysis 直接拦截
  if (error) {
    return (
      <div className="stack-section">
        <EmptyState title="情绪分析失败" description={`无法完成分析，具体原因：${error}`} />
        <div className="hero__actions">
          <button className="button-secondary" onClick={() => router.push('/')}>
            返回重新输入
          </button>
        </div>
      </div>
    )
  }
  
  if (!analysis) {
    return <EmptyState title="还没有可分析的内容" description="请先回到首页输入一句你现在的状态。" />
  }

  return (
    <div className="stack-section">
      <EmotionSummaryCard analysis={analysis} />

      <section className="card">
        <div className="card__heading">
          <h2>为你筛出的同频房间</h2>
        </div>

        <div className="strategy-strip">
          <span className="strategy-strip__label">匹配策略</span>
          <div className="strategy-strip__chips">
            {strategyLabels.map((strategy) => (
              <button
                key={strategy}
                type="button"
                className={strategy === selectedStrategy ? 'strategy-chip strategy-chip--active' : 'strategy-chip'}
                onClick={() => setSelectedStrategy(strategy)}
              >
                {strategy}
              </button>
            ))}
          </div>
        </div>

        {matching ? (
          <div className="loading-screen loading-screen--inline">
            <div className="loading-panel">正在为你匹配最接近此刻心情的房间…</div>
          </div>
        ) : null}

        {!matching && activeRoomGroup ? (
          <div className="room-group-list">
            <section className="room-group">
              <div className="room-group__header">
                <h3>{activeRoomGroup.strategy_label}</h3>
                <p>{activeRoomGroup.description}</p>
              </div>
              <div className="room-suggestion-row">
                {activeRoomGroup.rooms.map((room) => (
                  <article key={`${activeRoomGroup.strategy_key}-${room.room_id}`} className="room-suggestion-card">
                    <span className="room-suggestion-card__badge">{activeRoomGroup.strategy_label}</span>
                    <h3>{room.room_title}</h3>
                    <p>你将以「{matchResult?.nickname ?? '匿名旅人'}」的身份加入这个房间，直接开始匿名对话。</p>
                    <div className="room-suggestion-card__meta">
                      <span>房间编号：{room.room_id}</span>
                      <span>房间情绪：{getEmotionLabel(room.vibe_key)}</span>
                      <span>当前人数：{room.participant_count}</span>
                      <span>状态：{room.connection_state === 'waiting' ? '等待中' : room.connection_state === 'connected' ? '已连接' : room.connection_state}</span>
                    </div>
                    <button onClick={() => handleJoinRoom(room)}>加入房间</button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {!matching && !activeRoomGroup ? (
          <EmptyState title="暂时还没有可加入的房间" description="可以返回重新输入一句更具体的心情，系统会重新筛选。" />
        ) : null}
      </section>

      {error ? <p className="error-message">{error}</p> : null}
      <div className="hero__actions">
        <button className="button-secondary" onClick={() => router.push('/')}>
          返回重新输入
        </button>
      </div>
    </div>
  )
}