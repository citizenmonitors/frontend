"use client";
import AdminsDisplay from "@/app/components/admin/admin/AdminsDisplay";
import CreateAdminModal from "@/app/components/admin/admin/CreateAdminModal";
import AdminList from "@/app/components/admin/admin/graphs/AdminList";
import DailyTraffic from "@/app/components/admin/admin/graphs/DailyTraffic";
import { Button } from "antd";
import { Add } from "iconsax-react";
import React from "react";

export default function Admins() {
  const [createAdminModalOpen, setCreateAdminModalOpen] = React.useState(false);

  return (
    <div>

      <header className="flex gap-3 justify-between items-center mb-7">
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Admin(s)
        </h2>
        <Button
          onClick={() => {
            setCreateAdminModalOpen(true);
          }}
          className="flex gap-2 items-center"
          size="large"
          type="primary"
        >
          <Add size={20} />
          <span className="text-sm">Add new admin</span>
        </Button>
        <CreateAdminModal open={createAdminModalOpen} setOpen={setCreateAdminModalOpen} />
      </header>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <AdminList />
          <DailyTraffic />
        </div>
        <AdminsDisplay />
      </div>
    </div>
  );
}
