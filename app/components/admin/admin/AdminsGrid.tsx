import { AdminCardAdmin } from "@/app/redux/admin-features/adminSlice";
import React from "react";
import AdminCard from "./AdminCard";

type AdminsGridProps = {
  admins: Array<AdminCardAdmin>;
};

export default function AdminsGrid({ admins }: AdminsGridProps) {
  return admins.length ? (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {admins.map((admin) => (
        <AdminCard key={admin._id} admin={admin} />
      ))}
    </div>
  ) : (
    <div className="text-gray-500 text-sm text-center h-[200px] grid place-content-center">
      No admins available.
    </div>
  );
}
