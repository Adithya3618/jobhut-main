'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, Award, Banknote } from 'lucide-react';

const TECHNICAL_FIELDS = [
  'Software Developer',
  'Data Analyst',
  'Web Developer',
  'DevOps Engineer',
  'System Engineer',
  'Data Scientist',
  'QA Engineer',
  'Other'
];

export default function SearchForm() {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    salary: '',
    experience: '',
    category: '',
    subCategory: '',
    jobType: '',
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value)
    );
    router.push(`/jobs?${searchParams.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
      >
        {/* Main Search Bar - Full Width */}
        <div className="flex flex-col space-y-6">
          <div className="relative group">
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Search jobs, companies, fields..."
              className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 group-hover:border-blue-300"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
              size={24}
            />
          </div>

          {/* 2x2 Grid Filter Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Row 1 - Column 1 */}
            <div className="relative group">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                size={20}
              />
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 appearance-none cursor-pointer group-hover:border-blue-300"
              />
            </div>

            {/* Row 1 - Column 2 */}
            <div className="relative group">
              <Award
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                size={20}
              />
              <select
                name="experience"
                value={filters.experience}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 appearance-none cursor-pointer group-hover:border-blue-300"
              >
                <option value="">Experience Level</option>
                <option value="pursuing">Pursuing</option>
                <option value="fresher">Fresher</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Row 2 - Column 1 */}
            <div className="relative group">
              <Briefcase
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                size={20}
              />
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 appearance-none cursor-pointer group-hover:border-blue-300"
              >
                <option value="">Category</option>
                <option value="technical">Technical</option>
                <option value="non-technical">Non-Technical</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Row 2 - Column 2 */}
            <div className="relative group">
              <Briefcase
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                size={20}
              />
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 appearance-none cursor-pointer group-hover:border-blue-300"
              >
                <option value="">Job Type</option>
                <option value="intern">Intern</option>
                <option value="fulltime">Full Time</option>
                <option value="intern+full">Intern + Full Time</option>
                <option value="parttime">Part Time</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6 flex justify-center ">
          <button
            type="submit"
            className="bg-blue-500 text-white px-8 py-3.5 rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search size={20} />
            <span className="font-medium">Search Jobs</span>
          </button>
        </div>
      </form>
    </div>
  );
}