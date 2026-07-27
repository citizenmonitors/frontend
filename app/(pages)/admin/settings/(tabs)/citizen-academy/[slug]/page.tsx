"use client";

import CitizenAcademyView from "@/app/components/portal/settings/CitizenAcademyView";
import { useParams } from "next/navigation";
import React from "react";

const academyBasePath = "/admin/settings/citizen-academy";

export default function CitizenAcademyArticle() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : undefined;

  return (
    <CitizenAcademyView
      slug={slug}
      basePath={academyBasePath}
      backHref="/admin/settings"
    />
  );
}
