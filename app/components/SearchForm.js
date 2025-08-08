'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, Briefcase, Award,
  GraduationCap, Building2, ChevronDown
} from 'lucide-react';

const FORM_CONFIG = {
  TECHNICAL_FIELDS: [
    'Software Developer',
    'Data Analyst',
    'Web Developer',
    'DevOps Engineer',
    'System Engineer',
    'Data Scientist',
    'QA Engineer',
    'Other'
  ],
  NON_TECHNICAL_FIELDS: [
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Customer Support',
    'Other'
  ],
  EXPERIENCE_LEVELS: [
    { value: 'pursuing', label: 'Currently Pursuing' },
    { value: 'fresher', label: 'Fresher' },
    { value: '1-3', label: '1-3 Years' },
    { value: '3-5', label: '3-5 Years' },
    { value: '5+', label: '5+ Years' }
  ],
  JOB_TYPES: [
    { value: 'intern', label: 'Internship' },
    { value: 'fulltime', label: 'Full Time' },
    { value: 'intern+full', label: 'Intern + Full Time' },
    { value: 'parttime', label: 'Part Time' },
    { value: 'contract', label: 'Contract' }
  ]
};

export default function SearchForm() {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    experience: '',
    jobType: '',
    category: '',
    subCategory: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subCategory: '' } : {})
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value)
    );
    router.push(`/jobs?${searchParams.toString()}`);
  }, [filters, router]);

  const baseInputClasses = `
    w-full
    pl-12
    pr-4
    py-3
    sm:py-3.5
    rounded-xl
    border-2
    border-gray-200
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-100
    transition-all
    duration-200
    placeholder-gray-400
    text-gray-800
  `;

  const iconClasses = `
    absolute
    left-4
    top-1/2
    -translate-y-1/2
    text-gray-400
    group-hover:text-blue-500
    transition-colors
    duration-200
  `;

  const selectClasses = `${baseInputClasses} appearance-none bg-white cursor-pointer pr-10`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl"
      >
        {/* Main Search Bar */}
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="relative group">
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Search jobs, companies, fields..."
              className="w-full pl-12 sm:pl-14 pr-12 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
              onFocus={() => setIsExpanded(true)}
            />
            <Search
              className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
              size={20}
            />
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            >
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Search Options */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 transition-all duration-500 ease-in-out ${isExpanded ? 'opacity-100 max-h-[1000px] translate-y-0' : 'opacity-0 max-h-0 -translate-y-4 overflow-hidden'
              }`}
          >
            <div className="relative group">
              <MapPin className={iconClasses} size={18} />
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Location"
                className={baseInputClasses}
              />
            </div>

            <div className="relative group">
              <Award className={iconClasses} size={18} />
              <select
                name="experience"
                value={filters.experience}
                onChange={handleChange}
                className={selectClasses}
              >
                <option value="">Experience Level</option>
                {FORM_CONFIG.EXPERIENCE_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            <div className="relative group">
              <Briefcase className={iconClasses} size={18} />
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleChange}
                className={selectClasses}
              >
                <option value="">Job Type</option>
                {FORM_CONFIG.JOB_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* Secondary Filters Row */}
            <div className="relative group md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <Building2 className={iconClasses} size={18} />
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className={selectClasses}
                  >
                    <option value="">Select Category</option>
                    <option value="technical">Technical</option>
                    <option value="non-technical">Non-Technical</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>

                <div className="relative group">
                  <GraduationCap className={iconClasses} size={18} />
                  <select
                    name="subCategory"
                    value={filters.subCategory}
                    onChange={handleChange}
                    className={`${selectClasses} ${!filters.category ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={!filters.category}
                  >
                    <option value="">Select Field</option>
                    {filters.category && (
                      filters.category === 'technical'
                        ? FORM_CONFIG.TECHNICAL_FIELDS
                        : FORM_CONFIG.NON_TECHNICAL_FIELDS
                    ).map((field) => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:justify-between">
          <div className="flex space-x-3 w-full sm:w-auto">
            <a
              href="jobs?category=technical"
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${filters.category === 'technical'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <Building2 size={18} />
              <span className="font-medium text-sm sm:text-base">Technical</span>
            </a>
            <a
              href="jobs?category=non-technical"
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${filters.category === 'non-technical'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <GraduationCap size={18} />
              <span className="font-medium text-sm sm:text-base">Non-Technical</span>
            </a>
          </div>



          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search size={18} />
            <span className="font-medium text-sm sm:text-base">Search Jobs</span>
          </button>
        </div>
      </form>
    </div>
  );
}