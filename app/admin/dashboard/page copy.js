'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import AddJobForm from '../../components/AddJobForm'
import JobManagement from '../../components/JobManagement'
import AddCouponForm from '../../components/AddCouponForm'
import CouponManagement from '../../components/CouponManagement'
import BlogManagement from '../../components/BlogManagement'
import Loading from '../../components/Loading'
import PageViewWrapper from '../../components/PageViewWrapper'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function AdminDashboard() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('jobs')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
    } else {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <Loading />
        </div>
        <Footer />
      </div>
    )
  }

  const tabs = [
    { id: 'jobs', label: 'Manage Jobs', icon: Briefcase },
    { id: 'addJob', label: 'Add New Job', icon: PlusCircle },
    { id: 'coupons', label: 'Manage Coupons', icon: Tag },
    { id: 'addCoupon', label: 'Add New Coupon', icon: PlusCircle },
  ]

  return (
    <PageViewWrapper>
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-1 p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm
                        ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        } transition-all duration-200
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <Suspense fallback={
              <div className="flex justify-center items-center h-64">
                <Loading />
              </div>
            }>
              {activeTab === 'jobs' && <JobManagement />}
              {activeTab === 'addJob' && <AddJobForm />}
              {activeTab === 'coupons' && <CouponManagement />}
              {activeTab === 'addCoupon' && <AddCouponForm />}
            </Suspense>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
    </PageViewWrapper>
  )
}