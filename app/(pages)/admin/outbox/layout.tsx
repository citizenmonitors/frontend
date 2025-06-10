"use client";
import OutboxTabs from "@/app/components/admin/outbox/OutboxTabs";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { clearOutbox, getPodcasts } from "@/app/redux/admin-features/outboxSlice";
import React, { useEffect } from "react";

type OutboxLayoutProps = {
  children: React.ReactNode;
};
export default function OutboxLayout({ children }: OutboxLayoutProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPodcasts());
    return () => {
      dispatch(clearOutbox());
    };
  }, []);

  return (
    <section>
      <header className="hidden md:block mb-6">
        <h2 className="font-league text-display-sm text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Outbox
        </h2>
      </header>
      <OutboxTabs />
      {children}
    </section>
  );
}
