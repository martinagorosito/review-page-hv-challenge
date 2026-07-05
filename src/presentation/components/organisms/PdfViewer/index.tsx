import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import 'pdfjs-dist/web/pdf_viewer.css'
import { observability } from '@shared/observability'
import { HVTypography } from '@presentation/components/atoms/HVTypography'
import type { PdfViewerHandle, PdfViewerProps } from './PdfViewer.types'
import {
  pdfViewerContainerStyles,
  pdfViewerDownloadBtnStyles,
  pdfViewerErrorStyles,
  pdfViewerPageWrapperStyles,
  pdfViewerScrollAreaStyles,
  pdfViewerSearchBarStyles,
  pdfViewerSkeletonStyles,
  pdfViewerToolbarBtnStyles,
  pdfViewerToolbarGroupStyles,
  pdfViewerToolbarSeparatorStyles,
  pdfViewerToolbarStyles,
} from './PdfViewer.styles'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl

const MIN_SCALE = 0.5
const MAX_SCALE = 3.0
const SCALE_STEP = 0.25
const DEFAULT_SCALE = 1.0

type LoadState = 'loading' | 'loaded' | 'error'

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const PdfViewer = forwardRef<PdfViewerHandle, PdfViewerProps>(
  ({ pdfUrl, className }, ref) => {
    const [loadState, setLoadState] = useState<LoadState>('loading')
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [scale, setScale] = useState(DEFAULT_SCALE)
    const [errorMessage, setErrorMessage] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchActive, setSearchActive] = useState(false)
    const [searchMatchCount, setSearchMatchCount] = useState(0)
    const [searchCurrentMatchIdx, setSearchCurrentMatchIdx] = useState(0)

    const pdfDocRef = useRef<PDFDocumentProxy | null>(null)
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
    const pageWrapperRefs = useRef<(HTMLDivElement | null)[]>([])
    const scrollAreaRef = useRef<HTMLDivElement | null>(null)
    const renderTasksRef = useRef<Map<number, RenderTask>>(new Map())
    const searchInputRef = useRef<HTMLInputElement | null>(null)
    const searchQueryRef = useRef('')
    const matchElementsRef = useRef<HTMLElement[]>([])
    const modifiedSpansRef = useRef<Array<{ span: HTMLSpanElement; original: string }>>([])

    // Keep searchQueryRef in sync for use inside async render callbacks
    useEffect(() => {
      searchQueryRef.current = searchQuery
    }, [searchQuery])

    const clearSearchHighlights = useCallback((): void => {
      modifiedSpansRef.current.forEach(({ span, original }) => {
        span.textContent = original
      })
      modifiedSpansRef.current = []
      matchElementsRef.current = []
    }, [])

    const applySearchHighlights = useCallback((query: string): void => {
      clearSearchHighlights()

      if (!query.trim()) {
        setSearchMatchCount(0)
        setSearchCurrentMatchIdx(0)
        return
      }

      const allSpans = Array.from(
        scrollAreaRef.current?.querySelectorAll<HTMLSpanElement>('.textLayer span') ?? []
      )

      const regex = new RegExp(escapeRegex(query), 'gi')
      const newMatches: HTMLElement[] = []

      allSpans.forEach((span) => {
        const text = span.textContent ?? ''
        if (!text.toLowerCase().includes(query.toLowerCase())) return

        regex.lastIndex = 0
        const parts: Node[] = []
        let lastIdx = 0
        let match: RegExpExecArray | null

        modifiedSpansRef.current.push({ span, original: text })

        while ((match = regex.exec(text)) !== null) {
          if (match.index > lastIdx) {
            parts.push(document.createTextNode(text.slice(lastIdx, match.index)))
          }
          const mark = document.createElement('mark')
          mark.style.cssText =
            'background:#fef08a;border-radius:2px;padding:0;color:inherit;'
          mark.textContent = match[0]
          parts.push(mark)
          newMatches.push(mark)
          lastIdx = match.index + match[0].length
        }
        if (lastIdx < text.length) {
          parts.push(document.createTextNode(text.slice(lastIdx)))
        }

        span.textContent = ''
        parts.forEach((node) => span.appendChild(node))
      })

      matchElementsRef.current = newMatches
      setSearchMatchCount(newMatches.length)
      if (newMatches.length > 0) {
        setSearchCurrentMatchIdx(1)
        newMatches[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        highlightCurrentMatch(newMatches, 0)
      } else {
        setSearchCurrentMatchIdx(0)
      }
    }, [clearSearchHighlights])

    const highlightCurrentMatch = (matches: HTMLElement[], idx: number): void => {
      matches.forEach((m, i) => {
        m.style.background = i === idx ? '#f97316' : '#fef08a'
      })
    }

    const goToNextMatch = useCallback((): void => {
      const matches = matchElementsRef.current
      if (matches.length === 0) return
      setSearchCurrentMatchIdx((prev) => {
        const next = prev % matches.length
        matches[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        highlightCurrentMatch(matches, next)
        return next + 1
      })
    }, [])

    const goToPrevMatch = useCallback((): void => {
      const matches = matchElementsRef.current
      if (matches.length === 0) return
      setSearchCurrentMatchIdx((prev) => {
        const prevIdx = (prev - 2 + matches.length) % matches.length
        matches[prevIdx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        highlightCurrentMatch(matches, prevIdx)
        return prevIdx + 1
      })
    }, [])

    // ⌘F / Ctrl+F → focus search
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent): void => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
          e.preventDefault()
          setSearchActive(true)
          searchInputRef.current?.focus()
          searchInputRef.current?.select()
        }
        if (e.key === 'Escape' && searchActive) {
          setSearchActive(false)
          setSearchQuery('')
          clearSearchHighlights()
          setSearchMatchCount(0)
          setSearchCurrentMatchIdx(0)
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => { window.removeEventListener('keydown', handleKeyDown) }
    }, [searchActive, clearSearchHighlights])

    // Re-apply highlights when query changes (after text layers ready)
    useEffect(() => {
      if (loadState !== 'loaded') return
      applySearchHighlights(searchQuery)
    }, [searchQuery, loadState, applySearchHighlights])

    // Load PDF document
    useEffect(() => {
      let cancelled = false

      const loadPdf = async (): Promise<void> => {
        setLoadState('loading')
        setErrorMessage('')

        const span = observability.startSpan('pdf.load', { pdfUrl })
        try {
          const loadingTask = pdfjsLib.getDocument({ url: pdfUrl })
          const doc = await loadingTask.promise

          if (cancelled) return

          pdfDocRef.current = doc
          setTotalPages(doc.numPages)
          setLoadState('loaded')
          observability.endSpan(span)
        } catch (error) {
          if (cancelled) return
          observability.endSpan(span)
          observability.trackError(error instanceof Error ? error : new Error(String(error)), {
            pdfUrl,
          })
          setErrorMessage('Failed to load the PDF document. Please try again.')
          setLoadState('error')
        }
      }

      void loadPdf()

      return () => {
        cancelled = true
      }
    }, [pdfUrl])

    // Render pages whenever doc is loaded or scale changes
    useEffect(() => {
      if (loadState !== 'loaded' || pdfDocRef.current === null) return

      const doc = pdfDocRef.current
      const renderAllPages = async (): Promise<void> => {
        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
          const canvas = canvasRefs.current[pageNum - 1]
          if (!canvas) continue

          const prevTask = renderTasksRef.current.get(pageNum)
          if (prevTask) {
            try { prevTask.cancel() } catch { /* ignore */ }
          }

          try {
            const page = await doc.getPage(pageNum)
            const viewport = page.getViewport({ scale })
            const ctx = canvas.getContext('2d')
            if (!ctx) continue

            canvas.width = viewport.width
            canvas.height = viewport.height

            const wrapper = pageWrapperRefs.current[pageNum - 1]
            if (wrapper) {
              wrapper.style.width = `${String(viewport.width)}px`
              wrapper.style.height = `${String(viewport.height)}px`
            }

            const renderTask = page.render({ canvasContext: ctx, viewport })
            renderTasksRef.current.set(pageNum, renderTask)
            await renderTask.promise

            const textLayerDiv = wrapper?.querySelector<HTMLDivElement>('.textLayer')
            if (textLayerDiv) {
              textLayerDiv.replaceChildren()
              const textLayer = new pdfjsLib.TextLayer({
                textContentSource: page.streamTextContent(),
                container: textLayerDiv,
                viewport,
              })
              await textLayer.render()
            }
          } catch (err) {
            const isCancel = err instanceof Error && err.message.toLowerCase().includes('cancel')
            if (!isCancel) console.error(`Error rendering page ${String(pageNum)}:`, err)
          }
        }

        // Re-apply search after text layers re-render (scale change)
        if (searchQueryRef.current) {
          applySearchHighlights(searchQueryRef.current)
        }
      }

      void renderAllPages()
    }, [loadState, scale, applySearchHighlights])

    // IntersectionObserver for current page tracking
    useEffect(() => {
      if (loadState !== 'loaded' || totalPages === 0) return

      const observers: IntersectionObserver[] = []

      for (let i = 0; i < totalPages; i++) {
        const wrapper = pageWrapperRefs.current[i]
        if (!wrapper) continue

        const pageNum = i + 1
        const observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0] as IntersectionObserverEntry | undefined
            if (entry?.isIntersecting && entry.intersectionRatio >= 0.5) {
              setCurrentPage((prev) => {
                if (prev !== pageNum) {
                  observability.trackEvent('pdf.page_changed', { page: pageNum })
                  return pageNum
                }
                return prev
              })
            }
          },
          { root: scrollAreaRef.current, threshold: 0.5 }
        )

        observer.observe(wrapper)
        observers.push(observer)
      }

      return () => { observers.forEach((o) => { o.disconnect() }) }
    }, [loadState, totalPages])

    const scrollToPage = useCallback((pageNum: number): void => {
      const wrapper = pageWrapperRefs.current[pageNum - 1]
      if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [])

    useImperativeHandle(ref, () => ({
      navigateToPage: (page: number) => {
        const clamped = Math.max(1, Math.min(page, totalPages))
        scrollToPage(clamped)
        setCurrentPage(clamped)
        observability.trackEvent('pdf.page_changed', { page: clamped })
      },
    }))

    const handlePrevPage = (): void => {
      if (currentPage <= 1) return
      const prevPage = currentPage - 1
      scrollToPage(prevPage)
      setCurrentPage(prevPage)
      observability.trackEvent('pdf.page_changed', { page: prevPage })
    }

    const handleNextPage = (): void => {
      if (currentPage >= totalPages) return
      const nextPage = currentPage + 1
      scrollToPage(nextPage)
      setCurrentPage(nextPage)
      observability.trackEvent('pdf.page_changed', { page: nextPage })
    }

    const handleZoomIn = (): void => {
      const newScale = Math.min(MAX_SCALE, scale + SCALE_STEP)
      setScale(newScale)
      observability.trackEvent('pdf.zoom_changed', { scale: newScale })
    }

    const handleZoomOut = (): void => {
      const newScale = Math.max(MIN_SCALE, scale - SCALE_STEP)
      setScale(newScale)
      observability.trackEvent('pdf.zoom_changed', { scale: newScale })
    }

    const zoomPercent = `${String(Math.round(scale * 100))}%`
    const isLoaded = loadState === 'loaded'

    return (
      <div className={pdfViewerContainerStyles(className)}>
        {/* Toolbar */}
        <div className={pdfViewerToolbarStyles()}>
          {/* Page navigation */}
          <div className={pdfViewerToolbarGroupStyles()}>
            <button
              type="button"
              className={pdfViewerToolbarBtnStyles()}
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || !isLoaded}
              aria-label="Previous page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span
              data-testid="pdf-page-indicator"
              className="text-xs font-medium text-content-slate whitespace-nowrap"
            >
              {isLoaded ? (
                <>Page <strong className="text-content-primary">{currentPage}</strong> / {totalPages}</>
              ) : '—'}
            </span>
            <button
              type="button"
              className={pdfViewerToolbarBtnStyles()}
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || !isLoaded}
              aria-label="Next page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className={pdfViewerToolbarSeparatorStyles()} />

          {/* Zoom */}
          <div className={pdfViewerToolbarGroupStyles()}>
            <button
              type="button"
              className={pdfViewerToolbarBtnStyles()}
              onClick={handleZoomOut}
              disabled={scale <= MIN_SCALE || !isLoaded}
              aria-label="Zoom out"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="text-xs font-medium text-content-slate w-10 text-center">{zoomPercent}</span>
            <button
              type="button"
              className={pdfViewerToolbarBtnStyles()}
              onClick={handleZoomIn}
              disabled={scale >= MAX_SCALE || !isLoaded}
              aria-label="Zoom in"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Right: search + download */}
          <div className="ml-auto flex items-center gap-2">
            <div className={pdfViewerSearchBarStyles(searchActive || searchQuery.length > 0)}>
              <svg
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={searchActive || searchQuery ? '#4f46e5' : '#94a3b8'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true" className="flex-shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value) }}
                onFocus={() => { setSearchActive(true) }}
                onBlur={() => { if (!searchQuery) setSearchActive(false) }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.shiftKey ? goToPrevMatch() : goToNextMatch()
                  }
                }}
                placeholder="Search…"
                aria-label="Search in document"
                className="flex-1 text-xs text-content-primary bg-transparent outline-none placeholder:text-content-muted min-w-0"
              />
              {searchQuery && (
                <span className="text-xxs font-medium text-content-secondary flex-shrink-0 whitespace-nowrap">
                  {searchMatchCount === 0 ? 'No results' : `${searchCurrentMatchIdx} / ${searchMatchCount}`}
                </span>
              )}
              <span className="text-xxs font-mono text-content-muted border border-surface-border rounded px-1 py-px flex-shrink-0">⌘F</span>
            </div>

            <button
              type="button"
              className={pdfViewerDownloadBtnStyles()}
              aria-label="Download PDF"
              onClick={() => { window.open(pdfUrl, '_blank') }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div ref={scrollAreaRef} className={pdfViewerScrollAreaStyles()}>
          {loadState === 'loading' && (
            <div data-testid="pdf-loading-skeleton">
              {[1, 2, 3].map((i) => (
                <div key={i} className={pdfViewerSkeletonStyles()} style={{ width: 800, height: 1000 }} />
              ))}
            </div>
          )}

          {loadState === 'error' && (
            <div className={pdfViewerErrorStyles()} role="alert">
              <HVTypography variant="base" color="primary">{errorMessage}</HVTypography>
            </div>
          )}

          {loadState === 'loaded' &&
            Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <div
                key={pageNum}
                ref={(el) => { pageWrapperRefs.current[pageNum - 1] = el }}
                className={pdfViewerPageWrapperStyles()}
                data-page={String(pageNum)}
              >
                <canvas
                  ref={(el) => { canvasRefs.current[pageNum - 1] = el }}
                  aria-label={`Page ${String(pageNum)}`}
                />
                <div className="textLayer" />
              </div>
            ))}
        </div>
      </div>
    )
  }
)

PdfViewer.displayName = 'PdfViewer'
