import type { SessionDraft } from './types'

const DRAFT_KEY = 'vibechat-draft'
const SESSION_TOKEN_KEY = 'vibechat-session-token'

export function getOrCreateSessionToken() {
  if (typeof window === 'undefined') {
    return 'server-session'
  }

  const existing = window.localStorage.getItem(SESSION_TOKEN_KEY)
  if (existing) {
    return existing
  }

  const token = `session-${crypto.randomUUID()}`
  window.localStorage.setItem(SESSION_TOKEN_KEY, token)
  return token
}

export function saveSessionDraft(draft: SessionDraft) {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function loadSessionDraft(): SessionDraft | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(DRAFT_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as SessionDraft
  } catch {
    return null
  }
}

export function clearSessionDraft() {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.removeItem(DRAFT_KEY)
}
