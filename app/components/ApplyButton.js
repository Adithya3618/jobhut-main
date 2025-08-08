'use client'

import { useState } from 'react'

export default function ApplyButton({ applyLink }) {
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [newTabOpened, setNewTabOpened] = useState(false) // Track if tab is opened
  const [popUpBlocked, setPopUpBlocked] = useState(false) // Track if pop-up is blocked

  const handleApply = () => {
    if (newTabOpened) return // Prevent opening multiple tabs

    setIsCountingDown(true)
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          clearInterval(timer)

          // Attempt to open the link in a new tab
          const newTab = window.open(applyLink, '_blank', 'noopener,noreferrer')
          if (newTab) {
            newTab.focus() // Focus on the new tab
            setNewTabOpened(true) // Mark the tab as opened
          } else {
            setPopUpBlocked(true) // Handle pop-up block
            setIsCountingDown(false) // Reset countdown state
          }
        }
        return prevCount - 1
      })
    }, 1000)
  }

  if (popUpBlocked) {
    return (
      <button
        onClick={() => window.open(applyLink, '_blank', 'noopener,noreferrer')} // Attempt to open link manually
        className="flex-1 text-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Enable Pop-Ups and Click Here
      </button>
    )
  }

  if (isCountingDown) {
    return (
      <button
        className="flex-1 text-center bg-green-500 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed"
        disabled
      >
        Redirecting in {countdown}...
      </button>
    )
  }

  return (
    <button
      onClick={handleApply}
      className="flex-1 text-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
    >
      Apply Now
    </button>
  )
}
