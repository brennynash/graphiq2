import React from 'react'
import Footer from '@/components/Footer';
import NavBar from '@/components/navbar';
import HeroSection from './_components/Hero';
import WhenSection from './_components/When';
import VideoSection from './_components/Video';
import WhySection from './_components/Why';
import ValuesSection from './_components/Values';
import TestimonialsSection from './_components/Testimonials';
import BrandsSection from './_components/Brands';
import Services from '@/components/Services';

const ServicesPage = () => {
  return (
    <main className="relative min-h-screen">
      <NavBar />
      <HeroSection/>
      <WhenSection/>
      <VideoSection/>
      <Services/>
      <WhySection/>
      <ValuesSection/>
      <TestimonialsSection/>
      <BrandsSection/>
      <Footer />
    </main>
  );
}

export default ServicesPage
