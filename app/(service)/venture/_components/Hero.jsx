"use client";
import React from "react";

const HeroSection = () => {
  return (
    <div className="w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24 lg:mb-32">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-4">
            Venture
          </h1>
          <p className="text-xl font-kalnia md:text-xl lg:text-2xl max-w-3xl mx-auto">
            Our investment approach
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 lg:px-16 lg:min-h-[80vh]">
          <div className="space-y-2 flex flex-col justify-between px-6 border-l border-neutral-grey/60">
            <div>
              <h2 className="text-lg md:text-3xl font-bold mb-6">
                Work for equity or revenue share
              </h2>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>
                  Branding & Design Services and Operational Support for 1-3
                  years
                </li>
                <li>Strategic Brandbuilding Partner in the long-terms</li>
                <li>
                  Access to 12 brand experts with different specializations and
                  a global network of creatives and markteers
                </li>
              </ul>
            </div>
            <p className="text-9xl font-bold mt-auto">01</p>
          </div>

          <div className="space-y-2 flex flex-col justify-between px-6 border-neutral-grey/60 lg:border-x  max-lg:border-l">
            <div >
              <h2 className="text-lg md:text-xl font-bold mb-6">Focus</h2>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li>Early-stage (Pre-Seed & Seed)</li>
                <li>Co-investing during or after funding around</li>
                <li>B2C & B2B</li>
                <li>Europe & US</li>
                <li>
                  Fashion, Consumer Goods, Green Tech, FinTech, Industry 4.0
                </li>
              </ul>
            </div>
            <p className="text-9xl font-bold">02</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
