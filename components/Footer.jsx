"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import SmileyFace from "./smiley";
import Promotion from "./Promotion";
import "iconify-icon"

const Footer = ({ footerRef }) => {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch('/api/admin/social-media');
        if (response.ok) {
          const data = await response.json();
          setSocialLinks(data.filter(link => link.isActive).map(link => ({
            label: link.platform.charAt(0).toUpperCase() + link.platform.slice(1),
            href: link.url
          })));
        }
      } catch (error) {
        console.error('Error fetching social media links:', error);
      }
    };

    fetchSocialLinks();
  }, []);

  const menuItems = [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <footer
      ref={footerRef}
      className="px-4 py-4 min-h-[80vh] flex flex-col lg:px-8"
    >
      <Promotion />
      <div className="mx-auto w-full flex-1 flex flex-col gap-6 items-start justify-between lg:flex-row lg:mt-8">
        <div className="grid grid-col-1 md:grid-cols-2 gap-8 lg:gap-6">
          {/* Left Column - Explore */}
          <div className="flex items-start gap-6">
            <div className="uppercase text-xs tracking-wide text-gray-700">
              Explore
            </div>
            <nav>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-3xl hover:opacity-70 transition-opacity"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Middle Column - Social */}
          <div className="flex items-start gap-6">
            <div className="uppercase text-xs tracking-wide text-gray-700">
              Stalk us
            </div>
            <nav>
              <ul className="space-y-1">
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-3xl hover:opacity-70 transition-opacity"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        {/* Right Column - Contact */}
        <div className="space-y-6">
          <div className="space-y-2 w-full lg:text-end">
            <div className="uppercase text-[10px] tracking-wide text-gray-700">
              Say Hello
            </div>
            <Link
              href="mailto:hello@graphiq.art"
              className="text-xl hover:opacity-70 transition-opacity flex items-center"
            >
              hello <iconify-icon icon="mdi:at" width="18" height="18" ></iconify-icon> graphiq.art
            </Link>
          </div>

          <div className="space-y-2 mt-12 w-full lg:text-end">
            <div className="uppercase text-[10px] tracking-wide text-gray-700">
              Exceptional Talent?
            </div>
            <Link
              href="mailto:apply@graphiq.art"
              className="text-xl hover:opacity-70 transition-opacity flex items-center"
            >
              apply  <iconify-icon icon="mdi:at" width="18" height="18" ></iconify-icon> graphiq.art
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto my-12 text-[10px] space-x-4 font-light lg:hidden">
        <Link href="/imprint" className="hover:opacity-70 transition-opacity max-lg:underline">
          IMPRINT
        </Link>
        <Link href="/privacy" className="hover:opacity-70 transition-opacity max-lg:underline">
          PRIVACY
        </Link>
        <Link href="/press" className="hover:opacity-70 transition-opacity max-lg:underline">
          PRESS
        </Link>
      </div>
      {/* Bottom Bar */}
      <div className="w-full lg:pt-12 lg:mt-12 lg:px-8">
        <div className="text-[2rem] font-medium mb-2 text-center lg:text-[124px]">
          <span>GRAPHIQ</span>{" "}
          <span className="inline-block">
            <SmileyFace />
          </span>{" "}
          <span>ART</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-[10px] font-light">GraphiqArtGmHb</div>
          <div className="text-[10px] font-light">
            München, Germany / Stockholm, Sweden
          </div>
          <div className="hidden text-[10px] space-x-4 font-light lg:block">
            <Link href="/imprint" className="hover:opacity-70 hover:underline transition-opacity">
              IMPRINT
            </Link>
            <Link href="/privacy" className="hover:opacity-70 hover:underline transition-opacity">
              PRIVACY
            </Link>
            <Link href="/press" className="hover:opacity-70 hover:underline transition-opacity">
              PRESS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
