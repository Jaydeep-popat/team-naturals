'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'

const products = [
  { id: 1, name: 'Neem & Tulsi Soap', description: 'Purifying and antibacterial', ingredient: 'Neem Extract' },
  { id: 2, name: 'Charcoal Detox Face Wash', description: 'Deep cleansing formula', ingredient: 'Activated Charcoal' },
  { id: 3, name: 'Rose Glow Soap', description: 'Moisturizing and soothing', ingredient: 'Rose Petals' },
  { id: 4, name: 'Aloe Vera Face Wash', description: 'Gentle and hydrating', ingredient: 'Aloe Vera Gel' },
]

const testimonials = [
  { name: 'Sarah M.', rating: 5, text: 'My skin has never felt better! Finally a soap that doesn\'t dry out my sensitive skin.' },
  { name: 'James K.', rating: 5, text: 'The natural ingredients make all the difference. Highly recommend Team Naturals!' },
  { name: 'Emma L.', rating: 5, text: 'Clean ingredients, amazing results. This is skincare done right.' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary mb-6 text-balance">
            Pure Natural Skincare
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Discover the power of nature with our handcrafted soaps and face washes made from organic ingredients.
          </p>
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition">
            Explore Products
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-full h-40 bg-muted rounded-lg mb-4" />
                <h3 className="font-bold text-lg text-primary mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                <p className="text-xs text-accent font-semibold">{product.ingredient}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Natural */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">Why Choose Natural?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-lg text-primary mb-2">No Harsh Chemicals</h3>
              <p className="text-muted-foreground">Only pure, organic ingredients that are gentle on your skin.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-lg text-primary mb-2">Handmade Quality</h3>
              <p className="text-muted-foreground">Crafted with care using traditional methods and modern science.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-lg text-primary mb-2">Sustainable</h3>
              <p className="text-muted-foreground">Eco-friendly packaging and ethical sourcing practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">What Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{testimonial.text}</p>
                <p className="font-semibold text-primary">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-primary mb-6">Ready to Experience Natural Skincare?</h2>
        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition">
          Shop Now
        </button>
      </section>
    </main>
  )
}
