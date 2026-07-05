import { clsx } from 'clsx'

export const pdfViewerContainerStyles = (className?: string): string =>
  clsx('relative flex flex-col h-full overflow-hidden rounded-md shadow-card', className)

export const pdfViewerToolbarStyles = (): string =>
  clsx(
    'sticky top-0 z-10 flex items-center',
    'bg-white border-b border-surface-border',
    'px-4 gap-3',
    'h-[46px] flex-shrink-0'
  )

export const pdfViewerToolbarGroupStyles = (): string => clsx('flex items-center gap-1')

export const pdfViewerToolbarSeparatorStyles = (): string =>
  clsx('w-px h-5 bg-surface-border flex-shrink-0')

export const pdfViewerToolbarBtnStyles = (): string =>
  clsx(
    'w-7 h-7 flex items-center justify-center rounded-md',
    'border-none bg-transparent cursor-pointer',
    'text-content-slate hover:bg-surface-subtle transition-colors',
    'disabled:opacity-40 disabled:cursor-not-allowed'
  )

export const pdfViewerSearchBarStyles = (active: boolean): string =>
  clsx(
    'flex items-center gap-2 rounded-md px-2.5 py-1.5',
    'w-[280px] h-8',
    active
      ? 'border-[1.5px] border-brand-600 bg-white shadow-[0_0_0_3px_rgba(79,70,229,0.12)]'
      : 'border border-surface-border bg-white'
  )

export const pdfViewerDownloadBtnStyles = (): string =>
  clsx(
    'w-[30px] h-[30px] flex items-center justify-center rounded-md flex-shrink-0',
    'border border-surface-border bg-white cursor-pointer',
    'text-content-slate hover:bg-surface-subtle transition-colors'
  )

export const pdfViewerScrollAreaStyles = (): string =>
  clsx('flex-1 overflow-y-auto bg-surface-page')

export const pdfViewerPageWrapperStyles = (): string =>
  clsx('relative mx-auto my-4 shadow-card rounded-sm overflow-hidden')

export const pdfViewerSkeletonStyles = (): string =>
  clsx('animate-pulse bg-surface-subtle rounded-sm mx-auto my-4')

export const pdfViewerErrorStyles = (): string =>
  clsx(
    'flex flex-col items-center justify-center p-8',
    'text-error-text bg-error-bg border border-error-border',
    'rounded-md m-4'
  )
