"use client";

import React, { useState } from "react";
import Footer from "@/components/Footer";
import NavBar from "@/components/navbar";
import Header from "./_componets/Header";
import ProjectList from "./_componets/Projects";
import IndustriesList from "./_componets/Industries";
import FeaturedLlist from "./_componets/Featured";

const WorkPage = () => {

  const [activeTab, setActiveTab] = useState("featured");
  const [navItems, setNavItems] = useState([
    { id: 'featured', label: 'Featured', count: '06', isActive: true },
    { id: 'all-projects', label: 'All projects', count: '19', isActive: false },
    { id: 'industries', label: 'Industries', count: '09', isActive: false }
  ]);

  const handleItemClick = (id) => {
    setNavItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        isActive: item.id === id
      }))
    );
    setActiveTab(id);
  };

  const tabComponents = {
    featured: <FeaturedLlist />,
    "all-projects": <ProjectList/>,
    industries: <IndustriesList />,
  };
  
  // Get the active component
  const ActiveComponent = tabComponents[activeTab] || <FeaturedLlist />;

  return (
    <main className="relative min-h-screen ">
      <NavBar />
      <Header navItems={navItems} handleItemClick={handleItemClick} />
      <div className="overflow-hidden">
        {ActiveComponent}
      </div>
      <Footer />
    </main>
  );
};

export default WorkPage;
