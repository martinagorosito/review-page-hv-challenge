import type { FC } from 'react'
import type { AppHeaderProps } from './AppHeader.types'

export const AppHeader: FC<AppHeaderProps> = ({ userInitials }) => (
  <header className="flex items-center justify-between px-6 h-14 bg-white border-b border-surface-border flex-shrink-0">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-brand-600 rounded-md flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-bold">M</span>
      </div>
      <span className="text-content-primary font-semibold text-sm">HomeVision</span>
      <span className="text-content-muted select-none">|</span>
      <span className="text-content-secondary text-sm">Document Review</span>
    </div>

    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Help"
        className="w-8 h-8 rounded-full border border-surface-border flex items-center justify-center text-content-secondary text-sm hover:bg-surface-subtle transition-colors"
      >
        ?
      </button>
      <div
        aria-label={`User ${userInitials}`}
        className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0"
      >
        <span className="text-white text-xs font-semibold">{userInitials}</span>
      </div>
    </div>
  </header>
)
