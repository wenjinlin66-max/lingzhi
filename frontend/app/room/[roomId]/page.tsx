import Link from 'next/link'

import { AppShell } from '@/components/layout/AppShell'
import { RoomChatFlow } from '@/features/chat/RoomChatFlow'

type RoomPageProps = {
  params: {
    roomId: string
  }
}

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <AppShell
      badge="匿名聊天室"
      title="同频房间已经打开，情绪开始流动。"
      description="说出口的瞬间开始变得不那么孤单。你会看到房间的气氛，也会留下自己的回声。"
      backgroundVariant="room"
      hideHero
      fullBleed
      topbarAction={
        <Link href="/analyze" className="room-exit-button">
          退出房间
        </Link>
      }
    >
      <RoomChatFlow roomId={params.roomId} />
    </AppShell>
  )
}
