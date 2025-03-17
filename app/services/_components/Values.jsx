"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ValuesSection = () => {
  const metrics = [
    {
      value: "95%",
      description:
        "Of the startups we branded are still in business and thriving",
    },
    {
      value: "40+",
      description:
        "Our startups are featured in global media, such as NY Times, Forbes, TechCrunch, Bloomberg, Hypebeast, and Business Insider",
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

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden min-h-screen px-4 py-8 lg:py-16 lg:px-12"
    >
      <h1 className="mx-auto text-center text-6xl font-tinos mb-16 max-w-[38rem] ">
        <span className="font-bold font-cabin">
          Kindness has an impact
        </span> {" "}
        in numbers
      </h1>
      <div className="mx-auto lg:px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-secondary-blue-ish p-2 md:p-6 rounded-lg flex flex-col h-[16rem] md:h-[24rem]"
            >
              <h2
                ref={(el) => (metricRefs.current[index] = el)}
                className="text-4xl md:text-7xl font-bold mb-10"
              >
                {metric.value}
              </h2>
              <p className="text-sm md:text-sm text-neutral-grey mt-auto font-tinos">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
