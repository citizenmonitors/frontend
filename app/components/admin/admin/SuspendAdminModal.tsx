import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { Button, Modal } from "antd";
import { Profile } from "iconsax-react";
import { AdminTableUser, clearUser, deleteUser } from "@/app/redux/admin-features/userSlice";
import { useEffect } from "react";
import { showAlert } from "@/app/redux/features/alertSlice";
import { AdminCardAdmin, getAdmins, suspendAdmin } from "@/app/redux/admin-features/adminSlice";

type SuspendAdminModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<AdminCardAdmin | null>>;
  admin: AdminCardAdmin | null;
};
export default function SuspendAdminModal({
  admin: user,
  open,
  setOpen,
}: SuspendAdminModalProps) {
  const dispatch = useAppDispatch();
  const adminState = useAppSelector((state) => state.adminAdmin);

  function hanldleSuspendAdmin() {
    dispatch(suspendAdmin(user?._id as string));
  }

  useEffect(() => {
    if (adminState.status.suspendAdmin === "fulfilled") {
      dispatch(
        showAlert({
          message: "Admin suspended successfully",
          type: "success",
        })
      );
      dispatch(getAdmins());
      closeModal();
    } else if (adminState.status.suspendAdmin === "rejected") {
      dispatch(
        showAlert({
          message: adminState.error.message || "An error occurred",
          type: "error",
        })
      );
    }
  }, [adminState.status.suspendAdmin]);

  function closeModal() {
    setOpen(null);
  }

  return (
    <Modal
      open={open}
      title="Are you sure you want to suspend this admin?"
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
          onClick={hanldleSuspendAdmin}
          loading={adminState.status.suspendAdmin === "pending"}
        >
          Suspend
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
        This account would no longer have access to any admin features.
      </p>
    </Modal>
  );
}
