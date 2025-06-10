import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { Button, Modal } from "antd";
import { Profile } from "iconsax-react";
import {
  AdminTableUser,
  clearUser,
  deleteUser,
} from "@/app/redux/admin-features/userSlice";
import { useEffect } from "react";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  AdminCardAdmin,
  getAdmins,
  suspendAdmin,
} from "@/app/redux/admin-features/adminSlice";
import { deleteElection, getElections } from "@/app/redux/features/electionSlice";
import { Election } from "@/app/redux/types";
import { CalendarEvent } from "@/app/hooks/useCalendarEvents";
import moment from "moment";

type DeleteEventModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<Election | null>>;
  election: Election | null;
  event: CalendarEvent | null;
};
export default function DeleteEventModal({
  election,
  open,
  setOpen,
  event,
}: DeleteEventModalProps) {
  const dispatch = useAppDispatch();
  const electionState = useAppSelector((state) => state.election);

  function hanldleDeleteEvent() {
    dispatch(deleteElection(election?._id as string));
  }

  useEffect(() => {
    if (electionState.status.deleteElection === "fulfilled") {
      dispatch(
        showAlert({
          message: "Election deleted successfully",
          type: "success",
        })
      );
      dispatch(getElections());
      closeModal();
    } else if (electionState.status.deleteElection === "rejected") {
      dispatch(
        showAlert({
          message: electionState.error.message || "An error occurred",
          type: "error",
        })
      );
    }
  }, [electionState.status.deleteElection]);

  function closeModal() {
    setOpen(null);
  }

  return (
    <Modal
      open={open}
      title="Are you sure you want to delete this event?"
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
          onClick={hanldleDeleteEvent}
          loading={electionState.status.deleteElection === "pending"}
        >
          Delete
        </Button>,
      ]}
    >
      {event && (
        <article
          key={event.name}
          className="flex gap-2 border-y border-gray-300 py-3 md:last:border-b-0"
        >
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-2 text-xs items-center">
              <span
                className="w-[10px] h-[10px] rounded-full"
                style={{ boxShadow: `0 0 0 3px ${event.color} inset` }}
              />
              <div>
                <time dateTime={moment(event.startDate).format("YYYY-MM-DD")}>
                  {moment(event.startDate).format("MMM D, YYYY")}
                </time>
                -{" "}
                <time dateTime={moment(event.endDate).format("YYYY-MM-DD")}>
                  {moment(event.endDate).format("MMM D, YYYY")}
                </time>
              </div>
            </div>
            <header className="flex gap-2 items-center">
              {event.icon}
              <h4 className="text-gray-700 text-sm">{event.name}</h4>
            </header>
          </div>
        </article>
      )}
      <p className="text-gray-500 text-sm my-2">
        This election event would no longer exist.
      </p>
    </Modal>
  );
}
