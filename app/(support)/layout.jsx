"use client";

import { useEffect } from "react";

export default function SupportLayout({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "pink");
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return <>{children}</>;
}
