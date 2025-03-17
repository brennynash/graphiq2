import React from "react";
import Image from "next/image";
import "iconify-icon";

const BrandsSection = () => {
  const brands = [
    {
      name: "Amnesty International",
      logo: (
        <iconify-icon
          icon="simple-icons:asus"
          width="10vw"
          height="10vh"
        ></iconify-icon>
      ),
    },
    {
      name: "Beam Suntory",
      logo: (
        <iconify-icon
          icon="meteor-icons:google"
          width="10vw"
          height="10vh"
        ></iconify-icon>
      ),
    },
    {
      name: "Vay",
      logo: (
        <iconify-icon
          icon="icon-park-outline:volkswagen"
          width="10vw"
          height="10vh"
        ></iconify-icon>
      ),
    },
    {
      name: "Frontify",
      logo: (
        <iconify-icon
          icon="simple-icons:mercedes"
          width="10vw"
          height="10vh"
        ></iconify-icon>
      ),
    },
    {
      name: "B&O Play",
      logo: (
        <iconify-icon
          icon="mdi:microsoft-xbox"
          width="10vw"
          height="10vh"
        ></iconify-icon>
      ),
    },
    {
      name: "Volkswagen",
      logo: (
        <iconify-icon
          icon="ri:tiktok-line"
          width="10vw"
          height="10vh"
        ></iconify-icon>
      ),
    },
    {
      name: "dell",
      logo: (
        <iconify-icon
          icon="simple-icons:dell"
          width="10vw"
          height="10vh"
        ></iconify-icon>
      ),
    },
    {
      name: "mimedia",
      logo: (
        <iconify-icon
          icon="arcticons:cloud-mimedia"
          width="10vw"
          height="10vh"
        ></iconify-icon>
      ),
    },
  ];

  return (
    <section className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-2xl font-normal mb-2">
            We've helped Europe's leading innovators to bring new brands into
            existence and take them to the next level
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 lg:px-16">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center justify-center p-4">
              {brand.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
