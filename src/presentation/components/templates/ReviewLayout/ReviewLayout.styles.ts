import { clsx } from 'clsx'

export const reviewLayoutRootStyles = clsx('h-screen flex flex-col overflow-hidden')

export const reviewLayoutBodyStyles = clsx('flex flex-1 overflow-hidden')

export const reviewLayoutPdfPaneStyles = clsx('flex-1 overflow-auto')

export const reviewLayoutIssuesPaneStyles = clsx(
  'w-125 flex-shrink-0 border-l border-surface-border flex flex-col overflow-hidden p-2'
)
