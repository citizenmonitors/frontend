import React, { useMemo } from "react";
import { Election } from "@/app/redux/types";
import ElectionPollingUnitModal from "./ElectionPollingUnitModal";
import BaseElectionCard from "../shared/BaseElectionCard";
import pluralize from "@/app/utils/pluralize";
import { useAppDispatch } from "@/app/hooks/redux";
import {
  clearElectionUploadData,
  getElectionById,
} from "@/app/redux/features/electionSlice";
import { useRouter } from "next/navigation";

type ElectionCardProps = {
  election: Election;
  mode?: "previous" | "ongoing";
};

export default function ElectionCard({ election, mode = "ongoing" }: ElectionCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [confirmPollingUnitModal, setConfirmPollingUnitModal] = React.useState(false);

  function handleElectionCardClick() {
    if (election.results.length > 0) {
      dispatch(getElectionById(election._id));
      router.push(`/portal/uploads/result/${election._id}`);
      return;
    }
    if (election.incidentReports.length > 0) {
      dispatch(getElectionById(election._id));
      router.push(`/portal/uploads/report/${election._id}`);
      return;
    }
    if (mode === "ongoing") {
      setConfirmPollingUnitModal(true);
    }
  }

  const previousElectionTag = useMemo(
    () =>
      election.resultsCount && mode === "previous"
        ? pluralize(election.resultsCount, "Result")
        : undefined,
    [election.resultsCount, mode]
  );

  return (
    <React.Fragment>
      <BaseElectionCard
        election={election}
        onClick={handleElectionCardClick}
        tag={previousElectionTag}
        style={{
          opacity: mode === "previous" && !election.resultsCount ? 0.5 : 1,
          boxShadow: mode === "previous" ? "none" : undefined,
        }}
      />
      <ElectionPollingUnitModal
        election={election}
        open={confirmPollingUnitModal}
        setOpen={setConfirmPollingUnitModal}
      />
    </React.Fragment>
  );
}
