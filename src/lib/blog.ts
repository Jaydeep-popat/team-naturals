// Blog post data — sourced from /src/content/blog/*.mdx
// Each object mirrors the MDX frontmatter of the corresponding file.
// When the site grows, this can be replaced by a CMS or gray-matter parser.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;         // ISO date string
  author: string;
  readTime: string;
  category: string;
  tags: string[];
  /** relative path inside /src/content/blog/ */
  contentFile: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-natural-cosmetics-arent-natural',
    title: 'Why Most "Natural" Cosmetics Aren\'t Actually Natural',
    description:
      'Walk into any supermarket and you\'ll see "100% natural," "pure organic," "chemical-free" everywhere. But who\'s actually checking if any of that is true? Almost no one.',
    date: '2026-08-17',
    author: 'Team Naturals',
    readTime: '7 min read',
    category: 'Ingredients & Transparency',
    tags: ['greenwashing', 'natural cosmetics', 'skincare', 'ingredients', 'clean beauty'],
    contentFile: 'why-natural-cosmetics-arent-natural.mdx',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
