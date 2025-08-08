import { getJobById } from '../lib/jobs'

export default async function JobDetails({ id }) {
  const job = await getJobById(id)

  return (
    <div className="job-details">
      <img src={job.companyLogo} alt={`${job.companyName} logo`} />
      <h2>{job.title}</h2>
      <p>Company: {job.companyName}</p>
      <p>Location: {job.location}</p>
      <p>Salary: {job.salary}</p>
      <p>Date Posted: {job.datePosted}</p>
      <p>Expiration Date: {job.expirationDate}</p>
      <p>Experience: {job.experience}</p>
      <p>Field {job.field}</p>
      <p>Qualification: {job.qualification}</p>
      <p>Last Date to Apply: {job.lastDate}</p>
      <h3>Job Overview</h3>
      <p>{job.overview}</p>
    </div>
  )
}

