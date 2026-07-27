"use client";

import CitizenAcademyView from "@/app/components/portal/settings/CitizenAcademyView";
import React from "react";

const academyBasePath = "/admin/settings/citizen-academy";

export default function CitizenAcademy() {
  return (
    <CitizenAcademyView basePath={academyBasePath} backHref="/admin/settings" />
  );
}
