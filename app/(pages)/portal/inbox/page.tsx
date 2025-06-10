"use client";
import InboxDisplay from "@/app/components/portal/inbox/InboxDisplay";
import { Button } from "antd";
import { ArrowLeft2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

export default function Inbox() {
  const router = useRouter();

  function handleRouterBack() {
    router.back();
  }

  return (
    <div>
      <Button
        type="text"
        className="flex text-gray-600 items-center gap-1 px-1 mb-4"
        onClick={handleRouterBack}
      >
        <ArrowLeft2 size={20} /> <span className="font-medium text-sm">Go Back</span>
      </Button>
      <header className="flex gap-4 md:items-center mb-7">
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-sm">
          Inbox
        </h2>
      </header>

      <InboxDisplay />
    </div>
  );
}
