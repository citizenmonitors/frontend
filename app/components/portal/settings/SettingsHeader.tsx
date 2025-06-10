import { dashboardPaths } from "@/app/data/portal";
import { Button } from "antd";
import { ArrowLeft2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import React from "react";

type SettingsHeaderProps = {
  children: React.ReactNode;
};
export default function SettingsHeader({ children }: SettingsHeaderProps) {
  const router = useRouter();
  function handleRouterBack() {
    router.replace(dashboardPaths.settings);
  }

  return (
    <header className="grid gap-4 mb-6 md:hidden">
      <Button
        type="text"
        className="flex text-gray-600 items-center gap-1 px-1 w-fit"
        onClick={handleRouterBack}
      >
        <ArrowLeft2 size={20} /> <span className="font-medium text-sm">Go Back</span>
      </Button>

      <h2 className="font-league text-display-sm text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
        {children}
      </h2>
    </header>
  );
}
