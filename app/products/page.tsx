'use client'

import { ShoppingCart } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Neem & Tulsi Soap',
    price: '$8.99',
    description: 'Purifying and antibacterial soap perfect for acne-prone skin',
    ingredient: 'Neem Extract, Tulsi, Coconut Oil',
    category: 'Soaps',
  },
  {
    id: 2,
    name: 'Charcoal Detox Face Wash',
    price: '$12.99',
    description: 'Deep cleansing formula that removes impurities',
    ingredient: 'Activated Charcoal, Tea Tree Oil',
    category: 'Face Washes',
  },
  {
    id: 3,
    name: 'Rose Glow Soap',
    price: '$8.99',
    description: 'Moisturizing and soothing soap with rose petals',
    ingredient: 'Rose Petals, Shea Butter, Almond Oil',
    category: 'Soaps',
  },
  {
    id: 4,
    name: 'Aloe Vera Face Wash',
    price: '$12.99',
    description: 'Gentle and hydrating formula for sensitive skin',
    ingredient: 'Aloe Vera Gel, Cucumber, Chamomile',
    category: 'Face Washes',
  },
  {
    id: 5,
    name: 'Lavender Honey Soap',
    price: '$8.99',
    description: 'Calming soap with natural honey and lavender oil',
    ingredient: 'Lavender Oil, Raw Honey, Oat Flour',
    category: 'Soaps',
  },
  {
    id: 6,
    name: 'Green Tea Clarify Face Wash',
    price: '$12.99',
    description: 'Antioxidant-rich cleanser for brightening',
    ingredient: 'Green Tea Extract, Lemon, Green Clay',
    category: 'Face Washes',
  },
  {
    id: 7,
    name: 'Turmeric & Yogurt Soap',
    price: '$9.99',
    description: 'Anti-inflammatory soap for radiant skin',
    ingredient: 'Turmeric Powder, Yogurt, Coconut Milk',
    category: 'Soaps',
  },
  {
    id: 8,
    name: 'Gentle Milk Cleanser',
    price: '$11.99',
    description: 'Ultra-gentle cleanser for all skin types',
    ingredient: 'Goat Milk, Rice Bran, Oatmeal',
    category: 'Face Washes',
  },
]

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-primary mb-4">Our Products</h1>
          <p className="text-lg text-muted-foreground">
            Discover our complete range of natural soaps and face washes
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border"
              >
                {/* Product Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-secondary/50 to-accent/20" />

                {/* Product Info */}
                <div className="p-5">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-lg text-primary mt-2 mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Ingredient */}
                  <div className="mb-4 pb-4 border-b border-border">
                    <p className="text-xs text-muted-foreground mb-1">Key Ingredient</p>
                    <p className="text-sm font-semibold text-primary">{product.ingredient}</p>
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{product.price}</span>
                    <button className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
