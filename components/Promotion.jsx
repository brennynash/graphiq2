"use client";

import { useProjectForm } from "@/strore/useProjectForm";
import gsap from "gsap";
import { CornerDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

const PromotionCard = ({
  title,
  subtitle,
  features = [],
  isDark = false,
  className = "",
  onClick,
}) => {
  const arrowRef = useRef(null);
  const textRef = useRef(null);

  const handleHover = (isEntering) => {
    if (arrowRef.current && textRef) {
      gsap.to(textRef.current, {
        x: isEntering ? "0" : "-36",
        duration: 1,
        ease: "power2.inOut",
      });
      gsap.to(arrowRef.current, {
        x: isEntering ? "0" : "-40",
        opacity: isEntering ? 1 : 0,
        duration: 1,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <div
      className={`
      p-8 rounded-xl flex flex-col justify-between min-h-[400px] 
      transition-transform duration-300 hover:scale-[1.02] cursor-pointer
      ${isDark ? "bg-zinc-900 text-white" : "bg-purple-200 text-zinc-900"}
      ${className}
    `}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={onClick}
    >
      <div>
        <div className="mb-4">
          {subtitle && <div className="mb-2 text-lg">{subtitle}</div>}
          {features.map((feature, index) => (
            <div key={index} className="text-lg font-light">
              {feature}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-current pt-6 mt-auto">
        <div className="flex text-4xl font-light">
          <div ref={arrowRef} className="opacity-0">
            <CornerDownRight size={36} />
          </div>
          <span ref={textRef} className="-translate-x-9">{title}</span>
        </div>
      </div>
    </div>
  );
};

const Promotion = () => {
  const router = useRouter();
  const { openForm } = useProjectForm();

  return (
    <div className="py-8">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PromotionCard
            title="Let's work"
            subtitle="You feel it too?"
            features={["Let's talk, no strings attached"]}
            isDark={true}
            onClick={() => openForm()}
          />

          <PromotionCard
            title="Brand sprint"
            subtitle="New!"
            features={[
              "Go to market fast",
              "Get a funding round",
              "Stand out from the crowd",
            ]}
            onClick={() => router.push("/branding")}
          />
        </div>
      </div>
    </div>
  );
};

export default Promotion;
