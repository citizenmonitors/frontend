"use client";

import ElectionDetailView from "@/app/components/landing/results/detail/ElectionDetailView";
import React from "react";

export default function ElectionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ElectionDetailView slug={params.slug} />;
}
