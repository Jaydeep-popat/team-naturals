'use client'

import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    location: 'Portland, OR',
    rating: 5,
    text: 'My skin has never felt better! Finally a soap that doesn\'t dry out my sensitive skin. The rose one is my absolute favorite.',
    product: 'Rose Glow Soap',
  },
  {
    id: 2,
    name: 'James K.',
    location: 'Denver, CO',
    rating: 5,
    text: 'The natural ingredients make all the difference. Highly recommend Team Naturals! Been using for 3 months now.',
    product: 'Neem & Tulsi Soap',
  },
  {
    id: 3,
    name: 'Emma L.',
    location: 'Seattle, WA',
    rating: 5,
    text: 'Clean ingredients, amazing results. This is skincare done right. No more breakouts!',
    product: 'Charcoal Detox Face Wash',
  },
  {
    id: 4,
    name: 'Marcus T.',
    location: 'Austin, TX',
    rating: 5,
    text: 'As someone with very sensitive skin, I\'ve tried everything. This is the only product that doesn\'t irritate me.',
    product: 'Aloe Vera Face Wash',
  },
  {
    id: 5,
    name: 'Jessica P.',
    location: 'Los Angeles, CA',
    rating: 5,
    text: 'The lavender honey soap smells incredible and leaves my skin feeling so soft. Already ordered again!',
    product: 'Lavender Honey Soap',
  },
  {
    id: 6,
    name: 'David R.',
    location: 'Boston, MA',
    rating: 5,
    text: 'Worth every penny. The quality is evident from the moment you use it. Supporting a company that actually cares.',
    product: 'Turmeric & Yogurt Soap',
  },
  {
    id: 7,
    name: 'Michelle G.',
    location: 'San Francisco, CA',
    rating: 5,
    text: 'Changed my entire skincare routine. My dermatologist even noticed the improvement!',
    product: 'Green Tea Clarify Face Wash',
  },
  {
    id: 8,
    name: 'Ryan C.',
    location: 'Chicago, IL',
    rating: 5,
    text: 'Finally found a brand I trust completely. No weird chemicals, no mysteries. Just pure quality.',
    product: 'Gentle Milk Cleanser',
  },
]

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">Customer Love Stories</h1>
          <p className="text-xl text-muted-foreground">
            See what our customers are saying about Team Naturals products
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-lg p-8 border border-border shadow-sm hover:shadow-md transition"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-lg text-foreground mb-6 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>

                {/* Product Tag */}
                <div className="mb-4 pb-4 border-t border-border">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                    Used: {testimonial.product}
                  </span>
                </div>

                {/* Author */}
                <div>
                  <p className="font-bold text-primary">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">98%</p>
              <p className="text-lg text-muted-foreground">Customer Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">5.0★</p>
              <p className="text-lg text-muted-foreground">Average Rating</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">2000+</p>
              <p className="text-lg text-muted-foreground">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-primary mb-6">Join Thousands of Happy Customers</h2>
        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition">
          Shop Now
        </button>
      </section>
    </main>
  )
}
