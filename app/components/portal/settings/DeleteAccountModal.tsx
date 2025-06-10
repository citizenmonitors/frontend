import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { deleteAccount } from "@/app/redux/features/userSlice";
import getUserRole from "@/app/utils/getUserRole";
import formatString from "@/app/utils/formatString";
import { Button, Modal } from "antd";
import { Profile, Verify } from "iconsax-react";
import { useEffect } from "react";
import UserProfileCard from "../../shared/UserProfileCard";

type DeleteAccountModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function DeleteAccountModal({ open, setOpen }: DeleteAccountModalProps) {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;

  function handleDeleteUser() {
    dispatch(deleteAccount());
  }

  return (
    <Modal
      open={open}
      title="Are you sure you want to delete this account?"
      centered
      closable={false}
      footer={[
        <Button
          key={"back"}
          type="text"
          size="large"
          className="text-sm"
          onClick={() => setOpen(false)}
        >
          Go Back
        </Button>,
        <Button
          key={"confirm"}
          type="text"
          className="!text-error-500 bg-error-50 hover:!bg-error-500 hover:!text-white text-sm transition-all"
          size="large"
          onClick={handleDeleteUser}
          loading={userState.status.deleteAccount === "pending"}
        >
          Delete
        </Button>,
      ]}
    >
      <div className="bg-gradient-to-b from-brand-25/10 to-brand-25/50 p-3 pb-0 rounded-lg ring-1 ring-brand-300 flex gap-2 mt-4">
        <UserProfileCard user={userDetails} />
      </div>
      <p className="text-gray-500 text-sm my-2">
        Your account would no longer exist. This action is irreversible.
      </p>
    </Modal>
  );
}
