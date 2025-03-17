import clsx from "clsx";
import React from "react";

const Header = ({ navItems, handleItemClick }) => {
  return (
    <div className="w-full py-4">
      <h1 className="text-5xl md:text-9xl font-bold text-center mb-8">
        Serious News
      </h1>
      <div className="flex flex-row items-center gap-3 md:gap-12 w-fit mx-auto">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="flex items-baseline cursor-pointer group"
          >
            <h1
              className={clsx(
                "text-base font-cabin font-light transition-colors duration-300 px-4 py-2 rounded-full md:text-lg md:px-6 ",
                item.isActive
                  ? "bg-neutral-black text-neutral-white"
                  : "bg-neutral-white text-neutral-black group-hover:text-neutral-grey"
              )}
            >
              {item.label}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
