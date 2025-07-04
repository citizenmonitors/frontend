import { Button, Checkbox, DatePicker, Input, Modal, Spin } from "antd";
import { CloseSquare } from "iconsax-react";
import React, { useEffect } from "react";
import UserProfileCard from "../../shared/UserProfileCard";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import AppSelect from "../../shared/Select";
import getElectionCoverageByType from "@/app/utils/getElectionCoverageByType";
import formatString from "@/app/utils/formatString";
import useLocationData from "@/app/hooks/useLocationData";
import formatNumber from "@/app/utils/formatNumber";
import dayjs from "dayjs";
import { createElection } from "@/app/redux/features/electionSlice";
import { showAlert } from "@/app/redux/features/alertSlice";

type CreateEventModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CreateEventModal({
  open,
  setOpen,
}: CreateEventModalProps) {
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const electionState = useAppSelector((state) => state.election);
  const electionTypes = electionState.electionTypes;

  const dispatch = useAppDispatch();
  const loading = false;

  const initialFormData = {
    electionType: undefined as string | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    mockElection: false,

    location: {
      federal: null,
      state: undefined as string | undefined,
      lga: undefined as string | undefined,
    },
  };

  const { locationData, updateLocationField } = useLocationData();
  const { formData, handleFormInputChange, setFormData } =
    useFormHandler(initialFormData);

  function closeModal() {
    setFormData(initialFormData);
    setOpen(false);
  }

  function handleCreateEvent() {
    if (!formData.electionType || !formData.startDate || !formData.endDate) {
      dispatch(
        showAlert({
          message: "Please fill in all fields.",
          type: "error",
        })
      );
      return;
    }

    const electionCoverage = getElectionCoverageByType(
      formData.electionType
    ).toLowerCase();
    const electionLocation = (formData.location as any)[electionCoverage];

    if (electionLocation === undefined) {
      dispatch(
        showAlert({
          message: "Please specify the location for the selected election.",
          type: "error",
        })
      );
      return;
    }

    const newElection = {
      electionId: electionTypes.find(
        (type) => type.electionType === formData.electionType
      )!._id,
      electionLocation,
      startDate: formData.startDate,
      endDate: formData.endDate,
      mockElection: formData.mockElection,
    };
    dispatch(createElection(newElection));
  }

  useEffect(() => {
    if (electionState.status.createElection === "fulfilled") {
      dispatch(
        showAlert({
          message: "Event created successfully.",
          type: "success",
        })
      );
      closeModal();
    }
    if (electionState.status.createElection === "rejected") {
      dispatch(
        showAlert({
          message: electionState.error.message || "Something went wrong",
          type: "error",
        })
      );
    }
  }, [electionState.status.createElection]);

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      footer={null}
      width={720}
      closeIcon={<CloseSquare size={24} className="text-gray-500" />}
      centered
      classNames={{
        content: "!max-h-[calc(100svh-120px)] overflow-y-scroll relative",
        header: "!text-brand-500",
      }}
    >
      {!loading ? (
        <React.Fragment>
          <UserProfileCard user={userDetails} />

          <header className="mb-4">
            <h3 className="text-lg font-semibold text-brand-500 font-league">
              Add New Event
            </h3>
          </header>

          <form
            id="signup-stage-two-form"
            action=""
            className="grid grid-cols-2 gap-4 w-full text-gray-700"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-[6px] col-span-2">
              <label htmlFor="event-type" className="text-sm font-medium">
                Election Type <span className="text-error-600">*</span>
              </label>
              <AppSelect
                id="event-type"
                value={formData.electionType}
                options={electionTypes.map((type) => ({
                  value: type.electionType,
                  label: `${type.electionName}`,
                }))}
                onChange={handleFormInputChange("electionType")}
                disabled={electionTypes.length === 0}
              />
            </div>

            <div className="grid gap-[6px] col-span-2">
              <label htmlFor="event-coverage" className="text-sm font-medium">
                Election Coverage
              </label>
              <Input
                id="event-coverage"
                value={formatString.capitaliseFirst(
                  getElectionCoverageByType(formData.electionType),
                  true
                )}
                className="!bg-white"
                size="large"
                disabled
              />
            </div>

            {["lga", "state"].includes(
              getElectionCoverageByType(formData.electionType).toLowerCase()
            ) ? (
              <div className="grid gap-[6px] col-start-1 col-span-2">
                <label htmlFor="signup-state" className="text-sm font-medium">
                  Election State <span className="text-error-600">*</span>
                </label>
                <AppSelect
                  id="signup-state"
                  value={locationData.states.current}
                  options={locationData.states.data.map((state, index) => ({
                    value: state,
                    label: `${formatNumber.prependZeroes(index + 1)} – ${formatString
                      .kebabToNormalCase(state)
                      .toUpperCase()}`,
                  }))}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      location: { ...formData.location, state: e.target.value },
                    });
                    updateLocationField("states", e.target.value);
                  }}
                  disabled={locationData.states.data.length === 0}
                />
              </div>
            ) : null}

            {["lga"].includes(
              getElectionCoverageByType(formData.electionType).toLowerCase()
            ) ? (
              <div className="grid gap-[6px] col-start-1 col-span-2">
                <label htmlFor="signup-lga" className="text-sm font-medium">
                  Election LGA <span className="text-error-600">*</span>
                </label>
                <AppSelect
                  id="signup-lga"
                  value={locationData.lgas.current}
                  options={locationData.lgas.data.map((lga, index) => ({
                    value: lga,
                    label: `${formatNumber.prependZeroes(index + 1)} – ${formatString
                      .kebabToNormalCase(lga)
                      .toUpperCase()}`,
                  }))}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      location: { ...formData.location, lga: e.target.value },
                    });
                    updateLocationField("lgas", e.target.value);
                  }}
                  disabled={locationData.lgas.data.length === 0}
                />
              </div>
            ) : null}

            <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1">
              <label htmlFor="event-start" className="text-sm font-medium">
                Start Date <span className="text-error-600">*</span>
              </label>
              <DatePicker
                required
                id="event-start"
                name="start date"
                size="large"
                placeholder="YYYY-MM-DD"
                minDate={dayjs()}
                maxDate={formData.endDate ? dayjs(formData.endDate) : undefined}
                value={formData.startDate}
                onChange={handleFormInputChange("startDate", "static")}
              />
            </div>
            <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1 md:col-start-2">
              <label htmlFor="event-end" className="text-sm font-medium">
                End Date <span className="text-error-600">*</span>
              </label>
              <DatePicker
                required
                id="event-end"
                name="end date"
                size="large"
                placeholder="YYYY-MM-DD"
                minDate={dayjs(formData.startDate)}
                value={formData.endDate}
                onChange={handleFormInputChange("endDate", "static")}
              />
            </div>

            <div className="grid gap-[6px] col-span-2 md:col-span-1 place-content-center md:place-content-start">
              <Checkbox
                id="mockelection"
                checked={formData.mockElection}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    mockElection: e.target.checked,
                  }));
                }}
              >
                <span className="text-gray-500">
									Set as Mock Election
                </span>
              </Checkbox>
            </div>

            <Button
              type="primary"
              size="large"
              className="group/signup-stage-two-submit font-medium flex gap-[1ch] items-center justify-center col-span-2 mb-3"
              onClick={handleCreateEvent}
              loading={electionState.status.createElection === "pending"}
            >
              <span>Save Event</span>
            </Button>
          </form>
        </React.Fragment>
      ) : (
        <div className="flex items-center justify-center h-96">
          <Spin />
        </div>
      )}
    </Modal>
  );
}
