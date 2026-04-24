import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import Layout from '../../components/Layout';
import { BlogPost } from '../../lib/types';
import { getSupabaseAdmin, getSupabaseClient } from '../../lib/supabase';

/** Allowed HTML tags and attributes for sanitizing post content */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'strong', 'em', 'del', 'ins', 's',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    code: ['class'],
    pre: ['class'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  // Force external links to open safely
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        ...(attribs.href?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
      },
    }),
  },
};

interface NavPost {
  title: string;
  slug: string;
}

interface BlogPostPageProps {
  post: BlogPost | null;
  sanitizedContent: string;
  prevPost: NavPost | null;
  nextPost: NavPost | null;
}

/**
 * Individual blog post page.
 * Content is sanitized server-side before rendering to prevent XSS.
 */
const BlogPostPage: NextPage<BlogPostPageProps> = ({ post, sanitizedContent, prevPost, nextPost }) => {
  if (!post) {
    return (
      <Layout title="Post Not Found - AI Bytes">
        <div className="py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-slate-400 mb-8">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link href="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const siteUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aibytez.co';

  return (
    <Layout
      title={post.title + ' - AI Bytes'}
      description={post.excerpt}
      ogImage={post.featured_image}
      canonicalUrl={siteUrl + '/blog/' + post.slug}
    >
      <article className="max-w-4xl mx-auto py-8">
        {/* Back to Blog */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8 rounded-xl overflow-hidden aspect-video">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm bg-brand-900/50 text-brand-300 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {post.author?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <span>{post.author || 'Anonymous'}</span>
            </div>
            <span>•</span>
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            {post.updated_at !== post.created_at && (
              <>
                <span>•</span>
                <span>Updated {formatDate(post.updated_at)}</span>
              </>
            )}
          </div>
        </header>

        {/* Post Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-slate-400 leading-relaxed mb-8 border-l-4 border-brand-500 pl-6 italic">
            {post.excerpt}
          </p>
        )}

        {/* Post Content - sanitized server-side */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white
            prose-p:text-slate-300
            prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-code:text-brand-300 prose-code:bg-slate-800
            prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
            prose-blockquote:border-brand-500 prose-blockquote:text-slate-400
            prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Post Navigation */}
        <nav className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {prevPost && (
              <Link
                href={'/blog/' + prevPost.slug}
                className="group flex flex-col gap-1 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors max-w-xs"
              >
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </span>
                <span className="text-white font-medium group-hover:text-brand-400 transition-colors line-clamp-2">
                  {prevPost.title}
                </span>
              </Link>
            )}
            {nextPost && (
              <Link
                href={'/blog/' + nextPost.slug}
                className="group flex flex-col gap-1 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors max-w-xs ml-auto text-right"
              >
                <span className="text-slate-400 text-sm flex items-center gap-1 justify-end">
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="text-white font-medium group-hover:text-brand-400 transition-colors line-clamp-2">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      </article>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    const client = getSupabaseAdmin() ?? getSupabaseClient();

    // Fetch current post
    const { data: postData, error: postError } = await client
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (postError || !postData) {
      return { props: { post: null, sanitizedContent: '', prevPost: null, nextPost: null } };
    }

    const post = postData as BlogPost;

    // Sanitize content server-side before sending to client
    const sanitizedContent = sanitizeHtml(post.content || '', SANITIZE_OPTIONS);

    // Fetch prev post (older — created_at < current)
    const { data: prevData } = await client
      .from('blogs')
      .select('title, slug')
      .eq('published', true)
      .lt('created_at', post.created_at)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Fetch next post (newer — created_at > current)
    const { data: nextData } = await client
      .from('blogs')
      .select('title, slug')
      .eq('published', true)
      .gt('created_at', post.created_at)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    return {
      props: {
        post,
        sanitizedContent,
        prevPost: prevData ? { title: prevData.title, slug: prevData.slug } : null,
        nextPost: nextData ? { title: nextData.title, slug: nextData.slug } : null,
      },
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { props: { post: null, sanitizedContent: '', prevPost: null, nextPost: null } };
  }
};

export default BlogPostPage;
