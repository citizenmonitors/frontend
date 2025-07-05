"use client";
import ResultUploadForm from "@/app/components/portal/upload/ResultUploadForm";
import ResultView from "@/app/components/portal/upload/ResultView";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearElectionUploadData,
  getElectionById,
} from "@/app/redux/features/electionSlice";
import { ElectionResult } from "@/app/redux/types";
import { Button, Spin } from "antd";
import { ArrowLeft2 } from "iconsax-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ResultUploadPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id }: { id: string } = useParams();
  const searchParams = useSearchParams();

  const electionState = useAppSelector((state) => state.election);
  const [mode, setMode] = useState<"upload" | "view" | "edit">("upload");
  const [prefilledFormData, setPrefilledFormData] = useState<any>(null);

  const modePages: { [key: string]: JSX.Element } = {
    view: <ResultView setMode={setMode} />,
    edit: <ResultUploadForm prefilledFormData={prefilledFormData} />,
    upload: <ResultUploadForm />,
  };

  useEffect(() => {
    if (electionState.electionData.election?._id !== id) {
      dispatch(clearElectionUploadData());
      dispatch(getElectionById(id));
    }
  }, []);

  useEffect(() => {
    const electionResult = electionState.electionData.result as ElectionResult;
    if (mode === "edit" && electionResult) {
      setPrefilledFormData({
        accreditedVoters: electionResult.accreditedVoters || 0,
        rejectedPapers: electionResult.rejectedPapers || 0,
        spoiledBallotPapers: electionResult.spoiledBallotPapers || 0,
        usedBallotPapers: electionResult.usedBallotPapers || 0,
        partiesVotes: electionResult.partiesVotes,
        voterIntimidation: electionResult.voterIntimidation,
        voteBuying: electionResult.voteBuying,
        voteRating: electionResult.voteRating,
        resultPicture: electionResult.resultPicture,
        resultVideo: electionResult.resultVideo || {},
      });
    }
  }, [mode, electionState.electionData.result]);

  useEffect(() => {
    if (
      electionState.electionData.report &&
      electionState.electionData.election?._id === id
    ) {
      dispatch(
        showAlert({
          message: "You have already uploaded an incident report for this election.",
          type: "warning",
        })
      );
      router.replace(`/portal/elections`);
      return;
    }
    if (electionState.electionData.result) {
      searchParams.get("mode") === "edit" ? setMode("edit") : setMode("view");
    } else {
      setMode("upload");
    }
  }, [electionState.electionData]);

  if (electionState.status.fetchElection === "rejected") {
    dispatch(
      showAlert({
        message: "Please choose a Valid Election.",
        type: "warning",
      })
    );
    router.replace("/portal/elections");
  }

  if (["not started", "pending"].includes(electionState.status.fetchElection)) {
    return (
      <div className="w-full h-[400px] grid place-content-center">
        <Spin size="large" />
      </div>
    );
  }

  function handleRouterBack() {
    if (mode === "upload") {
      router.back();
    } else if (mode === "view") {
      router.back();
    } else if (mode === "edit") {
      router.replace(`/portal/uploads/result/${id}`);
      setMode("view");
    }
  }

  return (
    <React.Fragment>
      <Button
        type="text"
        className="flex text-gray-600 items-center gap-1 px-1"
        onClick={handleRouterBack}
      >
        <ArrowLeft2 size={20} /> <span className="font-medium text-sm">Go Back</span>
      </Button>
      {modePages[mode]}
    </React.Fragment>
  );
}
