"use client";
import ReportUploadForm from "@/app/components/portal/upload/ReportUploadForm";
import ReportView from "@/app/components/portal/upload/ReportView";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearElectionUploadData,
  getElectionById,
} from "@/app/redux/features/electionSlice";
import { ElectionReport } from "@/app/redux/types";
import { Button, Spin } from "antd";
import { ArrowLeft2 } from "iconsax-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ReportUploadPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id }: { id: string } = useParams();
  const searchParams = useSearchParams();

  const electionState = useAppSelector((state) => state.election);
  const [mode, setMode] = useState<"upload" | "view" | "edit">("upload");
  const [prefilledFormData, setPrefilledFormData] = useState<any>(null);

  const modePages: { [key: string]: JSX.Element } = {
    view: <ReportView setMode={setMode} />,
    edit: <ReportUploadForm prefilledFormData={prefilledFormData} />,
    upload: <ReportUploadForm />,
  };

  useEffect(() => {
    if (electionState.electionData.election?._id !== id) {
      dispatch(clearElectionUploadData());
      dispatch(getElectionById(id));
    }
  }, []);

  useEffect(() => {
    const electionReport = electionState.electionData.report as ElectionReport;
    if (mode === "edit" && electionReport) {
      setPrefilledFormData({
        selectIncident: electionReport.selectIncident,
        incidentNote: electionReport.incidentNote,
        electionRating: electionReport.electionRating,
        incidentPictures: electionReport.incidentPictures,
        incidentVideos: electionReport.incidentVideos,
      });
    }
  }, [mode, electionState.electionData.report]);

  useEffect(() => {
    if (
      electionState.electionData.result &&
      electionState.electionData.election?._id === id
    ) {
      dispatch(
        showAlert({
          message: "You have already uploaded a result for this election.",
          type: "warning",
        })
      );
      router.replace(`/portal/elections`);
      return;
    }
    if (electionState.electionData.report) {
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
      router.replace(`/portal/uploads/report/${id}`);
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
