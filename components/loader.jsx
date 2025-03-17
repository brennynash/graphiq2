import React from "react";

const Loader = () => {
    return (
      <div className="flex justify-center items-center w-full">
        <svg
          className="animate-spin w-16 h-16 text-pink-500"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Face Circle */}
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="5" fill="none" />
          
          {/* Left Eye */}
          <circle cx="35" cy="40" r="5" fill="currentColor" />
          
          {/* Right Eye */}
          <circle cx="65" cy="40" r="5" fill="currentColor" />
          
          {/* Smile (Arc Path) */}
          <path
            d="M30 60 Q50 80, 70 60"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };
  
  export default Loader;
  