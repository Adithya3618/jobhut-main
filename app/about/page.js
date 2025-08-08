// aboutus.js
import Link from 'next/link';
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageViewWrapper from '../components/PageViewWrapper'

export default function AboutPage() {

  return (
    <PageViewWrapper>
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">About JobHut</h1>
          
          {/* Value Proposition Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Your One-Stop Job Search Platform</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              JobHut revolutionizes your job search by bringing together opportunities from countless job boards and company websites into one seamless platform. We save you valuable time and effort by eliminating the need to visit multiple websites.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-700">Job Sources</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-700">Updated Daily</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">100K+</div>
                <div className="text-gray-700">Active Jobs</div>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Mission</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  At JobHut, we're revolutionizing the way people find employment. Our mission is to streamline the job search process by aggregating opportunities from across the internet, saving you countless hours of searching through multiple websites.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We believe that finding your dream job shouldn't be a full-time job itself. That's why we've built powerful tools to bring all relevant opportunities to one place, making your job search more efficient and effective.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Smart Job Aggregation</h3>
                  <p className="text-gray-700">Automatically collect and organize jobs from thousands of sources</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Daily Updates</h3>
                  <p className="text-gray-700">Fresh opportunities added every day</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Intelligent Matching</h3>
                  <p className="text-gray-700">Advanced algorithms to find the most relevant jobs for you</p>
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
    </PageViewWrapper>
  );
}