"use client";
import { Select, Tabs } from "antd";
import { BookSaved, DocumentText, HeartCircle, VideoOctagon } from "iconsax-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Support from "../../shared/svg/Support";

export default function ResourceTabs() {
  const router = useRouter();
  const pathName = usePathname();

  const resourceTabs = [
    {
      key: "/resources",
      label: (
        <div className="flex gap-2 items-center">
          <BookSaved variant="Bulk" />
          <span>Featured</span>
        </div>
      ),
      children: null,
      active: true,
    },
    {
      key: "/resources/tutorials",
      label: (
        <div className="flex gap-2 items-center">
          <VideoOctagon variant="Bulk" />
          <span>Tutorials</span>
        </div>
      ),
      children: null,
    },
    {
      key: "/resources/guidelines",
      label: (
        <div className="flex gap-2 items-center">
          <DocumentText variant="Bulk" />
          <span>Guidelines</span>
        </div>
      ),
      children: null,
    },
    {
      key: "/resources/support",
      label: (
        <div className="flex gap-2 items-center">
          <Support size={24} />
          <span>Support</span>
        </div>
      ),
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
        items={resourceTabs}
        onChange={handleTabChange}
        id="resources-tab"
        className="mb-12 hidden md:block"
        centered
        size="large"
      />
      <Select
        size="large"
        className="w-full mb-4 md:hidden"
        value={pathName}
        options={resourceTabs.map(tab => ({
          label: <span className="text-brand-500">{tab.label}</span>,
          value: tab.key
        }))}
        onChange={handleTabChange}
      />
    </React.Fragment>
  );
}
