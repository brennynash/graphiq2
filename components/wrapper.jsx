"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSequence from "./loading-sequence";

export default function Wrapper({ children }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true); // Start animation
    setTimeout(() => setLoading(false), 2000); // End animation after 2s
  }, [pathname]);

  if(loading){
    return <LoadingSequence/>
  }
  return (
    <>
      {children}
    </>
  );
}
