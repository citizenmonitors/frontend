import React from "react";
import BaseElectionCard from "../shared/BaseElectionCard";
import { Election } from "@/app/redux/types";
import { useRouter } from "next/navigation";

type LiveResultsCardProps = {
  election: Election;
};

export default function LiveCard({ election }: LiveResultsCardProps) {
  const router = useRouter();
  function handleLiveResultsCardClick() {
    router.push(`/portal/live/${election._id}`);
  }

  const LiveResultsTag = (
    <div className="flex gap-1 items-center text-sm font-medium text-error-600">
      <div className="w-2 h-2 rounded-full bg-error-500"></div>
      <span className="md:hidden">Live</span>
      <span className="hidden md:inline-block">Happening Live</span>
    </div>
  );

  return (
    <React.Fragment>
      <BaseElectionCard
        election={election}
        onClick={handleLiveResultsCardClick}
        tag={LiveResultsTag}
      />
    </React.Fragment>
  );
}
