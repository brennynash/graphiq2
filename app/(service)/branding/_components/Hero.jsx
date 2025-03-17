"use client";
import AnimatedText from "@/components/animatedText";
import React from "react";

const HeroSection = () => {
  return (
    <div className="w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24 lg:mb-32">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-4">
            Branding projects
          </h1>
          <p className="text-xl font-kalnia md:text-xl lg:text-2xl max-w-3xl mx-auto">
            our branding services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-12 lg:gap-16">
          <div className="flex flex-col justify-start lg:max-w-md">
            <AnimatedText
              text="Strategic brand solutions at every business stage"
              textStyles="text-lg leading-tight md:text-4xl font-bold mb-6 max-md:max-w-52"
            />
            {/*  
            <h2 className="text-lg leading-tight md:text-4xl font-bold mb-6 max-md:max-w-52">
              Strategic brand solutions at every business stage
            </h2>
            */}
          </div>

          <div className="flex flex-col space-y-6">
            <AnimatedText
              text="In today's market, your startup's success hinges on capturing the intrest of key stakeholders: invesors, customers, and top-tier talent. However, a frequent stumbling block lies in the initial branding choices."
              textStyles="text-lg"
            />
            {/*  
            <p className="text-lg">
              In today's market, your startup's success hinges on capturing the intrest of key stakeholders: invesors, customers, and top-tier talent. However, a frequent stumbling block lies in the initial branding choices.
            </p>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
