'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function BlogSubmissionForm() {
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    author: '',
    category: 'blog',
    tags: '',
    relatedLinks: '',
    image: '', // Added image field
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setBlog(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blog),
      })

      if (!response.ok) {
        throw new Error('Failed to submit blog')
      }

      await response.json()
      toast.success('Blog submitted successfully! It will be reviewed by an admin.')
      setBlog({
        title: '',
        content: '',
        author: '',
        category: 'blog',
        tags: '',
        relatedLinks: '',
        image: '', // Reset image field
      })
    } catch (error) {
      console.error('Error submitting blog:', error)
      toast.error('An error occurred while submitting the blog. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Your Name
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={blog.author}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={blog.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="blog">Blog</option>
          <option value="article">Article</option>
          <option value="interview">Interview Experience</option>
          <option value="tutorial">Tutorial</option>
          <option value="news">Industry News</option>
          <option value="career">Career Advice</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={blog.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={blog.content}
          onChange={handleChange}
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={blog.tags}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="relatedLinks" className="block text-sm font-medium text-gray-700">
          Related Links (one per line)
        </label>
        <textarea
          id="relatedLinks"
          name="relatedLinks"
          value={blog.relatedLinks}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Cover Image URL
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={blog.image}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="https://example.com/your-image.jpg"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  )
}

