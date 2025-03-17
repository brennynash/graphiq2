import React from "react";

const DisplaySection = () => {
  return (
    <div className="relative mx-auto p-4 md:p-8">
      {/* Full width section */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 py-12">
          <h2 className="text-5xl font-bold mb-2 md:text-6xl">
            We didn't say <br />
            it first, but we <br />
            said it better
          </h2>
          <p className="text-xl">The secret to a great agency? Great people.</p>
        </div>

        <div className="flex-1 bg-secondary-grey-ish p-8 rounded-lg">
          <h2 className="text-9xl font-bold mb-12 lg:text-[9rem] md:leading-[1]">32</h2>
          <p className="text-base font-tinos md:text-2xl">
            That's how many <br />
            languages we speak if <br />
            we all had 3 beers
          </p>
        </div>
      </div>
      {/* First row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* 100% Remote section */}
        <div className="flex-1 bg-primary-pink p-8 rounded-lg">
          <h2 className="text-6xl font-bold mb-12 lg:text-8xl">
            100%
            <span className="block"> Remote</span>
          </h2>
          <p className="text-base font-tinos md:text-2xl">
            Work is where you are, <br />
            and there is wifi
          </p>
        </div>

        {/* 1Y section */}
        <div className="flex-1 max-w-[34rem] bg-secondary-purple p-8 rounded-lg text-center">
          <h2 className="text-8xl font-bold mb-12 lg:text-9xl">1Y</h2>
          <p className="text-base font-tinos md:text-2xl">
            ~1 year for our startups to <br />
            raise their next funding round <br />
            after working with us <br />
          </p>
        </div>
      </div>

      {/* Second row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Team trips section */}
        <div className="flex-1 bg-secondary-yellow p-8 rounded-lg">
          <h2 className="text-3xl mb-16 text-center font-tinos md:text-6xl">
            Team trips, <br />
            travel budgets, <br />
            real love <br />& a flat structure
          </h2>
          <p className="text-base font-serif text-center md:text-2xl">
            {" "}
            ... a few perks the team enjoys.
          </p>
        </div>

        {/* Culture over section */}
        <div className="flex-1 bg-neutral-black text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-16 md:text-6xl">
            Culture over <br />
            everything
          </h2>
          <p className="text-base font-serif md:text-2xl">
            <span className="line-through block">
              Sacrificing culture over profit
            </span>
            <span className="line-through block">Working overtime</span>
            <span className="line-through block">Strict Hierarchy</span>
            <span className="line-through block">Client is always right</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplaySection;
