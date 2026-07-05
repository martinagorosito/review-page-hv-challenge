import { createRef } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PdfViewer } from './index'
import type { PdfViewerHandle } from './PdfViewer.types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('pdfjs-dist', () => {
  const mockRender = vi.fn().mockReturnValue({ promise: Promise.resolve() })
  const mockGetTextContent = vi.fn().mockResolvedValue({ items: [] })
  const mockGetViewport = vi.fn().mockReturnValue({ width: 800, height: 1000, transform: [] })
  const mockGetPage = vi.fn().mockResolvedValue({
    render: mockRender,
    getTextContent: mockGetTextContent,
    getViewport: mockGetViewport,
  })
  const mockGetDocument = vi.fn().mockReturnValue({
    promise: Promise.resolve({
      numPages: 3,
      getPage: mockGetPage,
    }),
  })
  return {
    default: { getDocument: mockGetDocument, GlobalWorkerOptions: { workerSrc: '' } },
    getDocument: mockGetDocument,
    GlobalWorkerOptions: { workerSrc: '' },
    renderTextLayer: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
  }
})

vi.mock('@shared/observability', () => ({
  observability: {
    trackEvent: vi.fn(),
    trackError: vi.fn(),
    startSpan: vi.fn().mockReturnValue({ traceId: 't1', spanId: 's1', name: 'n', startTime: 0 }),
    endSpan: vi.fn(),
    setUserContext: vi.fn(),
    trackMetric: vi.fn(),
  },
}))

// ─── Setup ────────────────────────────────────────────────────────────────────

const scrollIntoViewMock = vi.fn()
Element.prototype.scrollIntoView = scrollIntoViewMock

// Mock canvas getContext so JSDOM doesn't throw "not implemented"
const mockCanvas2dCtx = {
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  scale: vi.fn(),
  setTransform: vi.fn(),
  transform: vi.fn(),
  translate: vi.fn(),
}
vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
  mockCanvas2dCtx as unknown as CanvasRenderingContext2D
)

const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.IntersectionObserver = mockIntersectionObserver

beforeEach(() => {
  vi.clearAllMocks()
  mockIntersectionObserver.mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PdfViewer', () => {
  it('renders loading skeleton initially (before PDF resolves)', () => {
    render(<PdfViewer pdfUrl="/test.pdf" />)

    expect(screen.getByTestId('pdf-loading-skeleton')).toBeInTheDocument()
  })

  it('renders 3 canvases after PDF loads (one per page)', async () => {
    render(<PdfViewer pdfUrl="/test.pdf" />)

    await waitFor(() => {
      expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
    })

    const canvases = screen.getAllByLabelText(/^Page \d+$/)
    expect(canvases).toHaveLength(3)
  })

  it('renders 3 text layer divs alongside the canvases', async () => {
    const { container } = render(<PdfViewer pdfUrl="/test.pdf" />)

    await waitFor(() => {
      expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
    })

    const textLayers = container.querySelectorAll('.textLayer')
    expect(textLayers).toHaveLength(3)
  })

  it('toolbar shows page indicator after load', async () => {
    render(<PdfViewer pdfUrl="/test.pdf" />)

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-indicator')).toHaveTextContent('Page 1 / 3')
    })
  })

  it('clicking "Next" scrolls to page 2 (trackEvent called with pdf.page_changed)', async () => {
    const { observability } = await import('@shared/observability')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { trackEvent } = observability
    const user = userEvent.setup()

    render(<PdfViewer pdfUrl="/test.pdf" />)

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-indicator')).toHaveTextContent('Page 1 / 3')
    })

    const nextButton = screen.getByRole('button', { name: /next page/i })
    await user.click(nextButton)

    expect(scrollIntoViewMock).toHaveBeenCalled()
    expect(trackEvent).toHaveBeenCalledWith('pdf.page_changed', { page: 2 })
  })

  it('clicking "Prev" on page 1 does nothing / stays on page 1', async () => {
    render(<PdfViewer pdfUrl="/test.pdf" />)

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-indicator')).toHaveTextContent('Page 1 / 3')
    })

    const prevButton = screen.getByRole('button', { name: /previous page/i })
    expect(prevButton).toBeDisabled()
    expect(screen.getByTestId('pdf-page-indicator')).toHaveTextContent('Page 1 / 3')
    expect(scrollIntoViewMock).not.toHaveBeenCalled()
  })

  it('clicking "Zoom In" increases zoom display to "125%"', async () => {
    const user = userEvent.setup()

    render(<PdfViewer pdfUrl="/test.pdf" />)

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-indicator')).toHaveTextContent('Page 1 / 3')
    })

    expect(screen.getByText('100%')).toBeInTheDocument()

    const zoomInButton = screen.getByRole('button', { name: /zoom in/i })
    await user.click(zoomInButton)

    expect(screen.getByText('125%')).toBeInTheDocument()
  })

  it('clicking "Zoom Out" decreases zoom display to "75%"', async () => {
    const user = userEvent.setup()

    render(<PdfViewer pdfUrl="/test.pdf" />)

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-indicator')).toHaveTextContent('Page 1 / 3')
    })

    const zoomOutButton = screen.getByRole('button', { name: /zoom out/i })
    await user.click(zoomOutButton)

    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('navigateToPage(2) called via ref changes current page', async () => {
    const { observability } = await import('@shared/observability')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { trackEvent } = observability
    const ref = createRef<PdfViewerHandle>()

    render(<PdfViewer pdfUrl="/test.pdf" ref={ref} />)

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-indicator')).toHaveTextContent('Page 1 / 3')
    })

    ref.current?.navigateToPage(2)

    expect(scrollIntoViewMock).toHaveBeenCalled()
    expect(trackEvent).toHaveBeenCalledWith('pdf.page_changed', { page: 2 })
  })

  it('on load failure, shows error message and calls trackError', async () => {
    const pdfjsMod = await import('pdfjs-dist')
    const { observability } = await import('@shared/observability')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { trackError } = observability

    vi.mocked(pdfjsMod.getDocument).mockReturnValueOnce({
      promise: Promise.reject(new Error('PDF load failed')),
    } as ReturnType<typeof pdfjsMod.getDocument>)

    render(<PdfViewer pdfUrl="/broken.pdf" />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    expect(trackError).toHaveBeenCalledWith(expect.any(Error), {
      pdfUrl: '/broken.pdf',
    })
  })
})
