import { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JobList from '../components/JobList';
import AdvancedSearch from '../components/AdvancedSearch';
import Loading from '../components/Loading';
import PageViewWrapper from '../components/PageViewWrapper';
import AdSense from '../components/AdSense'

export const metadata = {
  title: {
    default: 'Job Listings | Find Your Next Career Opportunity | JobHut',
    template: '%s | JobHut Careers'
  },
  description: 'Explore thousands of verified job openings across tech, finance, healthcare, and more. Easy-to-use search filters, detailed job descriptions, and direct application process. Find and apply to your dream job today with JobHut.',
  keywords: [
    'job listings', 'career opportunities', 'job search', 
    'employment opportunities', 'job openings', 'remote jobs',
    'full-time jobs', 'part-time jobs', 'tech jobs',
    'entry level positions', 'senior positions', 'job search platform'
  ],
  openGraph: {
    title: 'Find Your Perfect Job | JobHut Job Listings',
    description: 'Browse through carefully curated job opportunities. Advanced search filters, comprehensive job details, and seamless application process.',
    type: 'website',
    url: 'https://jobhut.com/jobs',
    images: [
      {
        url: 'https://github.com/saibadarinadh/jobHut/blob/main/public/jobs-page.jpg?raw=true',
        width: 1200,
        height: 630,
        alt: 'JobHut Job Listings Page',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Dream Job | JobHut Job Listings',
    description: 'Discover your next career opportunity with JobHut. Browse thousands of jobs with our advanced search filters.',
  },
  alternates: {
    canonical: 'https://jobhut.com/jobs',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  }
};

export default function Jobs() {
  return (
    <PageViewWrapper>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8" role="main">
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-center">
              Find Your Next Career Opportunity
            </h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Browse through thousands of carefully curated job listings across various industries. 
              Use our advanced filters to find the perfect match for your skills and experience.
            </p>
          </section>

          <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
            {/* Left side: Search Form */}
            <aside className="w-full lg:w-1/4" role="search" aria-label="Job search filters">
              <Suspense fallback={<Loading />}>
                <AdvancedSearch />
              </Suspense>
              {/* AdSense at the bottom of the page
          <AdSense adSlot="4567890123" style={{ marginTop: '2rem' }} />
        */}
            </aside>
            
            {/* Right side: Job List */}
            <section 
              className="w-full lg:w-3/4" 
              role="region" 
              aria-label="Job listings"
            >
              <Suspense fallback={<Loading />}>
                <JobList />
              </Suspense>
            </section>
            
          </div>
        </main>
        <Footer />
      </div>
    </PageViewWrapper>
  );
}