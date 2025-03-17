"use client";

import Image from "next/image";
import React, { useRef } from "react";

const BlogCard = ({ project, index }) => {
  const projectsRef = useRef([]);

  return (
    <div
      ref={(el) => {
        if (el) projectsRef.current[index] = el;
      }}
      className="group relative flex flex-col"
      data-column={index % 3}
    >
      <div className="relative min-h-[14rem] rounded-lg transition-transform">
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
    after:duration-700 group-hover:after:w-full lg:text-lg"
        >
          {project.name} | {project.title}{" "}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
