import { resultsMetadata } from "@/app/metadata";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  ...resultsMetadata,
  title: "Election Result | Citizen Monitors",
};

/** Parent /results layout already wraps LandingLayout — do not nest it again. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
