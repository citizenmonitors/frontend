"use client";
import { Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function ElectionsTabs() {
  const router = useRouter();
  const pathName = usePathname();

  const electionTabs = [
    {
      key: "/admin/elections",
      label: "Ongoing Elections",
      children: null,
      active: true,
    },
    {
      key: "/admin/elections/previous",
      label: "Previous Elections",
      children: null,
    },
  ];

  function handleTabChange(key: string) {
    router.replace(key);
  }

  return (
    <React.Fragment>
      <Tabs
        activeKey={pathName}
        items={electionTabs}
        onChange={handleTabChange}
        id="elections-tab"
        className="mb-2"
        centered={window.innerWidth < 768}
      />
    </React.Fragment>
  );
}
