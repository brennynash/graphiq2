"use client";

import React, { useRef } from "react";

const VideoSection = () => {
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);

  return (
    <div ref={containerRef} className="relative h-[40vh] flex items-center justify-center md:p-16 md:min-h-screen">
      <div className="relative w-full h-full flex items-center justify-center md:h-screen">
        <div
          ref={videoContainerRef}
          className="w-full h-full flex items-center justify-center md:rounded-lg"
        >
          <video
            ref={videoRef}
            preload="none"
            playsInline
            muted
            loop
            src="/assets/videos/hero-video.mp4"
            className="absolute inset-0 md:rounded-lg"
          ></video>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
