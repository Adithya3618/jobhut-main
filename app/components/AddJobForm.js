'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Define constants for field options
const TECHNICAL_FIELDS = [
  'Software Developer',
  'Data Analyst',
  'Web Developer',
  'DevOps Engineer',
  'System Engineer',
  'Data Scientist',
  'QA Engineer',
  'Other'
]

const NON_TECHNICAL_FIELDS = [
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Customer Support',
  'Other'
]

export default function AddJobForm() {
  const router = useRouter()
  
  // Initialize job state with default values
  const [job, setJob] = useState({
    title: '',
    companyName: '',
    companyLogo: '',
    overview: '',
    location: '',
    salary: '',
    experience: 'pursuing',
    otherExperience: '',
    qualification: '',
    lastDate: '',
    category: 'technical',
    subCategory: '',
    otherSubCategory: '',
    jobType: 'intern',
    applyLink: '',
  })

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    // Prepare the job data
    const jobData = {
      ...job,
      experience: job.experience === 'other' ? job.otherExperience : job.experience,
      subCategory: job.subCategory === 'Other' ? job.otherSubCategory : job.subCategory,
      datePosted: new Date().toISOString(),  // Set the current date and time
      expirationDate: job.lastDate ? new Date(job.lastDate).toISOString() : null
    }

    // Validate the expirationDate
    if (jobData.expirationDate && isNaN(Date.parse(jobData.expirationDate))) {
      throw new Error('Invalid expiration date');
    }

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add job')
      }

      const result = await response.json()
      
      if (result.success) {
        alert('Job added successfully!')
        // Reset form after successful submission
        setJob({
          title: '',
          companyName: '',
          companyLogo: '',
          overview: '',
          location: '',
          salary: '',
          experience: 'pursuing',
          otherExperience: '',
          qualification: '',
          lastDate: '',
          category: 'technical',
          subCategory: '',
          otherSubCategory: '',
          jobType: 'intern',
          applyLink: '',
        })
        // Optionally, redirect to the job management page or refresh the current page
        router.push('/admin/dashboard?tab=jobs')
      } else {
        throw new Error('Failed to add job')
      }
    } catch (error) {
      console.error('Error adding job:', error)
      alert(`Error adding job: ${error.message}`)
    }
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setJob(prevJob => ({
      ...prevJob,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              {/* Job Title */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={job.title}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Company Name */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={job.companyName}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Category */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={job.category}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="technical">Technical</option>
                  <option value="non-technical">Non-Technical</option>
                </select>
              </div>

              {/* Sub-Category (Field) */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
                  Field
                </label>
                <select
                  id="subCategory"
                  name="subCategory"
                  value={job.subCategory}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Field</option>
                  {(job.category === 'technical' ? TECHNICAL_FIELDS : NON_TECHNICAL_FIELDS).map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>

              {/* Other Sub-Category */}
              {job.subCategory === 'Other' && (
                <div className="col-span-6">
                  <label htmlFor="otherSubCategory" className="block text-sm font-medium text-gray-700">
                    Specify Field
                  </label>
                  <input
                    type="text"
                    id="otherSubCategory"
                    name="otherSubCategory"
                    value={job.otherSubCategory}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              )}

              {/* Experience */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={job.experience}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="pursuing">Pursuing</option>
                  <option value="fresher">Fresher</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Other Experience */}
              {job.experience === 'other' && (
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="otherExperience" className="block text-sm font-medium text-gray-700">
                    Specify Experience
                  </label>
                  <input
                    type="text"
                    id="otherExperience"
                    name="otherExperience"
                    value={job.otherExperience}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              )}

              {/* Company Logo URL */}
              <div className="col-span-6">
                <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700">
                  Company Logo URL
                </label>
                <input
                  type="url"
                  name="companyLogo"
                  id="companyLogo"
                  value={job.companyLogo}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              {/* Job Overview */}
              <div className="col-span-6">
                <label htmlFor="overview" className="block text-sm font-medium text-gray-700">
                  Job Overview
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  rows={3}
                  value={job.overview}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Location */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={job.location}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Salary */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  value={job.salary}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Job Type */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={job.jobType}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="intern">Intern</option>
                  <option value="fulltime">Full Time</option>
                  <option value="intern+full">Intern + Full Time</option>
                  <option value="parttime">Part Time</option>
                </select>
              </div>

              {/* Last Date to Apply */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="lastDate" className="block text-sm font-medium text-gray-700">
                  Last Date to Apply
                </label>
                <input
                  type="date"
                  name="lastDate"
                  id="lastDate"
                  value={job.lastDate}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                 
                />
              </div>

              {/* Qualification */}
              <div className="col-span-6">
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  id="qualification"
                  value={job.qualification}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Apply Link */}
              <div className="col-span-6">
                <label htmlFor="applyLink" className="block text-sm font-medium text-gray-700">
                  Apply Link
                </label>
                <input
                  type="url"
                  name="applyLink"
                  id="applyLink"
                  value={job.applyLink}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Job
        </button>
      </div>
    </form>
  )
}

