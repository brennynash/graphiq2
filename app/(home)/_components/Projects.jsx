"use client"

import AnimatedTitle from "@/components/animatedTitle";
import ProjectCard from "@/components/projectCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 300);
        } else {
          console.error("Projects data is not in the expected format:", data);
          setProjects([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      });
  }, []);
  return (
    <section className="overflow-hidden py-4">
      <div className="mb-12 flex items-center justify-center">
        <AnimatedTitle
          title="Europe's most aspiring <br /> startups and scaleups"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto px-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
