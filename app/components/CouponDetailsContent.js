'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import Loading from './Loading';
import PageViewWrapper from '../components/PageViewWrapper';

export default function CouponDetailsContent({ id }) {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchCoupon() {
      try {
        const response = await fetch(`/api/coupons/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch coupon');
        }
        const data = await response.json();
        setCoupon(data);
      } catch (error) {
        console.error('Error fetching coupon:', error);
        setError('Failed to load coupon. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCoupon();
    }
  }, [id]);

  const handleApply = () => {
    setRedirecting(true);
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      window.location.href = coupon.linkToApply;
    }, 5000);
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center p-8 bg-red-50 rounded-xl border border-red-100 max-w-md">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    </div>
  );
  if (!coupon) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-100 max-w-md">
        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Coupon not found</p>
      </div>
    </div>
  );

  return (
    <PageViewWrapper>
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl max-w-2xl mx-auto overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                {coupon.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-700 font-medium">
                    {coupon.couponId}
                  </span>
                </div>
                {coupon.validUntil && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      Valid until {new Date(coupon.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-8 space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {coupon.description}
              </p>
            </div>

            {/* Action Section */}
            <div className="space-y-4">
              {redirecting ? (
                <div className="space-y-4 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xl text-blue-800 font-medium text-center">
                    Redirecting in {countdown} seconds...
                  </p>
                  <div className="w-full bg-blue-100 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  Apply Coupon
                  <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageViewWrapper>
  );
}