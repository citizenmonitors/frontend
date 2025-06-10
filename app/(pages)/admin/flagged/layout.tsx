"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { clearFlaggedUploads, getFlaggedUploads } from "@/app/redux/admin-features/flaggedUploadSlice";
import { showAlert } from "@/app/redux/features/alertSlice";
import React, { useEffect } from "react";

export default function FlaggedUploadsLayout({ children }: any) {
  const dispatch = useAppDispatch();
  const flaggedUploadsState = useAppSelector((state) => state.adminFlaggedUpload);

  useEffect(() => {
    dispatch(getFlaggedUploads());

    return () => {
      dispatch(clearFlaggedUploads());
    }
  }, []);

  useEffect(() => {
    if (flaggedUploadsState.status.fetchFlaggedUploads === "rejected") {
      dispatch(showAlert({
        message: flaggedUploadsState.error.message || "An error occurred",
        type: "error",
      }))
    }
  }, [flaggedUploadsState.status.fetchFlaggedUploads]);

  return <React.Fragment>{children}</React.Fragment>;
}
