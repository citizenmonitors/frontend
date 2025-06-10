import AppSelect from "@/app/components/shared/Select";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import useLocationData from "@/app/hooks/useLocationData";
import { showAlert } from "@/app/redux/features/alertSlice";
import { Button, Radio } from "antd";
import { ArrowRight } from "iconsax-react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { SignupUserContext } from "../../../../(pages)/auth/signup/SignupUserProvider";
import { submitDetails } from "@/app/redux/features/signupSlice";
import formatString from "@/app/utils/formatString";
import formatNumber from "@/app/utils/formatNumber";

function CoverageDetailsForm() {
  const signupState = useAppSelector((state) => state.signup);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { locationData, updateLocationField } = useLocationData();
  const { currentUser, updateCurrentUser } = useContext(SignupUserContext);

  const initialFormState = {
    isRegisteredVoter: false,
    isPoliticalPartyMember: false,
    isElectionWitnessReady: false,
    isOpenToSurvey: false,
  };
  const { formData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);
  async function handleFormSubmit() {
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

    dispatch(
      submitDetails({
        user: {
          ...currentUser,
          state: locationData.states.current,
          lga: locationData.lgas.current,
          ward: locationData.wards.current,
          pollingUnit: locationData.pollingUnits.current,
          ...formData,
        },
      })
    );
  }

  useEffect(() => {
    if (signupState.status.detailsSubmission === "rejected") {
      dispatch(
        showAlert({
          message: signupState.error.message!,
          type: "error",
        })
      );
    }

    if (signupState.status.detailsSubmission === "fulfilled") {
      dispatch(
        showAlert({
          message: "Details saved successfully",
          type: "success",
        })
      );
      updateCurrentUser({
        state: locationData.states.current,
        lga: locationData.lgas.current,
        ward: locationData.wards.current,
        pollingUnit: locationData.pollingUnits.current,
        ...formData,
      });
      router.push("/auth/signup/role");
    }
  }, [signupState.status.detailsSubmission]);

  return (
    <form
      action=""
      className="grid grid-cols-2 gap-7 w-full max-w-[648px] text-gray-700"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1">
        <label htmlFor="signup-state" className="text-sm font-medium">
          State <span className="text-error-600">*</span>
        </label>
        <AppSelect
          id="signup-state"
          value={locationData.states.current}
          options={locationData.states.data.map((state, index) => ({
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
        <label htmlFor="signup-lga" className="text-sm font-medium">
          LGA <span className="text-error-600">*</span>
        </label>
        <AppSelect
          id="signup-lga"
          value={locationData.lgas.current}
          options={locationData.lgas.data.map((lga, index) => ({
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
        <label htmlFor="signup-ward" className="text-sm font-medium">
          Ward <span className="text-error-600">*</span>
        </label>
        <AppSelect
          id="signup-ward"
          value={locationData.wards.current}
          options={locationData.wards.data.map((ward, index) => ({
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
        <label htmlFor="signup-polling-unit" className="text-sm font-medium">
          Polling Unit <span className="text-error-600">*</span>
        </label>
        <AppSelect
          id="signup-polling-unit"
          value={locationData.pollingUnits.current}
          options={locationData.pollingUnits.data.map((pollingUnit, index) => ({
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
          htmlFor="signup-registered-voter"
          className="text-sm font-medium text-center md:text-left"
        >
          Are you a registered voter? <span className="text-error-600">*</span>
        </label>
        <Radio.Group
          name="signup-registered-voter"
          onChange={handleFormInputChange("isRegisteredVoter")}
          value={formData.isRegisteredVoter}
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
          htmlFor="signup-p-p-member"
          className="text-sm font-medium text-center md:text-left"
        >
          Are you a member of a political party? <span className="text-error-600">*</span>
        </label>
        <Radio.Group
          name="signup-p-p-member"
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
          htmlFor="signup-witness"
          className="text-sm font-medium text-center md:text-left"
        >
          If needed, would you be ready to be an election witness in a court of law?{" "}
          <span className="text-error-600">*</span>
        </label>
        <Radio.Group
          name="signup-witness"
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
          htmlFor="signup-surveys"
          className="text-sm font-medium text-center md:text-left"
        >
          Besides polling unit monitoring, would you be open to our online
          political/electoral/economic data surveys?{" "}
          <span className="text-error-600">*</span>
        </label>
        <Radio.Group
          name="signup-surveys"
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
        className="group/signup-stage-three-submit font-medium flex gap-[1ch] items-center justify-center col-span-2 mb-3"
        loading={signupState.status.detailsSubmission === "pending"}
        onClick={handleFormSubmit}
        htmlType="submit"
      >
        Proceed to Select Role
        <ArrowRight
          variant="Linear"
          size={18}
          className="group-hover/signup-stage-three-submit:translate-x-1 transition-transform"
        />
      </Button>
    </form>
  );
}

export default CoverageDetailsForm;
