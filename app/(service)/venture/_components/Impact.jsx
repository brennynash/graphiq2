"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ImpactSection = () => {
  const metrics = [
    {
      value: "95%",
      description:
        "Of our customers are still in business and thriving",
    },
    {
      value: "15+",
      description:
        "Access contacts to VC's in the European and US funding landscape within our network",
    },
    {
      value: "100+",
      description:
        "Startups we've helped on their growth journey over the past 8 years",
    },
    {
      value: "250M€",
      description:
        "Of funding subsequently collected over the past 2 years from renowned investors such as Y-Combinator, Atomico, and Project A",
    },
  ];

  const sectionRef = useRef(null);
  const metricRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      metricRefs.current.forEach((el, index) => {
        const { value } = metrics[index];

        // Extract numeric and suffix part
        const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
        const suffix = value.replace(/[\d.]/g, "");

        gsap.fromTo(
          el,
          { textContent: 0 },
          {
            textContent: numericValue,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%", // Trigger when 80% of the element is in view
              once: true, // Ensures it plays once
            },
            snap: { textContent: 1 }, // Rounds numbers smoothly
            onUpdate: function () {
              el.innerHTML = Math.round(this.targets()[0].textContent) + suffix;
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden min-h-screen px-4 py-8 lg:py-16 lg:px-12"
    >
      <h1 className="mx-auto text-start text-6xl font-bold mb-16 max-w-[38rem] lg:text-center">
          Impact of projects in numbers
      </h1>
      <div className="mx-auto lg:px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-neutral-white p-2 lg:p-6 rounded-lg flex flex-col h-[14rem] md:h-[24rem]"
            >
              <h2
                ref={(el) => (metricRefs.current[index] = el)}
                className="text-4xl md:text-7xl font-bold mb-10"
              >
                {metric.value}
              </h2>
              <p className="text-xs md:text-sm text-neutral-grey mt-auto font-tinos">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
