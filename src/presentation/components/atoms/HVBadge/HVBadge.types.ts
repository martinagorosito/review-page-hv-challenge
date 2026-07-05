import type { HTMLAttributes } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { badgeStyles } from './HVBadge.styles'

export interface HVBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeStyles> {
  children: React.ReactNode
}
