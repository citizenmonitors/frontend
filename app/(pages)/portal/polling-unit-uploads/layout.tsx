"use client";
import { useAppDispatch } from "@/app/hooks/redux";
import { getPollingUnitResults } from "@/app/redux/features/electionSlice";
import React, { useEffect } from "react";

export default function PollingUnitUploadsLayout({ children }: any) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPollingUnitResults({}));
  }, []);

  return children;
}
