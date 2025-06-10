"use client";
import React, { useState } from "react";
import { v4 } from "uuid";

type AboutContentMobileProps = {
  content: string[];
};

export default function AboutContentMobile({ content }: AboutContentMobileProps) {
  const [allContentShown, setAllContentShown] = useState(false);
  const mobileContent = content.slice(0, allContentShown ? content.length : 1);
  return (
    <article
      className="about-main-content-mobile md:hidden text-gray-500 flex flex-col gap-4"
      aria-hidden
    >
      {mobileContent.map((paragraph) => (
        <p key={v4()} className="text-justify">{paragraph}</p>
      ))}
      <button
        className={`text-brand-500 font-medium text-left`}
        onClick={() => setAllContentShown((prev) => !prev)}
      >
        {
          allContentShown ? "Read less" : "Read More..."
        }
      </button>
    </article>
  );
}
