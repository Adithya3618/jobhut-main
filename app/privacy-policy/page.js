import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageViewWrapper from '../components/PageViewWrapper';
import { Lock, Clock, Shield, Mail, FileText, Bell } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | JobHut',
  description: 'Learn about how JobHut collects, uses, and protects your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <PageViewWrapper>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Lock className="w-16 h-16 mx-auto mb-6 text-purple-300" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-lg text-gray-300">How we protect and handle your personal information</p>
            </div>
          </div>
        </div>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated Banner */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-8 border-l-4 border-purple-500 flex items-center">
              <Clock className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-gray-600">Last updated: 08/01/2025</span>
            </div>

            {/* Introduction */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <p className="text-gray-600 leading-relaxed">
                This Privacy Policy describes how JobHut ("we", "us", or "our") collects, uses, and shares your personal information when you use our website https://jobhut.com (the "Site") and our services.
              </p>
            </div>

            {/* Main Content Sections */}
            <div className="space-y-8">
              {/* Information Collection Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start mb-4">
                  <FileText className="w-6 h-6 text-purple-500 mr-3 mt-1" />
                  <h2 className="text-2xl font-semibold">Information We Collect</h2>
                </div>
                <div className="pl-9">
                  <p className="text-gray-600 mb-4">We collect information you provide directly to us when you create an account, apply for jobs, or communicate with us. This may include:</p>
                  <ul className="space-y-2 text-gray-600 mb-6">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Personal information (e.g., name, email address, phone number)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Professional information (e.g., resume, work history, education)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Account credentials
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Communication data
                    </li>
                  </ul>

                  <p className="text-gray-600 mb-4">We also automatically collect certain information when you use our Site, including:</p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Usage data (e.g., pages visited, time spent on the Site)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Device information (e.g., IP address, browser type)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Location data
                    </li>
                  </ul>
                </div>
              </div>

              {/* Information Usage Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start mb-4">
                  <Shield className="w-6 h-6 text-purple-500 mr-3 mt-1" />
                  <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
                </div>
                <div className="pl-9">
                  <ul className="space-y-2 text-gray-600">
                    {[
                      'Provide, maintain, and improve our services',
                      'Process your job applications',
                      'Communicate with you about our services',
                      'Personalize your experience on our Site',
                      'Analyze usage of our Site and services',
                      'Protect against fraud and unauthorized access'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Additional Sections */}
              <div className="space-y-8">
                {[
                  {
                    title: "Data Security",
                    icon: <Lock className="w-6 h-6 text-purple-500 mr-3 mt-1" />,
                    content: "We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
                  },
                  {
                    title: "Contact Us",
                    icon: <Mail className="w-6 h-6 text-purple-500 mr-3 mt-1" />,
                    content: (
                      <>
                        <p className="mb-2">If you have any questions about this Privacy Policy, please contact us at:</p>
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
                    <div className="flex items-start mb-4">
                      {section.icon}
                      <h2 className="text-2xl font-semibold">{section.title}</h2>
                    </div>
                    <div className="pl-9 text-gray-600">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
              <Link
                href="/"
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
              >
                ← Back to Home Page
              </Link>

              <div className="flex gap-4 text-sm">
                <Link href="/disclaimer" className="text-gray-600 hover:text-purple-600">Disclaimer</Link>
                <Link href="/terms-of-service" className="text-gray-600 hover:text-purple-600">Terms of Service</Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageViewWrapper>
  );
}