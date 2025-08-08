import React from 'react';
import { Flame } from 'lucide-react';
import Link from 'next/link';

const trendingTopics = [
  'React Interview Questions',
  'Remote Work Tips',
  'Resume Building',
  'Tech Career Growth',
  'AI in Recruitment',
  'Job Search Strategies',
  'Work-Life Balance',
  'Latest in Web Development',
];

export default function TrendingTopics() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 sticky top-24 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="text-orange-500 w-6 h-6 animate-pulse" />
        <h2 className="text-xl font-bold text-gray-800">Trending Topics</h2>
      </div>
      <ul className="space-y-3">
        {trendingTopics.map((topic, idx) => (
          <li key={idx}>
            <Link
              href={`/blogs?search=${encodeURIComponent(topic)}`}
              className="block px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium text-gray-700"
            >
              {topic}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 