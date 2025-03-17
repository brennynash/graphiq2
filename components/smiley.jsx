"use client"

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const SmileyFace = () => {
  const faceRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const mouthRef = useRef(null);

  return (
    <svg
      ref={faceRef}
      viewBox="0 0 115 115" // Increased size
      className="w-9 h-8 lg:w-28 lg:h-28 " // Adjust display size
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Face Circle */}
      <circle cx="60" cy="60" r="50" stroke="var(--text-color)" strokeWidth="7" fill="none" />

      {/* Eyes */}
      <circle
        ref={leftEyeRef}
        cx="45"
        cy="45"
        r={6} // Slightly larger eyes
        fill="var(--text-color)"
      />
      <circle
        ref={rightEyeRef}
        cx="75"
        cy="45"
        r={6}
        fill="var(--text-color)"
      />

      {/* Mouth */}
      <path
        ref={mouthRef}
        d="M45 75 Q60 90 75 75" // Smiling path
        stroke="var(--text-color)"
        strokeWidth="4"
        fill="transparent"
      />
    </svg>
  );
}

export default SmileyFace;

export const SmileySvg = ({color}) => {
  return (
    <svg
      viewBox="0 0 115 115"
      className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] md:w-[70px] md:h-[70px] lg:w-[100px] lg:h-[100px] xl:w-[115px] xl:h-[115px]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Face Circle */}
      <circle cx="60" cy="60" r="50" stroke={color} strokeWidth="7" fill="none" />

      {/* Eyes */}
      <circle cx="45" cy="45" r="6" fill={color} />
      <circle cx="75" cy="45" r="6" fill={color} />

      {/* Mouth */}
      <path d="M45 75 Q60 90 75 75" stroke={color} strokeWidth="4" fill="transparent" />
    </svg>
  );
};
