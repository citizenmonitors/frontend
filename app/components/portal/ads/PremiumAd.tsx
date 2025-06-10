"use client";
import { Button } from "antd";
import { Add, CloseCircle, Crown } from "iconsax-react";
import React, { useState } from "react";

export default function PremiumAd() {
  const [adOpen, setAdOpen] = useState(true);

  return adOpen ? (
    <article className="ring-1 ring-gray-200 rounded-lg py-4 px-3 grid gap-2 relative bg-white">
      <span
        className={`absolute right-1 top-0 -translate-y-1/2 bg-brand-50 border border-brand-500 rounded-full p-1 text-[8px] font-medium text-brand-500`}
      >
        Coming soon
      </span>
      <header className="flex justify-between items-center">
        <h3 className="text-brand-500 font-league flex gap-[.5ch] items-center">
          <Crown className="text-[#EAA613]" variant="Bold" size={20} />{" "}
          <span className="mt-1">Citizen Monitors Plus</span>
        </h3>
        <Button
          type="text"
          className="p-0 rounded-full h-6 w-6 text-gray-400 hover:text-gray-500"
          onClick={() => setAdOpen(false)}
        >
          <Add className="rotate-45" size={24} />
        </Button>
      </header>
      <p className="text-xs text-gray-500">
        Get detailed election data, verified evidence, and incident reports tailored to
        your legal or research needs.
      </p>

      <Button
        type="text"
        size="small"
        className="text-xs ring-1 ring-gray-200 mt-2 !text-brand-500 h-[32px]"
      >
        Get Premium Data
      </Button>
    </article>
  ) : null;
}
