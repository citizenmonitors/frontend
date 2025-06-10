"use client";
import { Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function OutboxTabs() {
  const router = useRouter();
  const pathName = usePathname();

  const outboxTabs = [
    {
      key: "/admin/outbox",
      label: "New Broadcast",
      children: null,
      active: true,
    },
    {
      key: "/admin/outbox/previous",
      label: "Previous Broadcasts",
      children: null,
    },
  ];

  function handleTabChange(key: string) {
    router.replace(key);
  }

  return (
    <Tabs
      activeKey={pathName}
      items={outboxTabs}
      onChange={handleTabChange}
      id="outbox-tab"
      className="mb-2"
      centered={window.innerWidth < 768}
    />
  );
}
