'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'motion/react'

import { saveSessionDraft } from '@/lib/storage'

const EXAMPLES = [
  '今天忙了一整天，脑子停不下来，但又不想一个人扛着。',
  '我其实挺开心的，只是想找个同样轻松的人说说今天发生的小事。',
  '最近总有点失落，好像很多话说不出口。',
]

export function HomeEmotionForm() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const charCount = text.trim().length

  function handleSubmit() {
    const trimmed = text.trim()
    if (!trimmed) {
      setError('先写一句你现在的状态，我们才能帮你找到同频的人。')
      return
    }

    saveSessionDraft({ text: trimmed })
    router.push('/analyze')
  }

  return (
    <motion.div
      className="hero__panel"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <div className="panel-heading">
        <div>
          <span className="panel-heading__eyebrow">Signal Input</span>
          <label htmlFor="emotion-input">你现在想说什么？</label>
        </div>
        <span className="panel-heading__meta">{charCount > 0 ? `${charCount} 字` : '一句就够'}</span>
      </div>

      <textarea
        id="emotion-input"
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          setError('')
        }}
        placeholder="比如：今天有点累，但还是想找一个能理解我现在心情的人聊一会儿。"
        rows={6}
      />

      <div className="input-note">
        <span className="input-note__dot" />
        系统会先分析情绪标签、强度和解释，再决定把你送往哪个房间。
      </div>

      <div className="hero__actions">
        <button onClick={handleSubmit}>开始被理解</button>
        <span className="hero__actions-note">预计 3-8 秒完成分析与匹配</span>
      </div>

      {error ? <p className="error-message">{error}</p> : null}

      <div className="example-block">
        <span>你也可以从这些情绪碎片开始</span>
        <div className="chip-list chip-list--interactive">
          {EXAMPLES.map((example) => (
            <motion.button
              key={example}
              type="button"
              onClick={() => setText(example)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
