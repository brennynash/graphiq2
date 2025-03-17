'use client';

import React, { useEffect, useState } from "react";
import ListItem from "./listItem";
import { motion } from "framer-motion";

const IndustriesList = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();

        if (data.projects && Array.isArray(data.projects) && data.industries) {
          // Ensure each project has required image properties
          const processedProjects = data.projects.map(project => ({
            ...project,
            mainImage: project.mainImage || null // Ensure mainImage is null if not present
          }));

          // Group projects by industry
          const groupedProjects = data.industries.map(industry => ({
            title: industry.toUpperCase(),
            projects: processedProjects.filter(project => project.industry === industry)
          })).filter(group => group.projects.length > 0);

          setIndustries(groupedProjects);
        } else {
          console.error("Data is not in the expected format:", data);
          setIndustries([]);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setIndustries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-6 mx-auto lg:px-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="my-6 lg:my-12 space-y-4">
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-16 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!industries.length) {
    return (
      <div className="w-full px-6 mx-auto lg:px-12">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">No industries found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 mx-auto lg:px-12">
      {industries.map((industry, index) => (
        <motion.div
          key={industry.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative space-y-2 my-6 lg:my-12"
        >
          <h2 className="text-base font-semibold lg:text-lg">{industry.title}</h2>
          <div className="relative">
            {industry.projects.map((project, projectIndex) => (
              <ListItem key={project.id} project={project} index={projectIndex} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default IndustriesList;
