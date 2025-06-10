"use client";
import React, { useEffect } from "react";
import ElectionsTabs from "../../../components/portal/elections/ElectionsTabs";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { clearElections, getElections } from "@/app/redux/features/electionSlice";
import { Spin } from "antd";

export default function ElectionsLayout({ children }: any) {
  const dispatch = useAppDispatch();
  const electionState = useAppSelector((state) => state.election);

  useEffect(() => {
    dispatch(clearElections());
    dispatch(getElections());
  }, []);

  return (
    <React.Fragment>
      <ElectionsTabs />
      {electionState.status.fetchElections === "fulfilled" ? (
        children
      ) : (
        <div className="h-[400px] grid place-content-center">
          <Spin size="large" />
        </div>
      )}
    </React.Fragment>
  );
}
