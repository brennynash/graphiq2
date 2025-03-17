"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index }) => {
  const projectsRef = useRef([]);

  return (
    <div
      ref={(el) => {
        if (el) projectsRef.current[index] = el;
      }}
      className="group relative flex flex-col"
    >
      <div className="relative max-h-[20rem] rounded-lg transition-transform">
        <Image
          src={project.mainImage}
          alt={project.title}
          className="w-full h-full object-cover rounded-lg"
          width={250}
          height={100}
        />
      </div>
      <div className="py-2 space-y-1">
        <p
          className="relative w-fit text-base font-semibold
    after:content-[''] after:absolute after:left-0 after:bottom-[-2px] 
    after:w-0 after:h-[2px] after:bg-[var(--text-color)] after:transition-all
    after:duration-700 group-hover:after:w-full"
        >
          {project.title}{" "}
        </p>
        <p className="text-sm font-light">{project.description} </p>
      </div>
    </div>
  );
};

export default ProjectCard;
