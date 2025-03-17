import React, { useState, useEffect } from "react";
import { ChevronsUpDown, X } from "lucide-react";

const Header = ({ navItems, handleItemClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block w-full py-8">
        <div className="flex flex-row items-center gap-12 w-fit mx-auto">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="flex items-baseline cursor-pointer group"
            >
              <h2
                className={`text-6xl font-serif transition-colors duration-300 group-hover:text-neutral-grey ${
                  item.isActive ? "" : "text-neutral-light-grey"
                }`}
              >
                {item.label}
              </h2>
              <span
                className={`ml-2 text-sm font-mono transition-colors duration-300 self-start group-hover:text-neutral-grey ${
                  item.isActive ? "" : "text-neutral-light-grey"
                }`}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden w-full px-4 py-6 flex items-center gap-4">
        <div className="flex items-baseline">
          {/* Display only the active item on mobile */}
          {navItems
            .filter((item) => item.isActive)
            .map((item) => (
              <div key={item.id} className="flex items-baseline">
                <h2 className="text-5xl font-serif">{item.label}</h2>
                <span className="ml-2 text-sm font-mono self-start">
                  {item.count}
                </span>
              </div>
            ))}
        </div>

        {/* Menu Button */}
        <button
          onClick={toggleMenu}
          className="bg-transparent rounded-full p-1"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <ChevronsUpDown size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed flex items-center justify-center inset-0 bg-neutral-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        >
          <div
            className="rounded-lg bg-white z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              {navItems.map((item) => (
                <div
                  className="w-full flex gap-12 justify-between items-center cursor-pointer group py-6 px-12 even:border even:border-neutral-light-grey"
                  onClick={() => {
                    handleItemClick(item.id);
                    toggleMenu();
                  }}
                >
                  <label className="text-base">{item.label}</label>
                  <input
                    type="radio"
                    key={item.id}
                    checked={item.isActive}
                    readOnly
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
