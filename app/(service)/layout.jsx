"use client";

import { useEffect } from "react";

export default function ServiceLayout({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "pink");
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return <>{children}</>;
}
