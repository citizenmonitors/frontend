import LogoFlat from "@/app/components/shared/svg/LogoFlat";
import AppSelect from "@/app/components/shared/Select";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  getFlagPermission,
  getPollingUnitResults,
} from "@/app/redux/features/electionSlice";
import { PollingUnitReport, PollingUnitResult } from "@/app/redux/types";
import { Button, Input, Modal, Radio, Spin } from "antd";
import React, { useEffect, useMemo } from "react";
import { ArrowRight } from "iconsax-react";
import { useRouter } from "next/navigation";

type PollingUnitUploadFlagConfirmModalProps = {
  pollingUnitUpload: PollingUnitReport | PollingUnitResult | null;
  closeModal: () => void;
};
const initialFormData = {
  flagConfirm: undefined,
  flagEvidenceConfirm: undefined,
  flagEvidenceType: undefined as "report" | "result" | undefined,
  flagReason: undefined as string | undefined,
  flagOtherReason: undefined as string | undefined,
};
const flagReasons = [
  "Election never held.",
  "Result is a total fabrication.",
  "Result is correct but contains error(s).",
  // "I just don't like the result.",
  "Other",
];

export default function PollingUnitUploadFlagConfirmModal({
  pollingUnitUpload,
  closeModal,
}: PollingUnitUploadFlagConfirmModalProps) {
  const {
    status,
    pollingUnitResults: { hasSubmitted },
  } = useAppSelector((state) => state.election);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isResult = !!(pollingUnitUpload as PollingUnitResult)?.partiesVotes;

  const { formData, handleFormInputChange, setFormData } =
    useFormHandler(initialFormData);

  useEffect(() => {
    if (pollingUnitUpload) {
      setFormData(initialFormData);
      setFormData(() => ({ ...formData, flagEvidenceType: isResult ? "result" : "report" }));
      dispatch(
        getFlagPermission({
          props: {
            electionId: pollingUnitUpload.electionId,
            dataType: isResult ? "election" : "incident",
            action: "flag",
          },
        })
      );
    }
  }, [pollingUnitUpload]);

  const flagReasonProvided =
    !!(formData.flagReason && formData.flagReason !== "Other") ||
    !!(formData.flagReason === "Other" && formData.flagOtherReason?.trim());

  const enabledButtonProps = useMemo(() => {
    if (!pollingUnitUpload) return;

    if (formData.flagConfirm && formData.flagReason) {
      if (hasSubmitted) {
        // Flag Upload
        return {
          text: `Flag ${isResult ? "Result" : "Report"}`,
          action: () => {
            dispatch(
              getPollingUnitResults({
                actionProps: {
                  action: "flag",
                  electionId: pollingUnitUpload!.electionId,
                  dataType: isResult ? "election" : "incident",
                  flagReason:
                    formData.flagReason === "Other"
                      ? formData.flagOtherReason
                      : formData.flagReason,
                },
              })
            );
            closeModal();
          },
        };
      } else {
        if (formData.flagEvidenceConfirm) {
          // Upload Evidence
          return {
            text: (
              <div className="flex gap-[1ch] items-center">
                Upload Evidence and Flag {isResult ? "Result" : "Report"}{" "}
                <ArrowRight size={18} />
              </div>
            ),
            action: () =>
              router.push(
                `/portal/uploads/${formData.flagEvidenceType!}/${
                  pollingUnitUpload.electionTypeId
                }?flag=true&flagResultId=${pollingUnitUpload.electionId}&flagDataType=${
                  isResult ? "election" : "incident"
                }&flagReason=${
                  formData.flagReason === "Other"
                    ? formData.flagOtherReason
                    : formData.flagReason
                }`
              ),
          };
        } else {
          return {
            text: `Exit Flag ${isResult ? "Result" : "Report"}`,
            action: closeModal,
          };
        }
      }
    } else {
      return {
        text: `Exit Flag ${isResult ? "Result" : "Report"}`,
        action: closeModal,
      };
    }
  }, [formData, hasSubmitted]);

  function handleConfirm() {
    if (formData.flagConfirm && enabledButtonProps?.text !== "Exit Flag Result") {
      if (!formData.flagReason) {
        dispatch(
          showAlert({ message: "Please select a reason for flagging.", type: "error" })
        );
        return;
      }

      if (formData.flagReason === "Other" && !formData.flagOtherReason?.trim()) {
        dispatch(
          showAlert({
            message: "Please specify the other reason for flagging.",
            type: "error",
          })
        );
        return;
      }
    }

    enabledButtonProps?.action();
  }

  return (
    <Modal
      open={!!pollingUnitUpload}
      onCancel={closeModal}
      centered
      width={950}
      footer={null}
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="self-center">
          <span className="md:hidden">
            <LogoFlat size={40} />
          </span>
          <span className="hidden md:inline-block">
            <LogoFlat size={55} />
          </span>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid gap-6 w-full max-w-[300px] relative"
        >
          {status.fetchFlagPermission !== "fulfilled" && (
            <div className="absolute inset-0 bg-white z-10 w-full grid place-content-center">
              <Spin size="large" />
            </div>
          )}
          <div className="grid gap-[6px] place-content-center">
            <label
              htmlFor="polling-unit-result-flag-sure"
              className="text-sm font-medium text-center"
            >
              Are you sure you want to flag this {isResult ? "result" : "report"}
            </label>
            <Radio.Group
              name="polling-unit-result-flag-sure"
              onChange={handleFormInputChange("flagConfirm")}
              value={formData.flagConfirm}
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

          {formData.flagConfirm ? (
            <>
              <div className="grid gap-[6px]">
                <label
                  htmlFor="upload-flag-reason"
                  className="text-sm font-medium text-center"
                >
                  Why do you want to flag this {isResult ? "result" : "report"}?
                </label>
                <AppSelect
                  id="upload-flag-reason"
                  value={formData.flagReason}
                  options={flagReasons.map((r) => ({ label: r, value: r }))}
                  onChange={(e) => {
                    setFormData(() => ({
                      ...formData,
                      flagReason: e.target.value,
                      flagOtherReason: undefined,
                    }));
                  }}
                />
              </div>
              {formData.flagReason === "Other" && (
                <div className="grid gap-[6px]">
                  <label
                    htmlFor="signup-registered-voter"
                    className="text-sm font-medium text-center"
                  >
                    Please specify (You selected "Other")
                  </label>
                  <Input
                    size="large"
                    placeholder="Your reason..."
                    value={formData.flagOtherReason}
                    className="!w-full"
                    onChange={handleFormInputChange("flagOtherReason")}
                  />
                </div>
              )}
              {flagReasonProvided && !hasSubmitted ? (
                <>
                  <div className="grid gap-[6px] place-content-center">
                    <label
                      htmlFor="polling-unit-result-flag-evidence"
                      className="text-sm font-medium text-center"
                    >
                      Do you have a conflicting {isResult ? "result" : "report"} to
                      upload?
                    </label>
                    <Radio.Group
                      name="polling-unit-result-flag-evidence"
                      onChange={handleFormInputChange("flagEvidenceConfirm")}
                      value={formData.flagEvidenceConfirm}
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
                  {formData.flagEvidenceConfirm === false ? (
                    <p className="text-error-500 text-center">
                      Alternative results need to be uploaded for Initial Results to be
                      flagged
                    </p>
                  ) : formData.flagEvidenceConfirm === true ? (
                    <>
                      <div className="grid gap-[6px] place-content-center">
                        <label
                          htmlFor="polling-unit-result-flag-type"
                          className="text-sm font-medium text-center"
                        >
                          What evidence would you like to upload?
                        </label>
                        <Radio.Group
                          name="polling-unit-result-flag-type"
                          onChange={handleFormInputChange("flagEvidenceType")}
                          value={formData.flagEvidenceType}
                          size="large"
                          className="mx-auto"
                        >
                          <Radio value={"result"} className="min-w-16 font-light">
                            Result
                          </Radio>
                          <Radio value={"report"} className="min-w-16 font-light">
                            Incident Report
                          </Radio>
                        </Radio.Group>
                      </div>
                      <p className="text-brand-500 text-center">
                        After uploading the conflicting {isResult ? "result" : "report"},
                        this {isResult ? "result" : "report"} will be flagged.
                      </p>
                    </>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}

          {enabledButtonProps && (
            <Button size="large" type="primary" onClick={handleConfirm}>
              {enabledButtonProps.text}
            </Button>
          )}
        </form>
      </div>
    </Modal>
  );
}
