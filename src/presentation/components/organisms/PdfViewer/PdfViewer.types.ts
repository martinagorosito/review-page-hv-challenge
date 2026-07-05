export interface PdfViewerHandle {
  navigateToPage: (page: number) => void
}

export interface PdfViewerProps {
  pdfUrl: string
  className?: string
}
