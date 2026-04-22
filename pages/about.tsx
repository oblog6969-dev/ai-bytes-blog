import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';

/**
 * About page - describes the AI Bytes blog mission and team
 */
const AboutPage: NextPage = () => {
  return (
    <Layout
      title="About - AI Bytes"
      description="Learn about AI Bytes: our mission, team, and approach to making AI knowledge accessible."
    >
      <div className="max-w-3xl mx-auto py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="text-brand-400">AI Bytes</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Making artificial intelligence knowledge accessible, one article at a time.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-12 bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            AI Bytes was created to bridge the gap between cutting-edge AI research and the people who
            want to understand it. We believe that artificial intelligence should not be a black box
            reserved for specialists — it should be understandable, approachable, and actionable for
            everyone.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Every article on this blog is written to give you real insight without unnecessary jargon.
            Whether you&apos;re a developer, a business professional, or simply a curious mind, you&apos;ll
            find something here worth reading.
          </p>
        </section>

        {/* What We Cover */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Machine Learning', desc: 'Foundational concepts and practical applications of ML.' },
              { title: 'Large Language Models', desc: 'Deep dives into LLMs, prompting, and fine-tuning.' },
              { title: 'AI Ethics & Safety', desc: 'The human side of building responsible AI systems.' },
              { title: 'Tools & Frameworks', desc: 'Hands-on guides for the latest AI development tools.' },
            ].map((item) => (
              <div key={item.title} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-brand-900/50 to-slate-800 rounded-2xl p-10 border border-brand-800/50">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Explore?</h2>
          <p className="text-slate-400 mb-6">
            Head over to the blog and start reading our latest articles.
          </p>
          <Link href="/blog" className="btn-primary px-8 py-3 text-lg inline-block">
            Browse Articles
          </Link>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;
