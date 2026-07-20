'use client'

import { Check } from 'lucide-react'

const values = [
  { title: 'Natural Ingredients', description: 'We use only certified organic ingredients, never harsh chemicals.' },
  { title: 'Handmade Quality', description: 'Each product is crafted with care using traditional methods.' },
  { title: 'Cruelty-Free', description: 'No animal testing, vegan-friendly formulations.' },
  { title: 'Sustainable Practices', description: 'Eco-friendly packaging and responsible sourcing.' },
  { title: 'Transparency', description: 'Full ingredient lists, no hidden secrets.' },
  { title: 'Community Focused', description: 'Supporting local farmers and fair-trade partnerships.' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-primary mb-6">Our Story</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Team Naturals was born from a passion for clean skincare and a commitment to the earth.
            What started as a small home project has blossomed into a mission to bring authentic,
            natural beauty products to everyone.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg" />
            <div>
              <h2 className="text-4xl font-bold text-primary mb-6">The Beginning</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Our founder discovered that conventional skincare products were filled with synthetic chemicals
                that often did more harm than good. Inspired by nature and backed by research, she started
                experimenting with natural formulations in her kitchen.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The results were remarkable. Friends and family couldn't get enough. What started as gifts
                became a passion, and Team Naturals was officially born.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-4 text-center">Our Mission & Values</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We believe in skincare that nourishes both your skin and the planet.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-card rounded-lg border border-border">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg p-8 border border-border">
            <h3 className="text-2xl font-bold text-primary mb-4">A Note from Our Founder</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Every product we create starts with a simple question: &quot;Would I use this on myself?&quot;
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              The answer is always yes. Because we believe that skincare shouldn't be a compromise between
              what's good for you and what's good for the planet. With Team Naturals, it never has to be.
            </p>
            <div>
              <p className="font-semibold text-primary mb-1">With gratitude,</p>
              <p className="font-semibold text-primary">The Team Naturals Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-primary mb-6">Join Our Natural Beauty Movement</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience the difference that truly natural skincare can make.
        </p>
        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition">
          Explore Our Products
        </button>
      </section>
    </main>
  )
}
