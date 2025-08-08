import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageViewWrapper from '../components/PageViewWrapper';
import { AlertCircle, Clock, ExternalLink, Shield, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Disclaimer | JobHut',
  description: 'Important disclaimer information for users of JobHut, a job search and career development platform.',
};

export default function DisclaimerPage() {
  return (
    <PageViewWrapper>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
              <p className="text-lg text-gray-300">Important information about using JobHut services</p>
            </div>
          </div>
        </div>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated Banner */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-8 border-l-4 border-blue-500 flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-600">Last updated: 08/01/2025</span>
            </div>

            {/* Main Content Sections */}
            <div className="space-y-8">
              {/* General Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600 leading-relaxed">
                  The information provided on JobHut (https://jobhut.com) is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
                </p>
              </div>

              {/* Job Listings Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3 mt-1" />
                  <h2 className="text-2xl font-semibold">Job Listings and Career Information</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  JobHut acts as a platform to connect job seekers with potential employers. We do not guarantee the accuracy of job listings, the validity of employers, or the likelihood of securing employment through our platform. Users are encouraged to conduct their own research and exercise caution when applying for jobs or providing personal information.
                </p>
              </div>

              {/* Third-Party Links Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start mb-4">
                  <ExternalLink className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                  <h2 className="text-2xl font-semibold">Third-Party Links</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Our website may contain links to third-party websites or services that are not owned or controlled by JobHut. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                </p>
              </div>

              {/* Limitation of Liability Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start mb-4">
                  <Shield className="w-6 h-6 text-red-500 mr-3 mt-1" />
                  <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  In no event shall JobHut, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </div>

              {/* Changes Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-4">Changes to This Disclaimer</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify or replace this disclaimer at any time. Your continued use of the website after any such changes constitutes your acceptance of the new disclaimer.
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
              <Link 
                href="/" 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back to Home Page
              </Link>
              
              <div className="flex gap-4 text-sm">
                <Link href="/privacy-policy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link>
                <Link href="/terms-of-service" className="text-gray-600 hover:text-blue-600">Terms of Service</Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageViewWrapper>
  );
}