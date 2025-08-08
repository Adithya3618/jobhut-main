import Header from '../components/Header';
import Footer from '../components/Footer';
import ResumeAnalysisForm from '../components/ResumeAnalysisForm';
import PageViewWrapper from '../components/PageViewWrapper';

export const metadata = {
  title: 'Resume Analysis | JobHut',
  description: 'Analyze your resume and get personalized feedback to improve your job applications.',
};

export default function ResumeAnalysisPage() {
  return (
    <PageViewWrapper>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
          {/* Hero Section */}
          <section className="w-full max-w-3xl mx-auto text-center mb-10">
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white/70 backdrop-blur-md border border-blue-100 p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 drop-shadow-sm">AI-Powered Resume Analysis</h1>
              <p className="text-lg md:text-xl text-gray-700 mb-2">Get instant, actionable feedback on your resume and see how you match to your dream job.</p>
              <p className="text-base text-blue-500 font-medium">Upload your resume or paste its content below. Our AI will do the rest!</p>
            </div>
          </section>
          {/* Form Section */}
          <section className="w-full max-w-4xl mx-auto">
            <ResumeAnalysisForm />
          </section>
        </main>
        <Footer />
      </div>
    </PageViewWrapper>
  );
}

