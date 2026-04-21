import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, supabaseClient } from '../../../lib/supabase';
import { BlogPost, ApiError } from '../../../lib/types';

type ResponseData = BlogPost | ApiError;

/**
 * API Route: GET /api/blogs/[id]
 * Fetch a single blog post by ID from Supabase
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  // Validate ID parameter
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid blog ID' });
  }

  try {
    // Use admin client if available (server-side), otherwise use public client
    const client = supabaseAdmin || supabaseClient;

    const { data, error } = await client
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Record not found
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error', message: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Cache for 60 seconds
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

    return res.status(200).json(data as BlogPost);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
