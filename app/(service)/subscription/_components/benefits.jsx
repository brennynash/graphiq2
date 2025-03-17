import AnimatedText from "@/components/animatedText";
import React from "react";

const BenefitsSection = () => {
  const features = [
    {
      title: "Unlimited design requests",
      description:
        "Manage, prioritize, and adjust tasks seamlessly on Notion. Never worry about running out of design support, ensuring your needs are always met.",
    },
    {
      title: "Fast and simple",
      description:
        "Receive high-quality designs within an average of 48 hours. Our streamlined process ensures quick turnaround times, keeping your projects on track with swift and efficient service.",
    },
    {
      title: "Cost & time efficient",
      description:
        "Enjoy a fixed, adaptable rate that saves both money and time. Eliminate unnecessary meetings with seamless communication, allowing you to focus on productive and hassle-free collaboration.",
    },
    {
      title: "Flexible and scalable",
      description:
        "Pause or adjust your subscription based on current demands. Adapt the service to fit your workflow, ensuring maximum efficiency and flexibility.",
    },
    {
      title: "100% satisfaction guaranteed",
      description:
        "We will continue working until you are fully satisfied. All outcomes and designs we create belong to you, giving you complete ownership and peace of mind.",
    },
  ];

  return (
    <div className="py-2 lg:py-6">
      <div className="w-full px-4 max-lg:mx-auto lg:max-w-3xl lg:ml-auto">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="py-6 flex flex-col gap-4 items-start border-t border-neutral-grey/60 last:border-y lg:gap-8 lg:flex-row"
          >
            <div className="lg:w-1/3">
              <AnimatedText
                text={feature.title}
                textStyles="text-2xl font-bold lg:text-xl"
              />
              {/*  
              <h3 className="text-2xl font-bold lg:text-xl">{feature.title}</h3>
              */}
            </div>
            <div className="lg:w-2/3">
              <AnimatedText
                text={feature.description}
                textStyles="text-base lg:text-sm"
              />
              {/* 
              <p className="text-base lg:text-sm">
                {feature.description}
              </p>
               */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection;
