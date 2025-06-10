import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { FileInfo } from "@/app/redux/types";
import {
  Button,
  Image as AntImage,
  Input,
  Modal,
  Select,
  Spin,
  Radio,
  UploadProps,
} from "antd";
import { CloseSquare, Profile } from "iconsax-react";
import React, { SetStateAction, useEffect, useState } from "react";
import { AdminTableUser, clearUser, getUser } from "@/app/redux/admin-features/userSlice";
import Dragger from "antd/es/upload/Dragger";
import UploadIcon from "../../shared/UploadIcon";
import formatNumber from "@/app/utils/formatNumber";
import TruncateTooltip from "../../shared/TruncateTooltip";
import UserProfileCard from "../../shared/UserProfileCard";
import { showAlert } from "@/app/redux/features/alertSlice";

type UserPreviewModalProps = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<Pick<AdminTableUser, '_id'> | null>>;
  user: Pick<AdminTableUser, '_id'> | null;
  footer?: React.ReactNode;
};
export default function UserPreviewModal({
  open,
  setOpen,
  user,
  footer,
}: UserPreviewModalProps) {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.adminUser);
  const verificationState = useAppSelector((state) => state.adminVerification);
  const userDetails = userState.user;
  const [previewFrontImageVisible, setPreviewFrontImageVisible] = useState(false);
  const [previewBackImageVisible, setPreviewBackImageVisible] = useState(false);

  const [observerIds, setObserverIds] = useState<{
    front?: FileInfo;
    back?: FileInfo;
  }>({});
  const observerIdFrontUploadProps: UploadProps = {
    name: "observerIdFront",
    multiple: false,
    showUploadList: false,
    fileList: observerIds.front ? [observerIds.front as any] : [],
  };
  const observerIdBackUploadProps: UploadProps = {
    name: "observerIdBack",
    multiple: false,
    showUploadList: false,
    fileList: observerIds.back ? [observerIds.back as any] : [],
  };

  function closeModal() {
    dispatch(clearUser());
    setOpen(null);
  }

  useEffect(() => {
    if (user) {
      dispatch(getUser(user._id));
    }
  }, [user]);

  useEffect(() => {
    if (userState.status.fetchUser === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message || "An error occurred",
          type: "error",
        })
      );
      closeModal();
    }
  }, [userState.status.fetchUser]);

  useEffect(() => {
    if (userDetails) {
      setObserverIds({
        front: userDetails.observerId.at(0),
        back: userDetails.observerId.at(1),
      });
    }
  }, [userDetails]);

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      footer={null}
      width={950}
      closeIcon={<CloseSquare size={24} className="text-gray-500" />}
      centered
      classNames={{
        content: "!max-h-[calc(100svh-120px)] overflow-y-scroll relative !p-0",
      }}
    >
      {user && userDetails ? (
        <React.Fragment>
          <div className="py-5 px-6">
            <UserProfileCard user={userDetails} />

            {userDetails.role === "observer" && (
              <section className="grid grid-cols-2 gap-3 mb-12">
                <header className="col-span-2">
                  <h3 className="text-lg font-semibold text-brand-500 font-league">
                    Verification Details
                  </h3>
                </header>

                <div className="grid gap-[6px] col-span-1">
                  <label
                    htmlFor="profile-update-firstname"
                    className="text-sm font-medium"
                  >
                    Bank Name
                  </label>
                  <Input
                    style={{ color: "rgb(52, 64, 84)" }}
                    required
                    id="profile-update-bankName"
                    size="large"
                    placeholder="Bank Name"
                    name="bankName"
                    value={userDetails.bankName}
                    disabled={true}
                    className="text-gray-700"
                    type="text"
                  />
                </div>

                <div className="grid gap-[6px] col-span-1">
                  <label
                    htmlFor="profile-update-bankAccountNumber"
                    className="text-sm font-medium"
                  >
                    Account Number
                  </label>
                  <Input
                    style={{ color: "rgb(52, 64, 84)" }}
                    required
                    id="profile-update-bankAccountNumber"
                    size="large"
                    placeholder="Account Number"
                    name="bankAccountNumber"
                    value={userDetails.bankAccountNumber}
                    className="text-gray-700"
                    disabled={true}
                    type="text"
                  />
                </div>

                <div className="grid gap-[6px] col-span-2">
                  <label
                    htmlFor="profile-update-accountName"
                    className="text-sm font-medium"
                  >
                    Account Name
                  </label>
                  <Input
                    style={{ color: "rgb(52, 64, 84)" }}
                    required
                    id="profile-update-accountName"
                    size="large"
                    placeholder="AccountName"
                    name="accountName"
                    value={userDetails.bankAccountName}
                    disabled={true}
                    className="text-gray-700"
                    type="text"
                  />
                </div>

                <div className="grid col-span-2 gap-[6px]">
                  <div className="text-sm font-medium">Permanent Voters Card (PVC)</div>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                      <Dragger
                        id="verify-id-front"
                        style={{ background: "white", height: "100%" }}
                        disabled={true}
                        {...observerIdFrontUploadProps}
                      >
                        <div className="flex gap-2 items-center">
                          <UploadIcon fileType={observerIds.front?.type as any} />
                          <p className="flex flex-col items-start ">
                            <span className="text-sm font-semibold text-gray-700">
                              Front Side
                            </span>
                            <div className="text-xs text-gray-500 flex gap-1 items-center">
                              <span>
                                {observerIds.front?.name ? (
                                  <TruncateTooltip length={15}>
                                    {observerIds.front?.name}
                                  </TruncateTooltip>
                                ) : (
                                  "No file uploaded"
                                )}
                              </span>
                              <span>•</span>
                              <span>
                                {formatNumber.fileSize(observerIds.front?.size || 0)}
                              </span>
                            </div>
                          </p>
                          {observerIds.front && (
                            <AntImage.PreviewGroup
                              preview={{
                                visible: previewFrontImageVisible,
                                onVisibleChange: (v) => setPreviewFrontImageVisible(v),
                              }}
                              items={[
                                observerIds.front.url || "/assets/uploads/file-empty.svg",
                              ]}
                            >
                              <Button
                                className="text-sm font-semibold ml-auto"
                                size="large"
                                type="primary"
                                onClick={() => setPreviewFrontImageVisible(true)}
                              >
                                View
                              </Button>
                            </AntImage.PreviewGroup>
                          )}
                        </div>
                      </Dragger>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                      <Dragger
                        id="verify-id-back"
                        style={{ background: "white", height: "100%" }}
                        disabled={true}
                        {...observerIdBackUploadProps}
                      >
                        <div className="flex gap-2 items-center">
                          <UploadIcon fileType={observerIds.back?.type as any} />
                          <p className="flex flex-col items-start ">
                            <span className="text-sm font-semibold text-gray-700">
                              Back Side
                            </span>
                            <div className="text-xs text-gray-500 flex gap-1 items-center">
                              <span>
                                {observerIds.back?.name ? (
                                  <TruncateTooltip length={15}>
                                    {observerIds.back?.name}
                                  </TruncateTooltip>
                                ) : (
                                  "No file uploaded"
                                )}
                              </span>
                              <span>•</span>
                              <span>
                                {formatNumber.fileSize(observerIds.back?.size || 0)}
                              </span>
                            </div>
                          </p>
                          {observerIds.back && (
                            <AntImage.PreviewGroup
                              preview={{
                                visible: previewBackImageVisible,
                                onVisibleChange: (v) => setPreviewBackImageVisible(v),
                              }}
                              items={[
                                observerIds.back.url || "/assets/uploads/file-empty.svg",
                              ]}
                            >
                              <Button
                                className="text-sm font-semibold ml-auto"
                                size="large"
                                type="primary"
                                onClick={() => setPreviewBackImageVisible(true)}
                              >
                                View
                              </Button>
                            </AntImage.PreviewGroup>
                          )}
                        </div>
                      </Dragger>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="grid grid-cols-2 gap-3 mb-12">
              <header className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-700 font-league">
                  Profile Details
                </h3>
              </header>

              <div className="grid gap-[6px] col-span-2">
                <label htmlFor="profile-update-email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  style={{ color: "rgb(52, 64, 84)" }}
                  required
                  id="profile-update-email"
                  size="large"
                  placeholder="Email"
                  name="email"
                  value={userDetails.email}
                  disabled={true}
                  className="text-gray-700"
                  type="text"
                />
              </div>

              <div className="grid gap-[6px] col-span-1">
                <label htmlFor="profile-update-firstname" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  style={{ color: "rgb(52, 64, 84)" }}
                  required
                  id="profile-update-firstname"
                  size="large"
                  placeholder="First Name"
                  name="firstname"
                  value={userDetails.firstName}
                  disabled={true}
                  className="text-gray-700"
                  type="text"
                />
              </div>

              <div className="grid gap-[6px] col-span-1">
                <label htmlFor="profile-update-lastname" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  style={{ color: "rgb(52, 64, 84)" }}
                  required
                  id="profile-update-lastname"
                  size="large"
                  placeholder="Last Name"
                  name="lastname"
                  value={userDetails.lastName}
                  className="text-gray-700"
                  disabled={true}
                  type="text"
                />
              </div>

              <div className="grid gap-[6px] col-span-1">
                <label htmlFor="profile-update-gender" className="text-sm font-medium">
                  Gender
                </label>
                <Select
                  id="profile-update-gender"
                  size="large"
                  value={userDetails.gender}
                  placeholder="Select Gender"
                  disabled={true}
                  options={[
                    { value: "male", label: <span className="text-gray-700">Male</span> },
                    {
                      value: "female",
                      label: <span className="text-gray-700">Female</span>,
                    },
                  ]}
                />
              </div>

              <div className="grid gap-[6px] col-span-1">
                <label htmlFor="profile-update-dob" className="text-sm font-medium">
                  Date Of Birth
                </label>
                <Input
                  style={{ color: "rgb(52, 64, 84)" }}
                  required
                  id="profile-update-dob"
                  name="date of birth"
                  size="large"
                  placeholder="YYYY-MM-DD"
                  disabled={true}
                  value={userDetails.dateOfBirth}
                />
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <header className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-700 font-league">
                  Coverage Details
                </h3>
              </header>

              <div className="grid gap-[6px] col-span-1">
                <label htmlFor="profile-update-state" className="text-sm font-medium">
                  State
                </label>
                <Input
                  style={{ color: "rgb(52, 64, 84)" }}
                  required
                  id="profile-update-state"
                  size="large"
                  placeholder="State"
                  name="state"
                  value={userDetails.state}
                  disabled={true}
                  className="text-gray-700"
                  type="text"
                />
              </div>

              <div className="grid gap-[6px] col-span-1">
                <label htmlFor="profile-update-lga" className="text-sm font-medium">
                  Local Government
                </label>
                <Input
                  style={{ color: "rgb(52, 64, 84)" }}
                  required
                  id="profile-update-lga"
                  size="large"
                  placeholder="Local Government"
                  name="lga"
                  value={userDetails.lga}
                  className="text-gray-700"
                  disabled={true}
                  type="text"
                />
              </div>

              <div className="grid gap-[6px] col-span-1">
                <label htmlFor="profile-update-ward" className="text-sm font-medium">
                  Ward
                </label>
                <Input
                  style={{ color: "rgb(52, 64, 84)" }}
                  id="profile-update-ward"
                  size="large"
                  value={userDetails.ward}
                  placeholder="Select Ward"
                  disabled={true}
                />
              </div>

              <div className="grid gap-[6px] col-span-1">
                <label htmlFor="profile-update-pu" className="text-sm font-medium">
                  Polling Unit
                </label>
                <Input
                  style={{ color: "rgb(52, 64, 84)" }}
                  required
                  id="profile-update-pu"
                  name="polling unit"
                  size="large"
                  placeholder="YYYY-MM-DD"
                  disabled={true}
                  value={userDetails.pollingUnit}
                />
              </div>

              <div className="grid gap-[6px] col-start-1 col-span-2 mt-3">
                <label
                  htmlFor="coverage-update-p-p-member"
                  className="text-sm font-medium text-center md:text-left"
                >
                  Are you a member of a political party?{" "}
                  <span className="text-error-600">*</span>
                </label>
                <Radio.Group
                  name="coverage-update-p-p-member"
                  value={userDetails.isPoliticalPartyMember}
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
                  If needed, would you be ready to be an election witness in a court of
                  law? <span className="text-error-600">*</span>
                </label>
                <Radio.Group
                  name="coverage-update-witness"
                  value={userDetails.isElectionWitnessReady}
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
                  value={userDetails.isOpenToSurvey}
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
            </section>
          </div>
          {footer && (
            <div className="grid grid-cols-2 gap-3 sticky bottom-0 left-0 w-full p-6 bg-white rounded-b-lg border-t border-gray-200">
              {footer}
            </div>
          )}
        </React.Fragment>
      ) : (
        <div className="flex items-center justify-center h-96">
          <Spin />
        </div>
      )}
    </Modal>
  );
}
