'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Loading from './Loading'
import { toast } from 'react-hot-toast'
import { FiSearch, FiChevronDown, FiChevronUp, FiTrash2, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi'

export default function BlogManagement() {
  const [pendingBlogs, setPendingBlogs] = useState([])
  const [approvedBlogs, setApprovedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalBlogs, setTotalBlogs] = useState(0)
  const [expandedSection, setExpandedSection] = useState('pending')
  const blogsPerPage = 20
  const router = useRouter()

  useEffect(() => {
    fetchBlogs()
  }, [currentPage, searchTerm])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: blogsPerPage.toString(),
        search: searchTerm,
      })
      const response = await fetch(`/api/blogs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch blogs')
      setPendingBlogs(data.blogs.filter(blog => blog.status === 'pending'))
      setApprovedBlogs(data.blogs.filter(blog => blog.status === 'approved'))
      setTotalBlogs(data.total)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error(error.message || 'Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update blog status')
      toast.success(`Blog ${newStatus === 'approved' ? 'approved' : 'rejected'}`)
      fetchBlogs()
    } catch (error) {
      console.error('Error updating blog status:', error)
      toast.error(error.message || 'Error updating blog status')
    }
  }

  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete blog')
      toast.success(data.message || 'Blog deleted successfully')
      fetchBlogs()
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error(error.message || 'Error deleting blog')
    }
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  if (loading) return <Loading />

  const BlogCard = ({ blog, isPending }) => (
    <div className="bg-white rounded-lg shadow-md mb-4 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">{blog.title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{blog.author}</span>
            <span>•</span>
            <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">{blog.category}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-600 mb-6 line-clamp-3">{blog.content}</p>
      <div className="flex justify-end space-x-2">
        {isPending ? (
          <>
            <button
              onClick={() => handleStatusChange(blog._id, 'approved')}
              className="flex items-center px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors duration-200"
            >
              <FiCheckCircle className="mr-2" />
              Approve
            </button>
            <button
              onClick={() => handleDelete(blog._id)}
              className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <FiXCircle className="mr-2" />
              Reject
            </button>
          </>
        ) : (
          <button
            onClick={() => handleDelete(blog._id)}
            className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            <FiTrash2 className="mr-2" />
            Delete
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Management</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Pending Blogs Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="flex justify-between items-center p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          onClick={() => toggleSection('pending')}
        >
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900">Pending Blogs</h2>
            <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">{pendingBlogs.length}</span>
          </div>
          {expandedSection === 'pending' ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </div>
        {expandedSection === 'pending' && (
          <div className="p-6">
            {pendingBlogs.length === 0 ? (
              <div className="flex items-center justify-center p-6 text-gray-500 bg-gray-50 rounded-lg">
                <FiAlertCircle className="mr-2" />
                <span>No pending blogs to review</span>
              </div>
            ) : (
              pendingBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} isPending={true} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Approved Blogs Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="flex justify-between items-center p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          onClick={() => toggleSection('approved')}
        >
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900">Approved Blogs</h2>
            <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">{approvedBlogs.length}</span>
          </div>
          {expandedSection === 'approved' ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </div>
        {expandedSection === 'approved' && (
          <div className="p-6">
            {approvedBlogs.length === 0 ? (
              <div className="flex items-center justify-center p-6 text-gray-500 bg-gray-50 rounded-lg">
                <FiAlertCircle className="mr-2" />
                <span>No approved blogs yet</span>
              </div>
            ) : (
              approvedBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} isPending={false} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-gray-600">
          Showing {Math.min((currentPage - 1) * blogsPerPage + 1, totalBlogs)} - {Math.min(currentPage * blogsPerPage, totalBlogs)} of {totalBlogs} blogs
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage * blogsPerPage >= totalBlogs}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}