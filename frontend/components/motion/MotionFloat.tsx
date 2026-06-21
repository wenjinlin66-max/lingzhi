'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'

type MotionFloatProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function MotionFloat({ children, className, delay = 0 }: MotionFloatProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.98, y: 18 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -4, 0],
      }}
      transition={{
        opacity: { duration: 0.55, delay },
        scale: { duration: 0.55, delay },
        y: {
          duration: 6.2,
          delay: delay + 0.2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      {children}
    </motion.div>
  )
}
