import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, supabaseClient } from '../../lib/supabase';
import { BlogPost, PaginatedBlogPosts, ApiError } from '../../lib/types';

type ResponseData = PaginatedBlogPosts | ApiError;

/**
 * API Route: GET /api/blogs
 * Fetch all blogs with pagination from Supabase
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - slug: string (filter by slug)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = '1', limit = '10', slug } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const offset = (pageNum - 1) * pageSize;

    // Use admin client if available (server-side), otherwise use public client
    const client = supabaseAdmin || supabaseClient;

    // Build query
    let query = client
      .from('blogs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Filter by slug if provided
    if (slug) {
      query = query.eq('slug', slug as string);
    } else {
      // Apply pagination only when not filtering by slug
      query = query.range(offset, offset + pageSize - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error', message: error.message });
    }

    const posts = (data as BlogPost[]) || [];
    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    // Cache for 60 seconds
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

    return res.status(200).json({
      posts,
      total,
      page: pageNum,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
