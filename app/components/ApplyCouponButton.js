'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplyCouponButton({ coupon }) {
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()

  const handleApply = () => {
    setIsCountingDown(true)
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          clearInterval(timer)
          window.open(coupon.linkToApply, '_blank')
        }
        return prevCount - 1
      })
    }, 1000)
  }

  if (isCountingDown) {
    return (
      <button
        className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed"
        disabled
      >
        Redirecting in {countdown} seconds...
      </button>
    )
  }

  return (
    <button
      onClick={handleApply}
      className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
    >
      Apply Coupon
    </button>
  )
}

