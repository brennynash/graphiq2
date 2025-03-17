"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const LoadingSequence = () => {
  const [playAnimation, setPlayAnimation] = useState(false);
  const pathname = usePathname();

  const preloaderRef = useRef(null);
  const bannerOneRef = useRef(null);
  const bannerTwoRef = useRef(null);
  const bannerThreeRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setPlayAnimation(true), 100);
  }, [pathname]);

  useEffect(() => {
    if (!playAnimation) return;

    const tl = gsap.timeline();

    tl.to(preloaderRef.current, {
      opacity: 0,
      duration: 0.5,
    });

    if (bannerOneRef.current && bannerTwoRef.current && bannerThreeRef.current) {
      tl.set([bannerThreeRef.current, bannerTwoRef.current, bannerOneRef.current], {
        yPercent: 0,
      });

      tl.to([bannerThreeRef.current, bannerTwoRef.current, bannerOneRef.current], {
        yPercent: 100,
        stagger: 0.2,
        ease: "power2.out",
        duration: 1,
      });
    }

    setTimeout(() => {
      setPlayAnimation(false);
    }, 2500);
  }, [playAnimation]);

  return (
    <>
      {playAnimation && (
        <div
          ref={preloaderRef}
          className="fixed inset-0 bg-orange-500 z-[600] opacity-100 transition-opacity duration-500"
        />
      )}

      {playAnimation && (
        <div>
          <div
            id="banner-1"
            ref={bannerOneRef}
            className="min-h-screen bg-red-600 z-[500] fixed top-0 left-0 w-screen"
          />
          <div
            id="banner-2"
            ref={bannerTwoRef}
            className="min-h-screen bg-blue-700 z-[500] fixed top-0 left-0 w-screen"
          />
          <div
            id="banner-3"
            ref={bannerThreeRef}
            className="min-h-screen bg-orange-500 z-[500] fixed top-0 left-0 w-screen"
          />
        </div>
      )}
    </>
  );
};

export default LoadingSequence;
