import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { AdminElectionUpload } from "@/app/redux/types";
import { Modal, Spin } from "antd";
import { CloseSquare } from "iconsax-react";
import moment from "moment";
import React, { SetStateAction, useEffect } from "react";
import { clearUpload, getUpload } from "@/app/redux/admin-features/uploadSlice";
import ElectionIcon from "../../shared/ElectionIcon";
import getElectionName from "@/app/utils/getElectionName";
import ResultDetails from "../../shared/ResultDetails";
import ReportDetails from "../../shared/ReportDetails";
import { showAlert } from "@/app/redux/features/alertSlice";

type UploadPreviewModalProps = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<AdminElectionUpload | null>>;
  upload: AdminElectionUpload | null;
};
export default function UploadPreviewModal({
  open,
  setOpen,
  upload,
}: UploadPreviewModalProps) {
  const dispatch = useAppDispatch();
  const uploadState = useAppSelector((state) => state.adminUpload);
  const uploadDetails = uploadState.upload;
		const electionDetails = (uploadDetails?.result || uploadDetails?.incident)
			?.electionDetails;

  const electionYear = moment(upload?.createdAt).format("YYYY");

  function closeModal() {
    dispatch(clearUpload());
    setOpen(null);
  }

  useEffect(() => {
    if (upload) {
      dispatch(getUpload(upload.id));
    }
  }, [upload]);

  useEffect(() => {
    if (uploadState.status.fetchUpload === "rejected") {
      dispatch(
        showAlert({
          message: uploadState.error.message || "An error occurred",
          type: "error",
        })
      );
      closeModal();
    }
  }, [uploadState.status.fetchUpload]);

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
      {upload && uploadDetails ? (
        <React.Fragment>
          {electionDetails && (
            <header className="flex gap-4 md:items-center mb-9">
              <ElectionIcon electionType={electionDetails.electionType} />{" "}
              <h2 className="font-league text-xl text-gray-700 font-semibold leading-[1.1] lg:text-display-xs mr-4">
                {electionYear} {getElectionName(electionDetails)}{" "}
                {upload.resultUploaded === "Incident Report" && upload.resultUploaded}
              </h2>
            </header>
          )}

          {uploadDetails.incident ? (
            <ReportDetails report={uploadDetails.incident} />
          ) : uploadDetails.result ? (
            <ResultDetails upload={uploadDetails.result} />
          ) : null}
        </React.Fragment>
      ) : (
        <div className="flex items-center justify-center h-96">
          <Spin />
        </div>
      )}
    </Modal>
  );
}
