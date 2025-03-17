"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

const MenuButton = ({ title = "Menu", menuItems, containerStyles }) => {
  const [textWidth, setTextWidth] = useState(0);
  const arrowRef = useRef(null);
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const menuItemsRef = useRef([]);

  useEffect(() => {
    if (containerRef.current) {
      setTextWidth(containerRef.current.offsetWidth);
    }
  }, [title]);

  const handleHover = (isEntering) => {

    if (arrowRef.current && titleRef.current) {
      const tl = gsap.timeline();

      // Step 1: Move the arrow
      tl.to(arrowRef.current, {
        x: isEntering ? -textWidth - 20 : 0,
        opacity:isEntering ?  0 : 1,
        duration: 0.5,
        ease: "power2.inOut",
      });
      // Step 2: Move and fade out the title
      tl.to(
        titleRef.current,
        {
          y: isEntering ? "30" : "0", // Move down when hiding
          opacity: isEntering ? 0 : 1,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            titleRef.current.style.display = isEntering ? "none" : "inline";
          },
        },
        "-=0.5" // Overlapping slightly for a smooth transition
      );

      // Step 3: Fade in and move up the menu items **after** the title disappears
      tl.to(menuItemsRef.current, {
        opacity: isEntering ? 1 : 0,
        y: isEntering ? "0" : "30",
        duration: 0.5,
        display: isEntering ? "inline-block" : "none",
        ease: "power2.inOut",
        stagger: -0.2,
      });
    }
  };

  return (
    <div className="ml-auto relative inline-block max-lg:hidden">
      <div
        className="cursor-pointer flex items-center"
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
        role="button"
        tabIndex={0}
      >
        {/* Menu Title (Disappears on Hover) */}
        <div
          ref={containerRef}
          className={clsx(
            "flex relative z-10 rounded-full px-6 py-2 overflow-hidden",
            containerStyles
          )}
          style={{
            color:"var(--button-text)",
            backgroundColor:"var(--button-bg)"
          }}
        >
          <span
            ref={titleRef}
            className="text-sm transition-opacity overflow-hidden"
          >
            {title}
          </span>
          <span className="items-center justify-center gap-4">
            {menuItems.map((item, index) => (
              <Link
                ref={(el) => (menuItemsRef.current[index] = el)}
                key={index}
                className="hidden opacity-0 hover:text-gray-900 mx-[6px] transition-colors hover:font-semibold"
                href={item.href}
                style={{
                  color:"var(--button-text)",
                }}
              >
                {item.title}
              </Link>
            ))}
          </span>
        </div>

        {/* Arrow (Moves from Right to Left) */}
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
          <ArrowLeft size={14} />
        </div>
      </div>
    </div>
  );
};

export default MenuButton;
