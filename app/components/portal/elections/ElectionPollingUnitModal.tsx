import LogoFlat from "@/app/components/shared/svg/LogoFlat";
import { useAppDispatch } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { Election } from "@/app/redux/types";
import getElectionName from "@/app/utils/getElectionName";
import { Button, Modal, Radio } from "antd";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";
import ElectionTimePicker from "./ElectionTimePicker";

type ElectionPollingUnitModalProps = {
  election: Election;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ElectionPollingUnitModal({
  election,
  open,
  setOpen,
}: ElectionPollingUnitModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { formData, setFormData, handleFormInputChange } = useFormHandler({
    isElectionInPollingUnit: false,
    electionTimeBegan: "",
  });

  function handleCancel() {
    setOpen(false);
  }

  function handleConfirmPollingUnit() {
    const { isElectionInPollingUnit } = formData;
    if (isElectionInPollingUnit) {
      if (!formData.electionTimeBegan) {
        dispatch(
          showAlert({
            message: "Please select the time the election began",
            type: "warning",
          })
        );
        return;
      }
      router.push(
        `/portal/uploads/result/${election._id}?timeBegan=${formData.electionTimeBegan}`
      );
    } else {
      router.push(`/portal/uploads/report/${election._id}`);
    }

    handleCancel();
  }

  return (
    <Modal open={open} onCancel={handleCancel} footer={null} centered width={950}>
      <div className="flex flex-col items-center gap-2 pt-4">
        <div className="self-center">
          <span className="md:hidden">
            <LogoFlat size={40} />
          </span>
          <span className="hidden md:inline-block">
            <LogoFlat size={60} />
          </span>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col">
            <span className="text-center text-gray-500">
              {getElectionName(election, "detailed")} Elections (
              {moment(election.startDate).format("YYYY")})
            </span>
            <label
              htmlFor="election-in-polling-unit"
              className="text-sm font-medium text-center mb-2"
            >
              Did the election hold in your polling unit?
            </label>
            <Radio.Group
              name="election-in-polling-unit"
              onChange={handleFormInputChange("isElectionInPollingUnit")}
              value={formData.isElectionInPollingUnit}
              size="large"
              className="mx-auto"
            >
              <Radio value={false} className="min-w-16 w-1/6 font-light">
                No
              </Radio>
              <Radio value={true} className="min-w-16 w-1/6 font-light">
                Yes
              </Radio>
            </Radio.Group>
          </div>

          {/* Extra Information */}

          {formData.isElectionInPollingUnit ? (
            <div className="mx-auto grid gap-1 py-3">
              <label
                htmlFor="election-time-began"
                className="text-sm font-medium text-center mb-2 text-gray-700"
              >
                Time Election Began? <span className="text-error-500">*</span>
              </label>
              <ElectionTimePicker
                onChange={(time) => {
                  setFormData(() => ({
                    ...formData,
                    electionTimeBegan: time,
                  }));
                }}
              />
            </div>
          ) : null}

          <Button
            key="confirm"
            onClick={handleConfirmPollingUnit}
            type="primary"
            size="large"
            block
          >
            Confirm
          </Button>
        </form>
      </div>
    </Modal>
  );
}
