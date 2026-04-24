import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

// Layout component props
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

/**
 * Main layout wrapper for all pages
 * Includes Header, Footer, and global SEO meta tags
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'AI Bytes - Tech Insights & AI Articles',
  description = 'Explore the latest in artificial intelligence, machine learning, and technology. Byte-sized articles for curious minds.',
  ogImage = '/og-image.png',
  canonicalUrl,
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aibytez.co';
  const canonical = canonicalUrl || siteUrl;

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonical} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />

        {/* Canonical URL */}
        <link rel="canonical" href={canonical} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
        <Header />
        <main className="flex-1 container-custom py-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
