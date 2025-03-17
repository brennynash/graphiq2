"use client";

import React from "react";
import { gsap } from "gsap";
import { useEffect} from "react";

const HeroSection = () => {
  const title =
    "We equip, empower and inspire tomorrow's leaders through premium branding";
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(
        ".animated-text",
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
          ease: "power2.inOut",
          duration:1,
          stagger: 0.02,
        },
        0
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="min-h-screen overflow-hidden p-4 flex items-center justify-center lg:p-8">
      <div className="max-w-3xl mx-auto">
        {title.split("<br />").map((line, index) => (
          <div
            key={index}
            className="text-center flex justify-center w-full flex-wrap gap-2 md:text-start md:justify-start md:gap-3"
          >
            {line.split(" ").map((word, idx) => (
              <span
                key={idx}
                className="animated-text text-5xl font-bold opacity-0 md:text-4xl lg:text-6xl"
                dangerouslySetInnerHTML={{ __html: word }}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
