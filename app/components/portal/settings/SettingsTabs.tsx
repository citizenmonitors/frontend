"use client";
import { Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { getSettingsMainRoutes } from "@/app/data/portal";
import { useAppSelector } from "@/app/hooks/redux";

export default function SettingsTabs() {
  const router = useRouter();
  const pathName = usePathname();
  const userDetails = useAppSelector((state) => state.user.details!);
  const settingsTabRoutes = getSettingsMainRoutes(userDetails.role);
  const settingsTabs = settingsTabRoutes.map((tab) => ({
    key: tab.route,
    label: tab.name,
    children: null,
  }));

  function handleTabChange(key: string) {
    router.replace(key);
  }

  function getActiveTab(pathName: string) {
    const matched = settingsTabRoutes.find(
      (route) =>
        pathName === route.route || pathName.startsWith(`${route.route}/`)
    );
    return matched?.route ?? pathName;
  }

  return pathName !== "/portal/settings" ? (
    <Tabs
      activeKey={getActiveTab(pathName)}
      items={settingsTabs}
      onChange={handleTabChange}
      id="settings-tab"
      className="mb-4 hidden md:block"
    />
  ) : null;
}
