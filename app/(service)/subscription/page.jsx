import Footer from '@/components/Footer'
import NavBar from '@/components/navbar'
import React from 'react'
import HeroSection from './_components/Hero'
import BenefitsSection from './_components/benefits'
import ProductsSection from './_components/products'
import ImageGallery from './_components/images'

const SubscriptionPage = () => {
  return (
    <div className='overflow-hidden'>
      <NavBar />
      <HeroSection />
      <BenefitsSection />
      <ImageGallery />
      <ProductsSection />
      <Footer />
    </div>
  )
}

export default SubscriptionPage
