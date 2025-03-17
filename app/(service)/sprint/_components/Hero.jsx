"use client";
import React from "react";

const HeroSection = () => {
  return (
    <div className="w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24 lg:mb-32">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-4">
            Launch Sprint
          </h1>
          <p className="text-xl font-kalnia md:text-xl lg:text-2xl max-w-3xl mx-auto">
            Build a high-end early-stage brand in 4 weeks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-12 lg:gap-16">
          <div className="flex flex-col justify-start lg:max-w-md">
            <h2 className="text-xl md:text-4xl font-bold mb-6">
              A smarter way to build your new brand. Suitable for young
              startups.
            </h2>
          </div>

          <div className="flex flex-col space-y-6">
            <p className="text-base md:text-lg">
              Many early stage startups, perhaps including yours, opt for
              budget-friendly branding solutions like logo generators, which can
              unintentionally undermine your brand's perceived value and
              trustworthiness. This approach often sets a self-imposed limit on
              your company's potential.
            </p>
            <p className="text-base md:text-lg">
              That's why at Serious Business, we've tailored the 'Sprint
              Package' specifically for early stage startups like yours. Our
              goal is to elevate your branding or website, ensuring it reflects
              the credibility and impact you truly deserve, ultimately helping
              you overcome these barriers and achieve remarkable success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
