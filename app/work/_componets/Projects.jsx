'use client';

import React, { useEffect, useState } from "react";
import ListItem from "./listItem";
import { motion } from "framer-motion";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        if (data.projects && Array.isArray(data.projects)) {
          // Process projects to ensure required properties
          const processedProjects = data.projects.map(project => ({
            ...project,
            mainImage: project.mainImage || null, // Ensure mainImage is null if not present
            title: project.title || 'Untitled Project',
            name: project.name || 'Unknown'
          }));
          setProjects(processedProjects);
        } else {
          console.error("Projects data is not in the expected format:", data);
          setProjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-6 mx-auto lg:px-12 relative">
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="w-full px-6 mx-auto lg:px-12 relative">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">No projects found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 mx-auto lg:px-12 relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2"
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ListItem project={project} index={index} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProjectsList;
