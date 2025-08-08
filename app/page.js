'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import RecentJobs from './components/RecentJobs'
import JobCategories from './components/JobCategories'
import Loading from './components/Loading'
import PageViewWrapper from './components/PageViewWrapper'
import AdSense from './components/AdSense'

export default function Home() {


  return (
    <PageViewWrapper>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">

          <Suspense fallback={<Loading />}>
            <section className="mb-12">
              <JobCategories />
            </section>
          </Suspense>
          <Suspense fallback={<Loading />}>
            <section>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                Recent Job Listings
              </h2>
              {/* AdSense after search form
              <AdSense adSlot="1234567890" style={{ marginBottom: '2rem' }} /> */}
              <RecentJobs />
              
              <div className="text-center mt-10">
                <Link href="/jobs" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                  View All Jobs
                </Link>
              </div>
            </section>
          </Suspense>
        </main>

        <Footer />
      </div>
    </PageViewWrapper>
  )
}

