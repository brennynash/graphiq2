"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const SprintPackageSection = () => {
  const [activeItem, setActiveItem] = useState(1); // Default to first item
  const [prevItem, setPrevItem] = useState(1); // Track previous item
  const imageRef = useRef(null);

  const packageItems = [
    { id: 1, title: "Logotype", media: "/assets/images/pic1.webp" },
    { id: 2, title: "Color Palette", media: "/assets/images/pic2.webp" },
    { id: 3, title: "Typography", media: "/assets/images/pic3.webp" },
    { id: 4, title: "Brand Design Elements", media: "/assets/images/pic4.webp" },
    { id: 5, title: "Landing Page Design", media: "/assets/images/pic5.webp" },
    { id: 6, title: "Presentation Template", media: "/assets/images/pic6.webp" },
    { id: 7, title: "Brand Guidelines", media: "/assets/images/pic7.webp" },
  ];

  useEffect(() => {
    if (!imageRef.current) return;

    const direction = activeItem > prevItem ? 1 : -1; // Determine scroll direction (down/up)
    
    gsap.fromTo(
      imageRef.current,
      { y: direction * 100, opacity: 0 }, // Start position (100px up or down)
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" } // End position (smooth transition)
    );

    setPrevItem(activeItem); // Update previous item
  }, [activeItem]);

  return (
    <section className="w-full bg-neutral-black text-neutral-white py-8 md:py-14 lg:min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <h2 className="text-lg md:text-xl lg:text-4xl font-bold mb-6 md:mb-12">
          What's in the sprint package?
        </h2>
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          {/* Left Column: Package List */}
          <div className="lg:w-1/3">
            <div className="flex flex-col">
              {packageItems.map((item) => (
                <div
                  key={item.id}
                  className={`font-tinos border-t border-neutral-light-grey py-2 flex gap-6 cursor-pointer transition-colors ${
                    activeItem === item.id
                      ? "opacity-100 text-neutral-white"
                      : "opacity-70 hover:opacity-90"
                  }`}
                  onMouseEnter={() => setActiveItem(item.id)} // Change image on hover
                >
                  <div className="text-base md:text-lg font-medium">
                    {item.id}
                  </div>
                  <div className="text-base md:text-lg font-medium">
                    {item.title}
                  </div>
                </div>
              ))}
              <div className="border-t border-neutral-light-grey"></div>
            </div>
          </div>

          {/* Right Column: Image Preview */}
          <div className="flex-1 overflow-hidden h-fit flex items-center justify-center">
            <div className="relative w-full h-[14rem] md:h-[20rem]">
              <div ref={imageRef} className="absolute inset-0">
                <Image
                  src={packageItems.find((item) => item.id === activeItem)?.media}
                  alt="Sprint Package Image"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SprintPackageSection;
