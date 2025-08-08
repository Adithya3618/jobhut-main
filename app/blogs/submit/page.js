import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BlogSubmissionForm from '../../components/BlogSubmissionForm'
import PageViewWrapper from '../../components/PageViewWrapper'

export const metadata = {
  title: 'Submit a Blog | JobHut',
  description: 'Share your thoughts, experiences, or articles with the JobHut community.',
};

export default function SubmitBlogPage() {
  return (
    <PageViewWrapper>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Submit a Blog</h1>
          <div className="max-w-2xl mx-auto">
            <BlogSubmissionForm />
          </div>
        </main>
        <Footer />
      </div>
    </PageViewWrapper>
  )
}

