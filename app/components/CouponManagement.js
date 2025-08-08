'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Loading from './Loading'
import EditCouponForm from './EditCouponForm'
import { toast } from 'react-hot-toast'
import { Search, Tag, Calendar, Info, Pencil, Trash2, ChevronLeft, ChevronRight, Ticket } from 'lucide-react'

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCoupons, setTotalCoupons] = useState(0)
  const couponsPerPage = 20
  const router = useRouter()

  useEffect(() => {
    fetchCoupons()
  }, [])

  useEffect(() => {
    fetchCoupons()
  }, [currentPage, searchTerm])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: couponsPerPage.toString(),
        search: searchTerm
      })
      const response = await fetch(`/api/coupons?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch coupons')
      const data = await response.json()
      setCoupons(data.coupons)
      setTotalCoupons(data.total)
    } catch (error) {
      console.error('Error fetching coupons:', error)
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (couponId) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return

    try {
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete coupon')
      setCoupons(coupons.filter(coupon => coupon._id !== couponId))
      toast.success('Coupon deleted successfully')
    } catch (error) {
      console.error('Error deleting coupon:', error)
      toast.error('Error deleting coupon')
    }
  }

  const handleEdit = (coupon) => setEditingCoupon(coupon)

  const handleEditSubmit = async (updatedCoupon) => {
    try {
      const response = await fetch(`/api/coupons/${updatedCoupon._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(updatedCoupon)
      })
      if (!response.ok) throw new Error('Failed to update coupon')
      
      const result = await response.json()
      if (result.success && result.coupon) {
        setCoupons(coupons.map(coupon => coupon._id === updatedCoupon._id ? result.coupon : coupon))
        setEditingCoupon(null)
        toast.success('Coupon updated successfully')
      } else {
        throw new Error('Failed to update coupon')
      }
    } catch (error) {
      console.error('Error updating coupon:', error)
      toast.error('Error updating coupon')
    }
  }

  const filteredCoupons = coupons.filter(coupon =>
    coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.couponId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Loading />
  if (editingCoupon) return <EditCouponForm coupon={editingCoupon} onSubmit={handleEditSubmit} onCancel={() => setEditingCoupon(null)} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchCoupons() }} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search coupons by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>
      </div>

      {/* Coupons Grid */}
      <div className="space-y-6">
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Ticket className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No coupons available</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search terms or clear the filter</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCoupons.map(coupon => (
              <div
                key={coupon._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 h-64 flex flex-col"
              >
                {/* Card Header */}
                <div className="p-6 flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {coupon.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">ID: {coupon.couponId}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {new Date(coupon.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {coupon.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg shadow-sm p-4">
        <p className="text-sm text-gray-700">
          Showing {Math.min((currentPage - 1) * couponsPerPage + 1, totalCoupons)} - {Math.min(currentPage * couponsPerPage, totalCoupons)} of {totalCoupons} coupons
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage * couponsPerPage >= totalCoupons}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}