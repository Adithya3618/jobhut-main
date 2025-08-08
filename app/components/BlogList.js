'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, User, Tag, Search, Star } from 'lucide-react'

export default function BlogList() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBlogs()
  }, [searchTerm])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching blogs with status=approved and search:', searchTerm)
      
      const response = await fetch(`/api/blogs?status=approved&search=${searchTerm}`)
      console.log('Blog API response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Blog API error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch blogs`)
      }
      
      const data = await response.json()
      console.log('Blog API response data:', data)
      
      if (data.blogs && Array.isArray(data.blogs)) {
        setBlogs(data.blogs)
      } else {
        console.warn('Blog API returned invalid data structure:', data)
        setBlogs([])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError('Failed to load blogs. Please try again later.')
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading blogs...</p>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="text-center py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-red-800 font-medium mb-2">Error Loading Blogs</div>
        <div className="text-red-600 text-sm">{error}</div>
        <button 
          onClick={fetchBlogs}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="w-full">
      {/* Google-style search bar at the top */}
      <div className="mb-8 relative max-w-2xl mx-auto">
        <span className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="h-6 w-6 text-[#4285F4]" />
        </span>
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-3 text-lg border-2 border-[#b5ad6a] rounded-full bg-white text-gray-900 focus:border-[#b5ad6a] focus:ring-2 focus:ring-[#b5ad6a] transition-all outline-none placeholder-gray-400"
          style={{ boxShadow: 'none' }}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          <Star className="h-6 w-6 text-[#b5ad6a]" />
        </span>
      </div>

      {/* Blog cards */}
      <div className="flex flex-col gap-10">
        {blogs.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-gray-600 mb-2">No blogs found</div>
              <div className="text-gray-500 text-sm">
                {searchTerm ? 'Try adjusting your search terms.' : 'No approved blogs are available at the moment.'}
              </div>
            </div>
          </div>
        )}
        {blogs.map((blog, idx) => (
          <BlogCard key={blog._id} blog={blog} large={idx === 0} />
        ))}
      </div>
    </div>
  )
}

// BlogCard component (can be in the same file or separate)
function BlogCard({ blog, large }) {
  return (
    <Link href={`/blogs/${blog._id}`} className="group block">
      <div
        className={`flex flex-row items-center bg-white rounded-2xl shadow hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-[1.02] hover:-translate-y-1 hover:bg-blue-50 animate-fade-in gap-8`}
        style={{ minHeight: '12rem' }}
      >
        {/* Much bigger image on the left */}
        {blog.image && (
          <div className="w-52 h-52 flex-shrink-0 flex items-center justify-center ml-4 my-4 overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-100 shadow-lg">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {/* Blog content on the right */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
              <User className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{blog.author || "Anonymous"}</span>
              <span>•</span>
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h2 className="font-bold mb-2 group-hover:underline group-hover:text-blue-600 transition-colors text-2xl">
              {blog.title}
            </h2>
            <p className="text-gray-600 mb-2 line-clamp-2">{blog.content}</p>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

// Animation keyframes (add to global CSS if not present)
// @keyframes fade-in {
//   from { opacity: 0; transform: translateY(20px); }
//   to { opacity: 1; transform: none; }
// }
// .animate-fade-in { animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both; }