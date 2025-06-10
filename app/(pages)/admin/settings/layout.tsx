"use client";
import SettingsTabs from "@/app/components/admin/settings/SettingsTabs";
import React from "react";

type SettingsLayoutProps = {
  children: React.ReactNode;
};
export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <section>
      <header className="hidden md:block mb-6">
        <h2 className="font-league text-display-sm text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Settings
        </h2>
      </header>
      <SettingsTabs />
      {children}
    </section>
  );
}
