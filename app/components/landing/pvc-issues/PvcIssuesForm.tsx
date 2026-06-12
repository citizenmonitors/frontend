"use client";

import AppSelect from "@/app/components/shared/Select";
import UploadIcon from "@/app/components/shared/UploadIcon";
import acceptedFileTypes from "@/app/data/acceptedFileTypes";
import {
  PVC_CONSENT_TEXT,
  PVC_CONFIRMATION_MESSAGE,
  PVC_DESCRIPTION_MAX,
  PVC_EVIDENCE_MAX_FILE_SIZE,
  PVC_ISSUE_TYPE_OTHER,
  PVC_ISSUE_TYPES,
} from "@/app/data/pvcIssues";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import useLocationData from "@/app/hooks/useLocationData";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearPvcIssueSubmission,
  submitPvcIssueReport,
} from "@/app/redux/features/pvcIssuesSlice";
import formatNumber from "@/app/utils/formatNumber";
import formatString from "@/app/utils/formatString";
import { Button, Checkbox, Upload, UploadProps } from "antd";
import type { RcFile } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";
import { TickCircle } from "iconsax-react";
import React, { useEffect, useState } from "react";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";

export default function PvcIssuesForm() {
  const dispatch = useAppDispatch();
  const pvcIssuesState = useAppSelector((state) => state.pvcIssues);
  const { locationData, updateLocationField } = useLocationData();
  const [evidenceFiles, setEvidenceFiles] = useState<RcFile[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const initialFormState = {
    fullName: "",
    phoneNumber: "",
    email: "",
    pollingUnit: "",
    issueType: "",
    otherIssueDetail: "",
    description: "",
    consent: false,
  };
  const { formData, handleFormInputChange, setFormData } =
    useFormHandler(initialFormState);

  const evidenceUploadProps: UploadProps = {
    name: "evidence",
    accept: acceptedFileTypes.pvcEvidence,
    fileList: evidenceFiles,
    multiple: true,
    beforeUpload: (file) => {
      if (file.size > PVC_EVIDENCE_MAX_FILE_SIZE) {
        dispatch(
          showAlert({
            message: "Each file must be 5MB or less.",
            type: "error",
          })
        );
        return Upload.LIST_IGNORE;
      }
      setEvidenceFiles((prev) => [...prev, file]);
      return false;
    },
    onChange: (info) => {
      setEvidenceFiles(
        info.fileList
          .map((f) => f.originFileObj)
          .filter((f): f is RcFile => f !== undefined)
      );
    },
    onRemove: (file) => {
      setEvidenceFiles((prev) => prev.filter((item) => item.uid !== file.uid));
    },
  };

  function resetForm() {
    setFormData(initialFormState);
    setEvidenceFiles([]);
    setSubmitted(false);
    dispatch(clearPvcIssueSubmission());
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      dispatch(showAlert({ type: "error", message: "Full Name is required." }));
      return;
    }

    if (!formData.phoneNumber.trim()) {
      dispatch(showAlert({ type: "error", message: "Phone Number is required." }));
      return;
    }

    if (!isMobilePhone(formData.phoneNumber, "en-NG")) {
      dispatch(
        showAlert({
          type: "error",
          message: "Please enter a valid Nigerian phone number.",
        })
      );
      return;
    }

    if (formData.email.trim() && !isEmail(formData.email)) {
      dispatch(
        showAlert({
          type: "error",
          message: "Please enter a valid email address.",
        })
      );
      return;
    }

    if (!locationData.states.current) {
      dispatch(showAlert({ type: "error", message: "State of Residence is required." }));
      return;
    }

    if (!locationData.lgas.current) {
      dispatch(showAlert({ type: "error", message: "Local Government Area is required." }));
      return;
    }

    if (!formData.pollingUnit.trim()) {
      dispatch(showAlert({ type: "error", message: "Polling Unit is required." }));
      return;
    }

    if (!formData.issueType) {
      dispatch(showAlert({ type: "error", message: "Type of Issue is required." }));
      return;
    }

    if (
      formData.issueType === PVC_ISSUE_TYPE_OTHER &&
      !formData.otherIssueDetail.trim()
    ) {
      dispatch(
        showAlert({
          type: "error",
          message: "Please describe your issue.",
        })
      );
      return;
    }

    if (!formData.description.trim()) {
      dispatch(
        showAlert({
          type: "error",
          message: "Short Description is required.",
        })
      );
      return;
    }

    const descriptionLength = formData.description.trim().length;
    if (descriptionLength > PVC_DESCRIPTION_MAX) {
      dispatch(
        showAlert({
          type: "error",
          message: `Description must not exceed ${PVC_DESCRIPTION_MAX} characters.`,
        })
      );
      return;
    }

    if (!formData.consent) {
      dispatch(
        showAlert({
          type: "error",
          message: "You must provide consent before submitting.",
        })
      );
      return;
    }

    dispatch(
      submitPvcIssueReport({
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim() || undefined,
        state: locationData.states.current,
        lga: locationData.lgas.current,
        pollingUnit: formData.pollingUnit.trim(),
        issueType: formData.issueType,
        otherIssueDetail:
          formData.issueType === PVC_ISSUE_TYPE_OTHER
            ? formData.otherIssueDetail.trim()
            : undefined,
        description: formData.description.trim(),
        consent: true,
        consentText: PVC_CONSENT_TEXT,
        evidence: evidenceFiles,
      })
    );
  }

  useEffect(() => {
    const status = pvcIssuesState.status.submitReport;

    if (status === "rejected") {
      dispatch(
        showAlert({
          message:
            pvcIssuesState.error.message ||
            "Failed to submit your report. Please try again.",
          type: "error",
        })
      );
      dispatch(clearPvcIssueSubmission());
      return;
    }

    if (status === "fulfilled") {
      setSubmitted(true);
      dispatch(clearPvcIssueSubmission());
    }
  }, [pvcIssuesState.status.submitReport]);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-25 p-6 md:p-10 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-600">
          <TickCircle size={32} variant="Bulk" />
        </div>
        <h2 className="font-league text-display-xs font-semibold text-gray-800 mb-3">
          Report Submitted
        </h2>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
          {PVC_CONFIRMATION_MESSAGE}
        </p>
        <Button type="primary" size="large" onClick={resetForm}>
          Submit Another Report
        </Button>
      </div>
    );
  }

  const descriptionLength = formData.description.length;

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="pvc-full-name" className="text-sm font-medium text-gray-700">
            Full Name <span className="text-error-600">*</span>
          </label>
          <input
            id="pvc-full-name"
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition-all hover:border-brand-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20"
            value={formData.fullName}
            onChange={handleFormInputChange("fullName")}
            placeholder="Enter your full name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="pvc-phone" className="text-sm font-medium text-gray-700">
            Phone Number <span className="text-error-600">*</span>
          </label>
          <input
            id="pvc-phone"
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition-all hover:border-brand-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20"
            value={formData.phoneNumber}
            onChange={handleFormInputChange("phoneNumber")}
            placeholder="e.g. 08012345678 or +2348012345678"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="pvc-email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="pvc-email"
            type="email"
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition-all hover:border-brand-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20"
            value={formData.email}
            onChange={handleFormInputChange("email")}
            placeholder="Optional"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="pvc-state" className="text-sm font-medium text-gray-700">
            State of Residence <span className="text-error-600">*</span>
          </label>
          <AppSelect
            id="pvc-state"
            placeholder="Select state"
            options={locationData.states.data.map((state) => ({
              value: state,
              label: formatString.normalCase(state),
            }))}
            value={locationData.states.current || ""}
            onChange={(event) => updateLocationField("states", event.target.value)}
            disabled={locationData.states.status === "pending"}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="pvc-lga" className="text-sm font-medium text-gray-700">
            Local Government Area <span className="text-error-600">*</span>
          </label>
          <AppSelect
            id="pvc-lga"
            placeholder="Select LGA"
            options={locationData.lgas.data.map((lga) => ({
              value: lga,
              label: formatString.normalCase(lga),
            }))}
            value={locationData.lgas.current || ""}
            onChange={(event) => updateLocationField("lgas", event.target.value)}
            disabled={!locationData.states.current || locationData.lgas.status === "pending"}
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="pvc-polling-unit" className="text-sm font-medium text-gray-700">
            Polling Unit <span className="text-error-600">*</span>
          </label>
          <input
            id="pvc-polling-unit"
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition-all hover:border-brand-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20"
            value={formData.pollingUnit}
            onChange={handleFormInputChange("pollingUnit")}
            placeholder="Enter your polling unit"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="pvc-issue-type" className="text-sm font-medium text-gray-700">
            Type of Issue <span className="text-error-600">*</span>
          </label>
          <AppSelect
            id="pvc-issue-type"
            placeholder="Select issue type"
            options={PVC_ISSUE_TYPES.map((issue) => ({
              value: issue.value,
              label: issue.label,
            }))}
            value={formData.issueType}
            onChange={handleFormInputChange("issueType")}
          />
        </div>

        {formData.issueType === PVC_ISSUE_TYPE_OTHER && (
          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              htmlFor="pvc-other-issue"
              className="text-sm font-medium text-gray-700"
            >
              Describe Your Issue <span className="text-error-600">*</span>
            </label>
            <input
              id="pvc-other-issue"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition-all hover:border-brand-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20"
              value={formData.otherIssueDetail}
              onChange={handleFormInputChange("otherIssueDetail")}
              placeholder="Briefly describe the issue"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="pvc-description" className="text-sm font-medium text-gray-700">
            Short Description <span className="text-error-600">*</span>
          </label>
          <textarea
            id="pvc-description"
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-all hover:border-brand-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20 resize-none"
            value={formData.description}
            onChange={handleFormInputChange("description")}
            placeholder="Describe what happened in detail"
          />
          <p
            className={`text-xs ${
              descriptionLength > PVC_DESCRIPTION_MAX ? "text-error-600" : "text-gray-500"
            }`}
          >
            {descriptionLength}/{PVC_DESCRIPTION_MAX} characters
          </p>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Evidence Upload
          </label>
          <Dragger style={{ background: "white" }} {...evidenceUploadProps}>
            <div className="mb-2 grid place-items-center">
              <UploadIcon fileType={evidenceFiles.at(-1)?.type as any} />
            </div>
            <p className="text-gray-600">
              <span className="font-semibold text-brand-600">Click to upload</span> or
              drag and drop
            </p>
            <p className="text-xs text-gray-400">
              Images, PDFs, or screenshots • Max. 5MB per file
            </p>
            {evidenceFiles.length > 0 && (
              <div className="mt-4 flex flex-col gap-1 text-left">
                {evidenceFiles.map((file) => (
                  <p key={file.uid} className="text-xs text-gray-600">
                    {file.name} • {formatNumber.fileSize(file.size || 0)}
                  </p>
                ))}
              </div>
            )}
          </Dragger>
        </div>

        <div className="md:col-span-2 rounded-xl border border-gray-200 bg-gray-25 p-4">
          <Checkbox
            checked={formData.consent}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                consent: event.target.checked,
              }))
            }
          >
            <span className="text-sm text-gray-700 leading-relaxed">
              {PVC_CONSENT_TEXT}
            </span>
          </Checkbox>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        htmlType="submit"
        className="w-full md:w-fit md:ml-auto"
        loading={pvcIssuesState.status.submitReport === "pending"}
        disabled={!formData.consent}
      >
        Submit Report
      </Button>
    </form>
  );
}