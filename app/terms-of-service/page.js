import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageViewWrapper from '../components/PageViewWrapper';
import { FileText, Clock, ScrollText, UserCheck, Shield, Mail } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | JobHut',
  description: 'Read the terms and conditions governing the use of JobHut, a job search and career development platform.',
};

export default function TermsOfServicePage() {
  return (
    <PageViewWrapper>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <ScrollText className="w-16 h-16 mx-auto mb-6 text-blue-300" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-300">Please read these terms carefully before using JobHut</p>
            </div>
          </div>
        </div>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated Banner */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-8 border-l-4 border-blue-500 flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-600">Last updated: 08/01/2025 </span>
            </div>

            {/* Introduction */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <p className="text-gray-600 leading-relaxed">
                Welcome to JobHut. By accessing or using our website (https://jobhut.com) and services, you agree to comply with and be bound by the following terms and conditions. Please read these Terms of Service carefully before using JobHut.
              </p>
            </div>

            {/* Main Sections */}
            <div className="space-y-6">
              {/* Acceptance of Terms */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start mb-4">
                  <UserCheck className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                  <div>
                    <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      By accessing or using JobHut, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
                    </p>
                  </div>
                </div>
              </div>

              {/* User Conduct Section with List */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start mb-4">
                  <Shield className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                  <div>
                    <h2 className="text-2xl font-semibold">2. User Conduct</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      You agree not to use JobHut for any unlawful purpose or in any way that could damage, disable, overburden, or impair our services. This includes, but is not limited to:
                    </p>
                    <ul className="mt-4 space-y-2">
                      {[
                        'Posting false or misleading information',
                        'Impersonating any person or entity',
                        'Interfering with or disrupting the service or servers',
                        'Attempting to gain unauthorized access to any part of the service'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Other Sections */}
              {[
                {
                  title: "3. Intellectual Property",
                  icon: <FileText className="w-6 h-6 text-blue-500 mr-3 mt-1" />,
                  content: "All content on JobHut, including text, graphics, logos, and software, is the property of JobHut or its content suppliers and is protected by copyright laws. You may not reproduce, distribute, or create derivative works from this content without express written consent from JobHut."
                },
                {
                  title: "4. Contact Us",
                  icon: <Mail className="w-6 h-6 text-blue-500 mr-3 mt-1" />,
                  content: (
                    <>
                      <p className="mb-4">If you have any questions about these Terms, please contact us at:</p>
                      <Link
                          href="/contact"
                          className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                        >
                           contact
                        </Link>
                    </>
                  )
                }
              ].map((section, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start">
                    {section.icon}
                    <div>
                      <h2 className="text-2xl font-semibold">{section.title}</h2>
                      <div className="mt-4 text-gray-600 leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                <Link href="/disclaimer" className="text-gray-600 hover:text-blue-600">Disclaimer</Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageViewWrapper>
  );
}