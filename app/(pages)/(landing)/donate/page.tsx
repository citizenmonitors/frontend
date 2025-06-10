import Donate from "@/app/components/landing/donate/Donate";
import Image from "next/image";
import React, { Suspense } from "react";

export default function DonatePage() {
  return (
    <div className="container">
      <header className="text-display-sm lg:text-display-lg font-league text-center leading-tight tracking-tight font-bold mb-5 mt-3 lg:mt-[55px] lg:mb-10 lg:text-left">
        <h1 className="text-brand-500">DONATE:</h1>{" "}
        <h2 className="leading-[0.94] text-gray-700">
          Help Us Strengthen, Defend and Expand our Infrastructure
        </h2>
      </header>

      <div className="grid grid-cols-12 mb-16 gap-6 md:gap-12">
        <div className="col-span-12 lg:col-span-5 rounded-[20px] overflow-hidden relative isolate">
          <Image
            src={"/assets/donate/donate.png"}
            alt="Donate Image"
            width={541}
            height={758}
            className="absolute inset-0 -z-10 w-full h-full object-cover object-center"
          />
          <div className="bg-black/65 p-5 flex items-end lg:h-full">
            <div className="bg-white/10 p-3 lg:p-5 text-white rounded-[10px] text-[12px] md:text-sm lg:text-base text-justify">
              Your donation is key to every aspect of our mission—supporting data
              collection, ensuring data quality, securing and storing data, and
              strengthening the overall infrastructure that powers transparent and secure
              electoral surveillance.
              <br />
              <br />
              By supporting Citizen Monitors, you’re not only helping us protect democracy
              but also improving and maintaining the technology and services that ensure
              electoral scrutiny. Your contribution also supports legal services,
              real-time data approvals, and scaling our coverage to reach more regions and
              communities.
              <br />
              <br />
              Be part of the movement—donate today to uphold free and fair elections while
              strengthening the systems that make it all possible.
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <Suspense>
            <Donate />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
