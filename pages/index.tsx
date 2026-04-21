import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import { BlogPost } from '../lib/types';

interface HomePageProps {
  latestPosts: BlogPost[];
}

/**
 * Homepage - Shows hero section and latest blog posts
 */
const HomePage: NextPage<HomePageProps> = ({ latestPosts }) => {
  return (
    <Layout
      title="AI Bytes - Artificial Intelligence Insights"
      description="Explore the latest in AI, machine learning, and emerging technology. Bite-sized articles for curious minds."
    >
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-900/50 text-brand-300 text-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></span>
            New articles every week
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            AI <span className="text-brand-400">Insights</span>{' '}
            <br />Made Simple
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore artificial intelligence, machine learning, and emerging technologies
            through clear, engaging articles written for curious minds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog" className="btn-primary text-center px-8 py-3 text-lg">
              Read the Blog
            </Link>
            <Link href="/about" className="btn-secondary text-center px-8 py-3 text-lg">
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Latest Articles</h2>
            <p className="text-slate-400 mt-1">Fresh insights from the AI world</p>
          </div>
          <Link
            href="/blog"
            className="text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors"
          >
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700">
            <p className="text-slate-400 text-lg">No articles yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="bg-gradient-to-r from-brand-900/50 to-slate-800 rounded-2xl p-12 text-center border border-brand-800/50">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Up to Date
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Don&apos;t miss our latest articles on AI, machine learning, and technology.
            Explore our full blog for in-depth coverage.
          </p>
          <Link href="/blog" className="btn-primary px-8 py-3 text-lg inline-block">
            Explore All Articles
          </Link>
        </div>
      </section>
    </Layout>
  );
};

/**
 * Fetch latest 3 blog posts at build time
 */
export const getStaticProps: GetStaticProps = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(apiUrl + '/api/blogs?limit=3&page=1');

    if (!response.ok) {
      return { props: { latestPosts: [] }, revalidate: 60 };
    }

    const data = await response.json();
    return {
      props: { latestPosts: data.posts || [] },
      // Regenerate page every 60 seconds
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return { props: { latestPosts: [] }, revalidate: 60 };
  }
};

export default HomePage;
