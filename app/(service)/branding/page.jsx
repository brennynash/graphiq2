import Footer from '@/components/Footer'
import NavBar from '@/components/navbar'
import React from 'react'
import HeroSection from './_components/Hero'
import BrandingSolutionSection from './_components/benefits'
import ProductsSection from './_components/products'

const BrandingPage = () => {
  return (
    <div className='overflow-hidden'>
      <NavBar />
      <HeroSection />
      <BrandingSolutionSection />
      <ProductsSection />
      <Footer />
    </div>
  )
}

export default BrandingPage
