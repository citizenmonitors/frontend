"use client";
import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { clearUserStatus, updateAccount } from "@/app/redux/features/userSlice";
import getBase64 from "@/app/utils/getBase64";
import { Button, DatePicker, Input, Select, Tooltip, Upload, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import dayjs from "dayjs";
import { Edit2, InfoCircle, ProfileAdd, Trash } from "iconsax-react";
import React, { useEffect, useMemo, useState } from "react";
import NextImage from "next/image";
import { backendDomain } from "@/app/data/backend";
import acceptedFileTypes from "@/app/data/acceptedFileTypes";
import formatNumber from "@/app/utils/formatNumber";

export default function ProfileDetails() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const { formData, handleFormInputChange, setFormData } = useFormHandler({
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    gender: userDetails.gender,
  });

  const [profileModified, setProfileModified] = useState<boolean>(false);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [profileImage, setProfileImage] = React.useState<RcFile | null>(null);
  const profileImageUploadProps: UploadProps = {
    id: "signup-profile-image",
    name: "profileImage",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    accept: acceptedFileTypes.profilePicture,
    fileList: profileImage ? [profileImage] : [],
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
      let b = await getBase64(file);
      setProfileImage(file);
      setProfilePreview(b);
      setProfileModified(true);
      return false;
    },
  };
  const [dateOfBirth, setDateOfBirth] = useState(
    dayjs(userDetails.dateOfBirth, "YYYY-MM-DD")
  );
  const isChangesMade = useMemo(() => {
    const currentDetails = {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      gender: userDetails.gender,
      dateOfBirth: userDetails.dateOfBirth,
    };

    const newDetails = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      gender: formData.gender,
      dateOfBirth: dateOfBirth.format("YYYY-MM-DD"),
    };

    return (
      JSON.stringify(currentDetails) !== JSON.stringify(newDetails) || profileModified
    );
  }, [formData, dateOfBirth, userState.status.updateAccount, profileModified]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isChangesMade) {
      dispatch(
        showAlert({
          message: "No profile changes detected.",
          type: "warning",
        })
      );
      return;
    }

    if (
      formData.firstName.trim() === "" ||
      formData.lastName.trim() === "" ||
      !formData.gender ||
      !dateOfBirth
    ) {
      dispatch(
        showAlert({
          message: "Please fill in all required fields.",
          type: "error",
        })
      );
      return;
    }
    const updatedFields = {
      ...formData,
      dateOfBirth: dateOfBirth.format("YYYY-MM-DD"),
    };
    if (profileModified) {
      Object.assign(updatedFields, { profileImage: profileImage });
    }
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
          message: "Profile updated successfully.",
          type: "success",
        })
      );
      dispatch(clearUserStatus(["updateAccount"]));
      setProfileModified(false);
    }
  }, [userState.status.updateAccount]);

  return (
    <React.Fragment>
      <SettingsHeader>Your Profile</SettingsHeader>
      <div
        id="settings-profile-details"
        className="py-6 md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[736px] mx-auto bg-white"
      >
        <h3 className="font-league text-xl md:text-display-xs lg:text-display-sm text-brand-500 text-center font-semibold mb-1 leading-tight">
          Update your profile.
        </h3>
        <p className="text-gray-500 text-sm text-center mb-8 max-w-screen-xs mx-auto">
          Here you can view and edit public profile information about yourself.
        </p>

        <form className="grid grid-cols-2 gap-8" action="" onSubmit={handleSubmit}>
          <div className="grid gap-[6px] col-start-1 col-span-2">
            <span className="text-sm font-medium flex justify-between items-center">
              <label htmlFor="signup-profile-image">Profile Photo</label>
              <Tooltip className="text-center" title="Add your profile image (Max. 1MB).">
                <InfoCircle size={16} className="text-gray-400" />
              </Tooltip>
            </span>
            <ImgCrop cropShape="round">
              <Upload {...profileImageUploadProps}>
                <div className="preview h-[64px] w-[64px] md:h-[100px] md:w-[100px] rounded-full bg-gray-100 overflow-hidden">
                  {!profileModified && userDetails.profileImage ? (
                    <NextImage
                      src={userDetails.profileImage.url}
                      alt="profile"
                      className="w-full h-full"
                      width={100}
                      height={100}
                    />
                  ) : !profilePreview ? (
                    <div className="user-card-profile h-full w-full grid place-content-center rounded-full bg-gradient-to-b from-brand-600 to-brand-500 text-white ">
                      <ProfileAdd size={40} />
                    </div>
                  ) : (
                    <NextImage
                      src={profilePreview}
                      alt="profile"
                      className="w-full h-full"
                      width={100}
                      height={100}
                    />
                  )}
                </div>
                <div className="info flex flex-col gap-1 md:gap-2 ">
                  {!profileModified && userDetails.profileImage ? (
                    <React.Fragment>
                      <div
                        className="text-sm  text-center  mx-auto flex items-center gap-[0.5ch]"
                        title={userDetails.profileImage.name}
                      >
                        <span className="inline-block truncate max-w-[192px] text-gray-500">
                          {userDetails.profileImage.name}
                        </span>{" "}
                        <span className="text-gray-400 font-medium">
                          ({formatNumber.fileSize(userDetails.profileImage.size || 0)})
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <Button
                          type="text"
                          className="text-brand-500 hover:!text-brand-600 font-medium flex items-center"
                          icon={<Edit2 size={16} variant="Bold" />}
                        >
                          Change
                        </Button>
                      </div>
                    </React.Fragment>
                  ) : profileImage ? (
                    <React.Fragment>
                      <div
                        className="text-sm  text-center  mx-auto flex items-center gap-[0.5ch]"
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
                          className="text-brand-500 hover:!text-brand-600 font-medium flex items-center"
                          icon={<Edit2 size={16} variant="Bold" />}
                        >
                          Change
                        </Button>
                      </div>
                    </React.Fragment>
                  ) : (
                    <Button
                      type="text"
                      className="text-brand-500 hover:!text-brand-600 font-medium"
                    >
                      Add Profile Photo
                    </Button>
                  )}
                </div>
              </Upload>
            </ImgCrop>
          </div>

          <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1">
            <label htmlFor="profile-update-firstname" className="text-sm font-medium">
              First Name <span className="text-error-600">*</span>
            </label>
            <Input
              required
              id="profile-update-firstname"
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
            <label htmlFor="profile-update-lastname" className="text-sm font-medium">
              Last Name <span className="text-error-600">*</span>
            </label>
            <Input
              required
              id="profile-update-lastname"
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

          <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1">
            <label htmlFor="profile-update-gender" className="text-sm font-medium">
              Gender <span className="text-error-600">*</span>
            </label>
            <Select
              id="profile-update-gender"
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
            <label htmlFor="profile-update-dob" className="text-sm font-medium">
              Date Of Birth <span className="text-error-600">*</span>
            </label>
            <DatePicker
              required
              id="profile-update-dob"
              name="date of birth"
              size="large"
              placeholder="YYYY-MM-DD"
              value={dateOfBirth}
              onChange={(dob) => setDateOfBirth(dob)}
            />
          </div>

          <div className="buttons grid gap-4 col-span-2">
            <Button
              type="primary"
              size="large"
              className="group/profile-update-stage-two-submit font-medium flex gap-[1ch] items-center justify-center"
              htmlType="submit"
              loading={userState.status.updateAccount === "pending"}
              block
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}
