'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SectionCard } from '@/components/common/SectionCard'
import { saveSessionDraft } from '@/lib/storage'

const suggestions = [
  '今天一直很累，明明没发生什么大事，但就是很想找个人说说话。',
  '我有点兴奋，也有点紧张，好像很想分享，但不知道从哪里开始。',
  '最近总觉得心里堵着什么，像是被很多事情同时拉扯。',
]

export function HomeEmotionEntry() {
  const router = useRouter()
  const [text, setText] = useState('')

  function handleSubmit() {
    if (!text.trim()) {
      return
    }

    saveSessionDraft({ text: text.trim() })
    router.push('/analyze')
  }

  return (
    <SectionCard title="你现在想说什么？" description="把一句此刻的状态投递出去，系统会先理解你的情绪，再决定你该被送往哪个房间。">
      <div className="entry-panel">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="比如：今天有点累，但其实更像是不知道该怎么把委屈说出口。"
          rows={8}
        />

        <div className="entry-actions">
          <button onClick={handleSubmit} disabled={!text.trim()}>
            开始被理解
          </button>
        </div>

        <div className="suggestion-list">
          {suggestions.map((item) => (
            <button key={item} className="suggestion-chip" onClick={() => setText(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}
