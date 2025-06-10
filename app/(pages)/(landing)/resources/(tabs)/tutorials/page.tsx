"use client";
import { resourceVideos } from "@/app/components/landing/resources/data";
import ResourceVideoCard from "@/app/components/landing/resources/ResourceVideoCard";
import React, { useMemo, useState } from "react";

export default function TutorialResources() {
  const videos = useMemo(() => resourceVideos, []);

  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-10">
      {videos.map((video) => (
        <React.Fragment key={video.id}>
          <ResourceVideoCard
            active={activeVideo}
            setActive={setActiveVideo}
            key={video.id}
            video={video}
          />
          <div className="w-full h-[1px] bg-gray-200 md:hidden" />
        </React.Fragment>
      ))}
    </div>
  );
}
