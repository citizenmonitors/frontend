import React, { useEffect, useMemo, useState } from "react";
import { initialVerificationFilterData } from "./data";
import copyObject from "@/app/utils/copyObject";
import formatString from "@/app/utils/formatString";
import AppFilter from "../../shared/AppFilter";
import VerificationTable from "./VerificationTable";
import moment from "moment";
import AppExport from "../../shared/AppExport";
import { AdminTableVerificationUser } from "@/app/redux/admin-features/verificationSlice";

type VerificationDisplayProps = {
  users?: Array<AdminTableVerificationUser>;
};

export default function VerificationDisplay({ users = [] }: VerificationDisplayProps) {
  const [filterData, setFilterData] = useState(copyObject(initialVerificationFilterData));

  useEffect(() => {
    const filters = copyObject(initialVerificationFilterData);
    // popupulating the filters
    users.forEach((user) => {
      const state = formatString.normalCase(user.state) + " State";
      const year = moment(user.createdAt).format("YYYY");

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

  const exportHeaderKeyMap: Record<string, keyof AdminTableVerificationUser> = {
    ["First Name"]: "firstName",
    ["Last Name"]: "lastName",
    ["Email"]: "email",
    ["Verification"]: "role",
    ["State"]: "state",
    ["Registered On"]: "createdAt",
    ["Gender"]: "gender",
    ["Phone Number"]: "phoneNumber",
    ["Bank"]: "bankName",
    ["Account Name"]: "bankAccountName",
    ["Account Number"]: "bankAccountNumber",
    ["Observer Verification ID"]: "observerId",
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-4 items-center justify-between flex-wrap mb-4">
        <AppFilter filterData={filterData} setFilterData={setFilterData} />
        <AppExport
          filename="Export (Verification)"
          data={filteredUsers.map((user) => ({
            ...user,
            createdAt: moment(user.createdAt).format("YYYY-MM-DD"),
            state: formatString.normalCase(user.state) + " State",
            role:
              user.role === "observer" && user.pendingObserverVerification
                ? "Pending Observer"
                : user.role,
            observerId: user.observerId?.map((id) => id.url).join(", "),
          }))}
          headerKeyMap={exportHeaderKeyMap}
        />
      </div>
      <VerificationTable filteredUsers={filteredUsers} />
    </div>
  );
}
