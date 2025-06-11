"use client";
import ElectionCard from "@/app/components/portal/elections/ElectionCard";
import EmptyElectionsPage from "@/app/components/portal/elections/EmptyElectionsPage";
import { useAppSelector } from "@/app/hooks/redux";
import moment from "moment";
import React from "react";

export default function PreviousElections() {
  const elections = useAppSelector((state) => state.election.elections);
  const today = moment(new Date()).format("YYYY-MM-DD");
  const previousElections = elections.filter((election) => election.endDate < today);

  return previousElections.length > 0 ? (
    <div className="election-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
      {previousElections.map((election) => (
        <ElectionCard key={election._id} election={election} mode="previous" />
      ))}
    </div>
  ) : (
    <EmptyElectionsPage />
  );
}
