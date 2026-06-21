'use client'

import { motion } from 'motion/react'

type AmbientBackgroundProps = {
  variant?: 'home' | 'analyze' | 'match' | 'room'
}

const variantClassMap: Record<NonNullable<AmbientBackgroundProps['variant']>, string> = {
  home: 'ambient-bg ambient-bg--home',
  analyze: 'ambient-bg ambient-bg--analyze',
  match: 'ambient-bg ambient-bg--match',
  room: 'ambient-bg ambient-bg--room',
}

export function AmbientBackground({ variant = 'home' }: AmbientBackgroundProps) {
  const className = variantClassMap[variant]

  return (
    <div aria-hidden="true" className={className}>
      <div className="ambient-bg__base-gradient" />
      <motion.div
        className="ambient-bg__blob ambient-bg__blob--one"
        animate={{ x: [0, 24, -12, 0], y: [0, -18, 10, 0], scale: [1, 1.06, 0.98, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-bg__blob ambient-bg__blob--two"
        animate={{ x: [0, -18, 16, 0], y: [0, 14, -10, 0], scale: [1, 0.96, 1.04, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-bg__blob ambient-bg__blob--three"
        animate={{ x: [0, 16, -10, 0], y: [0, 10, -16, 0], rotate: [0, 4, -3, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-bg__veil"
        animate={{ opacity: [0.45, 0.62, 0.5, 0.45] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.svg
        className="ambient-bg__waves"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        animate={{ y: [0, -10, 0], opacity: [0.82, 1, 0.88] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          className="ambient-bg__wave ambient-bg__wave--back"
          d="M0 664C115 622 220 610 330 628C458 649 565 714 695 716C821 718 908 650 1036 628C1156 608 1280 626 1440 700V900H0Z"
        />
        <path
          className="ambient-bg__wave ambient-bg__wave--mid"
          d="M0 720C126 665 262 668 376 700C476 728 566 782 674 786C792 790 883 748 990 720C1128 684 1274 690 1440 758V900H0Z"
        />
        <path
          className="ambient-bg__wave ambient-bg__wave--front"
          d="M0 786C142 744 278 752 416 790C526 820 618 856 742 858C877 860 1000 806 1128 788C1250 770 1347 786 1440 830V900H0Z"
        />
      </motion.svg>
      <motion.svg
        className="ambient-bg__rings"
        viewBox="0 0 600 600"
        animate={{ rotate: [0, 6, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="300" cy="300" r="108" className="ambient-bg__ring ambient-bg__ring--one" />
        <circle cx="300" cy="300" r="164" className="ambient-bg__ring ambient-bg__ring--two" />
        <circle cx="300" cy="300" r="222" className="ambient-bg__ring ambient-bg__ring--three" />
      </motion.svg>
      <motion.svg
        className="ambient-bg__steps"
        viewBox="0 0 700 700"
        animate={{ x: [0, 10, -6, 0], y: [0, -8, 6, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          className="ambient-bg__step ambient-bg__step--one"
          d="M80 160C80 116 116 80 160 80H540C584 80 620 116 620 160V540C620 584 584 620 540 620H160C116 620 80 584 80 540Z"
        />
        <path
          className="ambient-bg__step ambient-bg__step--two"
          d="M146 210C146 182 168 160 196 160H504C532 160 554 182 554 210V490C554 518 532 540 504 540H196C168 540 146 518 146 490Z"
        />
        <path
          className="ambient-bg__step ambient-bg__step--three"
          d="M214 266C214 250 226 238 242 238H458C474 238 486 250 486 266V434C486 450 474 462 458 462H242C226 462 214 450 214 434Z"
        />
      </motion.svg>
      <div className="ambient-bg__mesh" />
      <div className="ambient-bg__noise" />
    </div>
  )
}
