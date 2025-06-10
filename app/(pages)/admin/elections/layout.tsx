"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { Spin } from "antd";
import { clearElections } from "@/app/redux/features/electionSlice";
import { getElections } from "@/app/redux/admin-features/electionSlice";

export default function ElectionsLayout({ children }: any) {
  const dispatch = useAppDispatch();
  const electionState = useAppSelector((state) => state.adminElection);

  useEffect(() => {
    dispatch(getElections());
    return () => {
      dispatch(clearElections());
    };
  }, []);

  return (
    <React.Fragment>
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
