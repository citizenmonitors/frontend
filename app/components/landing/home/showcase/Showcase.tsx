import Image from "next/image";
import React from "react";
import ShowcasePeople from "@/public/assets/showcase/showcase-people.webp";
import ShowcaseSteps from "./ShowcaseSteps";
import { Button } from "antd";
import { ArrowRight } from "iconsax-react";
import Link from "next/link";

function Showcase() {
  return (
    <div className="showcase-container grid-center">
      <section className="container py-8 md:py-[60px]">
        <Image
          src={ShowcasePeople}
          alt="grayscale image of people raising their hands up"
          className="w-full mb-16 md:mb-24 lg:mb-32"
        />
        {/* <div className="grid place-items-center mb-12 md:mb-[100px] lg:mb-[120px]">
          <Link href={"/insights"} className="rounded-lg">
            <Button
              size="large"
              className="text-lg md:text-display-xs font-league font-semibold px-4 md:px-8 h-[38px] md:h-[52px] leading-[1] group/view-case-study hover:!bg-brand-500 hover:!text-white"
            >
              View Case Study
              <div className="aspect-square relative h-[18px] w-[18px] md:h-[24px] md:w-[24px]">
                <ArrowRight size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[.75] md:scale-100 transition group-hover/view-case-study:opacity-0" />
                <ArrowRight size={24} className="absolute -rotate-45 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[.75] md:scale-100 transition opacity-0 group-hover/view-case-study:opacity-100" />
              </div>
            </Button>
          </Link>
        </div> */}

        <header className="mb-4">
          <h2 className="font-bold text-center text-gray-700 font-league text-display-sm sm:text-display-base md:text-display-lg leading-tight">
            <span className="text-brand-500">ELECTION DATA</span> PROCESS
            <span className="text-brand-500">.</span>
          </h2>
        </header>
        <ShowcaseSteps />
      </section>
    </div>
  );
}

export default Showcase;
