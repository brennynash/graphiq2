import React from "react";
import Footer from "@/components/Footer";
import NavBar from "@/components/navbar";
import HeroSection from "./_components/Hero";
import AboutSection from "./_components/About";
import DisplaySection from "./_components/display";
import TeamMembersSection from "./_components/members";
import ImageSection from "./_components/images";

const AboutPage = () => {
  return (
    <main className="relative min-h-screen">
      <NavBar />
      <HeroSection />
      <section className="mt-[100vh]">
        <AboutSection/>
        <ImageSection />
        <DisplaySection/>
        <TeamMembersSection/>
        <Footer />
      </section>
    </main>
  );
};

export default AboutPage;
