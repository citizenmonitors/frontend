import Logo from "@/app/components/shared/svg/Logo";
import { binarySelectOptions, ratingSelectOptions } from "@/app/data/form";
import { useAppDispatch } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { Button, Modal, Select } from "antd";
import React, { SetStateAction } from "react";

type SentimentAnalysisModalProps = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  formData: {
    voterIntimidation: undefined | string;
    voteBuying: undefined | string;
    voteRating: undefined | string;
  };
  setFormData: React.Dispatch<SetStateAction<SentimentAnalysisModalProps["formData"]>>;
  submitPrimaryForm: Function;
  mode?: "result" | "report";
};

export default function SentimentAnalysisModal({
  open,
  setOpen,
  formData,
  setFormData,
  submitPrimaryForm,
  mode = "result",
}: SentimentAnalysisModalProps) {
  const dispatch = useAppDispatch();

  function handleFormSubmit() {
    if (
      mode === "result" &&
      (formData.voterIntimidation === undefined || formData.voteBuying === undefined)
    ) {
      dispatch(
        showAlert({
          message: "Please fill in all fields.",
          type: "error",
        })
      );
      return;
    }

    if (!formData.voteRating) {
      dispatch(
        showAlert({
          message: "Please rate today's election.",
          type: "error",
        })
      );
      return;
    }

    setOpen(false);
    submitPrimaryForm();
  }

  return (
    <Modal centered open={open} onCancel={() => setOpen(false)} footer={null}>
      <header className="flex flex-col gap-8">
        <div className="self-center">
          <span className="md:hidden">
            <Logo size={40} />
          </span>
          <span className="hidden md:inline-block">
            <Logo size={60} />
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-xl md:text-display-xs font-semibold text-brand-500 leading-[1]">
            Sentiment Analysis
          </h2>
          <p className="text-gray-500 text-center">
            Please help us improve our data by answering this quick survey.
          </p>
        </div>
      </header>
      <form className="mt-8 flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
        {mode === "result" ? (
          <React.Fragment>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="sentiment-analysis-voter-intimidation"
              >
                Were there instances of voter intimidation in your polling unit today?{" "}
                <span className="text-error-600">*</span>
              </label>
              <Select
                id="sentiment-analysis-voter-intimidation"
                placeholder="Select from dropdown"
                size="large"
                options={binarySelectOptions}
                value={formData.voterIntimidation}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, voterIntimidation: value }))
                }
              />
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="sentiment-analysis-vote-buying"
              >
                Did you observe instances of vote buying in your polling unit today?{" "}
                <span className="text-error-600">*</span>
              </label>
              <Select
                id="sentiment-analysis-vote-buying"
                placeholder="Select from dropdown"
                size="large"
                options={binarySelectOptions}
                value={formData.voteBuying}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, voteBuying: value }))
                }
              />
            </div>
          </React.Fragment>
        ) : null}

        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="sentiment-analysis-voter-intimidation"
          >
            How would you rate today's election in your polling unit?{" "}
            <span className="text-error-600">*</span>
          </label>
          <Select
            id="sentiment-analysis-voter-intimidation"
            placeholder="Select from dropdown"
            size="large"
            options={ratingSelectOptions}
            value={formData.voteRating}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, voteRating: value }))
            }
          />
        </div>

        <Button type="primary" block size="large" onClick={handleFormSubmit}>
          Submit
        </Button>
      </form>
    </Modal>
  );
}
