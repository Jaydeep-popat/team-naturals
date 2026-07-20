'use client'

import { Mail, Phone, MapPin } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission would be handled here
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            Have questions about our products? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            {/* Email */}
            <div className="bg-card rounded-lg p-6 border border-border mb-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1">Email</h3>
                  <p className="text-muted-foreground">hello@teamnaturals.com</p>
                  <p className="text-sm text-muted-foreground">We&apos;ll respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-card rounded-lg p-6 border border-border mb-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1">Phone</h3>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                  <p className="text-sm text-muted-foreground">Mon–Fri, 9am–5pm EST</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1">Office</h3>
                  <p className="text-muted-foreground">123 Natural Lane</p>
                  <p className="text-muted-foreground">Portland, OR 97201</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card rounded-lg p-8 border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-semibold text-primary mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="How can we help?"
                  required
                />
              </div>

              {/* Message */}
              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-semibold text-primary mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Tell us more..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
              >
                Send Message
              </button>

              {/* Success Message */}
              {submitted && (
                <div className="mt-4 p-4 bg-secondary/20 rounded-lg border border-secondary">
                  <p className="text-primary font-semibold">
                    ✓ Thank you! Your message has been sent. We&apos;ll get back to you soon.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Are your products vegan and cruelty-free?',
                a: 'Yes! All Team Naturals products are 100% vegan and cruelty-free. We don\'t test on animals and use only plant-based ingredients.',
              },
              {
                q: 'Can I use these products if I have sensitive skin?',
                a: 'Absolutely. Our products are specifically formulated for sensitive skin. However, if you have specific allergies, please review the ingredient list carefully.',
              },
              {
                q: 'How long do the soaps last?',
                a: 'A bar of soap typically lasts 4-6 weeks with regular use. Our handmade formula is long-lasting and durable.',
              },
              {
                q: 'Do you offer international shipping?',
                a: 'Yes, we ship to most countries worldwide! Shipping times and costs vary by location.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-bold text-primary mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
