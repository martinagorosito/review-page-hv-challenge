import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@app/globals.css'
import { ReviewPage } from '@presentation/components/pages/ReviewPage'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <ReviewPage reviewId="review-1" />
  </StrictMode>,
)
