"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const ListItem = ({ project, index }) => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Default services if none provided
  const services = ["Strategy", "Visual Identity", "Website"];

  return (
    <div className="relative">
      <div className="border-t border-gray-200 flex items-end gap-8 max-md:py-4">
        <div
          className="flex flex-col-reverse gap-2 group hover:border-black hover:cursor-pointer transition-colors duration-200 max-md:w-1/2 md:w-full md:grid md:grid-cols-3 md:py-6 md:gap-4"
          onMouseEnter={() => setHoveredProject(index)}
          onMouseLeave={() => setHoveredProject(null)}
          onMouseMove={handleMouseMove}
        >
          <div className="md:col-span-1">
            <h3 className="text-sm md:text-base font-serif group-hover:md:font-semibold">
              {project.title}
            </h3>
          </div>

          <div className="md:col-span-1">
            <p className="text-xs md:text-base font-serif group-hover:md:font-semibold">
              {project.name}
            </p>
          </div>

          <div className="md:col-span-1 max-md:hidden">
            <p className="text-sm md:text-base font-serif group-hover:md:font-semibold">
              {services.join(", ")}
            </p>
          </div>
        </div>
        <div className="w-1/2 h-32 rounded-lg md:hidden">
          {project.mainImage ? (
            <Image
              src={project.mainImage}
              alt={project.title || 'Project image'}
              width={120}
              height={120}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListItem;
