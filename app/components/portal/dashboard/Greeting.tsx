"use client";
import { useAppSelector } from "@/app/hooks/redux";
import useLiveGreeting from "@/app/hooks/useLiveGreeting";
import formatString from "@/app/utils/formatString";
import { SunFog } from "iconsax-react";
import React from "react";

export default function Greeting() {
  const greeting = useLiveGreeting();
  const userDetails = useAppSelector((state) => state.user.details!);

  return (
    <header className="flex items-center gap-2 mb-2">
      <SunFog size={26} className="text-brand-500 md:hidden" />
      <SunFog size={30} className="text-brand-500 hidden md:block" />
      <h2 className="font-league text-xl md:text-display-xs tracking-tight font-medium text-gray-700 leading-[1]">
        {greeting},{" "}
        <span className="text-brand-500">
          {formatString.normalCase([userDetails.firstName, userDetails.lastName])}
        </span>
      </h2>
    </header>
  );
}
