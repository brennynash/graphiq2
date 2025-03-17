import React from "react";

const AboutSection = () => {
  return (
    <div className="min-h-screen p-6 lg:px-16 lg:py-10">
      <div className="mx-auto max-w-lg space-y-8">
        <p className="text-2xl leading-18 text-start font-thin font-tinos md:text-center md:text-3xl">
          <span className="font-semibold font-cabin">GRAPHIQ.ART</span> started
          in 2015 as a{" "}
          <span className="font-semibold font-cabin">passion project</span> at
          Hyper Island, Stockholm by a diverse group of creatives with the goal
          of re-defining what a serious business is really about:{" "}
          <span className="font-semibold font-cabin">
            kindness and creativity.
          </span>
        </p>
        <p className="text-2xl leading-18 text-start font-thin font-tinos md:text-center md:text-3xl">
          That's why we craft our future with kindness to {" "}
          <span className="font-semibold font-cabin">
            create brands that make people smile.
          </span>
        </p>
        <p className="text-2xl leading-18 text-start font-thin font-tinos md:text-center md:text-3xl">
          Today our  <span className="font-bold font-cabin">dream team</span> of 15 creatives with a Global perspective has crafted a new generation of brands with over 100 change-making startups in Europe and America - a proof that it is culture that drives a serious business 
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
