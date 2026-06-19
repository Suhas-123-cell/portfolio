'use client'

import { motion } from 'motion/react'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.96, filter: 'brightness(3)' }}
      animate={{ opacity: 1, scaleY: 1,    filter: 'brightness(1)' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'center top' }}
    >
      {children}
    </motion.div>
  )
}
