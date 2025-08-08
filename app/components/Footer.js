import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { FaTelegram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">JobHut</h3>
            <p className="text-gray-400 leading-relaxed">Find your dream job with ease. Join our community of job seekers and employers.</p>
            <Link 
              href="https://chat.whatsapp.com/EmqcoRUvG66LXF9XE0ZKfq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 mt-4"
            >
              <FaWhatsapp className="text-xl" />
              <span>Join WhatsApp Community</span>
            </Link>
            <Link 
              href="https://t.me/jobhutin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
            >
              <FaTelegram className="text-xl" />
              <span>Join Telegram Community</span>
            </Link>
            
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors duration-200">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Job Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/jobs?category=technical" className="hover:text-white transition-colors duration-200">Technical Jobs</Link>
              </li>
              <li>
                <Link href="/jobs?category=non-technical" className="hover:text-white transition-colors duration-200">Non-Technical Jobs</Link>
              </li>
              <li>
                <Link href="/jobs?jobType=intern" className="hover:text-white transition-colors duration-200">Internships</Link>
              </li>
              <li>
                <Link href="/jobs?jobType=fulltime" className="hover:text-white transition-colors duration-200">Full Time</Link>
              </li>
              <li>
                <Link href="/jobs?experience=pursuing" className="hover:text-white transition-colors duration-200">Pursuing</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors duration-200">Disclaimer</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors duration-200">Admin Login</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} JobHut. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}