"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import moment from "moment";
import AppExport from "../../shared/AppExport";
import { AdminTableActivity } from "@/app/redux/admin-features/activityLogSlice";
import ActivityLogTable from "./ActivityLogTable";
import { initialUploadsFilterData } from "./data";
import copyObject from "@/app/utils/copyObject";
import formatString from "@/app/utils/formatString";
import AppFilter from "../../shared/AppFilter";
import { useRouter, useSearchParams } from "next/navigation";
import { showAlert } from "@/app/redux/features/alertSlice";

export default function ActivityLogDisplay() {
  const activityLogState = useAppSelector((state) => state.adminActivityLog);
  const { activities: stateActivities } = activityLogState;
  const activities = useMemo(() => {
    return stateActivities.map((activity) => activity.admin);
  }, [stateActivities]);
  const [filterData, setFilterData] = useState(copyObject(initialUploadsFilterData));
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const filters = copyObject(initialUploadsFilterData);
    // popupulating the filters
    activities.forEach((activity) => {
      const name = formatString.normalCase([activity.firstName, activity.lastName]);

      if (!filters.name.options.includes(name)) {
        filters.name.options.push(name);
      }
    });
    setFilterData(filters);
    const autoSelectedAdmin = searchParams.get("admin");
    if (autoSelectedAdmin && activities.length) {
      const admin = activities.find((a) => a._id === autoSelectedAdmin);
      if (!admin) {
        dispatch(
          showAlert({
            message: "No activities found for the selected admin.",
            type: "error",
          })
        );
        router.replace("/admin/activity-log");
      } else {
        setFilterData((prev) => ({
          ...prev,
          name: {
            ...prev.name,
            selected: formatString.normalCase([admin.firstName, admin.lastName]),
          },
        }));
      }
    }
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const filtered = activities.filter((activity) => {
      const name = formatString.normalCase([activity.firstName, activity.lastName]);
      
      if (filterData.name.selected !== "all admins" && filterData.name.selected !== name)
        return false;
      
      return true;
    });
    return filtered;
  }, [activities, filterData]);

  const exportHeaderKeyMap: Record<string, keyof AdminTableActivity["admin"]> = {
    ["First Name"]: "firstName",
    ["Last Name"]: "lastName",
    ["Email"]: "email",
    ["User Verification"]: "role",
    ["Action"]: "action",
    ["Time of Occurrence"]: "timeCreated",
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-4 items-center justify-between flex-wrap mb-4">
        <AppFilter filterData={filterData} setFilterData={setFilterData} />
        <AppExport
          filename="Export (Activity Log)"
          data={filteredActivities.map((activity) => ({
            ...activity,
            timeCreated: moment(activity.timeCreated).format("YYYY-MM-DD"),
          }))}
          headerKeyMap={exportHeaderKeyMap}
        />
      </div>

      <ActivityLogTable filteredActivities={filteredActivities} />
    </div>
  );
}
