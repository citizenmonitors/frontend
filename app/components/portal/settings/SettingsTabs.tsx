"use client";
import { Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { settingsRoutes } from "@/app/data/portal";

const settingsTabRoutes = settingsRoutes.slice(0, -2);
const settingsTabs = settingsTabRoutes.map((tab) => ({
  key: tab.route,
  label: tab.name,
  children: null,
}));

export default function SettingsTabs() {
  const router = useRouter();
  const pathName = usePathname();
  function handleTabChange(key: string) {
    router.replace(key);
  }

  return pathName !== "/portal/settings" ? (
    <Tabs
      activeKey={pathName}
      items={settingsTabs}
      onChange={handleTabChange}
      id="settings-tab"
      className="mb-4 hidden md:block"
    />
  ) : null;
}
