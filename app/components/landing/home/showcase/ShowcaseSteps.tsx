import { ArrowRight } from "iconsax-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import ShowcaseStep1 from "@/public/assets/showcase/showcase-step-1.webp";
import ShowcaseStep4 from "@/public/assets/showcase/showcase-step-4.png";

function ShowcaseSteps() {
  return (
    <div
      id="showcase"
      className="showcase-steps grid grid-cols-2 gap-5 md:gap-8 lg:gap-10 pt-4"
    >
      <article className="flex flex-col rounded-[20px] ring-1 ring-gray-300 md:flex-row col-span-2 hover:bg-brand-400 hover:ring-brand-400 transition-colors group/showcase-card duration-300 min-h-[380px] lg:min-h-[400px]">
        {/* Step Number */}
        <div className="flex justify-center md:flex-col md:justify-start p-7 pb-3 md:p-7 lg:py-12 lg:px-10">
          <span className="[--size:36px] lg:[--size:60px] w-[var(--size)] h-[var(--size)] rounded-full ring-1 ring-gray-700 grid place-items-center text-gray-700 text-display-sm lg:text-display-lg font-league group-hover/showcase-card:text-white group-hover/showcase-card:ring-white transition-all duration-300">
            1
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 px-7 md:px-0 md:py-7 justify-between lg:py-12">
          <header>
            <h3 className="text-display-xs lg:text-display-base xl:text-display-lg lg:leading-[1] sm:text-display-sm font-league text-center font-semibold text-gray-700 -tracking-[0.48px] leading-[1.1] md:text-left group-hover/showcase-card:text-white transition-colors duration-300">
              Attach evidence of election result or incident in picture or video format.
            </h3>
          </header>
          <p className="text-gray-500 text-sm text-center sm:text-base font-light md:text-left group-hover/showcase-card:text-white duration-300">
            Capture and upload a quality picture or video of the official election result
            or incident in your polling unit.
          </p>
          <Link
            href={"/#faq"}
            className="mx-auto md:mx-0 flex gap-2 items-center py-[10px] text-brand-500 text-sm sm:text-base w-fit font-semibold group/showcase-step-link group-hover/showcase-card:text-white duration-300"
          >
            Learn More
            <ArrowRight
              variant="Linear"
              size={18}
              className="group-hover/showcase-step-link:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Image */}
        <div
          className={`
          flex
          h-[256px]
          md:h-full md:min-w-[256px]
          lg:min-w-[382px]
        `}
        >
          <Image
            src={ShowcaseStep1}
            className="w-full object-contain object-center md:mt-auto md:w-full"
            alt="grayscale image of a fist"
            width={512}
            height={512}
          />
        </div>
      </article>

      <article className="flex flex-col rounded-[20px] ring-1 ring-gray-300 md:flex-row col-span-2 md:col-span-1 hover:bg-brand-400 hover:ring-brand-400 transition-colors group/showcase-card duration-300 group/showcase-step">
        {/* Step Number */}
        <div className="flex justify-center md:flex-col md:justify-start p-7 pb-3 md:p-7 lg:py-12 lg:px-10">
          <span className="[--size:36px] lg:[--size:60px] w-[var(--size)] h-[var(--size)] rounded-full ring-1 ring-gray-700 grid place-items-center text-gray-700 text-display-sm lg:text-display-lg font-league group-hover/showcase-card:text-white group-hover/showcase-card:ring-white transition-all duration-300">
            2
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-7 pt-0 md:p-7 md:pl-0 lg:py-12 justify-between">
          <header>
            <h3 className="text-display-xs lg:text-display-base xl:text-display-lg lg:leading-[1] sm:text-display-sm font-league text-center font-semibold text-gray-700 -tracking-[0.48px] leading-[1.1] md:text-left group-hover/showcase-card:text-white transition-colors duration-300">
              Manually input each political party’s result or submit an incidence report.
            </h3>
          </header>
          <p className="text-gray-500 text-sm text-center sm:text-base font-light md:text-left group-hover/showcase-card:text-white duration-300">
            Write an incident report or input the total vote for each political party in
            agreement with your uploaded picture or video.
          </p>
          <Link
            href={"/#faq"}
            className="mx-auto md:mx-0 flex gap-2 items-center py-[10px] text-brand-500 text-sm sm:text-base w-fit font-semibold group/showcase-step-link group-hover/showcase-card:text-white duration-300"
          >
            Learn More
            <ArrowRight
              variant="Linear"
              size={18}
              className="group-hover/showcase-step-link:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </article>

      <article className="flex flex-col rounded-[20px] ring-1 ring-gray-300 md:flex-row col-span-2 md:col-span-1 hover:bg-brand-400 hover:ring-brand-400 transition-colors group/showcase-card duration-300 group/showcase-step">
        {/* Step Number */}
        <div className="flex justify-center md:flex-col md:justify-start p-7 pb-3 md:p-7 lg:py-12 lg:px-10">
          <span className="[--size:36px] lg:[--size:60px] w-[var(--size)] h-[var(--size)] rounded-full ring-1 ring-gray-700 grid place-items-center text-gray-700 text-display-sm lg:text-display-lg font-league group-hover/showcase-card:text-white group-hover/showcase-card:ring-white transition-all duration-300">
            3
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-7 pt-0 md:p-7 md:pl-0 lg:py-12 justify-between">
          <header>
            <h3 className="text-display-xs lg:text-display-base xl:text-display-lg lg:leading-[1] sm:text-display-sm font-league text-center font-semibold text-gray-700 -tracking-[0.48px] leading-[1.1] md:text-left group-hover/showcase-card:text-white transition-colors duration-300">
              Click upload, rate your polling unit and preview.
            </h3>
          </header>
          <p className="text-gray-500 text-sm text-center sm:text-base font-light md:text-left group-hover/showcase-card:text-white duration-300">
            Submit the incident or result and rate the efficiency of your polling unit as
            an observer.
          </p>
          <Link
            href={"/#faq"}
            className="mx-auto md:mx-0 flex gap-2 items-center py-[10px] text-brand-500 text-sm sm:text-base w-fit font-semibold group/showcase-step-link group-hover/showcase-card:text-white duration-300"
          >
            Learn More
            <ArrowRight
              variant="Linear"
              size={18}
              className="group-hover/showcase-step-link:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </article>

      <article className="flex flex-col rounded-[20px] ring-1 ring-gray-300 md:flex-row col-span-2 overflow-hidden hover:bg-brand-400 hover:ring-brand-400 transition-colors group/showcase-card duration-300 min-h-[380px] lg:min-h-[400px]">
        {/* Step Number */}
        <div className="flex justify-center md:flex-col md:justify-start p-7 pb-3 md:p-7 lg:py-12 lg:px-10">
          <span className="[--size:36px] lg:[--size:60px] w-[var(--size)] h-[var(--size)] rounded-full ring-1 ring-gray-700 grid place-items-center text-gray-700 text-display-sm lg:text-display-lg font-league group-hover/showcase-card:text-white group-hover/showcase-card:ring-white transition-all duration-300">
            4
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 px-7 md:px-0 md:py-7 justify-between lg:py-12 lg:pr-6">
          <header>
            <h3 className="text-display-xs lg:text-display-base xl:text-display-lg lg:leading-[1] sm:text-display-sm font-league text-center font-semibold text-gray-700 -tracking-[0.48px] leading-[1.1] md:text-left group-hover/showcase-card:text-white transition-colors duration-300">
              View aggregated live data of observers as Collaborative Power in progress.
            </h3>
          </header>
          <p className="text-gray-500 text-sm text-center sm:text-base font-light md:text-left group-hover/showcase-card:text-white duration-300 md:pb-12 md:pr-2">
            Follow your peer-reviewed and admin-approved election data in progress
          </p>
          <Link
            href={"/auth/signup"}
            className="mx-auto md:mx-0 flex gap-2 items-center py-[10px] text-brand-500 text-sm sm:text-base w-fit font-semibold group/showcase-step-link group-hover/showcase-card:text-white duration-300"
          >
            Let's Begin
            <ArrowRight
              variant="Linear"
              size={18}
              className="group-hover/showcase-step-link:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Image */}
        <div
          className={`
          flex
          h-[256px]
          md:h-full md:min-w-[256px]
          lg:min-w-[382px]
          pointer-events-none
        `}
        >
          <Image
            src={ShowcaseStep4}
            className="w-full object-contain object-center mx-auto md:mt-auto scale-[1] md:scale-[1.3] origin-bottom-right"
            alt="grayscale image of a fist"
            width={658}
            height={512}
          />
        </div>
      </article>
    </div>
  );
}

export default ShowcaseSteps;
