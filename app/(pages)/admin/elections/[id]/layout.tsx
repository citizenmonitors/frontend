"use client";
import ElectionIcon from "@/app/components/shared/ElectionIcon";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import {
  clearElectionData,
  getElectionById,
} from "@/app/redux/admin-features/electionSlice";
import { showAlert } from "@/app/redux/features/alertSlice";
import getElectionName from "@/app/utils/getElectionName";
import { Button, Spin } from "antd";
import { ArrowLeft2 } from "iconsax-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ElectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user.details!);
  const electionState = useAppSelector((state) => state.adminElection!);

  useEffect(() => {
    dispatch(getElectionById(params.id));

    return () => {
      dispatch(clearElectionData());
    };
  }, []);

  useEffect(() => {
    if (electionState.status.fetchElection === "rejected") {
      dispatch(
        showAlert({
          message: "Invalid Election.",
          type: "error",
        })
      );
      dispatch(clearElectionData());
      router.push("/admin/elections");
    }
  }, [electionState.status]);

  if (
    !electionState.electionData ||
    !electionState.electionData.electionDetails?.electionName
  ) {
    return (
      <div className="h-[50vh] grid place-content-center">
        <Spin size="large" />
      </div>
    );
  }

  const election = electionState.electionData.electionDetails;
  const electionYear = moment(election.startDate).format("YYYY");

  function handleRouterBack() {
    router.push("/admin/elections");
    dispatch(clearElectionData());
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
        <ElectionIcon electionType={election.electionType} />{" "}
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-sm">
          {electionYear} {getElectionName(election, "detailed")} Elections
        </h2>
      </header>
      {children}
    </div>
  );
}
