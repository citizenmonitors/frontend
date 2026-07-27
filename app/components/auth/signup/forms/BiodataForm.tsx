"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { Button, DatePicker, Input, Select, Tooltip, Upload, UploadProps } from "antd";
import { ArrowRight, Edit2, InfoCircle, ProfileAdd, Trash } from "iconsax-react";
import moment from "moment";
import NextImage from "next/image";
import ImgCrop from "antd-img-crop";
import getBase64 from "@/app/utils/getBase64";
import acceptedFileTypes from "@/app/data/acceptedFileTypes";
import { SignupUserContext } from "../../../../(pages)/auth/signup/SignupUserProvider";
import { RcFile } from "antd/es/upload";
import { useRouter } from "next/navigation";
import formatNumber from "@/app/utils/formatNumber";
import {
  buildCountrySelectOptions,
  CountryFlag,
  filterCountrySelectOption,
} from "@/app/utils/countrySelectOptions";
import { readSignupDraft } from "@/app/data/signupDraft";

function BiodataForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser, updateCurrentUser } = useContext(SignupUserContext);
  const profileImage = currentUser.profileImage as unknown as RcFile | null | undefined;

  const initialFormState = {
    email: "",
    firstName: "",
    lastName: "",
    gender: undefined as string | undefined,
    nationality: undefined as string | undefined,
    dateOfBirth: undefined as any,
  };
  const { formData, setFormData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);

  useEffect(() => {
    const draft = readSignupDraft();
    const nextEmail = currentUser.email || draft?.email || "";
    const nextFirstName = currentUser.firstName || draft?.firstName || "";
    const nextLastName = currentUser.lastName || draft?.lastName || "";

    setFormData((prev) => ({
      ...prev,
      ...(nextEmail ? { email: nextEmail } : {}),
      ...(nextFirstName && !prev.firstName ? { firstName: nextFirstName } : {}),
      ...(nextLastName && !prev.lastName ? { lastName: nextLastName } : {}),
    }));

    if (nextEmail && !currentUser.email) {
      updateCurrentUser({
        email: nextEmail,
        ...(nextFirstName ? { firstName: nextFirstName } : {}),
        ...(nextLastName ? { lastName: nextLastName } : {}),
      });
    }
  }, [currentUser.email, currentUser.firstName, currentUser.lastName]);

  const nationalitySelectOptions = useMemo(
    () =>
      buildCountrySelectOptions().map((opt) => ({
        value: opt.value,
        label: opt.label,
        country: opt.country,
        flag: opt.flag,
        isoCode: opt.isoCode,
      })),
    []
  );
  const [profilePreview, setProfilePreview] = useState<string>("");
  const profileImageUploadProps: UploadProps = {
    id: "signup-profile-image",
    name: "profileImage",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    accept: acceptedFileTypes.profilePicture,
    openFileDialogOnClick: true,
    beforeUpload: async (file) => {
      const maxFileSize = 1 * 1024 * 1024;
      if (file.size > maxFileSize) {
        dispatch(
          showAlert({
            message: "Profile image maximum size is 1MB.",
            type: "error",
          })
        );
        return Upload.LIST_IGNORE;
      }
      const preview = await getBase64(file);
      updateCurrentUser({ profileImage: file as any });
      setProfilePreview(preview);
      return false;
    },
  };

  function handleFormSubmit() {
    if (
      formData.firstName.trim() === "" ||
      formData.lastName.trim() === "" ||
      !formData.gender ||
      !formData.dateOfBirth
    ) {
      dispatch(
        showAlert({
          message: "Please fill in all required fields.",
          type: "error",
        })
      );
      return;
    }

    const dob = moment((formData.dateOfBirth as { $d: Date }).$d);
    const isOlderThan18 = moment().diff(dob, "years") >= 18;

    if (!isOlderThan18) {
      dispatch(
        showAlert({
          message: "You must be at least 18 years old to sign up.",
          type: "error",
        })
      );
      return;
    }

    updateCurrentUser({
      ...formData,
      dateOfBirth: moment((formData.dateOfBirth as { $d: Date }).$d).format("YYYY-MM-DD"),
    });
    router.push("/auth/signup/coverage");
  }

  return (
    <form
      id="signup-stage-two-form"
      action=""
      className="grid grid-cols-2 gap-7 w-full max-w-[648px] text-gray-700"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid gap-[6px] col-start-1 col-span-2">
        <span className="text-sm font-medium flex justify-between items-center">
          <span>Profile Photo</span>
          <Tooltip className="text-center" title="Add your profile image (Max. 1MB).">
            <InfoCircle size={16} className="text-gray-400" />
          </Tooltip>
        </span>

        <ImgCrop cropShape="round" modalProps={{ zIndex: 2000 }}>
          <Upload {...profileImageUploadProps}>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center cursor-pointer">
              <div className="preview h-[64px] w-[64px] md:h-[100px] md:w-[100px] rounded-full bg-gray-100 overflow-hidden">
                {!profilePreview ? (
                  <div className="user-card-profile h-full w-full grid place-content-center rounded-full bg-gradient-to-b from-brand-600 to-brand-500 text-white">
                    <ProfileAdd size={40} />
                  </div>
                ) : (
                  <NextImage
                    src={profilePreview}
                    alt="profile"
                    className="w-full h-full"
                    width={100}
                    height={100}
                    unoptimized
                  />
                )}
              </div>
              <div className="info flex flex-col gap-1 md:gap-2">
                {profileImage ? (
                  <React.Fragment>
                    <div
                      className="text-sm text-center mx-auto flex items-center gap-[0.5ch]"
                      title={profileImage.name}
                    >
                      <span className="inline-block truncate max-w-[192px] text-gray-500">
                        {profileImage.name}
                      </span>{" "}
                      <span className="text-gray-400 font-medium">
                        ({formatNumber.fileSize(profileImage.size || 0)})
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        type="text"
                        htmlType="button"
                        className="text-brand-500 hover:!text-brand-600 font-medium flex items-center"
                        icon={<Edit2 size={16} variant="Bold" />}
                      >
                        Change
                      </Button>
                      <Button
                        type="text"
                        htmlType="button"
                        className="text-error-500 hover:!text-error-600 font-medium flex items-center"
                        icon={<Trash size={16} variant="Bold" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCurrentUser({ profileImage: null });
                          setProfilePreview("");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </React.Fragment>
                ) : (
                  <Button
                    type="text"
                    htmlType="button"
                    className="text-brand-500 hover:!text-brand-600 font-medium"
                  >
                    Add Profile Photo
                  </Button>
                )}
              </div>
            </div>
          </Upload>
        </ImgCrop>
      </div>

      <div className="grid gap-[6px] col-start-1 col-span-2">
        <label htmlFor="signup-email" className="text-sm font-medium">
          Email Address
        </label>
        <Input
          required
          id="signup-email"
          size="large"
          placeholder="example@gmail.com"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleFormInputChange("email")}
          className="text-gray-700"
          disabled
          suffix={
            <Tooltip className="text-center" title="This email has been verified.">
              <InfoCircle size={16} className="text-gray-400" />
            </Tooltip>
          }
        />
      </div>

      <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1">
        <label htmlFor="signup-firstname" className="text-sm font-medium">
          First Name <span className="text-error-600">*</span>
        </label>
        <Input
          required
          id="signup-firstname"
          size="large"
          placeholder="First Name"
          name="firstname"
          value={formData.firstName}
          onChange={handleFormInputChange("firstName")}
          className="text-gray-700"
          suffix={
            <Tooltip className="text-center" title="Enter your first name here.">
              <InfoCircle size={16} className="text-gray-400" />
            </Tooltip>
          }
          type="text"
        />
      </div>

      <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1 md:col-start-2">
        <label htmlFor="signup-lastname" className="text-sm font-medium">
          Last Name <span className="text-error-600">*</span>
        </label>
        <Input
          required
          id="signup-lastname"
          size="large"
          placeholder="Last Name"
          name="lastname"
          value={formData.lastName}
          onChange={handleFormInputChange("lastName")}
          className="text-gray-700"
          suffix={
            <Tooltip className="text-center" title="Enter your last name here.">
              <InfoCircle size={16} className="text-gray-400" />
            </Tooltip>
          }
          type="text"
        />
      </div>

      <div className="grid gap-[6px] col-start-1 col-span-2">
        <label htmlFor="signup-nationality" className="text-sm font-medium">
          Nationality
        </label>
        <Select
          id="signup-nationality"
          size="large"
          showSearch
          value={formData.nationality}
          onChange={handleFormInputChange("nationality", "static")}
          placeholder="Select Nationality"
          options={nationalitySelectOptions}
          optionFilterProp="country"
          filterOption={filterCountrySelectOption}
          optionRender={(option) => (
            <div className="flex items-center gap-2">
              <CountryFlag flag={option.data.flag} name={option.data.country} />
              <span className="text-gray-700">{option.data.country}</span>
            </div>
          )}
          virtual={false}
        />
      </div>

      <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1">
        <label htmlFor="signup-gender" className="text-sm font-medium">
          Gender <span className="text-error-600">*</span>
        </label>
        <Select
          id="signup-gender"
          size="large"
          value={formData.gender}
          onChange={handleFormInputChange("gender", "static")}
          placeholder="Select Gender"
          options={[
            { value: "male", label: <span className="text-gray-700">Male</span> },
            { value: "female", label: <span className="text-gray-700">Female</span> },
          ]}
        />
      </div>

      <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1 md:col-start-2">
        <label htmlFor="signup-dob" className="text-sm font-medium">
          Date Of Birth <span className="text-error-600">*</span>
        </label>
        <DatePicker
          required
          id="signup-dob"
          name="date of birth"
          size="large"
          placeholder="YYYY-MM-DD"
          value={formData.dateOfBirth}
          onChange={handleFormInputChange("dateOfBirth", "static")}
        />
      </div>

      <Button
        type="primary"
        size="large"
        className="group/signup-stage-two-submit font-medium flex gap-[1ch] items-center justify-center col-span-2 mb-3"
        onClick={handleFormSubmit}
      >
        <span>Proceed to Coverage Details</span>
        <ArrowRight
          variant="Linear"
          size={18}
          className="group-hover/signup-stage-two-submit:translate-x-1 transition-transform"
        />
      </Button>
    </form>
  );
}

export default BiodataForm;
