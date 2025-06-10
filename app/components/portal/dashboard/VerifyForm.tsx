import AppSelect from "@/app/components/shared/Select";
import UploadIcon from "@/app/components/shared/UploadIcon";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useBankData from "@/app/hooks/useBankData";
import useCountryData from "@/app/hooks/useCountryData";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { upgradeAccount } from "@/app/redux/features/userSlice";
import { Button, Input, Select, Upload, UploadProps } from "antd";
import { UploadFile } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";
import { Verify } from "iconsax-react";
import Image from "next/image";
import React, { useState } from "react";
import { isMobilePhone } from "validator";
import acceptedFileTypes from "../../../data/acceptedFileTypes";
import { FileInfo } from "@/app/redux/types";
import formatNumber from "@/app/utils/formatNumber";

export default function VerifyForm() {
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const initialFormState = {
    phoneNumberCode: "+234",
    phoneNumber: "",
    bankAccountNumber: "",
    bankAccountName: "",
  };
  const { bankData, updateCurrentBank } = useBankData();
  const { countryData } = useCountryData();
  const { formData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);

  function handleFormSubmit() {
    const { phoneNumber, phoneNumberCode, bankAccountName, bankAccountNumber } = formData;

    if (!observerIds.front) {
      dispatch(
        showAlert({
          message: "Please upload your PVC. (Front and Back)",
          type: "error",
        })
      );
      return;
    }

    if (!isMobilePhone(phoneNumberCode + phoneNumber)) {
      dispatch(
        showAlert({
          message: "Please enter a valid phone number.",
          type: "error",
        })
      );
      return;
    }

    // If bank details are provided, ensure they are valid
    if (
      (!bankData.current ||
      bankAccountName.trim().length === 0 ||
      bankAccountNumber.trim().length === 0) &&
      (bankData.current || bankAccountName.trim().length > 0 || bankAccountNumber.trim().length > 0)
    ) {
      dispatch(
        showAlert({
          message: "Please fill in all bank details.",
          type: "error",
        })
      );
      return;
    }

    const observerIdDT = new DataTransfer();
    observerIdDT.items.add(observerIds.front.originFileObj!);
    if (observerIds.back) observerIdDT.items.add(observerIds.back.originFileObj!);

    const upgradeDetails = {
      bankName: bankData.current,
      bankAccountName,
      bankAccountNumber,
      phoneNumber: phoneNumberCode + phoneNumber,
      observerId: observerIdDT.files as unknown as Array<FileInfo>,
    };
    dispatch(upgradeAccount(upgradeDetails));
  }

  const [observerIds, setObserverIds] = useState<{
    front?: UploadFile;
    back?: UploadFile;
  }>({});
  const observerIdFrontUploadProps: UploadProps = {
    name: "observerIdFront",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    accept: acceptedFileTypes.observerID,
    fileList: observerIds.front ? [observerIds.front] : [],
    beforeUpload(file) {
      const maxFileSize = 5 * 1024 * 1024;

      if (file.size > maxFileSize) {
        dispatch(
          showAlert({
            message: "File size too high (Max 5MB).",
            type: "error",
          })
        );
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange(info) {
      setObserverIds((prev) => ({ ...prev, front: info.fileList[0] }));
    },
  };
  const observerIdBackUploadProps: UploadProps = {
    name: "observerIdBack",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    accept: acceptedFileTypes.observerID,
    fileList: observerIds.back ? [observerIds.back] : [],
    beforeUpload(file) {
      const maxFileSize = 5 * 1024 * 1024;

      if (file.size > maxFileSize) {
        dispatch(
          showAlert({
            message: "File size too high (Max 5MB).",
            type: "error",
          })
        );
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange(info) {
      setObserverIds((prev) => ({ ...prev, back: info.fileList[0] }));
    },
  };

  const phoneNumberCodeSelectOptions = countryData.map((country) => ({
    value: country.dialCode,
    flag: country.flag,
    country: country.name,
    countryCode: country.dialCode,
    name: `${country.isoCode} ${country.name}`,
    label: (
      <div className="flag-image h-[20px] w-[20px] grid place-items-center rounded-full overflow-hidden bg-gray-200">
        <Image
          src={country.flag}
          alt={`flag of ${country.name}`}
          className="scale-150"
          width={64}
          height={64}
        />
      </div>
    ) as unknown as string,
  }));

  const phoneNumberCodeSelect = (
    <Select
      value={formData.phoneNumberCode}
      options={phoneNumberCodeSelectOptions}
      optionRender={(option) => (
        <div className="flex items-center gap-2">{option.data.country}</div>
      )}
      virtual={false}
      placeholder="Search Country"
      onChange={handleFormInputChange("phoneNumberCode", "static") as any}
      optionFilterProp="children"
      className="group/select-display"
      dropdownStyle={{ minWidth: "250px" }}
    />
  );

  return (
    <form
      id="verify-form"
      action=""
      className="grid grid-cols-2 gap-7 w-full text-gray-700 mt-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid col-span-2">
        <div className="text-sm font-medium">
          Upload your Permanent Voters Card (PVC){" "}
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Ensure to attach the front and back image(s) of your Permanent Voters Card
          (PVC).
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="verify-id-front"
            >
              Front <span className="text-error-600">*</span>
            </label>
            <Dragger
              id="verify-id-front"
              style={{ background: "white", height: "100%" }}
              {...observerIdFrontUploadProps}
            >
              <div className="grid mb-2 place-items-center">
                <UploadIcon fileType={observerIds.front?.type as any} />
              </div>
              {observerIds.front ? (
                <p className="flex flex-col gap-1 text-gray-700">
                  <span className="text-sm font-semibold text-brand-600">
                    {observerIds.front.name}
                  </span>
                  <p className="mb-3 text-xs text-gray-400">Front or Both Side(s)</p>
                  <span className="text-xs text-gray-700">
                    {formatNumber.fileSize(observerIds.front.size || 0)}
                  </span>
                </p>
              ) : (
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-brand-600">Click to upload</span>{" "}
                    or drag and drop
                  </p>
                  <p className="mb-2 text-xs text-gray-400">
                    JPG and PNG formats only • Max. 5MB
                  </p>

                  <Button className="text-sm font-semibold" size="large" type="primary">
                    Browse
                  </Button>
                </div>
              )}
            </Dragger>
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <label className="text-sm font-medium text-gray-700" htmlFor="verify-id-back">
              Back
            </label>
            <Dragger
              id="verify-id-back"
              style={{ background: "white", height: "100%" }}
              {...observerIdBackUploadProps}
            >
              <div className="grid mb-2 place-items-center">
                <UploadIcon fileType={observerIds.back?.type as any} />
              </div>
              {observerIds.back ? (
                <p className="flex flex-col gap-1 text-gray-700">
                  <span className="text-sm font-semibold text-brand-600">
                    {observerIds.back.name}
                  </span>
                  <p className="mb-3 text-xs text-gray-400">Back Side</p>
                  <span className="text-xs text-gray-700">
                    {formatNumber.fileSize(observerIds.back.size || 0)}
                  </span>
                </p>
              ) : (
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-brand-600">Click to upload</span>{" "}
                    or drag and drop
                  </p>
                  <p className="mb-2 text-xs text-gray-400">
                    JPG and PNG formats only • Max. 5MB
                  </p>

                  <Button className="text-sm font-semibold" size="large" type="primary">
                    Browse
                  </Button>
                </div>
              )}
            </Dragger>
          </div>
        </div>
      </div>

      <div className="grid gap-[6px] col-start-1 col-span-2">
        <label htmlFor="verify-phone-number" className="text-sm font-medium">
          Phone Number <span className="text-error-600">*</span>
        </label>
        <Input
          id="verify-phone-number"
          size="large"
          value={formData.phoneNumber}
          onChange={handleFormInputChange("phoneNumber")}
          placeholder="902 1410 897"
          prefix={<span className="text-gray-700">{formData.phoneNumberCode}</span>}
          suffix={<Verify size={16} className="text-brand-500" variant="Bold" />}
          addonBefore={phoneNumberCodeSelect}
        />
      </div>

      <header className="text-sm col-start-1 col-span-2">
        <h3 className="font-medium">Bank Details</h3>
        <p className="text-gray-500 font-normal">
          Please verify your bank account details for observing allowance.
        </p>
      </header>

      <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1">
        <label htmlFor="verify-bank-name" className="text-sm font-medium">
          Bank Name
        </label>
        <AppSelect
          id="verify-bank-name"
          value={bankData.current}
          onChange={(e) => updateCurrentBank(e.target.value)}
          disabled={bankData.data.length === 0}
          options={bankData.data}
        />
      </div>

      <div className="grid gap-[6px] col-start-1 col-span-2 md:col-span-1 md:col-start-2">
        <label htmlFor="verify-acc-number" className="text-sm font-medium">
          Account Number
        </label>
        <Input
          id="verify-acc-number"
          size="large"
          value={formData.bankAccountNumber}
          onChange={handleFormInputChange("bankAccountNumber")}
          placeholder="Enter account number"
        />
      </div>

      <div className="grid gap-[6px] col-start-1 col-span-2">
        <label htmlFor="verify-acc-name" className="text-sm font-medium">
          Account Name
        </label>
        <Input
          id="verify-acc-name"
          size="large"
          value={formData.bankAccountName}
          onChange={handleFormInputChange("bankAccountName")}
          placeholder="Enter account name"
        />
      </div>

      <Button
        type="primary"
        size="large"
        className="group/verify-stage-four-submit font-medium flex gap-[1ch] items-center justify-center col-span-2"
        loading={userState.status.upgradeAccount === "pending"}
        onClick={handleFormSubmit}
        htmlType="submit"
      >
        Upload
      </Button>
    </form>
  );
}
