'use client'

import { Suspense } from 'react'
import { usePageViews } from '../hooks/usePageViews'

function PageViewsTracker() {
  usePageViews()
  return null
}

export default function PageViewWrapper({ children }) {
  return (
    <Suspense fallback={null}>
      <PageViewsTracker />
      {children}
    </Suspense>
  )
}

