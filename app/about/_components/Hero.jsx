"use client";
import { useState } from "react";
import Image from "next/image";

const images = [
  "/assets/images/pic1.webp",
  "/assets/images/pic2.webp",
  "/assets/images/pic3.webp",
  "/assets/images/pic4.webp",
  "/assets/images/pic5.webp",
  "/assets/images/pic6.webp",
  "/assets/images/pic7.webp",
  "/assets/images/pic8.webp",
];

const HeroSection = () => {
  const [trail, setTrail] = useState([]);


  return (
    <div className="absolute top-0 left-0 w-full h-screen cursor-pointer">
      <div className="relative w-full h-full p-4 flex flex-col items-center overflow-hidden lg:p-8">
        <div className="text-[40vw] flex h-full items-start justify-center flex-col font-bold tracking-tight relative lg:text-[25vw] lg:items-center lg:flex-row lg:gap-16">
          <div className="relative">
            Est
            <div className="w-18 absolute top-[55%] -right-[12%] translate-x-1/2 p-4 lg:top-[60%] lg:-right-[7%]">
              <Image
                src="/assets/images/logo-3.svg"
                width={18}
                height={18}
                alt="logo"
                className="w-8 h-8 lg:w-16 lg:h-16 object-contain"
              />
            </div>
          </div>
          <span className="">2015</span>
        </div>

        <div className="p-6 mx-auto text-center">
          <p className="text-3xl font-cabin font-semibold lg:text-2xl">
            Crafting the future,
          </p>
          <p className="text-3xl font-serif lg:text-2xl">
            while having serious fun
          </p>
        </div>

        {/* Image trail */}
        {trail.map((img) => (
          <div
            key={img.id}
            className={`image-${img.id} absolute pointer-events-none z-0`}
            style={{
              left: img.x - img.width / 2,
              top: img.y - img.height / 2,
              transform: `rotate(${img.rotation}deg)`,
              willChange: "opacity, transform", // Performance optimization
            }}
          >
            <Image
              src={img.src}
              alt=""
              width={img.width}
              height={img.height}
              className="rounded-lg object-cover"
              style={{
                width: `${img.width}px`,
                height: `${img.height}px`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
