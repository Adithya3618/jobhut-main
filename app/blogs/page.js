import { Suspense } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BlogList from '../components/BlogList'
import Loading from '../components/Loading'
import PageViewWrapper from '../components/PageViewWrapper'
import AdSense from '../components/AdSense'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const metadata = {
  title: 'Blogs | JobHut',
  description: 'Read and submit the latest blogs, articles, and interview experiences from JobHut community.',
};

export default function BlogsPage() {
  return (
    <PageViewWrapper>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-end items-center mb-8">
            <Link href="/blogs/submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
              <Plus className="mr-2" />
              <span>Write a Blog</span>
            </Link>
          </div>

          {/* Heading at the top */}
          <h1 className="text-4xl font-bold mb-8">JobHut Blog</h1>

          {/* Blog list */}
          <div className="w-full">
            <Suspense fallback={<Loading />}>
              <BlogList />
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
    </PageViewWrapper>
  )
}

