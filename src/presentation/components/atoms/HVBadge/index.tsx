import type { FC } from 'react'
import { clsx } from 'clsx'
import { badgeStyles } from './HVBadge.styles'
import type { HVBadgeProps } from './HVBadge.types'

export const HVBadge: FC<HVBadgeProps> = ({ variant, className, children, ...props }) => {
  return (
    <span className={clsx(badgeStyles({ variant }), className)} {...props}>
      {children}
    </span>
  )
}
