import Link from 'next/link';
import { Tag, Clock, Percent, Ticket } from 'lucide-react';

export default function CouponCard({ coupon }) {
  const validUntil = coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : null;
  const discount = coupon.discountPercentage ? `${coupon.discountPercentage}% OFF` : 'Special Offer';
  
  return (
    <div className="group relative h-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute top-0 right-0 w-48 h-48 opacity-5 transform rotate-45 transition-transform group-hover:rotate-90 duration-700">
        <Ticket className="w-full h-full text-blue-600" />
      </div>

      {/* Enhanced Discount Badge */}
      <div className="absolute -top-3 -right-3">
        <div className="relative">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
            {discount}
          </div>
        </div>
      </div>

      {/* Enhanced Header Section */}
      <div className="p-8 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300">
              {coupon.name}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                <Tag className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-700 font-semibold">
                  {coupon.couponId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="px-8 space-y-6">
        <p className="text-gray-600 text-base leading-relaxed line-clamp-2 font-medium">
          {coupon.description}
        </p>

        <div className="flex flex-wrap gap-4 text-sm">
          {validUntil && (
            <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Valid until {validUntil}</span>
            </div>
          )}
          {coupon.category && (
            <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200">
              <Tag className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{coupon.category}</span>
            </div>
          )}
        </div>

        {coupon.terms && (
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
            <span className="font-semibold text-gray-800">Terms:</span> {coupon.terms}
          </div>
        )}
      </div>

      {/* Enhanced Footer Section */}
      <div className="p-8 mt-4">
        <Link
          href={`/coupons/${coupon._id}`}
          className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}