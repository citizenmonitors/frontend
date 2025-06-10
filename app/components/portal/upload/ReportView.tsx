import ElectionIcon from "@/app/components/shared/ElectionIcon";
import UploadIcon from "@/app/components/shared/UploadIcon";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { Button, Input, Modal, Select, UploadFile, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import moment from "moment";
import React, { useMemo } from "react";
import { MessageEdit, Trash } from "iconsax-react";
import { ratingSelectOptions } from "@/app/data/form";
import {
  clearElectionUploadData,
  deleteElectionReport,
  getElectionById,
} from "@/app/redux/features/electionSlice";
import formatNumber from "@/app/utils/formatNumber";
import { showAlert } from "@/app/redux/features/alertSlice";
import { useParams, useRouter } from "next/navigation";
import acceptedFileTypes from "../../../data/acceptedFileTypes";
import getElectionName from "@/app/utils/getElectionName";

type ReportViewProps = {
  setMode: React.Dispatch<React.SetStateAction<"upload" | "view" | "edit">>;
};
export default function ReportView({ setMode }: ReportViewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id }: { id: string } = useParams();
  const userState = useAppSelector((state) => state.user.details!);
  const electionState = useAppSelector((state) => state.election);
  const election = electionState.electionData.election!;
  const electionReport = electionState.electionData.report!;
  const electionYear = moment(election.startDate).format("YYYY");

  const incidentPictures = useMemo(
    () =>
      electionReport.incidentPictures.map((picture) => ({
        uid: picture._id,
        name: picture.name,
        type: picture.type,
        size: picture.size,
        status: "done",
      })) as Array<UploadFile>,
    [electionReport.incidentPictures]
  );
  const incidentVideos = useMemo(
    () =>
      electionReport.incidentVideos.map((video) => ({
        uid: video._id,
        name: video.name,
        type: video.type,
        size: video.size,
        status: "done",
      })) as Array<UploadFile>,
    [electionReport.incidentVideos]
  );

  const incidentPicturesUploadProps: UploadProps = {
    name: "incidentPictures",
    accept: acceptedFileTypes.incidentReportPicture,
    fileList: incidentPictures,
    disabled: true,
  };
  const incidentVideoUploadProps: UploadProps = {
    name: "incidentVideo",
    accept: acceptedFileTypes.incidentReportVideo,
    fileList: incidentVideos,
    disabled: true,
  };

  const [deleteReportModal, setDeleteReportModal] = React.useState(false);
  function handleDeleteReport() {
    dispatch(deleteElectionReport({ electionId: election._id }));
  }

  React.useEffect(() => {
    if (electionState.status.deleteElectionReport === "fulfilled") {
      setDeleteReportModal(false);
      dispatch(
        showAlert({
          message: "Incident report has been deleted.",
          type: "success",
        })
      );
      dispatch(clearElectionUploadData());
      router.replace(`/portal/uploads`);
    } else if (electionState.status.deleteElectionReport === "rejected") {
      dispatch(
        showAlert({
          message: electionState.error.message || "An error occurred",
          type: "error",
        })
      );
    }
  }, [electionState.status.deleteElectionReport]);

  const actionButtons = (
    <div className="flex flex-col items-center gap-3 action-buttons md:flex-row">
      <Button
        type="primary"
        size="large"
        className="flex items-center justify-center w-full gap-2 md:w-auto"
        onClick={() => {
          router.replace(`/portal/uploads/report/${id}?mode=edit`);
          setMode("edit");
        }}
      >
        <MessageEdit size={18} /> Edit
      </Button>
      <Button
        type="primary"
        size="large"
        className="flex items-center justify-center w-full gap-2 md:w-auto"
        danger
        onClick={() => setDeleteReportModal(true)}
      >
        <Trash size={18} /> Delete
      </Button>
    </div>
  );

  return (
    <form
      id="election-report-upload"
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-5 mt-6"
    >
      <header className="flex gap-4 md:items-center">
        <ElectionIcon electionType={election.electionType} />{" "}
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-sm">
        {electionYear} {getElectionName(election, "detailed", userState)} Elections Incident
          Report
        </h2>
        <div className="hidden ml-auto md:block">{actionButtons}</div>
      </header>

      <p className="text-sm text-error-600">
        Incident claims are only valid with proof of pictures and/or video according to
        upload terms.
      </p>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label className="text-sm font-medium text-gray-700">
          Upload Incident Report <span className="text-error-600">*</span>
        </label>
        <p>
          Your documentation will help us have independent data and evidence that can help
          us collectively advocate for a just and transparent electoral process.
        </p>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-500">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="election-report-incident"
        >
          Select Incident <span className="text-error-600">*</span>
        </label>
        <Select
          id="election-report-incident"
          placeholder="Select an Incident"
          size="large"
          value={electionReport.selectIncident}
          disabled
          style={{ background: "white", borderRadius: "8px" }}
        />
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-500">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="election-report-note"
        >
          Incident Note <span className="text-error-600">*</span>
        </label>
        <Input.TextArea
          id="election-report-note"
          size="large"
          placeholder="Kindly provide more context here."
          autoSize={{ minRows: 4, maxRows: 8 }}
          value={electionReport.incidentNote}
          disabled
          style={{ background: "white", borderRadius: "8px" }}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="election-report-pictures"
          >
            Pictures <span className="text-error-600">*</span>
          </label>
          <Dragger
            id="election-report-pictures"
            style={{ background: "white", borderRadius: "8px" }}
            {...incidentPicturesUploadProps}
          >
            <div className="grid mb-2 place-items-center">
              <UploadIcon fileType={incidentPictures.at(-1)?.type as any} />
            </div>
            <p className="flex flex-col gap-1 text-gray-700">
              <span className="text-sm font-semibold text-brand-600">
                {incidentPictures.at(-1)!.name || "Picture file"}
              </span>
              <span className="text-xs text-gray-700">
                {formatNumber.fileSize(incidentPictures.at(-1)!.size || 0)}
              </span>
            </p>
          </Dragger>
          <p className="text-xs font-light text-error-600">
            Pictures must capture describable proof of the incident in your polling unit.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="election-report-video"
          >
            Videos <span className="text-error-600">*</span>
          </label>
          <Dragger
            id="election-report-video"
            style={{ background: "white", height: "100%" }}
            {...incidentVideoUploadProps}
          >
            <div className="grid mb-2 place-items-center">
              <UploadIcon fileType={incidentVideos.at(-1)?.type as any} />
            </div>
            <p className="flex flex-col gap-1 text-gray-700">
              <span className="text-sm font-semibold text-brand-600">
                {incidentVideos.at(-1)?.name || "Video file"}
              </span>
              <span className="text-xs text-gray-700">
                {formatNumber.fileSize(incidentVideos.at(-1)?.size || 0)}
              </span>
            </p>
          </Dragger>
          <p className="text-xs font-light text-error-600">
            Videos must contain vocal proof of date, time and place to validate the live
            video capture of the reported incidents.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-500">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="sentiment-analysis-voter-intimidation"
        >
          How would you rate today's election in your polling unit?{" "}
          <span className="text-error-600">*</span>
        </label>
        <Select
          id="sentiment-analysis-voter-intimidation"
          placeholder="Select from dropdown"
          size="large"
          options={ratingSelectOptions}
          value={electionReport.electionRating}
          disabled
          style={{ background: "white", borderRadius: "8px" }}
        />
      </div>

      <div className="md:hidden">{actionButtons}</div>

      <Modal
        open={deleteReportModal}
        title="Delete Incident Report"
        centered
        onCancel={() => setDeleteReportModal(false)}
        footer={[
          <Button
            key={"cancel"}
            size="large"
            type="text"
            className="text-gray-500"
            onClick={() => setDeleteReportModal(false)}
          >
            Cancel
          </Button>,
          <Button
            key={"delete"}
            danger
            type="primary"
            onClick={handleDeleteReport}
            loading={electionState.status.deleteElectionReport === "pending"}
          >
            Delete
          </Button>,
        ]}
      >
        <p className="text-sm text-center text-gray-500">
          Are you sure you want to delete the incident report for{" "}
          <span className="font-medium text-brand-600 whitespace-nowrap">
            {electionYear} {getElectionName(election)} Elections
          </span>
          ?
        </p>
      </Modal>
    </form>
  );
}
