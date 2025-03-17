"use client";

import ProjectForm from "./projectForm";
import { useState } from "react";
import SmileyButton from "./smileyButton";
import FlippingText from "./flippingText";
import MenuButton from "./menuButton";
import { X } from "lucide-react";
import Link from "next/link";
import { useProjectForm } from "@/strore/useProjectForm";

const NavBar = () => {
  const {isOpen,closeForm } = useProjectForm();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { title: "Work", href: "/work" },
    { title: "About", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Blog", href: "/blog" },
  ];

  const contactInfo = {
    sayHello: "hello@serious.business",
    apply: "apply@serious.business",
    location: "München, Germany | Stockholm, Sweden",
  };

  return (
    <div className="sticky top-0 z-[100] h-20 border-none transition-all duration-700 overflow-hidden lg:h-18">
      <header className="z-[101]">
        <nav className="flex flex-row-reverse items-center justify-between px-4 lg:grid grid-cols-2 md:grid-cols-3  ">
          <SmileyButton setIsMobileMenuOpen={setIsMobileMenuOpen}/>
          <FlippingText />
          <MenuButton menuItems={menuItems} />
        </nav>
      </header>
      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 bg-neutral-white transition-transform duration-300 ease-in-out z-50
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          lg:hidden
        `}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="self-end mb-8 rounded-full flex items-center gap-2"
            style={{
              backgroundColor: "var( --bg-color)",
              color: "var(--text-color)",
            }}
          >
            <div className="rounded-full px-4 py-1">
              Close <X size={16} className="inline" />
            </div>
          </button>

          <div className="text-4xl space-y-6 mb-auto">
            {menuItems.map((item) => (
              <div key={item.title}>
                <Link
                  href={item.href}
                  className="hover:opacity-70 transition-opacity"
                >
                  {item.title}
                </Link>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-sm">
            <div>
              <div className="text-neutral-grey mb-1">SAY HELLO</div>
              <Link
                href={`mailto:${contactInfo.sayHello}`}
                className="underline"
              >
                {contactInfo.sayHello}
              </Link>
            </div>

            <div>
              <div className="text-neutral-grey mb-1">EXCEPTIONAL TALENT?</div>
              <Link href={`mailto:${contactInfo.apply}`} className="underline">
                {contactInfo.apply}
              </Link>
            </div>

            <div className="text-neutral-grey">{contactInfo.location}</div>
          </div>
        </div>
      </div>
      <ProjectForm
        isOpen={isOpen}
        onClose={closeForm}
      />
    </div>
  );
};

export default NavBar;
