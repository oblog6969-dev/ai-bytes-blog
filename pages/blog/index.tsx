import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import Layout from '../../components/Layout';
import BlogList from '../../components/BlogList';
import { BlogPost } from '../../lib/types';

const PAGE_SIZE = 10;

interface BlogIndexProps {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Blog listing page - shows all blog posts with pagination
 */
const BlogIndex: NextPage<BlogIndexProps> = ({ posts, total, page, totalPages }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side filtering by title/excerpt
  const filteredPosts = searchQuery.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  return (
    <Layout
      title="Blog - AI Bytes | All Articles"
      description="Browse all our articles on artificial intelligence, machine learning, and technology."
    >
      {/* Header */}
      <div className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          All <span className="text-brand-400">Articles</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          {total} article{total !== 1 ? 's' : ''} covering AI, ML, and tech topics
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Blog Posts Grid */}
      <BlogList posts={filteredPosts} />

      {/* Pagination */}
      {totalPages > 1 && !searchQuery && (
        <div className="flex justify-center gap-2 mt-12">
          {/* Previous */}
          {page > 1 && (
            <a
              href={'/blog?page=' + (page - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              Previous
            </a>
          )}

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <a
                key={pageNum}
                href={'/blog?page=' + pageNum}
                className={'px-4 py-2 rounded-lg transition-colors border ' +
                  (pageNum === page
                    ? 'bg-brand-600 border-brand-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                  )
                }
              >
                {pageNum}
              </a>
            );
          })}

          {/* Next */}
          {page < totalPages && (
            <a
              href={'/blog?page=' + (page + 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              Next
            </a>
          )}
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const page = parseInt((query.page as string) || '1', 10);

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(
      apiUrl + '/api/blogs?page=' + page + '&limit=' + PAGE_SIZE
    );

    if (!response.ok) {
      return { props: { posts: [], total: 0, page, totalPages: 0 } };
    }

    const data = await response.json();
    return {
      props: {
        posts: data.posts || [],
        total: data.total || 0,
        page,
        totalPages: data.totalPages || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { props: { posts: [], total: 0, page, totalPages: 0 } };
  }
};

export default BlogIndex;
