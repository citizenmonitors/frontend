"use client";
import { guidelineCardsMap, resourceVideos } from "@/app/components/landing/resources/data";
import ResourceVideoCard from "@/app/components/landing/resources/ResourceVideoCard";
import React from "react";

export default function FeaturedResources() {
  const [activeResourceVideo, setActiveResourceVideo] = React.useState<string | null>(
    null
  );
  return (
    <div className="grid gap-10">
      <ResourceVideoCard
        video={resourceVideos[0]}
        active={activeResourceVideo}
        setActive={setActiveResourceVideo}
        horizontal
      />
      <div className="block md:hidden w-full h-[1px] bg-gray-200"></div>
      {guidelineCardsMap.voterRegistration}
      <div className="block md:hidden w-full h-[1px] bg-gray-200"></div>
      <ResourceVideoCard
        video={resourceVideos[2]}
        active={activeResourceVideo}
        setActive={setActiveResourceVideo}
        horizontal
      />
      <div className="block md:hidden w-full h-[1px] bg-gray-200"></div>
      {guidelineCardsMap.voterInclusivity}
      <div className="block md:hidden w-full h-[1px] bg-gray-200"></div>
    </div>
  );
}
