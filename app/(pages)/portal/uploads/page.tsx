"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { getUploads } from "@/app/redux/features/electionSlice";
import UploadsTable from "../../../components/portal/upload/UploadsTable";

export default function UploadResults() {
  const dispatch = useAppDispatch();
  const electionState = useAppSelector((state) => state.election);

  useEffect(() => {
    dispatch(getUploads());
  }, [
    electionState.status.deleteElectionReport,
    electionState.status.deleteElectionResult,
  ]);

  return (
    <div>
      <header className="flex gap-3 md:items-center mb-1 md:mb-2">
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Records
        </h2>
      </header>
      <p className="text-sm text-gray-500 lg:text-base mb-6 md:mb-7">
        Track all the incident reports and results you have uploaded to the platform in
        one place.
      </p>
      <UploadsTable />
    </div>
  );
}
