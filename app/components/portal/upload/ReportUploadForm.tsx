import ElectionIcon from "@/app/components/shared/ElectionIcon";
import UploadIcon from "@/app/components/shared/UploadIcon";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { Button, Checkbox, Input, Select, Upload, UploadFile, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import moment from "moment";
import React, { useEffect } from "react";
import SentimentAnalysisModal from "./SentimentAnalysisModal";
import { electionIncidentOptions, ratingSelectOptions } from "@/app/data/form";
import {
  clearElectionUploadData,
  getElectionById,
  getPollingUnitResults,
  updateElectionReport,
  uploadElectionReport,
} from "@/app/redux/features/electionSlice";
import formatNumber from "@/app/utils/formatNumber";
import { ElectionReport, FileInfo, RatingOption } from "@/app/redux/types";
import { useRouter, useSearchParams } from "next/navigation";
import acceptedFileTypes from "../../../data/acceptedFileTypes";
import getElectionName from "@/app/utils/getElectionName";
import Link from "next/link";

type ReportUploadFormProps = {
  prefilledFormData?: {
    selectIncident: string;
    incidentNote: string;
    electionRating: RatingOption;

    // Uploads
    incidentPictures: Array<FileInfo>;
    incidentVideos: Array<FileInfo>;
  };
};

export default function ReportUploadForm({ prefilledFormData }: ReportUploadFormProps) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const userState = useAppSelector((state) => state.user.details!);
  const userDetails = useAppSelector((state) => state.user.details!);
  const electionState = useAppSelector((state) => state.election);
  const election = electionState.electionData.election!;
  const electionYear = moment(election.startDate).format("YYYY");
  const router = useRouter();
  const [surveyFormOpen, setSurveyFormOpen] = React.useState(false);
  const isEditMode = !!prefilledFormData;
  const { formData, setFormData, handleFormInputChange } = useFormHandler({
    selectIncident: prefilledFormData?.selectIncident || undefined,
    incidentNote: prefilledFormData?.incidentNote || "",
    isInfoAccurate: false,
    isAgreedToTerms: false,
    // Survey
    electionRating: prefilledFormData?.electionRating,
    voterIntimidation: undefined,
    voteBuying: undefined,
    voteRating: undefined,
  });
  const [incidentPictures, setIncidentPictures] = React.useState<UploadFile[]>([]);
  const [incidentVideos, setIncidentVideos] = React.useState<UploadFile[]>([]);

  function fillFormData() {
    if (!prefilledFormData) return;
    setFormData({
      selectIncident: prefilledFormData.selectIncident,
      incidentNote: prefilledFormData.incidentNote,
      isInfoAccurate: false,
      isAgreedToTerms: false,
      // Survey
      electionRating: prefilledFormData.electionRating,
      voterIntimidation: undefined,
      voteBuying: undefined,
      voteRating: undefined,
    });
    setIncidentPictures(
      prefilledFormData.incidentPictures.map((picture) => ({
        uid: picture._id,
        name: picture.name,
        type: picture.type,
        size: picture.size,
        status: "done",
      }))
    );
    setIncidentVideos(
      prefilledFormData.incidentVideos.map((video) => ({
        uid: video._id,
        name: video.name,
        type: video.type,
        size: video.size,
        status: "done",
      }))
    );
  }
  useEffect(fillFormData, [prefilledFormData]);

  const incidentPicturesUploadProps: UploadProps = {
    name: "incidentPictures",
    accept: acceptedFileTypes.incidentReportPicture,
    fileList: incidentPictures,
    multiple: true,
    beforeUpload: (file, fileList) => {
      const maxFileSize = 5 * 1024 * 1024;
      const newFileListLength = fileList.length + incidentPictures.length;

      if (newFileListLength > 5) {
        dispatch(
          showAlert({
            message: "You can only upload a maximum of 5 pictures.",
            type: "error",
          })
        );
        return Upload.LIST_IGNORE;
      }

      if (file.size > maxFileSize) {
        dispatch(
          showAlert({
            message: "File size too high.",
            type: "error",
          })
        );
        return Upload.LIST_IGNORE;
      }
      setIncidentPictures((prev) => [...prev, file]);
      return false;
    },
    onChange: (info) => {
      setIncidentPictures(info.fileList);
    },
  };
  const incidentVideoUploadProps: UploadProps = {
    name: "incidentVideos",
    maxCount: 3,
    accept: acceptedFileTypes.incidentReportVideo,
    fileList: incidentVideos,
    multiple: true,
    beforeUpload: (file, fileList) => {
      const maxFileSize = 100 * 1024 * 1024;
      const newFileListLength = fileList.length + incidentVideos.length;

      if (newFileListLength > 3) {
        dispatch(
          showAlert({
            message: "You can only upload a maximum of 3 videos.",
            type: "error",
          })
        );
        return Upload.LIST_IGNORE;
      }

      if (file.size > maxFileSize) {
        dispatch(
          showAlert({
            message: "File size too high (Max 100MB).",
            type: "error",
          })
        );
        return Upload.LIST_IGNORE;
      }
      setIncidentVideos((prev) => [...prev, file]);
      return false;
    },
    onChange: (info) => {
      setIncidentVideos(info.fileList);
    },
  };

  function handleFormSubmit() {
    if (formData.selectIncident === undefined || !formData.incidentNote.trim()) {
      dispatch(
        showAlert({
          message: "Please fill all required fields.",
          type: "error",
        })
      );
      return;
    }

    if (incidentPictures.length < 1) {
      dispatch(
        showAlert({
          message: "Please upload at least one picture of the incident.",
          type: "error",
        })
      );
      return;
    }

    if (incidentVideos.length < 1) {
      dispatch(
        showAlert({
          message: "Please upload at least one video of the incident.",
          type: "error",
        })
      );
      return;
    }

    if (!formData.electionRating && isEditMode) {
      dispatch(
        showAlert({
          message: "Please fill in all survey fields.",
          type: "error",
        })
      );
      return;
    }

    if (!formData.isInfoAccurate) {
      dispatch(
        showAlert({
          message: "Please affirm that the information submitted is accurate.",
          type: "error",
        })
      );
      return;
    }

    if (!formData.isAgreedToTerms) {
      dispatch(
        showAlert({
          message: "Please affirm that you agree to the terms and conditions.",
          type: "error",
        })
      );
      return;
    }

    if (isEditMode) {
      updateReport();
    } else {
      setSurveyFormOpen(true);
    }
  }

  async function updateReport() {
    const updatedReport: Partial<ElectionReport> = {
      selectIncident: formData.selectIncident,
      incidentNote: formData.incidentNote,
      electionRating: formData.electionRating,
    };

    // get ids of previous files (from db)
    let previousPicturesIds = prefilledFormData!.incidentPictures.map((pic) => pic._id);
    let previousVideosIds = prefilledFormData!.incidentVideos.map((vid) => vid._id);

    // get ids of previous files (remaining)
    previousPicturesIds = previousPicturesIds.filter(
      (id) => !!incidentPictures.find((pic) => pic.uid === id)
    );
    previousVideosIds = previousVideosIds.filter(
      (id) => !!incidentVideos.find((vid) => vid.uid === id)
    );

    // get new files = all files - previous files
    const newIncidentPictures = incidentPictures
      .filter((picture) => !previousPicturesIds.includes(picture.uid))
      .map((picture) => picture.originFileObj! as unknown as FileInfo);
    const newIncidentVideos = incidentVideos
      .filter((video) => !previousVideosIds.includes(video.uid))
      .map((video) => video.originFileObj! as unknown as FileInfo);

    // store new files in a DataTransfer object
    const newIncidentPicturesDT = new DataTransfer();
    const newIncidentVideosDT = new DataTransfer();
    newIncidentPictures.forEach((pic) => newIncidentPicturesDT.items.add(pic as any));
    newIncidentVideos.forEach((vid) => newIncidentVideosDT.items.add(vid as any));

    (updatedReport as any).previousIncidentPictures = previousPicturesIds;
    (updatedReport as any).previousIncidentVideos = previousVideosIds;
    if (newIncidentPictures.length > 0) {
      updatedReport.incidentPictures =
        newIncidentPicturesDT.files as unknown as FileInfo[];
    }
    if (newIncidentVideos.length > 0) {
      updatedReport.incidentVideos = newIncidentVideosDT.files as unknown as FileInfo[];
    }

    dispatch(updateElectionReport({ electionId: election._id, report: updatedReport }));
  }

  async function uploadReport() {
    const incidentPicturesDT = new DataTransfer();
    incidentPictures.forEach((f) => incidentPicturesDT.items.add(f.originFileObj!));
    const incidentVideosDT = new DataTransfer();
    incidentVideos.forEach((f) => incidentVideosDT.items.add(f.originFileObj!));

    dispatch(
      uploadElectionReport({
        electionId: election._id,
        report: {
          selectIncident: formData.selectIncident!,
          incidentNote: formData.incidentNote,
          incidentPictures: incidentPicturesDT.files as unknown as FileInfo[],
          incidentVideos: incidentVideosDT.files as unknown as FileInfo[],
          electionRating: formData.voteRating!,
        } as unknown as ElectionReport,
      })
    );
    if (searchParams.get("flag")) {
      dispatch(
        getPollingUnitResults({
          actionProps: {
            action: "flag",
            electionId: searchParams.get("flagResultId")!,
            dataType: searchParams.get("flagDataType")! as any,
            flagReason: searchParams.get("flagReason")!,
          },
        })
      );
    }
  }

  // feedback messages
  useEffect(() => {
    if (isEditMode) {
      if (electionState.status.updateElectionReport === "fulfilled") {
        dispatch(
          showAlert({
            message: "Report has been updated.",
            type: "success",
          })
        );
        router.push(`/portal/uploads/report/${election._id}`);
        dispatch(clearElectionUploadData());
        dispatch(getElectionById(election._id));
      }
      if (electionState.status.updateElectionReport === "rejected") {
        dispatch(
          showAlert({
            message: electionState.error.message || "An error occurred.",
            type: "error",
          })
        );
      }
    } else {
      if (electionState.status.uploadElectionReport === "fulfilled") {
        if (userDetails.role === "volunteer") {
          dispatch(
            showAlert({
              message:
                "Your upload has been saved in ‘Records’. You can use this to flag an observer’s result for your polling unit.",
              type: "success",
            })
          );
        } else if (searchParams.get("flag")) {
          dispatch(
            showAlert({
              message:
                "Conflicting Incident Report Uploaded and Report Flagged successfully.",
              type: "success",
            })
          );
          dispatch(clearElectionUploadData());
          router.push(`/portal/polling-unit-uploads`);
        } else {
          dispatch(
            showAlert({
              message: "Incident Report Uploaded successfully.",
              type: "success",
            })
          );
          dispatch(clearElectionUploadData());
          router.push(`/portal/dashboard`);
        }
      } else if (electionState.status.uploadElectionReport === "rejected") {
        dispatch(
          showAlert({
            message: electionState.error.message || "An error occurred.",
            type: "error",
          })
        );
      }
    }
  }, [
    electionState.status.uploadElectionReport,
    electionState.status.updateElectionReport,
  ]);

  return (
    <form
      id="election-report-upload"
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-5 mt-6"
    >
      <header className="flex gap-4 md:items-center">
        <ElectionIcon electionType={election.electionType} />{" "}
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-sm">
          {isEditMode && "Edit "}
          {electionYear} {getElectionName(election, "detailed")} Elections
          Incident Report
        </h2>
      </header>

      <p className="text-sm text-error-600">
        Please ensure that you use the "GPSMapCamera" app to capture the incident reports.
        This app can be downloaded from the PlayStore or AppStore. Incident report
        submissions will only be valid if they adhere to this requirement.
      </p>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label className="text-sm font-medium text-gray-700">
          Upload Incident Report <span className="text-error-600">*</span>
        </label>
        <p>
          Your documentation will help us have independent data and evidence that can help
          us collectively advocate for a just and transparent electoral process.
        </p>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-500">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="election-report-incident"
        >
          Select Incident <span className="text-error-600">*</span>
        </label>
        <Select
          id="election-report-incident"
          placeholder="Select an Incident"
          size="large"
          options={electionIncidentOptions}
          value={formData.selectIncident}
          onChange={handleFormInputChange("selectIncident", "static")}
        />
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-500">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="election-report-note"
        >
          Incident Note <span className="text-error-600">*</span>
        </label>
        <Input.TextArea
          id="election-report-note"
          size="large"
          placeholder="Kindly provide more context here."
          autoSize={{ minRows: 4, maxRows: 8 }}
          value={formData.incidentNote}
          onChange={handleFormInputChange("incidentNote")}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="election-report-pictures"
          >
            Pictures <span className="text-error-600">*</span>
          </label>
          <Dragger
            id="election-report-pictures"
            style={{ background: "white" }}
            {...incidentPicturesUploadProps}
          >
            <div className="grid mb-2 place-items-center">
              <UploadIcon fileType={incidentPictures.at(-1)?.type as any} />
            </div>
            {incidentPictures.length > 0 ? (
              <p className="flex flex-col gap-1 text-gray-700">
                <span className="text-sm font-semibold text-brand-600">
                  {incidentPictures.at(-1)!.name}
                </span>
                <span className="text-xs text-gray-700">
                  {formatNumber.fileSize(incidentPictures.at(-1)!.size || 0)}
                </span>
              </p>
            ) : (
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold text-brand-600">Click to upload</span> or
                  drag and drop
                </p>
                <p className="mb-4 text-xs text-gray-400">
                  PNG or JPG • Max. 5MB (3 pictures max)
                </p>

                <div className="flex items-center gap-2 my-4">
                  <hr className="flex-1 border-gray-100" />
                  <span className="text-xs font-medium text-gray-400">OR</span>
                  <hr className="flex-1 border-gray-100" />
                </div>

                <Button className="text-sm font-semibold" size="large" type="primary">
                  Browse Files
                </Button>
              </div>
            )}
          </Dragger>
          <p className="text-xs font-light text-error-600">
            Pictures must capture describable proof of the incident in your polling unit.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="election-report-video"
          >
            Videos <span className="text-error-600">*</span>
          </label>
          <Dragger
            id="election-report-video"
            style={{ background: "white", height: "100%" }}
            {...incidentVideoUploadProps}
          >
            <div className="grid mb-2 place-items-center">
              <UploadIcon fileType={incidentVideos.at(-1)?.type as any} />
            </div>
            {incidentVideos.length > 0 ? (
              <p className="flex flex-col gap-1 text-gray-700">
                <span className="text-sm font-semibold text-brand-600">
                  {incidentVideos.at(-1)?.name}
                </span>
                <span className="text-xs text-gray-700">
                  {formatNumber.fileSize(incidentVideos.at(-1)?.size || 0)}
                </span>
              </p>
            ) : (
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold text-brand-600">Click to upload</span> or
                  drag and drop
                </p>
                <p className="mb-4 text-xs text-gray-400">
                  MP4 • Max. 100MB (3 videos max)
                </p>

                <div className="flex items-center gap-2 my-4">
                  <hr className="flex-1 border-gray-100" />
                  <span className="text-xs font-medium text-gray-400">OR</span>
                  <hr className="flex-1 border-gray-100" />
                </div>

                <Button className="text-sm font-semibold" size="large" type="primary">
                  Browse Files
                </Button>
              </div>
            )}
          </Dragger>
          <p className="text-xs font-light text-error-600">
            Videos must contain vocal proof of date, time and place to validate the live
            video capture of the reported incidents.
          </p>
        </div>
      </div>

      {isEditMode && (
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
            value={formData.electionRating}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, electionRating: value }))
            }
          />
        </div>
      )}

      <div className="flex flex-col gap-3 mt-4 conditions">
        <div className="flex gap-2 md:items-center">
          <div>
            <Checkbox
              checked={formData.isInfoAccurate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isInfoAccurate: e.target.checked }))
              }
            />
          </div>
          <p className="text-sm text-gray-700">
            I hereby affirm that the information submitted is accurate, peer-reviewed and
            can be used to fact-check the information submitted by the observer in my
            polling unit.
          </p>
        </div>
        <div className="flex gap-2 md:items-center">
          <div>
            <Checkbox
              checked={formData.isAgreedToTerms}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isAgreedToTerms: e.target.checked }))
              }
            />
          </div>
          <p className="text-sm text-gray-700">
            I have read and agree to Citizen Monitors'{" "}
            <Link
              href="/terms-of-use"
              target="_blank"
              rel="noopener"
              className="text-brand-500 font-semibold"
            >
              Terms & Conditions
            </Link>
            .
          </p>
        </div>
      </div>
      <Button
        type="primary"
        block
        size="large"
        onClick={handleFormSubmit}
        loading={
          isEditMode
            ? electionState.status.updateElectionReport === "pending"
            : electionState.status.uploadElectionReport === "pending"
        }
      >
        {isEditMode
          ? "Update Report"
          : searchParams.get("flag")
          ? "Submit Report and Flag"
          : "Submit Report"}
      </Button>

      <SentimentAnalysisModal
        open={surveyFormOpen}
        setOpen={setSurveyFormOpen}
        formData={formData}
        setFormData={setFormData as any}
        submitPrimaryForm={uploadReport}
        mode="report"
      />
    </form>
  );
}
