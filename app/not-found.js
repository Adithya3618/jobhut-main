import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import PageViewWrapper from './components/PageViewWrapper';

export default function NotFound() {
  return (
    <PageViewWrapper>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
          <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Go back to Home
          </Link>
        </main>
        <Footer />
      </div>
    </PageViewWrapper>
  );
}

