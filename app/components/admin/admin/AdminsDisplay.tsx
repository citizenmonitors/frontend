import { useAppSelector } from "@/app/hooks/redux";
import React, { useEffect, useMemo, useState } from "react";
import copyObject from "@/app/utils/copyObject";
import formatString from "@/app/utils/formatString";
import AppFilter from "../../shared/AppFilter";
import moment from "moment";
import AppExport from "../../shared/AppExport";
import { AdminTableUser } from "@/app/redux/admin-features/userSlice";
import { AdminCardAdmin } from "@/app/redux/admin-features/adminSlice";
import { Input } from "antd";
import { SearchNormal, SearchNormal1 } from "iconsax-react";
import AdminsGrid from "./AdminsGrid";

export default function AdminsDisplay() {
  const adminState = useAppSelector((state) => state.adminAdmin);
  const { admins } = adminState;
  const [search, setSearch] = useState("");

  const filteredAdmins = useMemo(() => {
    return admins.filter((user) => {
      const fullName = user.firstName + " " + user.lastName;
      return fullName.toLowerCase().includes(search.toLowerCase());
    });
  }, [admins, search]);

  const exportHeaderKeyMap: Record<string, keyof AdminCardAdmin> = {
    ["First Name"]: "firstName",
    ["Last Name"]: "lastName",
    ["Email"]: "email",
    ["Verification"]: "role",
    ["Profile Image"]: "profileImage",
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-4 items-center justify-between flex-wrap">
        <Input
          size="large"
          placeholder="Search Admins"
          addonBefore={<SearchNormal1 size={16} className="text-gray-500" />}
          className="text-sm max-w-[500px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AppExport
          filename="Export (Admins)"
          data={filteredAdmins.map((admin) => ({
            ...admin,
            profileImage: admin.profileImage?.url || "",
          }))}
          headerKeyMap={exportHeaderKeyMap}
        />
      </div>
      <AdminsGrid admins={filteredAdmins} />
    </div>
  );
}
