import { ReactNode, CSSProperties, ElementType } from 'react'

type Props = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: ElementType
  size?: 'sm' | 'md'
}

export default function GlassPanel({ children, className = '', style, as: Tag = 'div', size = 'md' }: Props) {
  return (
    <Tag className={`${size === 'sm' ? 'glass-sm' : 'glass'} ${className}`} style={style}>
      {children}
    </Tag>
  )
}
