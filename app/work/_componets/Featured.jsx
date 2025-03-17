'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const FeaturedList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch('/api/projects?featured=true');
        const data = await response.json();
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          console.error("Projects data is not in the expected format:", data);
          setProjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch featured projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto px-6 lg:px-12 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[4/3] rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-lg">No featured projects found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto px-6 lg:px-12 overflow-hidden">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-black"
        >
          {project.mainImage ? (
            <Image
              src={project.mainImage}
              alt={project.title || 'Project image'}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
            <p className="text-sm text-gray-200">{project.name}</p>
            <div className="mt-4">
              <Link
                href={`/work/${project.id}`}
                className="inline-block px-4 py-2 bg-white text-black rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                View Project
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedList;
