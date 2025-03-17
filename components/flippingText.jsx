"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

const FlippingText = () => {
  const wrapperRef = useRef(null);

  return (
    <div className="flex items-center justify-center w-[9rem] lg:w-full">
      {/* 3D Wrapper */}
      <div
        className="relative h-20 w-40 text-3xl font-bold"
        style={{ perspective: 1000 }}
      >
        {/* Flipping Inner Box */}
        <div
          ref={wrapperRef}
          className="relative h-full w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front Side */}
          <Link
            href={"/"}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            Graphiq.art
          </Link>

          {/* Back Side */}
          <Link
            href={"/"}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            Graphiq.art
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlippingText;
