import { AdminCardAdmin } from "@/app/redux/admin-features/adminSlice";
import React, { useState } from "react";
import UserProfileCard from "../../shared/UserProfileCard";
import { Button } from "antd";
import Link from "next/link";
import SuspendAdminModal from "./SuspendAdminModal";
import UpdateAdminModal from "./UpdateAdminModal";

type AdminCardProps = {
  admin: AdminCardAdmin;
};
export default function AdminCard({ admin }: AdminCardProps) {
  const [suspendAdminModalOpen, setSuspendAdminModalOpen] =
    useState<AdminCardAdmin | null>(null);
  const [updateAdminModalOpen, setUpdateAdminModalOpen] =
    useState<AdminCardAdmin | null>(null);

  return (
    <React.Fragment>
      <SuspendAdminModal
        admin={admin}
        open={!!suspendAdminModalOpen}
        setOpen={setSuspendAdminModalOpen}
      />
      <UpdateAdminModal
        admin={admin}
        open={!!updateAdminModalOpen}
        setOpen={setUpdateAdminModalOpen}
      />
      <div className="bg-white rounded-xl ring-1 ring-gray-300 p-5">
        <UserProfileCard
          user={{
            ...admin,
            pendingObserverVerification: false,
          }}
        />
        <div className="grid gap-3">
          <Link href={`/admin/activity-log?admin=${admin._id}`}>
            <Button type="primary" size="large" block className="text-sm">
              View Activity Log
            </Button>
          </Link>
          <div className="flex gap-3">
            <Button
              size="large"
              block
              className="text-sm flex-1 !border-brand-500 hover:!bg-brand-50 !text-brand-500"
              onClick={() => setUpdateAdminModalOpen(admin)}
            >
              Update Config
            </Button>
            <Button
              size="large"
              block
              className="text-sm flex-1 !border-error-500 hover:!bg-error-50 !text-error-500"
              onClick={() => setSuspendAdminModalOpen(admin)}
            >
              Suspend Admin
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
