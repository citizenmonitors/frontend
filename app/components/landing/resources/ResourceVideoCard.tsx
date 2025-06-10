"use client";
import { useAppDispatch } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { Button } from "antd";
import { PlayCircle, Share } from "iconsax-react";
import Image from "next/image";
import React, { SetStateAction, useState } from "react";
import VideoPlayer from "../../shared/VideoPlayer";

type ResourceVideoCardProps = {
  active: string | null;
  setActive: React.Dispatch<SetStateAction<string | null>>;
  video: {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
  };
  horizontal?: boolean;
};

export default function ResourceVideoCard({
  active,
  setActive,
  video,
  horizontal = false,
}: ResourceVideoCardProps) {
  const dispatch = useAppDispatch();

  function handleShareClick() {
    const shareData = {
      title: video.title,
      text: video.title,
      url: `https://www.youtube.com/watch?v=${video.youtubeId}&ab_channel=CitizenMonitors`,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => {
          dispatch(showAlert({ message: "Shared successfully.", type: "success" }));
        })
        .catch((error) => console.error("Error sharing:", error));
    } else if (navigator.clipboard) {
      // Copy to clipboard as a fallback
      navigator.clipboard.writeText(shareData.url).then(() => {
        dispatch(showAlert({ message: "Link copied to clipboard.", type: "success" }));
      });
    } else {
      dispatch(
        showAlert({ message: "Sharing not supported on this browser.", type: "error" })
      );
    }
  }

  return (
    <article
      className={`gap-4 lg:gap-8 md:p-8 md:ring-1 ring-gray-200 rounded-lg ${
        horizontal ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col max-w-[600px]"
      }`}
    >
      <div className="flex flex-col gap-4">
        <VideoPlayer
          video={video}
          showThumbnail={active !== video.id}
          onPlay={() => setActive(video.id)}
        />
        <div className="flex justify-between items-center">
          <span className="font-league font-bold text-sm bg-brand-500 text-white pt-2 pb-1 px-2 rounded">
            Caption Enabled
          </span>

          <Button
            type="primary"
            className="flex gap-2 items-center text-sm font-league font-bold"
            onClick={handleShareClick}
          >
            <Share size={18} />
            <span className="pt-[2px]">Share</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="leading-tight font-league font-bold text-gray-700 text-display-xs">
          {video.title}
        </h3>
        <p className="lg:text-lg text-gray-500">{video.description}</p>
      </div>
    </article>
  );
}
