import { Button } from "antd";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Expand from "@/public/assets/icons/expand.svg";
import Collapse from "@/public/assets/icons/collapse.svg";
import { Add } from "iconsax-react";
import VideoPlayer from "./VideoPlayer";
import Link from "next/link";

type SuggestionPopupProps = {
  id: string;
  suggestion: string;
  title: string;
  video: {
    youtubeId: string;
  };
};
export default function SuggestionPopup({
  id,
  suggestion,
  title,
  video,
}: SuggestionPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const key = `cm-suggestion-${id}`;

  // Display the popup
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;

    timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!expanded) {
      setIsPlaying(false);
    }
  }, [expanded]);

  const actionButtons = (
    <div className="flex items-center justify-between gap-1">
      <Button
        className="p-0 !h-[30px] !w-[30px] flex items-center justify-center"
        onClick={() => setExpanded(!expanded)}
        type="text"
      >
        {expanded ? (
          <Image src={Collapse} alt="collapse" width={24} height={24} />
        ) : (
          <Image src={Expand} alt="expand" width={24} height={24} />
        )}
      </Button>
      <Button
        className="p-0 !h-[30px] !w-[30px] flex items-center justify-center"
        onClick={() => {
          setShowPopup(false);
        }}
        type="text"
      >
        <Add size={24} className="text-error-500 rotate-45" />
      </Button>
    </div>
  );

  return (
    <aside
      className={`fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 ${
        showPopup ? "translate-y-0" : "translate-y-[calc(100%+36px)]"
      } transition duration-300 z-50`}
    >
      <article className="bg-white px-4 py-3 rounded ring-1 ring-gray-200 shadow-md shadow-gray-500/20 grid gap-4">
        <header className="flex items-center justify-between gap-5">
          <h3 className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-brand-500 font-bold text-sm sm:text-base md:text-lg font-league">
            <span>{suggestion}</span>
            <div className="w-[6px] h-[6px] rounded-full bg-brand-500 hidden sm:block"></div>
            <span className="text-gray-500 sm:text-brand-500">{title}</span>
          </h3>
          {actionButtons}
        </header>

        {expanded ? (
          <>
            <div>
              <VideoPlayer
                video={video}
                showThumbnail={!isPlaying}
                onPlay={() => {
                  if (expanded) setIsPlaying(true);
                }}
              />
            </div>

            <footer className="flex justify-between items-center gap-6">
              <p className="text-gray-400 text-sm sm:text-base md:text-lg font-league">
                Watch more videos on{" "}
                <Link
                  href="/resources"
                  className="text-brand-500 font-bold hover:underline"
                >
                  Resources
                </Link>
              </p>
              {actionButtons}
            </footer>
          </>
        ) : null}
      </article>
    </aside>
  );
}
