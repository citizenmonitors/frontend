import { PlayCircle } from "iconsax-react";
import Image from "next/image";
import React from "react";

type VideoPlayerProps = {
  video: {
    youtubeId: string;
  };
  showThumbnail: boolean;
  onPlay: () => void;
};

export default function VideoPlayer({ video, onPlay, showThumbnail }: VideoPlayerProps) {
  return (
    <div
      className={`wrapper rounded h-fit overflow-hidden bg-gray-200 flex justify-center`}
    >
      {!showThumbnail ? (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full aspect-[560/315]"
        />
      ) : (
        <div className="relative flex justify-center w-full aspect-[560/315] isolate">
          <Image
            src={`https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`}
            alt="yt thumbnail"
            priority
            width="560"
            height="315"
            className="h-full ring-1 w-full -z-30"
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="scale-75 md:scale-100 icon absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h- cursor-pointer">
            <PlayCircle
              size={100}
              variant="Bulk"
              className="text-white hover:scale-105 transition"
              onClick={onPlay}
            />
          </div>
        </div>
      )}
    </div>
  );
}
