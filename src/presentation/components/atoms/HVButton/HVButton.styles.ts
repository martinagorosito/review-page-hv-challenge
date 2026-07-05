import { cva } from 'class-variance-authority'

export const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-hover shadow-md rounded-md',
        secondary: 'border-2 border-black bg-transparent text-content-primary rounded-md hover:bg-surface-subtle',
        'secondary-white': 'border border-surface-border bg-white text-content-primary rounded-md shadow-sm hover:bg-surface-subtle',
        ghost: 'bg-transparent text-content-primary hover:text-brand-600 rounded-md',
        'ghost-brand': 'bg-transparent text-brand-600 hover:bg-brand-50 rounded-md',
      },
      size: {
        lg: 'px-8 py-4 text-sm',
        md: 'px-6 py-3 text-sm',
        sm: 'px-5 py-2 text-sm',
        nav: 'px-4 py-2 text-sm',
        icon: 'w-7 h-7',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
