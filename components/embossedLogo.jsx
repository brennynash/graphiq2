"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const EmbossedLogo = ({ text = "GA", color = "primary-pink" }) => {
  const containerRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const shadow = shadowRef.current;
    let bounds;

    const updateShadowPosition = (e) => {
      if (!bounds) return;

      const relativeX = e.clientX - bounds.left;
      const relativeY = e.clientY - bounds.top;

      const centerX = (relativeX / bounds.width - 0.5) * 2;
      const centerY = (relativeY / bounds.height - 0.5) * 2;

      gsap.to(shadow, {
        duration: 0.5,
        ease: "power2.out",
        "--x": `${centerX * 10}px`,
        "--y": `${centerY * 10}px`,
        opacity: 1,
      });
    };

    const resetShadow = () => {
      gsap.to(shadow, {
        duration: 0.5,
        ease: "power2.out",
        "--x": "0px",
        "--y": "0px",
        opacity: 0,
      });
    };

    const handleMouseEnter = (e) => {
      bounds = container.getBoundingClientRect();
      updateShadowPosition(e);
    };

    const handleMouseMove = (e) => {
      if (!bounds) bounds = container.getBoundingClientRect();
      updateShadowPosition(e);
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", resetShadow);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", resetShadow);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`
        relative flex flex-col items-center justify-center overflow-hidden
        bg-${color} rounded-full
        w-[250px] h-[250px] text-4xl
        sm:w-[300px] sm:h-[300px] sm:text-5xl
        md:w-[400px] md:h-[400px] md:text-6xl
        lg:w-[450px] lg:h-[450px] lg:text-8xl
      `}
    >
      {/* Dynamic shadow layer */}
      <div
        ref={shadowRef}
        className="absolute inset-0 opacity-0 transition-opacity"
        style={{
          background: `radial-gradient(circle at calc(50% + var(--x, 0)) calc(50% + var(--y, 0)), rgba(255,255,255,0.2) 0%, transparent 50%)`,
        }}
      />
      {/* Outer shadow rim */}
      <div className="absolute inset-0 rounded-full bg-primary-pink brightness-105 shadow-inner" />

      {/* Inner embossed circle */}
      <div className="absolute inset-4 rounded-full bg-primary-pink brightness-100 shadow-lg" />

      {/* Text with embossed effect */}
      <span
        className={`relative font-bold tracking-wider text-primary-pink brightness-95`}
        style={{
          textShadow: `
            -1px -1px 0 rgba(255,255,255,0.2),
            1px 1px 2px rgba(0,0,0,0.1)
          `,
        }}
      >
        {text}
        <svg
          width="300"
          height="150"
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-4 w-16 sm:w-24 md:w-32 lg:w-40 z-50"
        >
          <path
            d="M5 5 Q 50 50, 110 5"
            stroke="#fbc1d4"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
};

export default EmbossedLogo;
