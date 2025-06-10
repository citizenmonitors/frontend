"use client";
import { useAppDispatch } from "@/app/hooks/redux";
import { clearInbox, getPodcasts } from "@/app/redux/features/inboxSlice";
import React, { useEffect } from "react";

export default function InboxLayout({ children }: any) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPodcasts());
  }, []);

  return <React.Fragment>{children}</React.Fragment>;
}
