import type { Metadata } from 'next';
import { BlogPageClient } from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog & Stories | Team Naturals – Honest Skincare Insights',
  description:
    'Read honest articles, ingredient breakdowns, and stories behind cold-process handmade soaps from the Team Naturals workshop in Morbi, Gujarat.',
};

export default function BlogListingPage() {
  return <BlogPageClient />;
}
