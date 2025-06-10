"use client"
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import {
  clearActivities,
  getActivities,
} from "@/app/redux/admin-features/activityLogSlice";
import { showAlert } from "@/app/redux/features/alertSlice";
import React, { useEffect } from "react";

function ActivityLogLayout({ children }: any) {
  const dispatch = useAppDispatch();
  const activityLogState = useAppSelector((state) => state.adminActivityLog);

  useEffect(() => {
    dispatch(getActivities());

    return () => {
      dispatch(clearActivities());
    };
  }, []);

  useEffect(() => {
    if (activityLogState.status.fetchActivities === "rejected") {
      dispatch(
        showAlert({
          message: activityLogState.error.message || "Failed to fetch activities",
          type: "error",
        })
      );
    }
  }, [activityLogState.status.fetchActivities]);

  return <React.Fragment>{children}</React.Fragment>;
}

export default ActivityLogLayout;
