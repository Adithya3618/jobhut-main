'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import JobCard from './JobCard';
import Loading from './Loading';

export default function JobList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const jobsPerPage = 20;
  const searchParams = useSearchParams();

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const queryString = new URLSearchParams(searchParams.toString());
        queryString.set('page', currentPage.toString());
        queryString.set('limit', jobsPerPage.toString());
        
        const response = await fetch(`/api/jobs?${queryString.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data.jobs || []);
        setTotalJobs(data.total || 0);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
        setTotalJobs(0);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams, currentPage, jobsPerPage]);

  if (loading) {
    return <Loading />;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No jobs found.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
      <div className="mt-4 text-center text-gray-600">
        Showing {(currentPage - 1) * jobsPerPage + 1} - {Math.min(currentPage * jobsPerPage, totalJobs)} of {totalJobs} jobs
      </div>
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

