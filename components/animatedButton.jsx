"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";

const AnimatedButton = ({ title, containerStyles,onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const arrowRef = useRef(null);
  const aboutTextRef = useRef(null);

  // Measure the width of the text dynamically
  useEffect(() => {
    if (aboutTextRef.current) {
      setTextWidth(aboutTextRef.current.offsetWidth);
    }
  }, [title]); // Update when title changes

  const handleAboutHover = (isEntering) => {
    setIsHovered(isEntering);
    if (arrowRef.current && aboutTextRef.current) {
      gsap.to(arrowRef.current, {
        x: isEntering ? -textWidth : 0, // Move left based on text width
        duration: 0.5,
        ease: "power2.inOut",
      });
      gsap.to(aboutTextRef.current, {
        x: isEntering ? textWidth * 0.25 : 0, // Move text slightly right
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className="cursor-pointer flex items-center"
        onMouseEnter={() => handleAboutHover(true)}
        onMouseLeave={() => handleAboutHover(false)}
        role="button"
        tabIndex={0}
      >
        <button
          ref={aboutTextRef}
          className={
            `relative z-10 rounded-full px-6 py-2 text-sm font-semibold ${containerStyles}`
          }
          style={{
            color:"var(--button-text)",
            backgroundColor:"var(--button-bg)"
          }}
          onClick={onClick}
        >
          {title}
        </button>
        <div
          ref={arrowRef}
          className={clsx(
            "rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300",
            containerStyles
          )}
          style={{
            color:"var(--button-text)",
            backgroundColor:"var(--button-bg)"
          }}
        >
          {isHovered ? (
            <ArrowRight size={14} color="#111111" />
          ) : (
            <ArrowLeft size={14} color="#111111" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedButton;
