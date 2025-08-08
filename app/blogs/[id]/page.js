'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Loading from '../../components/Loading'
import PageViewWrapper from '../../components/PageViewWrapper'
import { ArrowLeft, Calendar, User, Tag, Clock, Share2, Bookmark, ThumbsUp, MessageCircle, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'

export default function BlogDetailPage({ params }) {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const router = useRouter()

  // Unwrap params for Next.js 13+ (params is a Promise)
  const [blogId, setBlogId] = useState(null);
  useEffect(() => {
    (async () => {
      const { id } = await params;
      setBlogId(id);
    })();
  }, [params]);

  useEffect(() => {
    if (!blogId) return;
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${blogId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch blog')
        }
        const data = await response.json()
        setBlog(data)
        setLikes(data.likes || 0)
      } catch (error) {
        console.error('Error fetching blog:', error)
        setError('Failed to load blog. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [blogId])

  const handleLike = () => {
    setLiked(!liked)
    setLikes(likes + (liked ? -1 : 1))
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  if (loading) {
    return (
      <PageViewWrapper>
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <Loading />
        </div>
        <Footer />
      </PageViewWrapper>
    )
  }

  if (error) {
    return (
      <PageViewWrapper>
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </PageViewWrapper>
    )
  }

  if (!blog) {
    return (
      <PageViewWrapper>
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="bg-yellow-50 text-yellow-600 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Not Found</h2>
            <p>The requested blog post could not be found.</p>
          </div>
        </div>
        <Footer />
      </PageViewWrapper>
    )
  }

  return (
    <PageViewWrapper>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          {/* Blog Cover Image */}
          {blog.image ? (
            <div className="w-full h-64 sm:h-80 md:h-[32rem] bg-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
              />
            </div>
          ) : (
            <div className="w-full h-64 sm:h-80 md:h-[32rem] bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-blue-300" />
            </div>
          )}

          <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 py-8">
            {/* Navigation */}
            <button
              onClick={() => router.back()}
              className="mb-8 flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2" size={20} />
              <span className="font-medium">Back to Blogs</span>
            </button>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                <User className="w-4 h-4" /> {blog.author || 'Anonymous'}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {blog.category && (
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-sm font-medium">
                  <Tag className="w-4 h-4" /> {blog.category}
                </span>
              )}
            </div>
            {/* Interaction Bar */}
            <div className="flex items-center gap-6 mb-8">
              <button
                className={`flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-lg font-medium ${liked ? 'text-blue-600' : ''}`}
                onClick={handleLike}
              >
                <ThumbsUp className="w-5 h-5" /> {likes}
              </button>
              <button
                className={`flex items-center gap-2 text-gray-500 hover:text-yellow-500 transition-colors text-lg font-medium ${isBookmarked ? 'text-yellow-500' : ''}`}
                onClick={handleBookmark}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors text-lg font-medium"
                onClick={() => navigator.share && navigator.share({ title: blog.title, url: window.location.href })}
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors text-lg font-medium"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Content Section */}
            <div className="prose max-w-none mb-8 text-lg text-gray-800 leading-relaxed">
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6">{paragraph}</p>
              ))}
            </div>

            {/* Tags Section */}
            {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 rounded-full px-4 py-1 text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Links Section */}
            {blog.relatedLinks && Array.isArray(blog.relatedLinks) && blog.relatedLinks.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6 shadow mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Links</h2>
                <ul className="space-y-3">
                  {blog.relatedLinks.map((link, index) => (
                    <li key={index} className="flex items-center">
                      <LinkIcon className="w-4 h-4 text-blue-600 mr-2" />
                      <Link
                        href={link}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PageViewWrapper>
  )
}