"use client";

import { Image as AntImage, Modal } from "antd";
import { Play } from "iconsax-react";
import React, { useMemo, useState } from "react";

type MediaItem =
  | { type: "image"; url: string; key: string }
  | { type: "video"; url: string; key: string };

type ElectionDiscussionMediaCollageProps = {
  imageUrls: string[];
  videoUrls: string[];
};

function getGridClass(count: number): string {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-2";
  return "grid-cols-2";
}

function getCellClass(count: number, index: number): string {
  if (count === 1) return "col-span-1 min-h-[200px] max-h-[420px] md:min-h-[240px] md:max-h-[480px]";
  if (count === 2) return "col-span-1 min-h-[180px] max-h-[320px] md:min-h-[220px] md:max-h-[360px]";
  if (count === 3) {
    return index === 0
      ? "col-span-1 row-span-2 min-h-[240px] max-h-[420px] md:min-h-[280px]"
      : "col-span-1 min-h-[118px] max-h-[200px] md:min-h-[136px]";
  }
  if (index === 0) return "col-span-2 min-h-[180px] max-h-[280px] md:min-h-[220px] md:max-h-[320px]";
  return "col-span-1 min-h-[120px] max-h-[180px] md:min-h-[140px] md:max-h-[200px]";
}

export default function ElectionDiscussionMediaCollage({
  imageUrls,
  videoUrls,
}: ElectionDiscussionMediaCollageProps) {
  const media = useMemo<MediaItem[]>(
    () => [
      ...imageUrls.map((url, index) => ({
        type: "image" as const,
        url,
        key: `image-${index}-${url}`,
      })),
      ...videoUrls.map((url, index) => ({
        type: "video" as const,
        url,
        key: `video-${index}-${url}`,
      })),
    ],
    [imageUrls, videoUrls]
  );

  const [previewImagesVisible, setPreviewImagesVisible] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  if (media.length === 0) return null;

  const imageOnlyUrls = media
    .filter((item): item is Extract<MediaItem, { type: "image" }> => item.type === "image")
    .map((item) => item.url);

  const visibleMedia = media.slice(0, 4);
  const overflowCount = media.length - visibleMedia.length;
  const count = visibleMedia.length;

  function openMedia(item: MediaItem) {
    if (item.type === "video") {
      setActiveVideoUrl(item.url);
      return;
    }

    const imageIndex = imageOnlyUrls.indexOf(item.url);
    setPreviewImageIndex(Math.max(imageIndex, 0));
    setPreviewImagesVisible(true);
  }

  return (
    <>
      <div
        className={`mb-4 grid gap-1 overflow-hidden rounded-xl bg-gray-200 ${getGridClass(
          count
        )}`}
      >
        {visibleMedia.map((item, index) => {
          const isLastVisible = index === visibleMedia.length - 1 && overflowCount > 0;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => openMedia(item)}
              className={`relative flex w-full items-center justify-center overflow-hidden bg-gray-900/90 text-left ${getCellClass(
                count,
                index
              )}`}
            >
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt="Discussion media"
                  className="h-full w-full object-contain"
                />
              ) : (
                <>
                  <video
                    src={item.url}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-contain"
                  />
                  <span className="pointer-events-none absolute inset-0 grid place-content-center bg-black/25">
                    <span className="rounded-full bg-white/90 p-3">
                      <Play size={22} className="text-gray-800" variant="Bold" />
                    </span>
                  </span>
                </>
              )}

              {isLastVisible && (
                <span className="absolute inset-0 grid place-content-center bg-black/55 text-2xl font-semibold text-white">
                  +{overflowCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {imageOnlyUrls.length > 0 && (
        <AntImage.PreviewGroup
          preview={{
            visible: previewImagesVisible,
            current: previewImageIndex,
            onVisibleChange: (visible) => setPreviewImagesVisible(visible),
            onChange: (current) => setPreviewImageIndex(current),
          }}
          items={imageOnlyUrls}
        />
      )}

      <Modal
        open={!!activeVideoUrl}
        onCancel={() => setActiveVideoUrl(null)}
        footer={null}
        centered
        width={720}
        destroyOnClose
        title="Video"
      >
        {activeVideoUrl && (
          <video
            src={activeVideoUrl}
            controls
            autoPlay
            className="mx-auto block w-full max-h-[70vh] rounded-lg bg-black object-contain"
          />
        )}
      </Modal>
    </>
  );
}
