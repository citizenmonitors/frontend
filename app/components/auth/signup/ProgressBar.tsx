"use client";
import React, { useContext, useMemo } from "react";
import { v4 } from "uuid";
import progressCheck from "@/public/assets/auth/progress-check.png";
import Image from "next/image";
import { SignupUserContext } from "../../../(pages)/auth/signup/SignupUserProvider";

function ProgressBar() {
  type ProgressStepProps = {
    state: "not started" | "progress" | "done";
    text: string;
  };

  const ProgressStep = ({ state, text }: ProgressStepProps) => (
    <div
      className={`
      h-8 w-8 md:h-11 md:w-11
      rounded-full
      grid place-content-center
      relative
      ${
        state === "not started"
          ? "bg-none"
          : state === "progress"
          ? "bg-brand-50"
          : state === "done"
          ? "bg-brand-500"
          : ""
      }
    `}
    >
      <span
        className={`
        h-6 w-6 md:h-9 md:w-9 bg-brand-500
        rounded-full ring-inset grid place-items-center
        ${
          state === "not started"
            ? "bg-white ring-brand-50 ring-[6px] md:ring-[8px]"
            : state === "progress"
            ? "bg-white ring-brand-500 ring-[9px] md:ring-[14px]"
            : state === "done"
            ? "bg-brand-500"
            : ""
        }
      `}
      >
        {state === "done" ? (
          <Image src={progressCheck} alt="step completed" className="w-3/5 h-auto" />
        ) : null}
      </span>
      <span className="absolute top-[calc(100%+.5rem)] left-1/2 -translate-x-1/2 text-gray-500 text-[10px] sm:text-xs md:text-sm font-medium text-center lg:whitespace-nowrap">
        {text}
      </span>
    </div>
  );
  const { currentUser } = useContext(SignupUserContext);
  const progressItems = ["Email", "Biodata", "Coverage", "Role"];
  const progressStage = useMemo(() => {
    const { email, dateOfBirth, state } = currentUser;

    if (state) {
      return 3;
    }
    if (dateOfBirth) {
      return 2;
    }
    // Email verified (+ password set) → Email done, Biodata is current step.
    if (email) {
      return 1;
    }
    return 0;
  }, [currentUser]);
  const progressPercent = (progressStage / (progressItems.length - 1)) * 100;

  return (
    <section
      className={`
        signup-progressbar flex justify-between isolate px-5 mb-8 md:mb-12
        relative max-w-[360px] md:max-w-[400px] w-full
    `}
    >
      {progressItems.map((item, index) => (
        <ProgressStep
          key={v4()}
          state={
            progressStage === index
              ? "progress"
              : progressStage > index
              ? "done"
              : "not started"
          }
          text={item}
        />
      ))}
      <div className="progress-state absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[calc(100%-52px)] h-2 md:h-3 bg-brand-50 -z-20 rounded-lg flex">
        <span
          className="progress-state-indicator h-full bg-brand-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        ></span>
      </div>
    </section>
  );
}

export default ProgressBar;
