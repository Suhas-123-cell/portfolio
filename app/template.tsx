'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function Template({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (reduced) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -4,    filter: 'blur(2px)' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
