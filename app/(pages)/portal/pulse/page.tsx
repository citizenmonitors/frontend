"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Pulse moved to the public site — keep old portal URL working */
export default function PortalPulseRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pulse");
  }, [router]);

  return null;
}
