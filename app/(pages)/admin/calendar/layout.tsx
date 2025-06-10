"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import {
  clearElections,
  getElections,
  getElectionTypes,
} from "@/app/redux/features/electionSlice";
import React, { useEffect } from "react";

export default function CalendarLayout({ children }: any) {
  const dispatch = useAppDispatch();
  const electionState = useAppSelector((state) => state.election);

  useEffect(() => {
    dispatch(getElections());
    dispatch(getElectionTypes());

    return () => {
      dispatch(clearElections());
    };
  }, []);

  useEffect(() => {
    if (electionState.status.createElection === "fulfilled") {
      dispatch(getElections());
    }
  }, [electionState.status.createElection]);

  return <React.Fragment>{children}</React.Fragment>;
}
