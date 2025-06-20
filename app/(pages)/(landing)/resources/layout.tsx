import LandingLayout from "@/app/components/landing/_layout";
import React from "react";
import "@/app/components/landing/resources/Resources.css";
import { Metadata } from "next";
import { resourcesMetadata } from "@/app/metadata";
import ResourcesLayout from "@/app/components/landing/resources/_layout";

export const metadata: Metadata = resourcesMetadata;

export default function Layout({ children }: any) {
  return (
    <LandingLayout>
      <ResourcesLayout>
        {children}
      </ResourcesLayout>
    </LandingLayout>
  );
}
