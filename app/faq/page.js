'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageViewWrapper from '../components/PageViewWrapper';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">

      <button
        className="w-full flex justify-between items-center py-4 px-6 hover:bg-gray-50 transition-colors duration-150"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-left font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <Minus className="w-5 h-5 text-blue-600 flex-shrink-0" />
        ) : (
          <Plus className="w-5 h-5 text-blue-600 flex-shrink-0" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
      >
        <div className="px-6 text-gray-600">{answer}</div>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const faqs = [
    {
      question: "What is JobHut?",
      answer: "JobHut is a comprehensive job search platform that connects job seekers with employers across India. We specialize in providing verified job listings, ensuring a safe and reliable job search experience."
    },
    {
      question: "How do I create an account on JobHut?",
      answer: "Creating an account is simple. Click on the 'Sign Up' button in the top right corner, fill in your basic details like name, email, and password. You can then complete your profile with your professional information and start applying for jobs."
    },
    {
      question: "Is JobHut free for job seekers?",
      answer: "Yes, JobHut is completely free for job seekers. You can create a profile, search for jobs, and apply to positions without any charges. We believe in making job searching accessible to everyone."
    },
    {
      question: "How do I know if a job posting is legitimate?",
      answer: "All job postings on JobHut go through a verification process. We work directly with employers and verify their business credentials. Additionally, we have a reporting system in place for any suspicious listings. Look for the 'Verified' badge on job postings for extra assurance."
    },
    {
      question: "Can I upload my resume to JobHut?",
      answer: "Yes, you can upload your resume in various formats (PDF, DOC, DOCX). Your resume will be stored securely and can be easily updated. You can also create a resume using our built-in resume builder tool."
    },
    {
      question: "How do I search for specific jobs?",
      answer: "Use our advanced search filters to find specific jobs. You can filter by location, job type, experience level, salary range, and industry. You can also use keywords to search for specific roles or companies."
    },
    {
      question: "What should I do if I face technical issues?",
      answer: "If you encounter any technical issues, first try clearing your browser cache and cookies. If the problem persists, contact our support team through the 'Help' section or email us at support@jobhut.in. We typically respond within 24 hours."
    },
    {
      question: "How can employers post jobs on JobHut?",
      answer: "Employers can create a business account and post jobs through our employer dashboard. We offer various packages for job postings. Contact our sales team at sales@jobhut.in for more information about posting jobs and pricing."
    }
  ]

  return (
    <PageViewWrapper>
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about JobHut's features, services, and how to make the most of your job search.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          {/* Contact Support Section */}
          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <a
              href="mailto:jobhut.team@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150"
            >
              Contact Support
            </a>
          </div>
        </div>

      </div>
      <Footer />
    </div>
    </PageViewWrapper>
  )
}