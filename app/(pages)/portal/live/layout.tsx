"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { clearElections, getElections } from "@/app/redux/features/electionSlice";
import { useEffect } from "react";

export default function LiveLayout({ children }: any) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearElections());
    dispatch(getElections());
  }, []);

  return children;
}
