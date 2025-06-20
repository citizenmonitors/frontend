import React, { Fragment } from "react";
import { termsOfUseMetadata } from "@/app/metadata";
import { Metadata } from "next";

export const metadata: Metadata = termsOfUseMetadata;

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <Fragment>{children}</Fragment>;
}