"use client";
import { Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function VerificationTabs() {
  const router = useRouter();
  const pathName = usePathname();
  function handleTabChange(key: string) {
    router.replace(key);
  }

  const verificationTabs = [
    {
      key: "/admin/verification",
      label: "Awaiting Verification",
      children: null,
    },
    {
      key: "/admin/verification/verified",
      label: "Verified Observers",
      children: null,
    },
  ];
  

  return (
    <div className="flex flex-col">
      <Tabs
        items={verificationTabs}
        defaultActiveKey={pathName}
        onChange={handleTabChange}
        id="verification-tab"
        className="mb-4 hidden md:block"
      />
    </div>
  );
}
