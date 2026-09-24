"use client";
import React from "react";
import { TypeAnimation } from "react-type-animation";

function IntroHeader() {
  return (
    <h1 className="text-[32px] sm:text-[42px] md:text-display-xl lg:text-display-xxl font-league font-bold text-gray-700 leading-[1.05] text-center md:text-left break-words">
      Crowdsourcing <br className="hidden lg:block" /> Electoral Data <span className="sr-only">for Public Good.</span>
      <br />
      <TypeAnimation
        className="text-brand-400 inline-block min-h-[48px] md:min-h-[65px] w-full"
        sequence={["for Public Good.",2000,""]}
        speed={1}
        repeat={Infinity}
        aria-hidden
      />
    </h1>
  );
}

export default IntroHeader;
