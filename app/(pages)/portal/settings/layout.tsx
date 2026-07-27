"use client";
import React from "react";
import { usePathname } from "next/navigation";
import SettingsTabs from "../../../components/portal/settings/SettingsTabs";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathName = usePathname();
  const isCitizenAcademy = pathName.startsWith("/portal/settings/citizen-academy");

  return (
    <section>
      {!isCitizenAcademy && (
        <header className="hidden md:block mb-6">
          <h2 className="font-league text-display-sm text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
            Settings
          </h2>
        </header>
      )}
      {!isCitizenAcademy && <SettingsTabs />}
      {children}
    </section>
  );
}
