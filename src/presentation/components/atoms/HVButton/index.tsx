import type { FC } from 'react'
import { clsx } from 'clsx'
import { buttonStyles } from './HVButton.styles'
import type { HVButtonProps } from './HVButton.types'

export const HVButton: FC<HVButtonProps> = ({
  variant,
  size,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        buttonStyles({ variant, size }),
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
