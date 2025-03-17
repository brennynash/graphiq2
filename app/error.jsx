"use client";

import React, { useEffect } from "react";
import AnimatedButton from "@/components/animatedButton";
import { useRouter } from "next/navigation";
import SmileyFace from "@/components/smiley";
import NavBar from "@/components/navbar";

const Custom404 = () => {
  const router = useRouter();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <main>
      <NavBar/>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="flex items-center gap-4 justify-center mb-4">
            <span className="text-[20rem] leading-[1] font-bold">4</span>
            <SmileyFace />
            <span className="text-[20rem] leading-[1] font-bold">4</span>
          </div>

          <h1 className="text-xl mb-12">Oops, this page not found!</h1>

          <AnimatedButton
            title="Take me back"
            onClick={() => router.push("/")}
            containerStyles="bg-neutral-white"
          />
        </div>
      </div>
    </main>
  );
};

export default Custom404;
