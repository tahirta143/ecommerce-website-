import { HeroSlider } from '@/components/HeroSlider'
import { ProductGrid } from '@/components/ProductGrid'
import React from 'react'

function page() {
  return (
    <main>
      <HeroSlider />
      <div className="container mx-auto px-4 py-12">
        <ProductGrid title="Featured Products" />
      </div>
    </main>
  )
}

export default page