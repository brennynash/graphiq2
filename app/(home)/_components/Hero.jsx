"use client";

import EmbossedLogo from "@/components/embossedLogo";
import React, { useRef } from "react";

const Hero = () => {
  const heroRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);

  return (
    <div ref={heroRef} id="hero" className="overflow-hidden relative pb-8">
      <div className="relative min-h-screen">
        <div className="w-full flex items-center justify-center max-lg:h-screen max-lg:flex-col max-lg:gap-32">
          <EmbossedLogo />
          <div className="mx-auto space-x-2 font-standard text-center mt-6 lg:hidden">
            <p className="text-[28px] font-outfit font-semibold">Branding and design agency</p>
            <p className="text-3xl font-light max-w-sm">Agency for startups and scaleups</p>
          </div>
        </div>
        <div className="relative w-full lg:h-screen">
          <div
            ref={videoContainerRef}
            className="w-full h-full rounded-lg"
          >
            <video
              ref={videoRef}
              preload="none"
              playsInline
              muted
              loop
              src="/assets/videos/hero-video.mp4"
              className="absolute inset-0 rounded-lg"
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
