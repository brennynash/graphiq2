"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import Footer from "@/components/Footer";
import Trending from "./Trending";

const BottomSection = () => {
  const trendingRef = useRef(null);
  const footerRef = useRef(null);

  return (
    <>
      <Trending trendingRef={trendingRef} />
      <Footer footerRef={footerRef} />
    </>
  );
};

export default BottomSection;
