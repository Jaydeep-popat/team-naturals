'use client'

import { ArrowRight, Calendar } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: '5 Skincare Myths You Need to Stop Believing',
    excerpt:
      'We\'re debunking common skincare misconceptions that could be damaging your skin. Learn the truth about natural ingredients and proper routines.',
    date: 'March 15, 2025',
    category: 'Skincare Tips',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'The Power of Neem: Ancient Remedy for Modern Skin',
    excerpt:
      'Discover why neem has been used for thousands of years and how this powerful ingredient can transform your skincare routine.',
    date: 'March 10, 2025',
    category: 'Natural Ingredients',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Your Complete Natural Skincare Routine Guide',
    excerpt:
      'Step-by-step guide to building the perfect natural skincare routine for your skin type. From morning to night, we\'ve got you covered.',
    date: 'March 5, 2025',
    category: 'Routine Guides',
    readTime: '8 min read',
  },
  {
    id: 4,
    title: 'Why Handmade Soap is Better Than Commercial Brands',
    excerpt:
      'Learn about the differences between handmade natural soap and mass-produced commercial products. Quality, ingredient transparency, and more.',
    date: 'February 28, 2025',
    category: 'Education',
    readTime: '6 min read',
  },
  {
    id: 5,
    title: 'Seasonal Skincare: Adjusting Your Routine Throughout the Year',
    excerpt:
      'Your skin\'s needs change with the seasons. Find out how to adapt your skincare routine for spring, summer, fall, and winter.',
    date: 'February 20, 2025',
    category: 'Skincare Tips',
    readTime: '6 min read',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-primary mb-4">Natural Beauty Blog</h1>
          <p className="text-xl text-muted-foreground">
            Expert tips, ingredient guides, and skincare advice for your natural beauty journey.
          </p>
        </div>
      </section>

      {/* Featured Post (First Post) */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Placeholder */}
              <div className="h-80 md:h-auto bg-gradient-to-br from-primary/10 to-accent/10" />

              {/* Content */}
              <div className="p-8 flex flex-col justify-center">
                <span className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
                  Featured Article
                </span>
                <h2 className="text-3xl font-bold text-primary mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {blogPosts[0].date}
                  </div>
                  <span>•</span>
                  <span>{blogPosts[0].readTime}</span>
                </div>
                <button className="w-fit px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2">
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-primary mb-8">Latest Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.slice(1).map((post) => (
              <div
                key={post.id}
                className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition group"
              >
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-6" />

                {/* Category */}
                <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                  {post.category}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold text-primary my-3 group-hover:text-accent transition">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4 pb-4 border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Read More Button */}
                <button className="text-accent font-semibold hover:opacity-70 transition flex items-center gap-2">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Get Expert Tips in Your Inbox</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Subscribe to our newsletter for skincare tips, ingredient spotlights, and exclusive offers.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg bg-white border-2 border-primary text-foreground placeholder-muted-foreground focus:outline-none"
            />
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
