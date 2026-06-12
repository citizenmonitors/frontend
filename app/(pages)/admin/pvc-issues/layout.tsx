"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import {
  clearPvcIssueReports,
  getPvcIssueReports,
} from "@/app/redux/admin-features/pvcIssuesSlice";
import { showAlert } from "@/app/redux/features/alertSlice";
import React, { useEffect } from "react";

export default function PvcIssuesLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const pvcIssuesState = useAppSelector((state) => state.adminPvcIssues);

  useEffect(() => {
    dispatch(getPvcIssueReports());

    return () => {
      dispatch(clearPvcIssueReports());
    };
  }, []);

  useEffect(() => {
    if (pvcIssuesState.status.fetchReports === "rejected") {
      dispatch(
        showAlert({
          message: pvcIssuesState.error.message || "Failed to load PVC issue reports.",
          type: "error",
        })
      );
    }
  }, [pvcIssuesState.status.fetchReports]);

  return <>{children}</>;
}
