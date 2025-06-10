"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { clearUsers, getUsers } from "@/app/redux/admin-features/userSlice";
import { showAlert } from "@/app/redux/features/alertSlice";

export default function UsersLayout({ children }: any) {
  const dispatch = useAppDispatch();
  const usersState = useAppSelector((state) => state.adminUser);

  useEffect(() => {
    dispatch(getUsers());

    return () => {
      dispatch(clearUsers());
    }
  }, []);

  useEffect(() => {
    if (usersState.status.fetchUsers === "rejected") {
      dispatch(showAlert({
        message: usersState.error.message || "An error occurred",
        type: "error",
      }))
    }
  }, [usersState.status.fetchUsers]);

  return <React.Fragment>{children}</React.Fragment>;
}
