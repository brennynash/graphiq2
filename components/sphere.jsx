"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const SphereAnimation = () => {
  const sphere1Ref = useRef(null);
  const sphere2Ref = useRef(null);
  const trackerRef = useRef(null);

  useEffect(() => {
    const handleAnimations = () => {
      const tracker = trackerRef.current;
      const moveEvent = (e) => {
        const tracker = trackerRef.current;
        if (!tracker) return;
        const wrapperRect = tracker.getBoundingClientRect();
        const relX = e.clientX - (wrapperRect.left + wrapperRect.width / 2);
        const relY = e.clientY - (wrapperRect.top + wrapperRect.height / 2);
        const sphere1DisX = (relX / wrapperRect.width) * 25;
        const sphere1DisY = (relY / wrapperRect.height) * 25;
        const sphere2DisX = (relX / wrapperRect.width) * 50;
        const sphere2DisY = (relY / wrapperRect.height) * 50;
        gsap.to(sphere1Ref.current, {
          x: sphere1DisX,
          y: sphere1DisY,
          ease: "power3.out",
          duration: 0.35,
        });
        gsap.to(sphere2Ref.current, {
          x: sphere2DisX,
          y: sphere2DisY,
          ease: "power3.out",
          duration: 0.35,
        });
      };
      const leaveEvent = () => {
        gsap.to(sphere1Ref.current, {
          x: 0,
          y: 0,
          ease: "power3.out",
          duration: 1,
        });
        gsap.to(sphere2Ref.current, {
          x: 0,
          y: 0,
          ease: "power3.out",
          duration: 1,
        });
      };
      if (tracker) {
        tracker.addEventListener("mousemove", moveEvent);
        tracker.addEventListener("mouseleave", leaveEvent);
      }
      return () => {
        if (tracker) {
          tracker.removeEventListener("mousemove", moveEvent);
          tracker.removeEventListener("mouseleave", leaveEvent);
        }
      };
    };

    if (typeof window !== "undefined") {
      handleAnimations();
    }
  }, []);

  return (
    <div ref={trackerRef} className="relative w-full h-screen">
      <div
        ref={sphere1Ref}
        className="sphere1"
        style={{
          backgroundImage: `url("/assets/images/gallery.jpg")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div
        ref={sphere2Ref}
        className="sphere2"
        style={{
          backgroundImage: `url("/assets/images/gallery.jpg")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
    </div>
  );
};

export default SphereAnimation;
