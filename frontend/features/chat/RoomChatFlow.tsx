'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { EmptyState } from '@/components/common/EmptyState'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusCard } from '@/components/common/StatusCard'
import { api } from '@/lib/api'
import { getOrCreateSessionToken, loadSessionDraft } from '@/lib/storage'
import { emotionThemeMap, getEmotionLabel } from '@/lib/theme'
import type { MatchResponse, MessageRead, RoomStateResponse } from '@/lib/types'
import { buildRoomSocketUrl } from '@/lib/ws'

type RoomChatFlowProps = {
  roomId: string
}

type SocketEvent = {
  type: string
  payload: MessageRead | {
    text?: string
  }
}

function sortMessagesByTime(items: MessageRead[]) {
  return [...items].sort((left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime())
}

function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RoomChatFlow({ roomId }: RoomChatFlowProps) {
  const draft = loadSessionDraft()
  const match = draft?.match as MatchResponse | undefined
  const selectedRoom = draft?.selectedRoom
  const nickname = match?.nickname ?? '匿名旅人'
  const sessionToken = getOrCreateSessionToken()

  const [roomState, setRoomState] = useState<RoomStateResponse | null>(null)
  const [messages, setMessages] = useState<MessageRead[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [connectionState, setConnectionState] = useState('连接中')
  const [error, setError] = useState('')
  const socketRef = useRef<WebSocket | null>(null)

  const vibeTheme = useMemo(() => {
    const key = roomState?.vibe_key ?? selectedRoom?.vibe_key ?? 'mixed'
    return emotionThemeMap[key] ?? emotionThemeMap.mixed
  }, [roomState?.vibe_key, selectedRoom?.vibe_key])

  const roomEmotionLabel = getEmotionLabel(roomState?.vibe_key ?? selectedRoom?.vibe_key ?? 'mixed')

  useEffect(() => {
    async function bootstrap() {
      try {
        const [state, history] = await Promise.all([api.getRoomState(roomId), api.getRoomMessages(roomId)])
        setRoomState(state)
        setMessages(sortMessagesByTime(history.messages))
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : '加载房间失败')
      }
    }

    void bootstrap()
  }, [roomId])

  useEffect(() => {
    const participantId = nickname.replaceAll(' ', '-')
    const socket = new WebSocket(buildRoomSocketUrl(roomId, participantId))
    socketRef.current = socket

    socket.onopen = () => setConnectionState('已连接')
    socket.onerror = () => setConnectionState('连接异常')
    socket.onclose = () => setConnectionState('已断开')
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SocketEvent
        if (data.type === 'chat_message' && 'content' in data.payload && 'avatar_color' in data.payload) {
          const incomingMessage = data.payload
          setMessages((current) => {
            const exists = current.some((message) => message.id === incomingMessage.id && message.created_at === incomingMessage.created_at)
            if (exists) {
              return current
            }

            return sortMessagesByTime([...current, incomingMessage])
          })
        }

        if (data.type === 'system' && 'text' in data.payload && data.payload.text) {
          const text = data.payload.text
          setMessages((current) => [
            ...current,
            {
              id: current.length + 1,
              room_id: roomId,
              nickname: '系统',
              avatar_color: 'system',
              message_type: 'system',
              content: text,
              created_at: new Date().toISOString(),
            },
          ])
          void api.getRoomState(roomId).then(setRoomState).catch(() => undefined)
        }
      } catch {
        setConnectionState('消息异常')
      }
    }

    return () => {
      socket.close()
    }
  }, [nickname, roomId])

  async function handleSendMessage() {
    const trimmed = messageInput.trim()
    if (!trimmed) {
      return
    }

    try {
      await api.sendRoomMessage(roomId, sessionToken, trimmed)
      setMessageInput('')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : '发送失败')
    }
  }

  if (!roomState && error) {
    return <EmptyState title="房间暂时不可用" description={error} />
  }

  return (
    <div className="room-im-shell" style={{ ['--room-gradient' as string]: vibeTheme.gradient }}>
      <section className="room-chat-main">
        <div className="room-im-header">
          <div className="room-im-header__main">
            <span className="hero__badge">
              {getEmotionLabel(roomState?.vibe_label ?? selectedRoom?.vibe_label ?? roomState?.vibe_key ?? selectedRoom?.vibe_key ?? '同频房间')}
            </span>
            <h2>{nickname}</h2>
            <p>
              {roomState?.participant_count && roomState.participant_count > 1
                ? '房间里已经有其他人在了，直接开口就好。'
                : '你是第一个抵达的人，这个房间会先接住你的情绪。'}
            </p>
          </div>
          <div className="room-im-header__meta">
            <span>房间情绪</span>
            <strong>{roomEmotionLabel}</strong>
          </div>
        </div>

        <div className="room-thread">
          <div className="room-thread__intro">匿名对话正在进行中</div>
          <div className="message-stream message-stream--thread">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={`${message.id}-${message.created_at}`}
                  className={`message-row ${
                    message.message_type === 'system'
                      ? 'message-row--system'
                      : message.nickname === nickname
                        ? 'message-row--self'
                        : 'message-row--other'
                  }`}
                >
                  <div
                    className={`message-bubble ${
                      message.message_type === 'system'
                        ? 'message-bubble--system'
                        : message.nickname === nickname
                          ? 'message-bubble--self'
                          : 'message-bubble--other'
                    }`}
                  >
                    <strong>{message.message_type === 'system' ? '系统' : message.nickname}</strong>
                    <p>{message.content}</p>
                    <small>{formatMessageTime(message.created_at)}</small>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="房间还很安静" description="先说出第一句话，后续进入房间的人会看到这份情绪。" />
            )}
          </div>
        </div>

        <div className="composer-shell composer-shell--im">
          <textarea
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            rows={2}
            placeholder="匿名写下你现在最想被理解的一句话…"
          />
          <div className="composer-shell__actions">
            <button onClick={handleSendMessage}>发送</button>
          </div>
          {error ? <p className="error-message">{error}</p> : null}
        </div>
      </section>

      <aside className="room-chat-side">
        <div className="status-grid status-grid--room">
          <StatusCard title="连接状态" value={connectionState} />
          <StatusCard title="当前人数" value={String(roomState?.participant_count ?? 0)} />
          <StatusCard title="房间情绪" value={roomEmotionLabel} />
        </div>

        <SectionCard title="AI 破冰建议" description="补充信息放在旁边，不抢聊天主舞台。">
          <ul>
            {(selectedRoom?.icebreakers ?? []).map((icebreaker) => (
              <li key={icebreaker}>{icebreaker}</li>
            ))}
          </ul>
        </SectionCard>
      </aside>
    </div>
  )
}
