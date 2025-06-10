import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { Button, Modal } from "antd";
import { Profile } from "iconsax-react";
import { useEffect } from "react";
import { AdminTableUser } from "@/app/redux/admin-features/userSlice";
import {
  approveUser,
  clearVerificationUser,
} from "@/app/redux/admin-features/verificationSlice";
import { showAlert } from "@/app/redux/features/alertSlice";

type ApproveUserModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<AdminTableUser | null>>;
  user: AdminTableUser | null;
};
export default function ApproveUserModal({ user, open, setOpen }: ApproveUserModalProps) {
  const dispatch = useAppDispatch();
  const verificationState = useAppSelector((state) => state.adminVerification);

  function handleApproveUser() {
    dispatch(approveUser(user?._id as string));
  }

  function closeModal() {
    setOpen(null);
    clearVerificationUser();
  }

  useEffect(() => {
    if (user) {
      if (verificationState.status.approveUser === "fulfilled") {
        dispatch(
          showAlert({
            message: "Account Verified Successfully.",
            type: "success",
          })
        );
        closeModal();
      }
      if (verificationState.status.approveUser === "rejected") {
        dispatch(
          showAlert({
            message:
              verificationState.error.message ||
              "Failed to verify account. Please try again later.",
            type: "error",
          })
        );
      }
    }
  }, [verificationState.status.approveUser, user]);

  return (
    <Modal
      open={open}
      title="Verify User to Observer"
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
          type="primary"
          className="text-sm"
          size="large"
          onClick={handleApproveUser}
          loading={verificationState.status.approveUser === "pending"}
        >
          Verify
        </Button>,
      ]}
    >
      <div className="bg-gradient-to-b from-brand-25/25 to-brand-25 p-3 rounded-lg ring-1 ring-brand-300 flex gap-2 mt-4">
        <div className="user-card-profile h-[40px] w-[40px] md:h-[44px] md:w-[44px] grid place-content-center rounded-full bg-gradient-to-b from-brand-600 to-brand-500 text-white">
          <Profile size={28} />
        </div>
        {user && (
          <article>
            <h3 className="text-lg font-medium font-league text-gray-700 leading-tight flex gap-1">
              {user.firstName} {user.lastName}
            </h3>
            <span className="text-sm text-gray-500">{user.email}</span>
          </article>
        )}
      </div>
      <p className="text-gray-500 text-sm my-2">
        By approving this user, you are verifying them as an observer. They will have
        access to all observer features.
      </p>
    </Modal>
  );
}
