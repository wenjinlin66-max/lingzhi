import type {
  EmotionAnalyzeResponse,
  MatchResponse,
  MessageListResponse,
  MessageRead,
  RoomStateResponse,
} from './types'

// 💡 优化：将默认的 fallback 地址从 'http://localhost:8000' 修改为 'http://127.0.0.1:8000'
// 这能完美绕过现代浏览器将 localhost 强制解析为 IPv6 [::1] 导致的连接拒绝问题（net::ERR_CONNECTION_REFUSED）
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`)
  }

  return response.json() as Promise<T>
}

export const api = {
  analyzeEmotion(text: string, sessionToken?: string) {
    return request<EmotionAnalyzeResponse>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ text, session_token: sessionToken }),
    })
  },
  matchRoom(sessionToken: string, analysis: EmotionAnalyzeResponse) {
    return request<MatchResponse>('/api/match', {
      method: 'POST',
      body: JSON.stringify({ session_token: sessionToken, analysis }),
    })
  },
  getRoomState(roomId: string) {
    return request<RoomStateResponse>(`/api/rooms/${roomId}`)
  },
  getRoomMessages(roomId: string) {
    return request<MessageListResponse>(`/api/rooms/${roomId}/messages`)
  },
  sendRoomMessage(roomId: string, sessionToken: string, content: string) {
    return request<MessageRead>(`/api/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ session_token: sessionToken, content }),
    })
  },
}