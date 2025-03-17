"use client";

import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { partnerItems } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

const Relationship = ({ partner }) => {
  return (
    <div className="overflow-hidden py-16 mx-4 relative lg:mx-12">
      <div className="mx-auto flex flex-col items-start gap-4 lg:gap-16 lg:flex-row">
        <div className="mb-6 lg:mb-12 max-lg:w-full max-lg:text-center">
          <h2 className="text-2xl font-light text-wrap leading-6 lg:max-w-[8rem] max-lg:text-center">
            {partner.title}
          </h2>
        </div>

        <div
          className={clsx(
            "grid grid-cols-4 gap-x-12 gap-y-2 mx-auto lg:gap-x-24 lg:gap-y-16 lg:max-w-2xl lg:ml-auto",
            partner.hasAchievements && "grid-cols-3"
          )}
        >
          {partner.items.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 items-start opacity-80 hover:opacity-100 transition-opacity duration-300 lg:gap-4"
            >
              <div className="mx-auto">{partner.logo}</div>

              {partner.achievements && (
                <div className="space-y-1">
                  <p className="font-semibold">{partner.name}</p>
                  {partner.achievements.map((item, idx) => (
                    <p key={idx} className="font-light text-xs lg:text-sm">
                      {item}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RelationshipsSection = () => {
  return (
    <>
      {partnerItems.map((item) => (
        <Relationship key={item.title} partner={item} />
      ))}
    </>
  );
};
export default RelationshipsSection;
