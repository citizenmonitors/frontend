"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { clearAdminState, getAdmins } from "@/app/redux/admin-features/adminSlice";
import { showAlert } from "@/app/redux/features/alertSlice";
import React, { useEffect } from "react";

export default function AdminsLayout({ children }: any) {
  const dispatch = useAppDispatch();
  const adminState = useAppSelector((state) => state.adminAdmin);

  useEffect(() => {
    dispatch(getAdmins());

    return () => {
      dispatch(clearAdminState());
    };
  }, []);

  useEffect(() => {
    if (adminState.status.fetchAdmins === "rejected") {
      dispatch(
        showAlert({
          message: adminState.error.message || "An error occurred",
          type: "error",
        })
      );
    }
  }, [adminState.status.fetchAdmins]);

  return <React.Fragment>{children}</React.Fragment>;
}
