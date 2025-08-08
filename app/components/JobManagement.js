'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import EditJobForm from './EditJobForm'
import Loading from './Loading'
import { toast } from 'react-hot-toast'
import { Search, Briefcase, MapPin, Building2, Clock, Award, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function JobManagement() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingJob, setEditingJob] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)
  const jobsPerPage = 20

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [currentPage])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: jobsPerPage.toString()
      })
      const response = await fetch(`/api/jobs?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch jobs')
      const data = await response.json()
      setJobs(data.jobs)
      setTotalJobs(data.total)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to load jobs. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        setJobs(jobs.filter(job => job._id !== jobId))
        toast.success('Job deleted successfully')
      } else {
        throw new Error('Failed to delete job')
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      toast.error('Error deleting job')
    }
  }

  const handleEdit = (job) => setEditingJob(job)

  const handleEditSubmit = async (updatedJob) => {
    try {
      const response = await fetch(`/api/jobs/${updatedJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(updatedJob)
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.job) {
          setJobs(jobs.map(job => job._id === updatedJob._id ? result.job : job))
          setEditingJob(null)
          toast.success('Job updated successfully')
        } else {
          throw new Error('Failed to update job')
        }
      } else {
        throw new Error('Failed to update job')
      }
    } catch (error) {
      console.error('Error updating job:', error)
      toast.error('Error updating job')
    }
  }

  const filteredJobs = jobs.filter(job => 
    (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) return <Loading />
  if (editingJob) return <EditJobForm job={editingJob} onSubmit={handleEditSubmit} onCancel={() => setEditingJob(null)} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form onSubmit={(e) => { e.preventDefault(); }} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs available</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search terms or clear the filter</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {filteredJobs.map((job) => (
              <div 
                key={job._id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={job.companyLogo || '/placeholder.svg'}
                        alt={job.companyName || 'Company logo'}
                        width={64}
                        height={64}
                        className="rounded-lg object-contain bg-gray-50 p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                        <div className="flex items-center text-gray-500">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span className="text-sm">{job.companyName}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0">
                    <button
                      onClick={() => handleEdit(job)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-500">
                    <Award className="h-4 w-4 mr-2" />
                    <span className="text-sm">Experience: {job.experience}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Job Type: {job.jobType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-700">
          Showing {Math.min((currentPage - 1) * jobsPerPage + 1, totalJobs)} - {Math.min(currentPage * jobsPerPage, totalJobs)} of {totalJobs} jobs
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage * jobsPerPage >= totalJobs}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}