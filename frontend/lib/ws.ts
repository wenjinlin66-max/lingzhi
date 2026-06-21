export function buildRoomSocketUrl(roomId: string, participantId: string) {
  const httpUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'
  const wsBase = httpUrl.replace('http://', 'ws://').replace('https://', 'wss://')
  return `${wsBase}/api/rooms/${roomId}/ws?participantId=${participantId}`
}
