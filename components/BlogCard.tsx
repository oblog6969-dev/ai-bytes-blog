import Link from 'next/link';
import { BlogPost } from '../lib/types';

interface BlogCardProps {
  post: BlogPost;
}

/**
 * Card component for displaying a blog post preview
 */
const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  // Format date for display
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

  return (
    <article className="card group cursor-pointer animate-fade-in">
      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-4 rounded-lg overflow-hidden aspect-video">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="space-y-3">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-brand-900/50 text-brand-300 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
          <Link href={'/blog/' + post.slug}>
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {post.author?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <span className="text-slate-400 text-sm">{post.author || 'Anonymous'}</span>
          </div>
          <time className="text-slate-500 text-sm" dateTime={post.created_at}>
            {formatDate(post.created_at)}
          </time>
        </div>

        {/* Read More Link */}
        <Link
          href={'/blog/' + post.slug}
          className="inline-flex items-center text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
        >
          Read More
          <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
