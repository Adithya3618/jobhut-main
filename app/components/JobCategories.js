import React from 'react';
import {
  Briefcase,
  Users,
  Building2,
  Rocket,
  ArrowRight,
  CheckCircle,
  Globe,
  Target
} from 'lucide-react';
import SearchForm from './SearchForm'
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">


      {/* Hero Section */}
      <div className="pt-5 pb-5 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Dream Job is Just a
            <span className="text-blue-600"> Click Away</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Connect with top companies and find opportunities that match your skills and aspirations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <section className="mb-2 text-center">
              <SearchForm />
            </section>

          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users,  label: "Job Seekers" },
              { icon: Building2, label: "Companies" },
              { icon: Briefcase,  label: "Active Jobs" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-xl transition-shadow duration-200">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
      Why Choose <span className="text-blue-600">JobHut</span>
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          icon: Target,
          title: "Smart Matching",
          description: "AI-powered job matching based on your skills and preferences",
        },
        {
          icon: CheckCircle,
          title: "Easy Apply",
          description: "One-click application process with your saved profile",
        },
        {
          icon: Globe,
          title: "Remote First",
          description: "Access opportunities from anywhere in the world",
        },
        {
          icon: Users,
          title: "Direct Connect",
          description: "Connect directly with hiring managers",
        },
      ].map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center text-center"
        >
          <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</div>





    </div>
  );
}