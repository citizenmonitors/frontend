import { guidelineCardsMap } from "@/app/components/landing/resources/data";
import React from "react";

export default function GuidelineResources() {
  return (
    <div className="grid gap-10">
      {Object.values(guidelineCardsMap).map((card, index) => (
        <React.Fragment key={index}>
          {card}
          <div className="block md:hidden w-full h-[1px] bg-gray-200"></div>
        </React.Fragment>
      ))}
    </div>
  );
}
