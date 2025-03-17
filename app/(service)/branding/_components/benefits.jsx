import AnimatedText from "@/components/animatedText";
import React from "react";

const BrandingSolutionSection = () => {
  const solutions = [
    {
      title: "Brand Refresh",
      description:
        "Enhance your existing brand with a fresh touch, maintaining core elements; while bringing more clarity and consistency to your brand.",
    },
    {
      title: "Rebranding",
      description:
        "Challenge your existing brand and re-think the strategy to futureproof your identity with a bold new look, verbal identity, and strategy.",
    },
    {
      title: "Brand Expansion",
      description:
        "Expand your brand to new touchpoints, providing clear direction for growth and consistency across platforms.",
    },
    {
      title: "Renaming",
      description:
        "Reposition your brand with a new name and identity, seamlessly integrated in a rebranding process.",
    },
    {
      title: "Brand Merger",
      description:
        "Strategically align and create a shared vision when merging brands to drive momentum for the new organization.",
    },
  ];

  return (
    <div className="py-2 lg:py-6 lg:px-16">
      <div className="w-full px-4 max-lg:mx-auto lg:max-w-xl lg:ml-auto">
        {solutions.map((solution) => (
          <div
            key={solution.title}
            className="py-6 flex flex-col gap-4 items-start border-t border-neutral-grey/60 last:border-y lg:gap-8 lg:flex-row"
          >
            <div className="lg:w-1/3">
              <AnimatedText
                text={solution.title}
                textStyles="text-2xl font-bold lg:text-xl"
              />
              {/* 
              <h3 className="text-2xl font-bold lg:text-xl">
                {solution.title}
              </h3>
               */}
            </div>
            <div className="lg:w-2/3">
              <AnimatedText
                text={solution.description}
                textStyles="text-base lg:text-sm"
              />
              {/*  
              <p className="text-base lg:text-sm">
                {solution.description}
              </p>
              */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandingSolutionSection;
