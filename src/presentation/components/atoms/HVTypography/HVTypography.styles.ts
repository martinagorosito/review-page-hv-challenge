import { cva } from 'class-variance-authority'

export const typographyStyles = cva('', {
  variants: {
    variant: {
      display: 'text-display font-bold tracking-[-4px] leading-tight text-content-primary',
      h1: 'text-display font-extrabold tracking-[-3px] leading-tight text-content-primary',
      h2: 'text-5xl font-bold tracking-[-2px] leading-snug text-content-primary',
      h3: 'text-h3 font-bold leading-snug text-content-primary',
      h4: 'text-2xl font-bold leading-normal text-content-primary',
      medium: 'text-lg font-normal leading-[1.75] text-content-secondary',
      base: 'text-base font-normal leading-relaxed text-content-secondary',
      small: 'text-sm font-medium text-content-secondary',
      xs: 'text-xs text-content-muted',
      xxs: 'text-xxs font-semibold uppercase tracking-[1.5px] text-brand-600',
    },
    color: {
      primary: 'text-content-primary',
      secondary: 'text-content-secondary',
      slate: 'text-content-slate',
      medium: 'text-content-medium',
      muted: 'text-content-muted',
      disabled: 'text-content-disabled',
      brand: 'text-brand-600',
      inherit: 'text-inherit',
    },
  },
  defaultVariants: {
    variant: 'base',
  },
})
