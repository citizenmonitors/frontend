import React from "react";
import { Election } from "@/app/redux/types";
import BaseElectionCard from "../../portal/shared/BaseElectionCard";
import Link from "next/link";

type ElectionCardProps = {
  election: Election;
};

export default function ElectionCard({ election }: ElectionCardProps) {
  const LiveResultsTag = (
    <div className="flex gap-1 items-center">
      <div className="w-2 h-2 rounded-full bg-error-500"></div>
      <span className="md:hidden">Live</span>
      <span className="hidden md:inline-block">Happening Live</span>
    </div>
  );

  return (
    <Link href={`/admin/elections/${election._id}`}>
      <BaseElectionCard detailed election={election} tag={LiveResultsTag} />
    </Link>
  );
}
