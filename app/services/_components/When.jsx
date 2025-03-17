import { CornerDownRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const WhenSection = () => {
  const stages = [
    {
      title: "Sprint",
      url:"/sprint",
      description:
        "Sprints are 1-month projects designed to create a brand or website quickly and efficiently for early-stage startups",
    },
    {
      title: "Branding Projects",
      url:"/branding",
      description:
        "Our best seller; a comprehensive brand package aimed at elevating your business to the next level. Our holisitic approach to branding, reflecting our core expertise.",
    },
    {
      title: "Subscription",
      url:"/subscription",
      description:
        "Subscriptions are our way of collaboraing long-term with clients, acting as their extended team to ensure brand consistency and growth.",
    },
    {
      title: "Venture",
      url:"/venture",
      description:
        "Venture relationships invlove high-commitment where we invest our expertise and resources in exchange for shares.",
    },
  ];
  return (
    <section className="overflow-hidden min-h-screen px-4 py-4 md:p-8">
      <div className="flex flex-col gap-16 lg:flex-row">
        <div className="max-w-md max-md:border-t max-md:border-neutral-light-grey py-4 md:p-8">
          <h1 className="text-xl font-semibold mb-6 md:text-sm">When?</h1>
          <p className="text-2xl font-serif">
            Post-seed, post-launch or getting ready for the next big step, we do
            branding for startups at any stage of the journey
          </p>
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-x-8">
          {stages.map((stage) => (
            <Link
              key={stage.title}
              className="group flex flex-col justify-between relative py-4 md:p-8 hover:md:bg-primary-pink md:rounded-md max-md:border-t max-md:border-neutral-light-grey"
              href={stage.url}
            >
              <div className="mb-2">
                <h1 className="text-3xl font-semibold mb-4">{stage.title}</h1>
                <div className="flex items-center justify-between gap-8">
                  <p className="text-lg md:text-base">{stage.description}</p>
                  <div>
                    <div className="w-12 h-12 rounded-full bg-primary-pink flex items-center justify-center md:hidden">
                      <CornerDownRight size={20} color="#1E1E1E" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full hidden md:flex justify-end md:opacity-0 md:translate-x-10 group-hover:md:opacity-100 group-hover:md:translate-x-0 transition-all md:duration-500">
                <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center md:bg-neutral-white">
                  <CornerDownRight size={16} color="#1E1E1E" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhenSection;
