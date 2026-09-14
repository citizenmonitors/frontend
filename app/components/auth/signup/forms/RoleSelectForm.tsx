import React, { useContext, useEffect } from "react";
import ObserverIllustration from "@/app/components/shared/svg/ObseverIllustration";
import PublicViewerIllustration from "@/app/components/shared/svg/PublicViewerIllustration";
import VolunteerIllustration from "@/app/components/shared/svg/VolunteerIllustration";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { Button, Radio } from "antd";
import { ArrowRight } from "iconsax-react";
import { SignupUserContext } from "../../../../(pages)/auth/signup/SignupUserProvider";
import { clearSignupState, selectRole } from "@/app/redux/features/signupSlice";
import { useRouter } from "next/navigation";
import { logoutUser, refreshUser } from "@/app/redux/features/userSlice";
import { consumeAuthRedirect } from "@/app/utils/authRedirect";

export default function RoleSelectForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);
  const { currentUser, updateCurrentUser } = useContext(SignupUserContext);

  const initialFormState = {
    role: null as "observer" | "volunteer" | "public-viewer" | null,
  };
  const { formData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);

  // handle form submission
  function submitRole() {
    if (!formData.role) {
      dispatch(
        showAlert({
          message: "Please select a role.",
          type: "error",
        })
      );
      return;
    }

    if (formData.role === "observer" && signupState.isObserverAllowed === false) {
      dispatch(
        showAlert({
          message:
            "An observer has been approved for your polling unit. You can only select the volunteer role.",
          type: "error",
        })
      );
      return;
    }

    dispatch(
      selectRole({
        user: {
          role: formData.role,
          email: currentUser.email!,
        },
      })
    );
  }

  useEffect(() => {
    const status = signupState.status.roleSelection;

    if (status === "rejected") {
      dispatch(
        showAlert({
          message: signupState.error.message!,
          type: "error",
        })
      );
    }

    if (status === "fulfilled") {
      if (formData.role === "volunteer" || formData.role === "public-viewer") {
        dispatch(
          showAlert({
            message: "Account created sucessfully.",
            type: "success",
          })
        );
        dispatch(clearSignupState());
        dispatch(refreshUser());
        setTimeout(() => {
          router.push(consumeAuthRedirect() || "/portal/dashboard");
        }, 0);
      } else {
        dispatch(
          showAlert({
            message: "Observer role selected. Please fill in additional details.",
            type: "success",
          })
        );
        updateCurrentUser({ role: formData.role! });
        router.push("/auth/signup/verify-observer");
      }
    }
  }, [signupState.status.roleSelection]);

  return (
    <React.Fragment>
      <p className="max-w-[480px] text-center text-sm text-gray-500 mb-4">
        There are three roles available: Observers, Volunteers, and Public Viewers.
      </p>
      <form action="" className="flex flex-col mb-3" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="signup-select-role" className="text-sm font-medium mb-5">
          Verification Level <span className="text-error-600">*</span>
        </label>
        <Radio.Group
          name="signup-select-role"
          className="flex flex-col items-center md:flex-row md:flex-wrap md:justify-center gap-7 mb-2 md:mb-4"
          onChange={handleFormInputChange("role")}
        >
          <div
            className={`role-card p-5 ring-1 rounded-lg flex flex-col items-center w-full max-w-[300px] md:max-w-[252px] transition-colors ${
              formData.role === "volunteer"
                ? "ring-brand-500 bg-brand-25/25"
                : "ring-gray-300"
            }`}
          >
            <VolunteerIllustration active={formData.role === "volunteer"} />
            <Radio
              value={"volunteer"}
              rootClassName="mt-2 mb-1"
              disabled={signupState.status.roleSelection === "pending"}
            >
              Volunteer
            </Radio>
            <p className="text-xs text-gray-500 font-light text-center">
              The role of the volunteer is to ensure polling unit accuracy by
              cross-checking observer data. Volunteers monitor and appraise election data
              activities on and off the platform. They may also act as ordinary bystanders
              or onlookers.
            </p>
          </div>
          <div
            className={`role-card p-5 ring-1 rounded-lg flex flex-col items-center w-full max-w-[300px] md:max-w-[252px] transition-colors ${
              formData.role === "observer" && signupState.isObserverAllowed
                ? "ring-brand-500 bg-brand-25/25"
                : "ring-gray-300"
            } ${
              signupState.isObserverAllowed === false
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <ObserverIllustration active={formData.role === "observer"} />
            <Radio
              value={"observer"}
              rootClassName="mt-2 mb-1"
              disabled={
                signupState.isObserverAllowed === false ||
                signupState.status.roleSelection === "pending"
              }
            >
              Observer
            </Radio>
            <p className="text-xs text-gray-500 font-light text-center">
              An observer is a platform-accredited individual overseeing the election at
              their polling unit. They credibly report results, incidents, and any
              irregularities to the platform. Their submissions are subject to detailed
              reviews and appraisals.
            </p>
          </div>
          <div
            className={`role-card p-5 ring-1 rounded-lg flex flex-col items-center w-full max-w-[300px] md:max-w-[252px] transition-colors ${
              formData.role === "public-viewer"
                ? "ring-brand-500 bg-brand-25/25"
                : "ring-gray-300"
            }`}
          >
            <PublicViewerIllustration active={formData.role === "public-viewer"} />
            <Radio
              value={"public-viewer"}
              rootClassName="mt-2 mb-1"
              disabled={signupState.status.roleSelection === "pending"}
            >
              Public Viewer
            </Radio>
            <p className="text-xs text-gray-500 font-light text-center">
              Public viewers follow elections on the platform without uploading
              results or incident reports. This role is ideal if you want to stay
              informed and closely monitor election activity in your local area.
              You can view live updates, explore election discussions.
            </p>
          </div>
        </Radio.Group>

        <p className="text-xs md:text-sm text-error-500 text-center mx-auto mt-1 mb-6 max-w-[484px]">
          {signupState.isObserverAllowed === false
            ? `Anyone can be an accredited observer but only one observer is accredited per polling unit, An observer has been approved for your polling unit.`
            : signupState.isObserverAllowed === true
            ? `Anyone can be an accredited observer but only one observer is accredited per polling unit. A valid PVC is required to become an accredited observer.`
            : null}
        </p>

        <Button
          type="primary"
          size="large"
          className="font-medium group/signup-role-submit flex gap-[1ch] items-center justify-center col-span-2 mb-3"
          onClick={submitRole}
          loading={signupState.status.roleSelection === "pending"}
          disabled={signupState.status.roleSelection === "fulfilled"}
        >
          <div className="flex flex-col gap-0">
            <span
              className={`transition-all duration-500 ${
                formData.role !== "observer" ? "opacity-0 h-0" : "opacity-100 h-[24px]"
              }`}
            >
              Verify Account
            </span>
            <span
              className={`transition-all duration-500 ${
                formData.role === "observer" ? "opacity-0 h-0" : "opacity-100 h-[24px]"
              }`}
            >
              Create Account
            </span>
          </div>
          <ArrowRight
            variant="Linear"
            size={18}
            className={`group-hover/signup-role-submit:translate-x-1 transition-all duration-300 ${
              formData.role !== "observer" ? "w-0 opacity-0" : ""
            }`}
          />
        </Button>
      </form>
    </React.Fragment>
  );
}
