import type { ElementType, HTMLAttributes } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { typographyStyles } from './HVTypography.styles'

export interface HVTypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyStyles> {
  as?: ElementType
  children: React.ReactNode
}
