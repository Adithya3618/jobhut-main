"use client"

import { useState } from "react"

const TECHNICAL_FIELDS = [
  "Software Developer",
  "Data Analyst",
  "Web Developer",
  "DevOps Engineer",
  "System Engineer",
  "Data Scientist",
  "QA Engineer",
  "Other",
]

const NON_TECHNICAL_FIELDS = ["Marketing", "Sales", "HR", "Finance", "Operations", "Customer Support", "Other"]

// Helper function to safely format date for input
const formatDateForInput = (dateValue) => {
  if (!dateValue || dateValue === null || dateValue === undefined) {
    return ""
  }

  try {
    if (typeof dateValue === "string") {
      // Handle ISO date strings
      if (dateValue.includes("T")) {
        return dateValue.split("T")[0]
      }
      // Handle date strings that are already in YYYY-MM-DD format
      if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateValue
      }
      // Try to parse other date formats
      const parsed = new Date(dateValue)
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split("T")[0]
      }
      return ""
    }

    const date = new Date(dateValue)
    if (isNaN(date.getTime())) {
      return ""
    }

    return date.toISOString().split("T")[0]
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}

export default function EditJobForm({ job, onSubmit, onCancel }) {
  const [editedJob, setEditedJob] = useState(job)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(editedJob)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedJob((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={editedJob.title}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={editedJob.companyName}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={editedJob.category}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="technical">Technical</option>
                  <option value="non-technical">Non-Technical</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
                  Field
                </label>
                <select
                  id="subCategory"
                  name="subCategory"
                  value={editedJob.subCategory}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Field</option>
                  {(editedJob.category === "technical" ? TECHNICAL_FIELDS : NON_TECHNICAL_FIELDS).map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>

              {editedJob.subCategory === "Other" && (
                <div className="col-span-6">
                  <label htmlFor="otherSubCategory" className="block text-sm font-medium text-gray-700">
                    Specify Field
                  </label>
                  <input
                    type="text"
                    id="otherSubCategory"
                    name="otherSubCategory"
                    value={editedJob.otherSubCategory || ""}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              )}

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={editedJob.experience}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="pursuing">Pursuing</option>
                  <option value="fresher">Fresher</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {editedJob.experience === "other" && (
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="otherExperience" className="block text-sm font-medium text-gray-700">
                    Specify Experience
                  </label>
                  <input
                    type="text"
                    id="otherExperience"
                    name="otherExperience"
                    value={editedJob.otherExperience || ""}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              )}

              <div className="col-span-6">
                <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700">
                  Company Logo URL
                </label>
                <input
                  type="url"
                  name="companyLogo"
                  id="companyLogo"
                  value={editedJob.companyLogo}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="overview" className="block text-sm font-medium text-gray-700">
                  Job Overview
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  rows={3}
                  value={editedJob.overview}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={editedJob.location}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  value={editedJob.salary}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={editedJob.jobType}
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

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="lastDate" className="block text-sm font-medium text-gray-700">
                  Last Date to Apply
                </label>
                <input
                  type="date"
                  name="lastDate"
                  id="lastDate"
                  value={
                    editedJob.lastDate
                      ? typeof editedJob.lastDate === "string"
                        ? editedJob.lastDate.split("T")[0]
                        : new Date(editedJob.lastDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  id="qualification"
                  value={editedJob.qualification}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="applyLink" className="block text-sm font-medium text-gray-700">
                  Apply Link
                </label>
                <input
                  type="url"
                  name="applyLink"
                  id="applyLink"
                  value={editedJob.applyLink}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}
