import { Suspense } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import JobDetailsContent from '../../components/JobDetailsContent'
import Loading from '../../components/Loading'
import PageViewWrapper from '../../components/PageViewWrapper'
import AdSense from '../../components/AdSense'

export default async function JobDetails({ params }) {
  const { id } = await params

  return (
    <PageViewWrapper>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <Suspense fallback={<Loading />}>
          <main className="flex-grow container mx-auto px-4 py-8">
            {/* AdSense at the top of the job details
            <AdSense adSlot="5678901234" style={{ marginBottom: '2rem' }} /> */}

            <JobDetailsContent id={id} />

            {/* AdSense at the bottom of the job details
            <AdSense adSlot="6789012345" style={{ marginTop: '2rem' }} /> */}
          </main>
        </Suspense>
        <Footer />
      </div>
    </PageViewWrapper>
  )
}

