"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { clearUploads, getUploads } from "@/app/redux/admin-features/uploadSlice";
import { showAlert } from "@/app/redux/features/alertSlice";
import React, { use, useEffect } from "react";

export default function UploadsLayout({ children }: any) {
  const dispatch = useAppDispatch();
  const uploadsState = useAppSelector((state) => state.adminUpload);

  useEffect(() => {
    dispatch(getUploads());

    return () => {
      dispatch(clearUploads());
    };
  }, []);

  useEffect(() => {
    if (uploadsState.status.fetchUploads === "rejected") {
      dispatch(showAlert({
        message: uploadsState.error.message || "An error occurred",
        type: "error",
      }))
    }
  }, [uploadsState.status.fetchUploads]);

  return <React.Fragment>{children}</React.Fragment>;
}
