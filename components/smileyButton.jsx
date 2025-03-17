"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import Button from "./button";
import { Ellipsis } from "lucide-react";
import { useProjectForm } from "@/strore/useProjectForm";

const SmileyButton = ({setIsMobileMenuOpen}) => {
  const {openForm} = useProjectForm();
  const smileyRef = useRef(null);

  const handleHover = (isEntering) => {
    if (smileyRef.current) {
      gsap.to(smileyRef.current, {
        x: isEntering ? "100%" : "-100%",
        opacity:isEntering ? 100 : 0,
        rotation: isEntering ? 360 : -360, 
        duration: 1,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <div
      className="relative flex items-center w-fit max-lg:gap-1"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <Button
        id="work-button"
        title="Let's work"
        containerClass="flex items-center justify-center gap-1 px-4 py-2"
        onClick={openForm}
      />
      <div
        ref={smileyRef}
        className="absolute right-0 top-0 h-full flex items-center"
        style={{ transform: "translateX(-100%) rotate(0deg)" }}
      >
        <div 
        className="hidden w-8 h-8  items-center justify-center rounded-full shadow-md lg:flex"
        style={{
          backgroundColor:"var(--button-bg)",
          color:"var(--button-text)"
        }}
        >
          {/* Smiley SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="9" cy="10" r="1" />
            <circle cx="15" cy="10" r="1" />
            <path d="M8 16 Q12 20, 16 16" />
          </svg>
        </div>
      </div>

      <Button
       id="menu-button"
       title={<Ellipsis size={18}/>}
       containerClass="flex items-center justify-center p-2 lg:hidden"
       onClick={()=>setIsMobileMenuOpen(true)}
      />
    </div>
  );
};

export default SmileyButton;
