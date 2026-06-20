import { ReactNode, CSSProperties } from 'react'

type Props = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'section' | 'article' | 'aside'
  size?: 'sm' | 'md'
}

export function GlassPanel({ children, className = '', style, as: Tag = 'div', size = 'md' }: Props) {
  return (
    <Tag className={`${size === 'sm' ? 'glass-sm' : 'glass'} ${className}`} style={style}>
      {children}
    </Tag>
  )
}
