// 💡 优化：编写一个纯 JS 实现的 UUIDv4 降级函数
// 如果浏览器禁用了 crypto.randomUUID（在非 HTTPS 的公网 HTTP 环境下），则自动使用此算法兜底
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  
  // 经典算法：在 HTTP 等非安全上下文环境下的 UUID 生成逻辑
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 获取或创建会话 Token
export function getOrCreateSessionToken(): string {
  if (typeof window === 'undefined') return ''
  
  let token = localStorage.getItem('session_token')
  if (!token) {
    // 👈 优化：将原先可能报错的 crypto.randomUUID() 替换为我们安全的 generateUUID() 降级函数
    token = generateUUID() 
    localStorage.setItem('session_token', token)
  }
  return token
}

// 获取草稿箱内容
export function loadSessionDraft() {
  if (typeof window === 'undefined') return null
  const draft = localStorage.getItem('session_draft')
  return draft ? JSON.parse(draft) : null
}

// 保存草稿箱内容
export function saveSessionDraft(draft: any) {
  if (typeof window === 'undefined') return
  localStorage.setItem('session_draft', JSON.stringify(draft))
}