import { HeroSlider } from '@/components/HeroSlider'
import { ProductGrid } from '@/components/ProductGrid'
import { products } from '@/lib/data'
import React from 'react'

function page() {
  return (
    <main>
      <HeroSlider />
      <div className="container mx-auto px-4 py-12">
        <ProductGrid products={products} title="Featured Products" />
      </div>
    </main>
  )
}

export default page