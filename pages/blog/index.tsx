import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import BlogList from '../../components/BlogList';
import { BlogPost } from '../../lib/types';
import { getSupabaseAdmin, getSupabaseClient } from '../../lib/supabase';

const PAGE_SIZE = 10;

interface BlogIndexProps {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
  searchQuery: string;
}

/**
 * Blog listing page - server-side search + pagination via URL query params.
 * Search is handled server-side so all pages are searchable, not just the current one.
 */
const BlogIndex: NextPage<BlogIndexProps> = ({ posts, total, page, totalPages, searchQuery }) => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem('q') as HTMLInputElement).value.trim();
    router.push({ pathname: '/blog', query: q ? { q } : {} });
  };

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
        <form onSubmit={handleSearch}>
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
              name="q"
              placeholder="Search articles..."
              defaultValue={searchQuery}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </form>
        {searchQuery && (
          <p className="text-slate-400 text-sm mt-2">
            Showing results for &quot;{searchQuery}&quot; — {total} found.{' '}
            <Link href="/blog" className="text-brand-400 hover:text-brand-300">Clear search</Link>
          </p>
        )}
      </div>

      {/* Blog Posts Grid */}
      <BlogList posts={posts} />

      {/* Pagination - only shown when not searching */}
      {totalPages > 1 && !searchQuery && (
        <div className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <Link
              href={{ pathname: '/blog', query: { page: page - 1 } }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              Previous
            </Link>
          )}

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <Link
                key={pageNum}
                href={{ pathname: '/blog', query: { page: pageNum } }}
                className={
                  'px-4 py-2 rounded-lg transition-colors border ' +
                  (pageNum === page
                    ? 'bg-brand-600 border-brand-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white')
                }
              >
                {pageNum}
              </Link>
            );
          })}

          {page < totalPages && (
            <Link
              href={{ pathname: '/blog', query: { page: page + 1 } }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const page = Math.max(1, parseInt((query.page as string) || '1', 10));
  const searchQuery = ((query.q as string) || '').trim();

  try {
    const client = getSupabaseAdmin() ?? getSupabaseClient();

    let q = client
      .from('blogs')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (searchQuery) {
      // Server-side search across all posts (not just current page)
      q = q.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
    } else {
      const offset = (page - 1) * PAGE_SIZE;
      q = q.range(offset, offset + PAGE_SIZE - 1);
    }

    const { data, error, count } = await q;

    if (error) {
      console.error('Error fetching posts:', error);
      return { props: { posts: [], total: 0, page, totalPages: 0, searchQuery } };
    }

    const total = count || 0;
    const totalPages = searchQuery ? 1 : Math.ceil(total / PAGE_SIZE);

    return {
      props: {
        posts: data || [],
        total,
        page,
        totalPages,
        searchQuery,
      },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { props: { posts: [], total: 0, page, totalPages: 0, searchQuery } };
  }
};

export default BlogIndex;
