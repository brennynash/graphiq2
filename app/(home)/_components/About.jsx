"use client"

import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AnimatedTitle from "@/components/animatedTitle";
import AnimatedButton from "@/components/animatedButton";
import { useRouter } from "next/navigation";

const facts = [
  {
    number: "40+",
    text: "global media features, including the New York Times, Forbes, TechCrunch, Bloomberg, and Hypebeast.",
  },
  {
    number: "100K+",
    text: "happy customers served across our platform worldwide.",
  },
  {
    number: "200",
    text: "support team available to assist clients in multiple languages.",
  },
];

export default function About() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const router = useRouter();

  const timerRef = useRef(null);
  const factNumberRef = useRef(null);
  const factContentRef = useRef(null);
  const factCountRef = useRef(null); 

  const handleNext = () => {
    setCurrentFactIndex((prev) => (prev + 1) % facts.length);
  };

  const handlePrev = () => {
    setCurrentFactIndex((prev) => (prev - 1 + facts.length) % facts.length);
  };

  return (
    <div className="overflow-hidden px-6 py-4 relative lg:px-12 lg:py-16">
      <div className="flex flex-col items-start gap-8 lg:gap-16 lg:flex-row">
        {/* Facts Section */}
        <div className="w-full max-w-md lg:w-[20%]">
          <div className="py-2 border-b border-neutral-grey flex items-center justify-between">
            <h1 className="text-xs font-semibold uppercase">
              Serious Facts
            </h1>
            <span className="text-xsflex gap-2">
              <span ref={factCountRef}>
                {String(currentFactIndex + 1).padStart(2, "0")}
              </span>
              <span> / </span>
              <span>{String(facts.length).padStart(2, "0")}</span>
            </span>
          </div>

          <div className="mb-4 h-[120px]" ref={factContentRef}>
            <p className="text-6xl font-bold mb-2" ref={factNumberRef}>
              {facts[currentFactIndex].number}
            </p>
            <p className="text-sm">
              {facts[currentFactIndex].text}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border transition-colors"
              aria-label="Previous fact"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border transition-colors relative"
              aria-label="Next fact"
            >
              <ArrowRight size={16} />
              <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  ref={timerRef}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[70%] lg:px-6">
          {/* Heading */}
          <AnimatedTitle title="Crafting premium brands for startups that make people smile" />
          {/* About Button */}
          <AnimatedButton title="About us" containerStyles="bg-white" onClick={()=>router.push("/about")}/>
        </div>
      </div>
    </div>
  );
}
