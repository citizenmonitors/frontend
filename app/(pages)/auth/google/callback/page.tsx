"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login");
  }, [router]);

  return <p className="text-center text-sm text-gray-500">Redirecting to sign in…</p>;
}
