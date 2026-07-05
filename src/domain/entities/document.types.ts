export interface ReviewPage {
  pageNum: number
  height: number
  width: number
}

export interface ReviewDocument {
  pdfUrl: string
  pages: ReviewPage[]
}
