export type EmotionAnalyzeResponse = {
  primary_emotion: string
  secondary_emotion: string
  valence: number
  arousal: number
  intensity: number
  keywords: string[]
  summary: string
  provider: string
}

export type MatchRoomSuggestion = {
  room_id: string
  vibe_key: string
  vibe_label: string
  room_title: string
  strategy_key: string
  strategy_label: string
  participant_count: number
  connection_state: string
  icebreakers: string[]
}

export type MatchStrategyGroup = {
  strategy_key: string
  strategy_label: string
  description: string
  rooms: MatchRoomSuggestion[]
}



export type MatchResponse = {
  nickname: string
  avatar_color: string
  recommended_surface: string
  recommended_strategy: string
  strategies: MatchStrategyGroup[]
}

export type RoomStateResponse = {
  room_id: string
  vibe_key: string
  vibe_label: string
  emotion_bucket: string
  intensity_bucket: string
  participant_count: number
  status: string
}

export type MessageRead = {
  id: number
  room_id: string
  nickname: string
  avatar_color: string
  message_type: string
  content: string
  created_at: string
}

export type MessageListResponse = {
  messages: MessageRead[]
}

export type SessionDraft = {
  text: string
  analysis?: EmotionAnalyzeResponse
  match?: MatchResponse
   selectedRoom?: MatchRoomSuggestion
}
