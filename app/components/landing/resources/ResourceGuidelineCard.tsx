import Image from "next/image";
import React from "react";

type ResourceGuidelineCardProps = {
  children: React.ReactNode;
};
export default function ResourceGuidelineCard({ children }: ResourceGuidelineCardProps) {
  return (
    <article className="grid grid-cols-12 gap-8 pt-2 md:p-8 md:ring-1 ring-gray-200 rounded-lg">
      <Image
        src={"/assets/resources/guideline-inec-logo.png"}
        alt="Inec Logo"
        width={268}
        height={74}
        className="col-span-12 lg:col-span-3 gap-8 mx-auto lg:mx-0"
      />
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">{children}</div>
    </article>
  );
}
