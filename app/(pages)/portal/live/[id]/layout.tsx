"use client";
import ElectionIcon from "@/app/components/shared/ElectionIcon";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearLiveElection,
  getLiveElectionById,
} from "@/app/redux/features/liveElectionSlice";
import getElectionName from "@/app/utils/getElectionName";
import { Button, Spin } from "antd";
import { useRowStyle } from "antd/es/grid/style";
import { ArrowLeft2 } from "iconsax-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function LiveSubmissionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user.details!);
  const liveElectionState = useAppSelector((state) => state.liveElection);

  useEffect(() => {
    dispatch(getLiveElectionById(params.id));

    return () => {
      dispatch(clearLiveElection());
    };
  }, []);

  useEffect(() => {
    if (liveElectionState.status.fetchLiveElection === "rejected") {
      dispatch(
        showAlert({
          message: "Invalid Election.",
          type: "error",
        })
      );
      dispatch(clearLiveElection());
      router.push("/portal/live");
    }
  }, [liveElectionState.status]);

  if (!liveElectionState.data || !liveElectionState.data.electionDetails.electionName) {
    return (
      <div className="h-[50vh] grid place-content-center">
        <Spin size="large" />
      </div>
    );
  }

  const liveElection = liveElectionState.data.electionDetails;
  const liveElectionYear = moment(liveElection.startDate).format("YYYY");

  function handleRouterBack() {
    router.push("/portal/live");
    dispatch(clearLiveElection());
  }

  return (
    <div>
      <Button
        type="text"
        className="flex text-gray-600 items-center gap-1 px-1 mb-4"
        onClick={handleRouterBack}
      >
        <ArrowLeft2 size={20} /> <span className="font-medium text-sm">Go Back</span>
      </Button>
      <header className="flex gap-4 md:items-center mb-7">
        <ElectionIcon electionType={liveElection.electionType} />{" "}
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-sm">
          {liveElectionYear} {getElectionName(liveElection, "detailed", userState)}{" "}
          Elections
        </h2>
      </header>
      {children}
    </div>
  );
}
