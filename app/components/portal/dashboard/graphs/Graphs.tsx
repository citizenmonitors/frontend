"use client";
import React, { useEffect } from "react";
import ActivityBoard from "./activity-board/ActivityBoard";
import LiveSubmissions from "./live-submissions/LiveSubmissions";
import { useAppDispatch } from "@/app/hooks/redux";
import { getActivityData, getSingleLiveResult } from "@/app/redux/features/activitySlice";

export default function Graphs() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getActivityData());
    dispatch(getSingleLiveResult());
  }, []);

  return (
    <React.Fragment>
      <ActivityBoard />
      <LiveSubmissions />
    </React.Fragment>
  );
}
