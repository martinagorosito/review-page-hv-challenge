import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import { ReviewPage } from '@presentation/components/pages/ReviewPage'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')

createRoot(rootEl).render(
  <StrictMode>
    <ReviewPage reviewId="review-1" />
  </StrictMode>
)
