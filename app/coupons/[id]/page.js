'use client'

import { Suspense } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CouponDetailsContent from '../../components/CouponDetailsContent';
import Loading from '../../components/Loading';
import PageViewWrapper from '../../components/PageViewWrapper'

export default function CouponDetails({ params }) {
 
  const id = params?.id || null;

  return (
    <PageViewWrapper>
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<Loading />}>
        <CouponDetailsContent id={id} />
      </Suspense>
      <Footer />
    </div>
    </PageViewWrapper>
  );
}

