export interface HealthResponse {
  ok: boolean
}

export interface MetaResponse {
  appName: string
  environment: string
  version: string
  databaseConnected: boolean
}

export type ItemStatus = 'draft' | 'active' | 'archived'

export interface Item {
  id: number
  title: string
  description: string
  status: ItemStatus
  created_at: string
}

export interface ItemsResponse {
  items: Item[]
}

export interface CreateItemPayload {
  title: string
  description: string
  status: ItemStatus
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export const api = {
  apiBaseUrl,
  getHealth: () => request<HealthResponse>('/api/health'),
  getMeta: () => request<MetaResponse>('/api/meta'),
  getItems: () => request<ItemsResponse>('/api/items'),
  createItem: (payload: CreateItemPayload) =>
    request<Item>('/api/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
