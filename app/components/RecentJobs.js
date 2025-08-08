'use client'

import { useState, useEffect } from 'react'
import JobCard from './JobCard'
import Loading from './Loading'

export default function RecentJobs() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/recent-jobs')
        if (!response.ok) {
          throw new Error('Failed to fetch recent jobs')
        }
        const data = await response.json()
        setJobs(data)
      } catch (error) {
        console.error('Error fetching recent jobs:', error)
        setError('Failed to load recent jobs. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!jobs.length) {
    return (
      <div className="text-center text-gray-500">
        No jobs available at the moment.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map(job => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  )
}

