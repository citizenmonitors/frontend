import LandingLayout from "@/app/components/landing/_layout";
import { resultsMetadata } from "@/app/metadata";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = resultsMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LandingLayout>{children}</LandingLayout>;
}
