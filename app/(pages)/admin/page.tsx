"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function Portal() {
  const router = useRouter();
  router.replace("/admin/dashboard");

  return <div></div>;
}