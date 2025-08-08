import React, { Suspense } from 'react'
import { use } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import CouponDetailsContent from '../../components/CouponDetailsContent'
import Loading from '../../components/Loading'
import PageViewWrapper from '../../components/PageViewWrapper'
import AdSense from '../../components/AdSense'

export const metadata = {
  title: 'Coupon Details | JobHut',
  description: 'View details and apply for exclusive coupons to enhance your learning experience.',
};

export default function CouponDetails({ params }) {
  const { id } = use(params)

  return (
    <PageViewWrapper>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* AdSense at the top of the coupon details page */}
          <AdSense adSlot="3456789012" style={{ marginBottom: '2rem' }} />

          <Suspense fallback={<Loading />}>
            <CouponDetailsContent id={id} />
          </Suspense>

          {/* AdSense at the bottom of the coupon details page */}
          <AdSense adSlot="4567890123" style={{ marginTop: '2rem' }} />
        </main>
        <Footer />
      </div>
    </PageViewWrapper>
  )
}

