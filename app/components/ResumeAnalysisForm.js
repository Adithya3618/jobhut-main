'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Briefcase, AlertCircle, CheckCircle, Star, List, ArrowRight, X } from 'lucide-react'

export default function ResumeAnalysisForm() {
  const [resumeContent, setResumeContent] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [file, setFile] = useState(null)
  const [analysisType, setAnalysisType] = useState('resume')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      setFile(null)
      return
    }
    if (selectedFile.type === 'application/pdf' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Please upload a PDF or Word document')
      setFile(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } })
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    setUploadProgress(0)
  }

  const formatAnalysisResult = (text) => {
    const sections = text.split(/(?=\d\.)/g).filter(Boolean)
    return sections.map(section => {
      const [title, ...content] = section.split('\n').filter(Boolean)
      return {
        title: title.trim(),
        content: content.join('\n').trim()
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    setError(null)
    setUploadProgress(0)
    let content = resumeContent
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        if (!response.ok) {
          const errorData = await response.json()
          // If PDF parsing fails, show a user-friendly error and enable paste fallback
          setFile(null)
          setError((errorData.error || 'File upload failed') + '\nTip: If PDF upload fails, try converting your resume to DOCX or paste the text below.')
          setIsLoading(false)
          return
        }
        const data = await response.json()
        if (data.success) {
          content = data.text
          setUploadProgress(100)
        } else {
          setFile(null)
          setError((data.error || 'Failed to extract text from file') + '\nTip: If PDF upload fails, try converting your resume to DOCX or paste the text below.')
          setIsLoading(false)
          return
        }
      } catch (error) {
        setFile(null)
        setIsLoading(false)
        setError((error.message || 'An unknown error occurred during file upload') + '\nTip: If PDF upload fails, try converting your resume to DOCX or paste the text below.')
        return
      }
    }
    if (!content) {
      setIsLoading(false)
      setError('Please provide resume content or upload a file')
      return
    }
    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: content, jobDescription: analysisType === 'job' ? jobDescription : undefined })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to analyze resume')
      }
      const data = await response.json()
      if (data.success && data.analysis) {
        setResult(formatAnalysisResult(data.analysis))
      } else {
        throw new Error(data.error || 'Invalid response from API')
      }
    } catch (error) {
      setError(error.message || 'An error occurred while analyzing the resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="relative bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-blue-200 max-w-3xl mx-auto p-6 sm:p-10 transition-all duration-300">
        {/* Stepper for Analysis Type */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-blue-50 p-1 border border-blue-100 shadow-inner">
            <button
              type="button"
              onClick={() => setAnalysisType('resume')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                analysisType === 'resume'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-transparent text-blue-700 hover:bg-blue-100'
              }`}
              aria-pressed={analysisType === 'resume'}
            >
              <FileText className="h-5 w-5" /> Resume Analysis
            </button>
            <button
              type="button"
              onClick={() => setAnalysisType('job')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                analysisType === 'job'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-transparent text-blue-700 hover:bg-blue-100'
              }`}
              aria-pressed={analysisType === 'job'}
            >
              <Briefcase className="h-5 w-5" /> Job Match
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-2">Upload Resume (PDF or DOCX)</label>
            <div
              className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-colors duration-200 ${file ? 'border-green-400 bg-green-50/70' : 'border-blue-200 bg-blue-50/60 hover:border-blue-400 hover:bg-blue-100/80'}`}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2 animate-fade-in">
                  <FileText className="w-8 h-8 text-green-600" />
                  <span className="text-green-800 font-medium">{file.name}</span>
                  <button type="button" className="text-xs text-red-600 underline mt-1 flex items-center gap-1" onClick={handleRemoveFile}><X className="inline w-4 h-4" />Remove</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 animate-fade-in">
                  <Upload className="w-8 h-8 text-blue-500" />
                  <span className="text-blue-700">Drag & drop or click to upload</span>
                  <span className="text-xs text-gray-500">Max 10MB. PDF or DOCX only.</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="text-xs text-blue-600 mt-1">Tip: If PDF upload fails, try converting your resume to DOCX or paste the text below.</div>
          </div>
          {/* OR Divider */}
          <div className="flex items-center justify-center my-2 text-blue-400 text-sm font-semibold">
            <span className="px-3">OR</span>
          </div>
          {/* Paste Resume */}
          <div>
            <label htmlFor="resumeContent" className="block text-sm font-semibold text-blue-700 mb-2">
              Paste Resume Content
            </label>
            <textarea
              id="resumeContent"
              rows={7}
              className="w-full px-4 py-3 text-blue-900 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 bg-blue-50/60"
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              placeholder="Paste your resume content here..."
              disabled={!!file}
            ></textarea>
          </div>
          {/* Job Description (if job match) */}
          {analysisType === 'job' && (
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-semibold text-blue-700 mb-2">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                rows={5}
                className="w-full px-4 py-3 text-blue-900 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 bg-blue-50/60"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
              ></textarea>
            </div>
          )}
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-md text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : 'Analyze Resume'}
            </button>
          </div>
        </form>
        {/* Error Message */}
        {error && (
          <div className="mt-7 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
          </div>
        )}
        {/* Results */}
        {result && (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 animate-fade-in">
            {result.map((section, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-100 flex flex-col gap-2 transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-blue-900 text-lg">{section.title}</span>
                </div>
                <div className="text-blue-900 whitespace-pre-line text-base leading-relaxed">{section.content}</div>
              </div>
            ))}
          </div>
        )}
        {/* Loader Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-3xl animate-fade-in">
            <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-blue-700 font-semibold text-lg">Analyzing your resume...</span>
          </div>
        )}
      </div>
      {/* Animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

