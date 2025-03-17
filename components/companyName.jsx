import React from "react";
import Image from "next/image";

export const CompanyName = () => {
  return (
    <svg
      viewBox="0 0 600 150"
      width="100%"
      height="120"
      xmlns="http://www.w3.org/2000/svg"
      className="max-lg:hidden overflow-hidden"
    >
      
      {/* Text */}
      <text
        x="50%"
        y="80%"
        fontFamily="Outfit, sans-serif"
        fontSize="152"
        fontWeight="bold"
        textAnchor="middle"
        style={{
          fill:"var(--text-color)"
        }}
      >
        GRAPHIQ.ART
      </text>
    </svg>
  );
};
