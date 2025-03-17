import AnimatedText from "@/components/animatedText";
import React from "react";

const WhySection = () => {
  const sections = [
    {
      index: 1,
      title: "Serial collaborators",
      description:
        "We sprinkle laughter, light and warmth over every collaboration, interaction and process to fuel our work.",
    },
    {
      index: 2,
      title: "fueled by diversity",
      description:
        "Our team is filled with the kind of people you want to hang out with, ask questions and grab a beer after work. In other words... culture first.",
    },
    {
      index: 3,
      title: "guided by kindness",
      description:
        "We conquer with kindness. Branding for startups is all about building connections – the best way to do it? With kindness.",
    },
    {
      index: 4,
      title: "that never settle",
      description:
        "We work with an unmatched conviction. We approach each project with a commitment to uniqueness and the desire for 'wowness'.",
    },
  ];

  return (
    <section className="overflow-hidden min-h-screen p-8 lg:my-12">
      <div className="flex flex-col gap-16 lg:flex-row">
        <div className="flex-1  p-8">
          <h1 className="text-6xl font-tinos mb-6">
            <span className="font-bold font-cabin">Why</span> <br /> Graphiq is{" "}
            <br /> good?
          </h1>
        </div>
        <div className="max-w-2xl px- 4">
          {sections.map((item) => (
            <div
              key={item.index}
              className="grid grid-cols-1 py-4 border-t border-neutral-light-grey mb-12 md:grid-cols-2"
            >
              <div className="flex gap-12 items-start">
                <div className="text-xl font-medium">{item.index}</div>
                <div className="flex-1">
                  <AnimatedText
                    text={item.title}
                    textStyles="text-xl font-medium"
                  />
                  {/*  
                    <h3 className="text-xl font-medium">
                     {item.title}
                    </h3>
                    */}
                </div>
              </div>
              <div>
                <AnimatedText
                  text={item.description}
                  textStyles="text-neutral-grey leading-relaxed text-sm"
                />
                {/*  
                  <p className="text-neutral-grey leading-relaxed text-sm">
                    {item.description}
                  </p>
                  */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
