import { useAppSelector } from "@/app/hooks/redux";
import React, { useEffect, useMemo, useState } from "react";
import { initialUploadsFilterData } from "./data";
import copyObject from "@/app/utils/copyObject";
import formatString from "@/app/utils/formatString";
import AppFilter from "../../shared/AppFilter";
import UsersTable from "./UsersTable";
import moment from "moment";
import AppExport from "../../shared/AppExport";
import { AdminTableUser } from "@/app/redux/admin-features/userSlice";

export default function UsersDisplay() {
  const userState = useAppSelector((state) => state.adminUser);
  const { users } = userState;
  const [filterData, setFilterData] = useState(copyObject(initialUploadsFilterData));

  useEffect(() => {
    const filters = copyObject(initialUploadsFilterData);
    // popupulating the filters
    users.forEach((user) => {
      const state = formatString.normalCase(user.state) + " State";
      const year = moment(user.createdAt).format("YYYY");

      if (!filters.verification.options.includes(user.role)) {
        filters.verification.options.push(user.role);
      }
      if (!filters.date.options.includes(year)) {
        filters.date.options.push(year);
      }
      if (!filters.state.options.includes(state)) {
        filters.state.options.push(state);
      }
      if (!filters.gender.options.includes(user.gender)) {
        filters.gender.options.push(user.gender);
      }
    });
    setFilterData(filters);
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const state = formatString.normalCase(user.state) + " State";
      const year = moment(user.createdAt).format("YYYY");

      if (
        filterData.state.selected !== "all states" &&
        filterData.state.selected !== state
      )
        return false;
      if (
        filterData.verification.selected !== "all verifications" &&
        filterData.verification.selected !== user.role
      )
        return false;
      if (filterData.date.selected !== "all dates" && filterData.date.selected !== year)
        return false;
      if (
        filterData.gender.selected !== "all genders" &&
        filterData.gender.selected !== user.gender
      )
        return false;

      return true;
    });
  }, [users, filterData]);

  const exportHeaderKeyMap: Record<string, keyof AdminTableUser> = {
    ["First Name"]: "firstName",
    ["Last Name"]: "lastName",
    ["Email"]: "email",
    ["Verification"]: "role",
    ["State"]: "state",
    ["Registered On"]: "createdAt",
    ["Gender"]: "gender",
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-4 items-center justify-between flex-wrap mb-4">
        <AppFilter filterData={filterData} setFilterData={setFilterData} />
        <AppExport
          filename="Export (Users)"
          data={filteredUsers.map((user) => ({
            ...user,
            createdAt: moment(user.createdAt).format("YYYY-MM-DD"),
            state: formatString.normalCase(user.state) + " State",
          }))}
          headerKeyMap={exportHeaderKeyMap}
        />
      </div>
      <UsersTable filteredUsers={filteredUsers} />
    </div>
  );
}
