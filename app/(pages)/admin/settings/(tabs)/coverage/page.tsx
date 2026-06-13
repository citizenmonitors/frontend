"use client";
import AppSelect from "@/app/components/shared/Select";
import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import useLocationData from "@/app/hooks/useLocationData";
import { showAlert } from "@/app/redux/features/alertSlice";
import { clearUserStatus, updateAccount } from "@/app/redux/features/userSlice";
import { User } from "@/app/redux/types";
import formatString from "@/app/utils/formatString";
import { Button, Radio } from "antd";
import React, { useEffect, useMemo } from "react";
import formatNumber from "@/app/utils/formatNumber";

export default function CoverageDetails() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const { locationData, updateLocationField } = useLocationData({
    states: {
      data: [],
      current: userDetails.state,
      status: "not started",
    },
    lgas: {
      data: [],
      current: userDetails.lga,
      status: "not started",
    },
    wards: {
      data: [],
      current: userDetails.ward,
      status: "not started",
    },
    pollingUnits: {
      data: [],
      current: userDetails.pollingUnit,
      status: "not started",
    },
  });
  const { formData, handleFormInputChange } = useFormHandler({
    isPoliticalPartyMember: userDetails.isPoliticalPartyMember,
    isElectionWitnessReady: userDetails.isElectionWitnessReady,
    isOpenToSurvey: userDetails.isOpenToSurvey,
  });

  const isChangesMade = useMemo(() => {
    const currentDetails = {
      state: userDetails.state,
      lga: userDetails.lga,
      ward: userDetails.ward,
      pollingUnit: userDetails.pollingUnit,
      isPoliticalPartyMember: userDetails.isPoliticalPartyMember,
      isElectionWitnessReady: userDetails.isElectionWitnessReady,
      isOpenToSurvey: userDetails.isOpenToSurvey,
    };

    const newDetails = {
      state: locationData.states.current,
      lga: locationData.lgas.current,
      ward: locationData.wards.current,
      pollingUnit: locationData.pollingUnits.current,
      isPoliticalPartyMember: formData.isPoliticalPartyMember,
      isElectionWitnessReady: formData.isElectionWitnessReady,
      isOpenToSurvey: formData.isOpenToSurvey,
    };

    return JSON.stringify(currentDetails) !== JSON.stringify(newDetails);
  }, [formData, locationData, userState.status.updateAccount]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isChangesMade) {
      dispatch(
        showAlert({
          message: "No coverage changes detected.",
          type: "warning",
        })
      );
      return;
    }

    if (
      !locationData.states.current ||
      !locationData.lgas.current ||
      !locationData.wards.current ||
      !locationData.pollingUnits.current
    ) {
      dispatch(
        showAlert({
          message: "Please fill in all required fields.",
          type: "error",
        })
      );
      return;
    }

    const updatedFields: Partial<User> = {
      state: locationData.states.current,
      lga: locationData.lgas.current,
      ward: locationData.wards.current,
      pollingUnit: locationData.pollingUnits.current,
      isPoliticalPartyMember: formData.isPoliticalPartyMember,
      isElectionWitnessReady: formData.isElectionWitnessReady,
      isOpenToSurvey: formData.isOpenToSurvey,
    };
    dispatch(updateAccount(updatedFields));
  }

  useEffect(() => {
    if (userState.status.updateAccount === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message!,
          type: "error",
        })
      );
    }

    if (userState.status.updateAccount === "fulfilled") {
      dispatch(
        showAlert({
          message: "Coverage details updated successfully.",
          type: "success",
        })
      );
      dispatch(clearUserStatus(["updateAccount"]));
    }
  }, [userState.status.updateAccount]);

  return (
    <React.Fragment>
      <SettingsHeader>Coverage Details</SettingsHeader>
      <div
        id="settings-coverage-details"
        className="py-6 bg-white md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[736px] mx-auto"
      >
        <h3 className="font-league text-xl md:text-display-xs lg:text-display-sm text-brand-500 text-center font-semibold mb-1 leading-tight">
          Update your coverage details.
        </h3>
        <p className="text-gray-500 text-sm text-center mb-2 max-w-screen-xs mx-auto">
          Take control of your coverage here. Edit your coverage details to fit your
          specific needs.
        </p>
        {userDetails.role === "observer" && (
          <p className="text-error-500 text-sm text-center mb-8 max-w-screen-xs mx-auto">
            Upon confirmation of change in coverage details, Observers will be downgraded
            to Volunteers. Reapply and upload your updated Permanent Voters Card (PVC) to
            become an Observer.
          </p>
        )}

        <form className="grid grid-cols-2 gap-8" action="" onSubmit={handleSubmit}>
          <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1">
            <label htmlFor="coverage-update-state" className="text-sm font-medium">
              State <span className="text-error-600">*</span>
            </label>
            <AppSelect
              id="coverage-update-state"
              value={locationData.states.current}
              options={locationData.states.data.map((state: string, index: number) => ({
                value: state,
                label: `${formatNumber.prependZeroes(index + 1)} – ${formatString.kebabToNormalCase(
                  state
                ).toUpperCase()}`,
              }))}
              onChange={(e) => {
                updateLocationField("states", e.target.value);
              }}
              disabled={locationData.states.data.length === 0}
            />
          </div>

          <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1 md:col-start-2">
            <label htmlFor="coverage-update-lga" className="text-sm font-medium">
              LGA <span className="text-error-600">*</span>
            </label>
            <AppSelect
              id="coverage-update-lga"
              value={locationData.lgas.current}
              options={locationData.lgas.data.map((lga: string, index: number) => ({
                value: lga,
                label: `${formatNumber.prependZeroes(index + 1)} – ${formatString.kebabToNormalCase(
                  lga
                ).toUpperCase()}`,
              }))}
              onChange={(e) => {
                updateLocationField("lgas", e.target.value);
              }}
              disabled={locationData.lgas.data.length === 0}
            />
          </div>

          <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1">
            <label htmlFor="coverage-update-ward" className="text-sm font-medium">
              Ward <span className="text-error-600">*</span>
            </label>
            <AppSelect
              id="coverage-update-ward"
              value={locationData.wards.current}
              options={locationData.wards.data.map((ward: string, index: number) => ({
                value: ward,
                label: `${formatNumber.prependZeroes(index + 1)} – ${formatString.kebabToNormalCase(
                  ward
                ).toUpperCase()}`,
              }))}
              onChange={(e) => {
                updateLocationField("wards", e.target.value);
              }}
              disabled={locationData.wards.data.length === 0}
            />
          </div>

          <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1 md:col-start-2">
            <label htmlFor="coverage-update-polling-unit" className="text-sm font-medium">
              Polling Unit <span className="text-error-600">*</span>
            </label>
            <AppSelect
              id="coverage-update-polling-unit"
              value={locationData.pollingUnits.current}
              options={locationData.pollingUnits.data.map((pollingUnit: string, index: number) => ({
                value: pollingUnit,
                label: `${formatNumber.prependZeroes(index + 1)} – ${formatString.kebabToNormalCase(
                  pollingUnit
                ).toUpperCase()}`,
              }))}
              onChange={(e) => {
                updateLocationField("pollingUnits", e.target.value);
              }}
              disabled={locationData.pollingUnits.data.length === 0}
            />
          </div>

          <div className="grid gap-[6px] col-start-1 col-span-2">
            <label
              htmlFor="coverage-update-p-p-member"
              className="text-sm font-medium text-center md:text-left"
            >
              Are you a member of a political party?{" "}
              <span className="text-error-600">*</span>
            </label>
            <Radio.Group
              name="coverage-update-p-p-member"
              onChange={handleFormInputChange("isPoliticalPartyMember")}
              value={formData.isPoliticalPartyMember}
              size="large"
              className="mx-auto md:mx-0"
            >
              <Radio value={false} className="min-w-16 w-1/6 font-light">
                No
              </Radio>
              <Radio value={true} className="min-w-16 w-1/6 font-light">
                Yes
              </Radio>
            </Radio.Group>
          </div>

          <div className="grid gap-[6px] col-start-1 col-span-2">
            <label
              htmlFor="coverage-update-witness"
              className="text-sm font-medium text-center md:text-left"
            >
              If needed, would you be ready to be an election witness in a court of law?{" "}
              <span className="text-error-600">*</span>
            </label>
            <Radio.Group
              name="coverage-update-witness"
              onChange={handleFormInputChange("isElectionWitnessReady")}
              value={formData.isElectionWitnessReady}
              size="large"
              className="mx-auto md:mx-0"
            >
              <Radio value={false} className="min-w-16 w-1/6 font-light">
                No
              </Radio>
              <Radio value={true} className="min-w-16 w-1/6 font-light">
                Yes
              </Radio>
            </Radio.Group>
          </div>

          <div className="grid gap-[6px] col-start-1 col-span-2">
            <label
              htmlFor="coverage-update-surveys"
              className="text-sm font-medium text-center md:text-left"
            >
              Besides polling unit monitoring, would you be open to our online
              political/electoral/economic data surveys?{" "}
              <span className="text-error-600">*</span>
            </label>
            <Radio.Group
              name="coverage-update-surveys"
              onChange={handleFormInputChange("isOpenToSurvey")}
              value={formData.isOpenToSurvey}
              size="large"
              className="mx-auto md:mx-0"
            >
              <Radio value={false} className="min-w-16 w-1/6 font-light">
                No
              </Radio>
              <Radio value={true} className="min-w-16 w-1/6 font-light">
                Yes
              </Radio>
            </Radio.Group>
          </div>

          <Button
            type="primary"
            size="large"
            className="group/coverage-update-stage-three-submit font-medium flex gap-[1ch] items-center justify-center col-span-2 mb-3"
            htmlType="submit"
            loading={userState.status.updateAccount === "pending"}
          >
            Update
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
}


// ""