import { FileType } from "@/app/data/acceptedFileTypes";
import Image from "next/image";
import React from "react";

type UploadIconProps = {
  fileType?: FileType;
  size?: "small" | "default";
};

export default function UploadIcon({ fileType, size }: UploadIconProps) {
  const emptyIcon = "/assets/uploads/file-empty.svg";
  const fileIconMap: Record<Required<UploadIconProps>["fileType"], string> = {
    "image/png": "/assets/uploads/file-png.svg",
    "image/jpeg": "/assets/uploads/file-jpg.svg",
    "image/gif": "/assets/uploads/file-gif.svg",
    "application/pdf": "/assets/uploads/file-pdf.svg",
    "video/mp4": "/assets/uploads/file-video.svg",
    "video/quicktime": "/assets/uploads/file-video.svg",
  };
  const radius = size === "small" ? "48px" : "56px";
  const iconSize = size === "small" ? 24 : 28;

  return (
    <div
      className="bg-gray-100 rounded-full grid place-items-center"
      style={{ width: radius, height: radius }}
    >
      <Image
        src={fileType ? fileIconMap[fileType] : emptyIcon}
        alt="upload-icon"
        style={{ width: iconSize, height: iconSize }}
        width={56}
        height={56}
      />
    </div>
  );
}
