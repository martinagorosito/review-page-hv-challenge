import type { FC } from 'react'
import { clsx } from 'clsx'
import { typographyStyles } from './HVTypography.styles'
import type { HVTypographyProps } from './HVTypography.types'

const defaultElements: Record<string, string> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  medium: 'p',
  base: 'p',
  small: 'span',
  xs: 'span',
  xxs: 'span',
}

export const HVTypography: FC<HVTypographyProps> = ({
  variant = 'base',
  color,
  as,
  className,
  children,
  ...props
}) => {
  const Tag = (as ?? defaultElements[variant ?? 'base'] ?? 'span') as React.ElementType
  return (
    <Tag className={clsx(typographyStyles({ variant, color }), className)} {...props}>
      {children}
    </Tag>
  )
}
