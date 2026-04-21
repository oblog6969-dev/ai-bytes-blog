// TypeScript interfaces for the AI Bytes Blog

/**
 * Represents a blog post from Supabase
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
  featured_image?: string;
  tags?: string[];
  published?: boolean;
}

/**
 * Paginated response for blog posts
 */
export interface PaginatedBlogPosts {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * API error response
 */
export interface ApiError {
  error: string;
  message?: string;
}

/**
 * Site metadata
 */
export interface SiteMetadata {
  title: string;
  description: string;
  url: string;
  ogImage?: string;
}
