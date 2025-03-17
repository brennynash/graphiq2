import React from "react";
import HeroSection from "./_components/Hero";
import NavBar from "@/components/navbar";
import WhySection from "./_components/why";
import SprintPackageSection from "./_components/packages";
import SprintProcessSection from "./_components/process";
import TestimonialsSection from "./_components/Testimonials";
import Footer from "@/components/Footer";
import ImageGallery from "./_components/images";

const SprintPage = () => {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <ImageGallery />
      <WhySection />
      <SprintPackageSection />
      <SprintProcessSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default SprintPage;
