import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { Button, Modal } from "antd";
import { Profile } from "iconsax-react";
import { AdminTableUser, clearUser, deleteUser } from "@/app/redux/admin-features/userSlice";
import { useEffect } from "react";
import { showAlert } from "@/app/redux/features/alertSlice";

type DeleteAccountModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<AdminTableUser | null>>;
  user: AdminTableUser | null;
};
export default function DeleteUserModal({
  user,
  open,
  setOpen,
}: DeleteAccountModalProps) {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.adminUser);

  function handleDeleteUser() {
    dispatch(deleteUser(user?._id as string));
  }

  useEffect(() => {
    if (userState.status.deleteUser === "fulfilled") {
      dispatch(
        showAlert({
          message: "User deleted successfully",
          type: "success",
        })
      );
      closeModal();
    } else if (userState.status.deleteUser === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message || "An error occurred",
          type: "error",
        })
      );
    }
  }, [userState.status.deleteUser]);

  function closeModal() {
    setOpen(null);
    dispatch(clearUser());
  }

  return (
    <Modal
      open={open}
      title="Are you sure you want to delete this user?"
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
          onClick={handleDeleteUser}
          loading={userState.status.deleteUser === "pending"}
        >
          Delete
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
        This account and all associated data would no longer exist.
      </p>
    </Modal>
  );
}
