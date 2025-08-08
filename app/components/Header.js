'use client'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { Home, Briefcase, BookOpen, FileText } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-blue-600 flex items-center"
          >
            <Image
              src="https://github.com/saibadarinadh/jobHut/blob/main/public/LOGO.jpg?raw=true"
              alt="JobHut Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            JobHut
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Briefcase className="w-4 h-4" />
              <span>Find Jobs</span>
            </Link>
            <Link
              href="/courses"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </Link>
            <Link
              href="/blogs"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <FileText className="w-4 h-4" />
              <span>Blogs</span>
            </Link>
            <Link
              href="/resume-analysis"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <FileText className="w-4 h-4" />
              <span>Resume Analysis</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span className="sr-only">Open main menu</span>
            {!isMenuOpen ? (
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                <div className="flex items-center space-x-1">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </div>
              </Link>
              <Link
                href="/jobs"
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span>Find Jobs</span>
                </div>
              </Link>
              <Link
                href="/courses"
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Courses</span>
                </div>
              </Link>
              <Link
                href="/blogs"
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>Blogs</span>
                </div>
              </Link>
              <Link
                href="/resume-analysis"
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>Resume Analysis</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}