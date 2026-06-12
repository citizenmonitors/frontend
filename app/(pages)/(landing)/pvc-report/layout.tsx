import LandingLayout from "@/app/components/landing/_layout";
import { pvcReportMetadata } from "@/app/metadata";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = pvcReportMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LandingLayout>{children}</LandingLayout>;
}
