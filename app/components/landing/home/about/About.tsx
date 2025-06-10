import React from "react";
import "./About.css";
import AboutContentMobile from "./AboutContentMobile";
import { v4 } from "uuid";

function About() {
  const backgroundStyles: React.CSSProperties = {
    background: `
      url("/assets/bg-pattern-1.jpg")
    `,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  const content = [
    `At Citizen Monitors, we believe data should be upright - This platform stands at the forefront of harnessing the power of data to drive positive change across the continent. Our primary objective is to enable citizens of Nigeria and Africa to subtly own, strategically aggregate, and bravely use data to hold institutions of political and electoral power accountable through crowdsourcing technology.`,
    `This platform has become the system that brings truth to the fore and provides a sense of power that collectively belongs to the people. We aim to foster transparency and fierce accountability powered by the people. Citizen Monitors' ultimate vision is to leverage data as a transformative tool to rectify electoral, political and governance fraud and to promote fairness and equity in African democracies.`,
  ];

  return (
    <div id="about" className="about-container grid-center" style={backgroundStyles}>
      <section className="container py-8 md:py-[60px] lg:px-16 xl:px-24">
        <header className="mb-4 sm:mb-8 md:mb-10">
          <h2 className="font-bold text-center text-gray-700 font-league text-display-sm sm:text-display-base md:text-display-lg md:text-right">
            ABOUT <span className="text-brand-500">US.</span>
          </h2>
        </header>
        <section className="grid grid-cols-12 gap-4 sr-only about-main-content md:not-sr-only">
          <header className="flex-col hidden col-span-3 col-start-1 text-gray-700 about-header md:flex">
            <h3 className="pb-6 font-bold text-display-xs font-league">Why Citizen Monitors?</h3>
            <h3 className="pb-6 font-bold text-display-xs font-league">About Us.</h3>
          </header>
          <article className="flex flex-col col-span-9 col-start-4 gap-6 text-base text-gray-500 about-content lg:text-lg">
            {content.map((paragraph) => (
              <p className="text-justify" key={v4()}>{paragraph}</p>
            ))}
          </article>
        </section>
        <AboutContentMobile content={content} />
      </section>
    </div>
  );
}

export default About;
