import React from "react";

type DisclaimerProps = {
  variant?: "landing" | "dashboard";
};
export default function Disclaimer({ variant = "landing" }: DisclaimerProps) {
  return (
    <article
      className={`text-error-600 flex flex-col p-6 md:p-10 ring-1 transition-all ${
        variant === "landing"
          ? "ring-error-100 rounded-[20px] gap-4 hover:bg-error-600 hover:text-white duration-700"
          : "ring-error-600 rounded-[6px] gap-[10px] mt-6"
      }`}
    >
      <h2
        className={`font-league tracking-tight leading-tight text-center ${
          variant === "landing"
            ? "text-display-xs md:text-display-base font-bold"
            : "text-display-xs font-bold md:font-medium"
        }`}
      >
        DISCLAIMER:
      </h2>
      <p
        className={`italic font-light text-center ${
          variant === "landing" ? "text-sm md:text-base" : "text-xs md:text-sm"
        }`}
      >
        The data presented on this platform is for monitoring, legal and research purposes
        only. It reflects aggregate, peer-reviewed submissions from accredited observers
        and volunteers. These results are not official and do not represent a declaration
        of election outcomes. Only the Independent National Electoral Commission (INEC) is
        authorized to declare official results. Citizen Monitors provides this data as a
        transparency tool for public accountability.
      </p>
    </article>
  );
}
