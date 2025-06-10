import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { Button, Input, Modal } from "antd";
import { Profile } from "iconsax-react";
import { useEffect } from "react";
import { AdminTableUser } from "@/app/redux/admin-features/userSlice";
import {
  clearVerificationUser,
  downgradeUser,
} from "@/app/redux/admin-features/verificationSlice";
import { showAlert } from "@/app/redux/features/alertSlice";
import useFormHandler from "@/app/hooks/useFormHandler";

type DowngradeUserModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<AdminTableUser | null>>;
  user: AdminTableUser | null;
};
export default function DowngradeUserModal({
  user,
  open,
  setOpen,
}: DowngradeUserModalProps) {
  const dispatch = useAppDispatch();
  const verificationState = useAppSelector((state) => state.adminVerification);
  const { formData, handleFormInputChange } = useFormHandler({ adminReason: "" });
  const defaultReason = "Downgrade Requested.";

  function handleDowngradeUser() {
    dispatch(
      downgradeUser({
        userId: user?._id as string,
        adminReason: formData.adminReason || defaultReason,
      })
    );
  }

  function closeModal() {
    setOpen(null);
    clearVerificationUser();
  }

  useEffect(() => {
    if (user) {
      if (verificationState.status.downgradeUser === "fulfilled") {
        dispatch(
          showAlert({
            message: "Account Downgraded Successfully.",
            type: "success",
          })
        );
        closeModal();
      }
      if (verificationState.status.downgradeUser === "rejected") {
        dispatch(
          showAlert({
            message:
              verificationState.error.message ||
              "Failed to downgrade account. Please try again later.",
            type: "error",
          })
        );
      }
    }
  }, [verificationState.status.downgradeUser]);

  return (
    <Modal
      open={open}
      title="Downgrade User to Volunteer"
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
          onClick={handleDowngradeUser}
          loading={verificationState.status.downgradeUser === "pending"}
        >
          Downgrade
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
      <div className="w-full grid gap-1 my-3">
        <label htmlFor="adminReason" className="text-sm text-gray-500">
          Reason for Downgrade (Optional)
        </label>
        <Input
          id="adminReason"
          name="adminReason"
          value={formData.adminReason}
          onChange={handleFormInputChange("adminReason")}
          className="w-full p-2 text-sm text-gray-700"
          placeholder={defaultReason}
        />
      </div>
      <p className="text-gray-500 text-sm my-2">
        This user will be downgraded to a volunteer and will lose access to all observer
        features.
      </p>
    </Modal>
  );
}
