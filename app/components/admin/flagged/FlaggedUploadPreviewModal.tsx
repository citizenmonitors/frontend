import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import {
  AdminFlaggedUpload,
  DetailedIncident,
  DetailedResult,
} from "@/app/redux/types";
import {
  Button,
  Modal,
  Spin,
  Tooltip,
} from "antd";
import {
  ArrowLeft,
  ArrowRight,
  CloseSquare,
  Dislike,
  Flag,
  Like1,
} from "iconsax-react";
import moment from "moment";
import React, { SetStateAction, useEffect, useState } from "react";
import ElectionIcon from "../../shared/ElectionIcon";
import getElectionName from "@/app/utils/getElectionName";
import ResultDetails from "../../shared/ResultDetails";
import ReportDetails from "../../shared/ReportDetails";
import {
  clearFlaggedUpload,
  deleteFlaggedUpload,
  getFlaggedUpload,
  restoreFlaggedUpload,
} from "@/app/redux/admin-features/flaggedUploadSlice";
import { showAlert } from "@/app/redux/features/alertSlice";

type FlaggedUploadPreviewModalProps = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<AdminFlaggedUpload | null>>;
  upload: AdminFlaggedUpload | null;
};
export default function FlaggedUploadPreviewModal({
  open,
  setOpen,
  upload,
}: FlaggedUploadPreviewModalProps) {
  const dispatch = useAppDispatch();
  const uploadState = useAppSelector((state) => state.adminFlaggedUpload);
  const uploadDetails = uploadState.upload;
  const electionDetails = (uploadDetails?.result || uploadDetails?.incident)
    ?.electionDetails;

  const electionYear = moment(upload?.createdAt).format("YYYY");

  const [uploadSlides, setUploadSlides] = useState<
    Array<DetailedResult | DetailedIncident>
  >([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slides: Array<DetailedResult | DetailedIncident> = [];

    if (uploadDetails) {
      if (uploadDetails.result) {
        slides.push(uploadDetails.result);
      } else if (uploadDetails.incident) {
        slides.push(uploadDetails.incident);
      }
      slides.push(...uploadDetails.counterEvidence);
    }

    setCurrentSlide(0);
    setUploadSlides(slides);
  }, [uploadDetails]);

  function closeModal() {
    dispatch(clearFlaggedUpload());
    setOpen(null);
  }

  useEffect(() => {
    if (upload) {
      dispatch(getFlaggedUpload(upload.id));
    }
  }, [upload]);

  useEffect(() => {
    if (uploadState.status.fetchFlaggedUpload === "rejected") {
      dispatch(
        showAlert({
          message:
            uploadState.error.message ||
            "An error occurred while fetching flagged upload.",
          type: "error",
        })
      );
      closeModal();
    }
  }, [uploadState.status.fetchFlaggedUpload]);

  useEffect(() => {
    if (uploadState.status.deleteFlaggedUpload === "fulfilled") {
      dispatch(
        showAlert({
          message: "Flag accepted and Upload taken down successfully.",
          type: "success",
        })
      );
      closeModal();
    }
    if (uploadState.status.deleteFlaggedUpload === "rejected") {
      dispatch(
        showAlert({
          message: uploadState.error.message || "An error occurred while accepting flag.",
          type: "error",
        })
      );
    }
  }, [uploadState.status.deleteFlaggedUpload]);

  useEffect(() => {
    if (uploadState.status.restoreFlaggedUpload === "fulfilled") {
      dispatch(
        showAlert({
          message: "Flag declined and Upload restored successfully.",
          type: "success",
        })
      );
      closeModal();
    }
    if (uploadState.status.restoreFlaggedUpload === "rejected") {
      dispatch(
        showAlert({
          message: uploadState.error.message || "An error occurred while declining flag.",
          type: "error",
        })
      );
    }
  }, [uploadState.status.restoreFlaggedUpload]);

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      footer={null}
      width={950}
      closeIcon={<CloseSquare size={24} className="text-gray-500" />}
      centered
      classNames={{ content: "!max-h-[calc(100svh-120px)] overflow-y-scroll" }}
    >
      {upload && uploadDetails && uploadSlides.length ? (
        <React.Fragment>
          {electionDetails && (
            <header className="flex gap-4 md:items-center">
              <ElectionIcon electionType={electionDetails.electionType} />{" "}
              <h2 className="font-league text-xl text-gray-700 font-semibold leading-[1.1] lg:text-display-xs mr-4">
                {electionYear} {getElectionName(electionDetails)}{" "}
                {upload.resultUploaded === "Incident Report" && upload.resultUploaded}
              </h2>
            </header>
          )}

          <div className="flex items-center justify-between">
            <h3 className="my-4 font-league font-semibold text-display-xs text-error-500">
              {currentSlide === 0
                ? "Flagged Upload"
                : `Counter Evidence (${currentSlide} of ${uploadSlides.length - 1})`}
            </h3>
            <Tooltip
              title={`${upload.priorityLevel}% of users in ${upload.pollingUnit} polling unit flagged this upload.`}
            >
              <div className="cursor-pointer flex gap-1 items-center transition-colors hover:bg-gray-200 py-1 px-2 rounded">
                <Flag
                  key={1}
                  className={upload.hidden ? "text-error-600" : "text-gray-400"}
                  size={20}
                  variant="Bold"
                />
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <p className="text-sm text-gray-500">{upload.priorityLevel}% Flagged</p>
              </div>
            </Tooltip>
          </div>

          <div className="ring-1 bg-gray-50 rounded ring-gray-300 max-h-[calc(100vh-406px)] overflow-hidden mb-4">
            <div
              className="transition max-h-[calc(100vh-406px)] overflow-hidden"
              style={{
                width: `${uploadSlides.length * 100}%`,
                transform: `translateX(-${(currentSlide / uploadSlides.length) * 100}%)`,
                display: "grid",
                gridTemplateColumns: `repeat(${uploadSlides.length}, 1fr)`,
              }}
            >
              {uploadDetails.incident
                ? (uploadSlides as Array<DetailedIncident>).map((slide, index) => (
                    <div
                      key={index}
                      className="p-4 max-h-[calc(100vh-406px)] overflow-y-scroll"
                    >
                      <ReportDetails report={slide} />
                    </div>
                  ))
                : uploadDetails.result
                ? (uploadSlides as Array<DetailedResult>).map((slide, index) => (
                    <div
                      key={index}
                      className="p-4 max-h-[calc(100vh-406px)] overflow-y-scroll"
                    >
                      <ResultDetails upload={slide} />
                    </div>
                  ))
                : null}
            </div>
          </div>

          <div className="flex gap-4 justify-center mb-4">
            <Button
              className="!p-0 !rounded-full !w-[40px]"
              size="large"
              type="primary"
              onClick={() => setCurrentSlide((prev) => prev - 1)}
              disabled={currentSlide === 0}
            >
              <ArrowLeft size={24} />
            </Button>
            <Button
              className="!p-0 !rounded-full !w-[40px]"
              size="large"
              type="primary"
              onClick={() => setCurrentSlide((prev) => prev + 1)}
              disabled={currentSlide === uploadSlides.length - 1}
            >
              <ArrowRight size={24} />
            </Button>
          </div>

          <div className="flex gap-5">
            <Button
              className="flex gap-2 items-center justify-center flex-1"
              size="large"
              loading={uploadState.status.deleteFlaggedUpload === "pending"}
              onClick={() => {
                dispatch(deleteFlaggedUpload(upload.id));
              }}
            >
              <span>Accept Flagging</span>
              <Like1 variant={"Linear"} />
            </Button>
            <Button
              className="flex gap-2 items-center justify-center !text-error-600 !border-error-600 hover:!bg-error-100 flex-1"
              size="large"
              loading={uploadState.status.restoreFlaggedUpload === "pending"}
              onClick={() => {
                dispatch(restoreFlaggedUpload(upload.id));
              }}
            >
              <Dislike variant={"Linear"} />
              <span>Decline Flagging</span>
            </Button>
          </div>
        </React.Fragment>
      ) : (
        <div className="flex items-center justify-center h-96">
          <Spin />
        </div>
      )}
    </Modal>
  );
}
