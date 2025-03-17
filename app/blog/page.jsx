"use client"

import { useState, useEffect } from 'react';
import NavBar from "@/components/NavBar";
import Header from "./_components/Header";
import ProjectStoriesSection from "./_components/Stories";
import KnowledgeSection from "./_components/Knowledge";
import Footer from "@/components/Footer";
import AllProjects from "./_components/All";

const BlogPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [navItems, setNavItems] = useState([
    { id: "all", label: "All", isActive: true },
    { id: "knowledge", label: "Knowledge", isActive: false },
    { id: "project-stories", label: "Project Stories", isActive: false },
  ]);

  const handleItemClick = (id) => {
    setNavItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        isActive: item.id === id,
      }))
    );
    setActiveTab(id);
  };

  const tabComponents = {
    all: <AllProjects />,
    "project-stories": <ProjectStoriesSection />,
    knowledge: <KnowledgeSection />,
  };

  // Get the active component
  const ActiveComponent = tabComponents[activeTab];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light-blue");
    return () => document.documentElement.removeAttribute("data-theme"); // Cleanup when leaving
  }, []);

  return (
    <main className="relative min-h-screen">
      <NavBar />
      <Header navItems={navItems} handleItemClick={handleItemClick} />
      <div>{ActiveComponent}</div>
      <Footer />
    </main>
  );
};

export default BlogPage;
