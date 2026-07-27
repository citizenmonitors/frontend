import { setPasswordMetadata } from "@/app/metadata";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = setPasswordMetadata;

export default function SetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
