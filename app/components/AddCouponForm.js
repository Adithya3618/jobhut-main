'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddCouponForm() {
  const [coupon, setCoupon] = useState({
    name: '',
    couponId: '',
    linkToApply: '',
    description: '',
  })
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCoupon((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          ...coupon,
          createdAt: new Date().toISOString()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert('Coupon added successfully!')
        setCoupon({
          name: '',
          couponId: '',
          linkToApply: '',
          description: '',
        })
        router.push('/admin/dashboard?tab=coupons')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add coupon')
      }
    } catch (error) {
      console.error('Error adding coupon:', error)
      alert(`Error adding coupon: ${error.message}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Coupon Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={coupon.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="couponId" className="block text-sm font-medium text-gray-700">
          Coupon ID
        </label>
        <input
          type="text"
          id="couponId"
          name="couponId"
          value={coupon.couponId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="linkToApply" className="block text-sm font-medium text-gray-700">
          Link to Apply
        </label>
        <input
          type="url"
          id="linkToApply"
          name="linkToApply"
          value={coupon.linkToApply}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={coupon.description}
          onChange={handleChange}
          required
          rows="4"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Coupon
        </button>
      </div>
    </form>
  )
}

