import Footer from '@/components/Footer'
import NavBar from '@/components/navbar'
import React from 'react'
import HeroSection from './_components/Hero'
import ImpactSection from './_components/Impact'
import RelationshipsSection from './_components/Relationships'

const VenturePage = () => {
  return (
    <div className='overflow-hidden'>
     <NavBar/>
     <HeroSection />
     <ImpactSection />
     <RelationshipsSection />
     <Footer/>
    </div>
  )
}

export default VenturePage
