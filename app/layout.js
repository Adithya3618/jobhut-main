import './globals.css';
import Script from 'next/script';
import GoogleTagManagerNoscript from './components/GoogleTagManagerNoscript';

export const metadata = {
  metadataBase: new URL('https://jobhut.com'),
  title: {
    default: 'JobHut - Find Your Dream Job | Top Job Search Platform',
    template: '%s | JobHut - Professional Job Search Platform'
  },
  description: 'JobHut: Your comprehensive job search platform featuring thousands of verified technical and non-technical positions. Access detailed job descriptions, salary insights, and company information. Find and apply to your ideal career opportunity today.',
  keywords: [
    'jobs', 'career opportunities', 'employment', 'job search', 'job listing',
    'technical jobs', 'non-technical jobs', 'remote jobs', 'full-time jobs',
    'part-time jobs', 'entry level jobs', 'senior positions', 'IT jobs',
    'software jobs', 'engineering jobs', 'professional careers', 'job portal',
    'career development', 'job application', 'hiring platform'
  ],
  authors: [{ name: 'JobHut', url: 'https://jobhut.com' }],
  generator: 'Next.js',
  applicationName: 'JobHut',
  referrer: 'origin-when-cross-origin',
  creator: 'JobHut Team',
  publisher: 'JobHut',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'job portal',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://jobhut.com/',
    siteName: 'JobHut',
    title: 'JobHut - Your Gateway to Professional Success',
    description: 'Discover thousands of job opportunities across various industries. JobHut connects talented professionals with leading employers worldwide.',
    images: [
      {
        url: 'https://github.com/saibadarinadh/jobHut/blob/main/public/LOGO.jpg?raw=true',
        width: 1200,
        height: 630,
        alt: 'JobHut - Professional Job Search Platform',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jobhut',
    creator: '@jobhut',
    title: 'JobHut - Find Your Dream Job',
    description: 'Your premier destination for professional job opportunities. Browse, apply, and advance your career with JobHut.',
    images: ['https://github.com/saibadarinadh/jobHut/blob/main/public/LOGO.jpg?raw=true'],
  },
  icons: {
    icon: [
      { url: 'https://github.com/saibadarinadh/jobHut/blob/main/public/LOGO.jpg?raw=true', sizes: '32x32', type: 'image/jpg' },
      { url: 'https://github.com/saibadarinadh/jobHut/blob/main/public/LOGO.jpg?raw=true', sizes: '192x192', type: 'image/jpg' }
    ],
    shortcut: 'https://github.com/saibadarinadh/jobHut/blob/main/public/LOGO.jpg?raw=true',
    apple: 'https://github.com/saibadarinadh/jobHut/blob/main/public/LOGO.jpg?raw=true',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: 'https://github.com/saibadarinadh/jobHut/blob/main/public/LOGO.jpg?raw=true'
    },
  },
  canonical: 'https://jobhut.com',
  alternates: {
    canonical: 'https://jobhut.com',
    languages: {
      'en-US': 'https://jobhut.com/en-US',
    },
  },
  verification: {
    google: 'google-site-verification=your_verification_code',
    other: {
      me: ['saibadarinadh@jobhut.com']
    }
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="google-adsense-account" content="ca-pub-2508731961979474" />

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5VRB6HMK');
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-KF8PF5C3XD"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KF8PF5C3XD', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2508731961979474"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Multi Tag Ad Script */}
        <Script id="multi-tag-ad" strategy="afterInteractive">
          {`
            (function(d,z,s){s.src='https://'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('vemtoutcheeg.com',8812911,document.createElement('script'));
          `}
        </Script>
        <Script id="additional-multi-tag-ad" strategy="afterInteractive">
          {`
            (function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('groleegni.net',8821479,document.createElement('script'));
          `}
        </Script>
      </head>
      <body>
        <GoogleTagManagerNoscript />
        {children}
      </body>
    </html>
  );
}
