# AI Bytez Blog — aibytez.co

A production-ready Next.js blog platform with Supabase integration, built with TypeScript and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Language**: TypeScript (strict mode)
- **Deployment**: Vercel

## Project Structure

```
ai-bytes-blog/
├── pages/
│   ├── _app.tsx          # App wrapper with global styles
│   ├── _document.tsx     # HTML document structure
│   ├── index.tsx         # Homepage with hero + latest posts
│   ├── blog/
│   │   ├── index.tsx     # Blog listing with pagination
│   │   └── [slug].tsx    # Individual post page
│   └── api/
│       ├── blogs.ts      # GET all blogs (paginated)
│       └── blogs/[id].ts # GET single blog by ID
├── components/
│   ├── Layout.tsx        # Page wrapper with SEO
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Site footer
│   ├── BlogCard.tsx      # Blog post card
│   └── BlogList.tsx      # Grid of blog cards
├── lib/
│   ├── supabase.ts       # Supabase client setup
│   └── types.ts          # TypeScript interfaces
├── styles/
│   └── globals.css       # Global styles + Tailwind
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind CSS config
└── postcss.config.js     # PostCSS config
```

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/oblog6969-dev/ai-bytes-blog.git
cd ai-bytes-blog
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Set up Supabase

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT,
  featured_image TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public blogs are viewable by everyone"
ON blogs FOR SELECT USING (published = true);

-- Create indexes for performance
CREATE INDEX blogs_slug_idx ON blogs(slug);
CREATE INDEX blogs_created_at_idx ON blogs(created_at DESC);
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Fetch paginated blog posts |
| GET | `/api/blogs?slug=my-post` | Fetch post by slug |
| GET | `/api/blogs?page=2&limit=10` | Paginated results |
| GET | `/api/blogs/[id]` | Fetch single post by UUID |

## Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push to GitHub:
```bash
git add .
git commit -m "Initialize Next.js blog"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

## Environment Variables for Vercel

Add these in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_API_URL` | Your production URL (e.g. https://aibytez.co) |

## Features

- Responsive design (mobile-first)
- SEO optimized with Open Graph and Twitter meta tags
- ISR (Incremental Static Regeneration) on homepage
- Server-side rendering for blog listing and posts
- Pagination support (10 posts per page)
- Client-side search/filter
- Loading skeleton states
- 404 handling
- Security headers
- TypeScript strict mode

## Development Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run type-check  # Run TypeScript checks
```
