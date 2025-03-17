"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedText = ({ text, textStyles }) => {
  const textRef = useRef(null);

  return (
    <p ref={textRef} className={textStyles}>
      {text}
    </p>
  );
};

export default AnimatedText;
