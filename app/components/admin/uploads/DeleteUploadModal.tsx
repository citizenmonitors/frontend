import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { Button, Modal } from "antd";
import { AdminElectionUpload } from "@/app/redux/types";
import { clearUpload, deleteUpload } from "@/app/redux/admin-features/uploadSlice";
import { useEffect } from "react";
import { showAlert } from "@/app/redux/features/alertSlice";

type DeleteUploadModalProps = {
  open: boolean;
  upload: AdminElectionUpload | null;
  setOpen: React.Dispatch<React.SetStateAction<AdminElectionUpload | null>>;
};
export default function DeleteUploadModal({
  upload,
  open,
  setOpen,
}: DeleteUploadModalProps) {
  const dispatch = useAppDispatch();
  const uploadState = useAppSelector((state) => state.adminUpload);

  function handleDeleteUpload() {
    dispatch(deleteUpload(upload?.id as string));
  }

  useEffect(() => {
    if (uploadState.status.deleteUpload === "fulfilled") {
      dispatch(
        showAlert({
          message: "Upload deleted successfully",
          type: "success",
        })
      );
      closeModal();
    } else if (uploadState.status.deleteUpload === "rejected") {
      dispatch(
        showAlert({
          message: uploadState.error.message || "An error occurred",
          type: "error",
        })
      );
    }
  }, [uploadState.status.deleteUpload]);

  function closeModal() {
    setOpen(null);
    dispatch(clearUpload());
  }

  return (
    <Modal
      open={open}
      title="Are you sure you want to delete this upload?"
      centered
      closable={false}
      footer={[
        <Button
          key={"back"}
          type="text"
          size="large"
          className="text-sm"
          onClick={closeModal}
        >
          Cancel
        </Button>,
        <Button
          key={"confirm"}
          type="text"
          className="!text-error-500 bg-error-50 hover:!bg-error-500 hover:!text-white text-sm transition-all"
          size="large"
          onClick={handleDeleteUpload}
          loading={uploadState.status.deleteUpload === "pending"}
        >
          Delete
        </Button>,
      ]}
    >
      <div className="text-center">
        <p className="text-gray-500 text-sm my-2 text-center">
          This upload would no longer exist. This action is irreversible.
        </p>
      </div>
    </Modal>
  );
}
