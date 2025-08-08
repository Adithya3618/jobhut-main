'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import JobCard from './JobCard';
import ApplyButton from './ApplyButton';
import Loading from './Loading';
import { Calendar, MapPin, Building2, Cpu, BadgeDollarSign, Clock, Users, User2, GraduationCap, Share2 } from 'lucide-react';

export default function JobDetailsContent({ id }) {
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const jobResponse = await fetch(`/api/jobs/${id}`);
        const jobData = await jobResponse.json();
        setJob(jobData);

        if (jobData && jobData.subCategory) {
          const similarResponse = await fetch(`/api/jobs/similar?category=${encodeURIComponent(jobData.subCategory)}`);
          const similarData = await similarResponse.json();
          setSimilarJobs(Array.isArray(similarData) ? similarData : []);
        } else {
          setSimilarJobs([]);
        }

        const recentResponse = await fetch('/api/recent-jobs');
        const recentData = await recentResponse.json();
        setRecentJobs(Array.isArray(recentData) ? recentData : []);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setJob(null);
        setSimilarJobs([]);
        setRecentJobs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.companyName}`,
          url: url
        });
      } catch (err) {
        console.log('Share failed:', err);
        await navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!job) {
    return <div className="container mx-auto px-4 py-8">Job not found</div>;
  }

  const datePosted = job.datePosted ? new Date(job.datePosted).toLocaleDateString() : 'N/A';
  const lastDate = job.lastDate ? new Date(job.lastDate).toLocaleDateString() : 'N/A';

  const getJobTypeBadgeColor = (type) => {
    if (!type || typeof type !== 'string') {
      return 'bg-gray-100 text-gray-800';
    }
    const colors = {
      intern: 'bg-purple-100 text-purple-800',
      fulltime: 'bg-green-100 text-green-800',
      'intern+full': 'bg-blue-100 text-blue-800',
      parttime: 'bg-orange-100 text-orange-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      {/* Job Header Section */}
      <div className="bg-white shadow-sm rounded-lg mb-6">
        <div className="relative">
          <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg" />
          <div className="px-8 pb-6 relative">
            <div className="absolute -top-12">
              <div className="w-24 h-24 bg-white rounded-lg shadow-md p-2">
                <Image
                  src={job.companyLogo || '/placeholder.svg'}
                  alt={`${job.companyName || 'Company'} logo`}
                  width={96}
                  height={96}
                  className="rounded-lg object-contain"
                />
              </div>
            </div>
            <div className="pt-16">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeBadgeColor(job.jobType)}`}>
                  {job.jobType === 'intern+full' ? 'Intern + Full Time' :
                    (job.jobType && typeof job.jobType === 'string' ? job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1) : 'N/A')}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-600">
                <span className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  {job.companyName}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {job.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Posted: {datePosted}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="whitespace-pre-line">{job.overview}</p>
            </div>
            {/* Apply Button Centered */}
            <div className="text-center mt-8">
              <ApplyButton
                applyLink={job.applyLink}
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-lg shadow-xl transform hover:scale-105 transition duration-200 text-lg font-semibold"
              />
              <p className="mt-4 text-gray-500 text-sm italic">Click above to start your journey with us!</p>
            </div>
          </div>
        </div>

        {/* Right Column - Job Information */}
        <div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6">Job Details</h3>
            <ul className="space-y-4">
              {[
                { label: 'Date Posted', value: datePosted, icon: <Calendar size={20} /> },
                { label: 'Location', value: job.location, icon: <MapPin size={20} /> },
                { label: 'Salary', value: job.salary, icon: <BadgeDollarSign size={20} /> },
                { label: 'Expiration Date', value: lastDate, icon: <Clock size={20} /> },
                { label: 'Experience', value: job.experience, icon: <Users size={20} /> },
                { label: 'Field', value: job.subCategory, icon: <User2 size={20} /> },
                { label: 'Qualification', value: job.qualification, icon: <GraduationCap size={20} /> },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <p className="font-medium text-gray-800">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            {/* Replace the existing share button div with this */}
<div className="mt-4 border-t pt-4">
  <button 
    onClick={handleShare}
    className="w-full flex items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 px-4 rounded-lg transition-all duration-200 group"
  >
    <Share2 size={18} className="group-hover:rotate-12 transition-transform duration-200" />
    <span className="font-medium">Share Position</span>
  </button>
</div>
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      {similarJobs.length > 0 && (
        <section className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Similar Jobs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarJobs.map((similarJob) => (
              <JobCard key={similarJob._id} job={similarJob} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Jobs Section */}
      {recentJobs.length > 0 && (
        <section className="mt-16 bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">Recently Added Jobs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentJobs.map((recentJob) => (
              <JobCard key={recentJob._id} job={recentJob} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
