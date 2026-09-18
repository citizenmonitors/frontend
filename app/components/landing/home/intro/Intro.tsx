import React from "react";
import IntroHeader from "./IntroHeader";
import { Button } from "antd";
import Link from "next/link";
import { ArrowRight } from "iconsax-react";
import IntroCollapse from "./IntroCollapse";
import "./Intro.css";

function Intro() {
  return (
    <div className="intro-container grid-center">
      <section className="container grid grid-cols-12 gap-2 py-8 md:py-[60px]">
        <div className="main-section col-start-1 col-span-12 md:col-span-7 flex flex-col">
          <IntroHeader />
          <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-[450px] md:max-w-none text-center md:text-left w-full mx-auto md:mx-0 mt-10 italic">
            “The power of the people is greater than the people in power.” <br className="hidden xl:block" />- Alexei
            Navalny.
          </p>
          <div className="intro-buttons flex flex-col gap-6 justify-center sm:flex-row sm:gap-5 mt-10 md:justify-start md:mt-6">
            <Link href={"/auth/login"} tabIndex={-1} className="w-full sm:w-auto">
              <Button
                className="flex items-center gap-[1ch] font-medium justify-center h-[48px] lg:h-[55px] lg:px-6"
                block
                size="large"
                type="primary"
              >
                <span>Sign Up/Register Here</span>
                <ArrowRight variant="Outline" size={16} />
              </Button>
            </Link>
            <Link href={"/pulse"} tabIndex={-1} className="w-full sm:w-auto">
              <Button
                className="flex items-center gap-[.5ch] font-medium justify-center h-[48px] lg:h-[55px] lg:px-6"
                block
                size="large"
              >
                <span>Share and View with Pulse</span>
              </Button>
            </Link>
          </div>
        </div>
        <aside className="other-section col-start-8 col-span-5 hidden md:grid pt-4 text-gray-500 md:min-h-[420px] lg:min-h-0 xl:px-6">
          <IntroCollapse />
        </aside>
      </section>
    </div>
  );
}

export default Intro;
