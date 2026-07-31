import ElectionIcon from "@/app/components/shared/ElectionIcon";
import UploadIcon from "@/app/components/shared/UploadIcon";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  Button,
  Checkbox,
  InputNumber,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { Trash } from "iconsax-react";
import moment from "moment";
import React, { useEffect } from "react";
import SentimentAnalysisModal from "./SentimentAnalysisModal";
import {
  BinaryOption,
  ElectionPartyResult,
  ElectionResult,
  FileInfo,
  RatingOption,
} from "@/app/redux/types";
import {
  clearElectionUploadData,
  getElectionById,
  getPollingUnitResults,
  updateElectionResult,
  uploadElectionResult,
} from "@/app/redux/features/electionSlice";
import AppSelect from "@/app/components/shared/Select";
import validator from "validator";
import { useRouter, useSearchParams } from "next/navigation";
import { binarySelectOptions, ratingSelectOptions } from "@/app/data/form";
import acceptedFileTypes from "../../../data/acceptedFileTypes";
import getElectionName from "@/app/utils/getElectionName";
import formatNumber from "@/app/utils/formatNumber";
import Image from "next/image";
import ElectionTimePicker from "../elections/ElectionTimePicker";
import Link from "next/link";

type ResultUploadFormProps = {
  prefilledFormData?: {
    accreditedVoters: number;
    rejectedPapers: number;
    spoiledBallotPapers: number;
    usedBallotPapers: number;
    partiesVotes: Array<ElectionPartyResult>;

    // Survey
    voterIntimidation: BinaryOption;
    voteBuying: BinaryOption;
    voteRating: RatingOption;

    // Uploads
    resultPicture: FileInfo;
    resultVideo: FileInfo;
  };
};

export default function ResultUploadForm({
  prefilledFormData,
}: ResultUploadFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const userDetails = useAppSelector((state) => state.user.details!);
  const electionState = useAppSelector((state) => state.election);
  const election = electionState.electionData.election!;
  const electionYear = moment(election.startDate).format("YYYY");
  const [surveyFormOpen, setSurveyFormOpen] = React.useState(false);
  const isEditMode = !!prefilledFormData;
  const { formData, setFormData, handleFormInputChange } = useFormHandler({
    timeBegan: searchParams.get("timeBegan") || "",
    accreditedVoters: null as number | null,
    rejectedPapers: null as number | null,
    spoiledBallotPapers: null as number | null,
    usedBallotPapers: null as number | null,
    isInfoAccurate: false,
    isAgreedToTerms: false,
    // Survey
    voterIntimidation: undefined as BinaryOption | undefined,
    voteBuying: undefined as BinaryOption | undefined,
    voteRating: undefined as RatingOption | undefined,
  });
  const [resultPicture, setResultPicture] = React.useState<UploadFile | null>(
    null
  );
  const [resultVideo, setResultVideo] = React.useState<UploadFile | null>(null);
  const [politicalPartyResults, setPoliticalPartyResults] = React.useState<
    Array<ElectionPartyResult>
  >([
    { party: "PDP", count: 0 },
    { party: "APC", count: 0 },
    { party: "LP", count: 0 },
    { party: "NNPP", count: 0 },
    { party: "SDP", count: 0 },
    { party: "ADP", count: 0 },
    { party: "APGA", count: 0 },
    { party: "AAC", count: 0 },
    { party: "PRP", count: 0 },
    { party: "AA", count: 0 },
  ]);
  function getValidPartyResults() {
    return politicalPartyResults.filter((result) => result.count > 0);
  }

  function getPartyLogo(code: string) {
    return (
      election.politicalParties.find((party) => party.code === code)?.logo || ""
    );
  }

  function fillFormData() {
    if (prefilledFormData) {
      setFormData((prev) => ({
        ...prev,
        accreditedVoters: +prefilledFormData.accreditedVoters,
        rejectedPapers: +prefilledFormData.rejectedPapers,
        spoiledBallotPapers: +prefilledFormData.spoiledBallotPapers,
        usedBallotPapers: +prefilledFormData.usedBallotPapers,
        voterIntimidation: prefilledFormData.voterIntimidation,
        voteBuying: prefilledFormData.voteBuying,
        voteRating: prefilledFormData.voteRating,
      }));
      setResultPicture({
        uid: prefilledFormData.resultPicture._id,
        name: prefilledFormData.resultPicture.name,
        type: prefilledFormData.resultPicture.type,
        size: prefilledFormData.resultPicture.size,
        status: "done",
      });
      setResultVideo({
        uid: prefilledFormData.resultVideo._id,
        name: prefilledFormData.resultVideo.name,
        type: prefilledFormData.resultVideo.type,
        size: prefilledFormData.resultVideo.size,
        status: "done",
      });
      setPoliticalPartyResults(
        prefilledFormData.partiesVotes.map((party) => ({ ...party }))
      );
    }
  }
  useEffect(fillFormData, [prefilledFormData]);

  const resultPictureUploadProps: UploadProps = {
    name: "resultPicture",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    accept: acceptedFileTypes.resultPicture,
    fileList: resultPicture ? [resultPicture] : [],
    beforeUpload: (file) => {
      const maxFileSize = 5 * 1024 * 1024;

      if (file.size > maxFileSize) {
        dispatch(
          showAlert({
            message: "File size too high.",
            type: "error",
          })
        );
        return Upload.LIST_IGNORE;
      }
      setResultPicture({
        uid: file.uid,
        name: file.name,
        size: file.size,
        type: file.type,
        originFileObj: file,
      });
      return false;
    },
    onChange: (info) => {
      const file = info.fileList[0];
      if (!file) {
        setResultPicture(null);
        return;
      }
      setResultPicture({
        ...file,
        originFileObj: file.originFileObj || (file as any),
      });
    },
  };
  const resultVideoUploadProps: UploadProps = {
    name: "resultVideo",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    accept: acceptedFileTypes.resultVideo,
    fileList: resultVideo ? [resultVideo] : [],
    beforeUpload: (file) => {
      const maxFileSize = 100 * 1024 * 1024;

      if (file.size > maxFileSize) {
        dispatch(
          showAlert({
            message: "File size too high.",
            type: "error",
          })
        );
        return Upload.LIST_IGNORE;
      }
      setResultVideo({
        uid: file.uid,
        name: file.name,
        size: file.size,
        type: file.type,
        originFileObj: file,
      });
      return false;
    },
    onChange: (info) => {
      const file = info.fileList[0];
      if (!file) {
        setResultVideo(null);
        return;
      }
      setResultVideo({
        ...file,
        originFileObj: file.originFileObj || (file as any),
      });
    },
  };

  const [addPoliticalPartyModal, setAddPoliticalPartyModal] =
    React.useState(false);
  const { formData: partyFormData, setFormData: setPartyFormData } =
    useFormHandler<{
      partyName?: string;
    }>({
      partyName: "",
    });
  function handleAddPoliticalParty() {
    if (!partyFormData.partyName) {
      dispatch(
        showAlert({
          message: "Please select a party name.",
          type: "error",
        })
      );
      return;
    }

    // Check if party already exists
    if (
      politicalPartyResults.some(
        (result) => result.party === partyFormData.partyName
      )
    ) {
      dispatch(
        showAlert({
          message: "Party already added.",
          type: "error",
        })
      );
      return;
    }

    setPoliticalPartyResults((prev) => [
      ...prev,
      {
        party: partyFormData.partyName!,
        count: 0,
      },
    ]);
    setAddPoliticalPartyModal(false);
    setPartyFormData({ partyName: undefined });
  }

  async function handleFormSubmit() {
    if (!isEditMode && !formData.timeBegan) {
      dispatch(
        showAlert({
          message: "Please select the time the election began.",
          type: "error",
        })
      );
      return;
    }

    if (!validator.isNumeric(String(formData.accreditedVoters))) {
      dispatch(
        showAlert({
          message: "Please enter a valid number of accredited voters.",
          type: "error",
        })
      );
      return;
    }

    if (!validator.isNumeric(String(formData.rejectedPapers))) {
      dispatch(
        showAlert({
          message: "Please enter a valid number of rejected ballots.",
          type: "error",
        })
      );
      return;
    }

    if (!validator.isNumeric(String(formData.usedBallotPapers))) {
      dispatch(
        showAlert({
          message: "Please enter a valid number of used ballot papers.",
          type: "error",
        })
      );
      return;
    }

    if (!validator.isNumeric(String(formData.spoiledBallotPapers))) {
      dispatch(
        showAlert({
          message: "Please enter a valid number of spoiled ballot papers.",
          type: "error",
        })
      );
      return;
    }

    if (!resultPicture) {
      dispatch(
        showAlert({
          message: "Please upload signed result sheets.",
          type: "error",
        })
      );
      return;
    }

    if (!resultVideo && userDetails.isObserverInPollingUnit) {
      dispatch(
        showAlert({
          message: "Please upload signed result sheets.",
          type: "error",
        })
      );
      return;
    }

    if (politicalPartyResults.length === 0) {
      dispatch(
        showAlert({
          message: "Please add at least one political party result.",
          type: "error",
        })
      );
      return;
    }

    politicalPartyResults.forEach((result) => {
      const resultVotes = result.count;
      if (isNaN(resultVotes) || resultVotes < 0) {
        dispatch(
          showAlert({
            message:
              "Please enter a valid vote count for all political parties.",
            type: "error",
          })
        );
        return;
      }
    });

    const manualPartyVotes = politicalPartyResults.reduce(
      (acc, res) => acc + res.count,
      0
    );

    if (formData.accreditedVoters! < formData.usedBallotPapers!) {
      dispatch(
        showAlert({
          message:
            "Upload Error (Section 64 & INEC Guidelines): Result is invalid because the number of used ballot papers must never exceed the number of accredited voters",
          type: "error",
        })
      );
      return;
    }

    if (
      formData.spoiledBallotPapers! +
        formData.rejectedPapers! +
        manualPartyVotes !==
      formData.usedBallotPapers!
    ) {
      dispatch(
        showAlert({
          message:
            "Upload Error (Section 64(4), Electoral Act 2022): Result is invalid because the used ballots don’t equal the sum of valid votes + rejected ballots + spoiled ballots.",
          type: "error",
        })
      );
      return;
    }

    if (
      formData.rejectedPapers! + manualPartyVotes >
      formData.accreditedVoters!
    ) {
      dispatch(
        showAlert({
          message:
            "Upload Error (Section 51(2), Electoral Act 2022): Result is invalid because the total votes cast (valid + rejected) exceed the number of accredited voters.",
          type: "error",
        })
      );
      return;
    }

    if (
      isEditMode &&
      (formData.voterIntimidation === undefined ||
        formData.voteBuying === undefined ||
        !formData.voteRating)
    ) {
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
      updateResult();
      return;
    }

    setSurveyFormOpen(true);
  }

  function uploadResult() {
    const pictureFile =
      (resultPicture?.originFileObj as File | undefined) ||
      (resultPicture as unknown as File | undefined);
    const videoFile = resultVideo
      ? (resultVideo.originFileObj as File | undefined) ||
        (resultVideo as unknown as File | undefined)
      : undefined;

    if (!pictureFile || !(pictureFile instanceof File)) {
      dispatch(
        showAlert({
          message: "Please upload signed result sheets.",
          type: "error",
        })
      );
      return;
    }

    dispatch(
      uploadElectionResult({
        electionId: election._id,
        result: {
          timeBegan: formData.timeBegan!,
          accreditedVoters: formData.accreditedVoters!,
          rejectedPapers: formData.rejectedPapers!,
          spoiledBallotPapers: formData.spoiledBallotPapers!,
          usedBallotPapers: formData.usedBallotPapers!,
          partiesVotes: getValidPartyResults(),
          voteRating: formData.voteRating!,
          voteBuying: formData.voteBuying!,
          voterIntimidation: formData.voterIntimidation!,
          resultPicture: pictureFile as unknown as FileInfo,
          resultVideo: videoFile
            ? (videoFile as unknown as FileInfo)
            : undefined,
        } as unknown as ElectionResult,
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

  async function updateResult() {
    const updatedResult: Partial<ElectionResult> = {
      accreditedVoters: formData.accreditedVoters!,

      partiesVotes: getValidPartyResults(),
      voteBuying: formData.voteBuying,
      voterIntimidation: formData.voterIntimidation,
      voteRating: formData.voteRating,
    };
    if (resultPicture!.uid !== prefilledFormData?.resultPicture._id) {
      updatedResult.resultPicture = resultPicture!
        .originFileObj! as unknown as FileInfo;
    }
    if (
      resultVideo &&
      resultVideo!.uid !== prefilledFormData?.resultVideo._id
    ) {
      updatedResult.resultVideo = resultVideo!
        .originFileObj! as unknown as FileInfo;
    }

    dispatch(
      updateElectionResult({
        electionId: election._id,
        result: updatedResult,
      })
    );
  }

  React.useEffect(() => {
    if (isEditMode) {
      if (electionState.status.updateElectionResult === "fulfilled") {
        dispatch(
          showAlert({
            message: "Result has been updated.",
            type: "success",
          })
        );
        router.push(`/portal/uploads/result/${election._id}`);
        dispatch(clearElectionUploadData());
        dispatch(getElectionById(election._id));
      }
      if (electionState.status.updateElectionResult === "rejected") {
        dispatch(
          showAlert({
            message: electionState.error.message || "An error occurred.",
            type: "error",
          })
        );
      }
    } else {
      if (electionState.status.uploadElectionResult === "fulfilled") {
        if (userDetails.role === "volunteer") {
          dispatch(
            showAlert({
              message:
                "Your upload has been saved in ‘Records’. You can use this to flag an observer’s result for your polling unit.",
              type: "success",
            })
          );
          router.replace("/portal/uploads");
        } else if (searchParams.get("flag")) {
          dispatch(
            showAlert({
              message:
                "Conflicting Result Uploaded and Result Flagged successfully.",
              type: "success",
            })
          );
          router.push(`/portal/polling-unit-uploads`);
        } else {
          dispatch(
            showAlert({
              message: "Result uploaded successfully.",
              type: "success",
            })
          );
          router.replace("/portal/uploads");
        }
        dispatch(clearElectionUploadData());
      } else if (electionState.status.uploadElectionResult === "rejected") {
        dispatch(
          showAlert({
            message: electionState.error.message || "An error occurred.",
            type: "error",
          })
        );
      }
    }
  }, [
    electionState.status.uploadElectionResult,
    electionState.status.updateElectionResult,
  ]);

  return (
    <form
      id="election-result-upload"
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-5 mt-6"
    >
      <header className="flex gap-4 md:items-center">
        <ElectionIcon electionType={election.electionType} />{" "}
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-sm">
          {isEditMode && "Edit"} {electionYear}{" "}
          {getElectionName(election, "detailed")} Elections Upload
        </h2>
      </header>

      {!isEditMode && !searchParams.get("timeBegan") && (
        <div className="flex flex-col gap-1 text-sm text-gray-500">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="accredited-voters"
          >
            Time Election Began <span className="text-error-600">*</span>
          </label>
          <p>
            Kindly select the time the election began in your polling unit
            (hh:mm AM/PM).
          </p>
          <ElectionTimePicker
            onChange={(time) => {
              setFormData(() => ({
                ...formData,
                timeBegan: time,
              }));
            }}
          />
        </div>
      )}

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="accredited-voters"
        >
          Total Number of Accredited Voters{" "}
          <span className="text-error-600">*</span>
        </label>
        <p>
          Kindly manually input the total number of accredited voters from the
          uploaded evidence.
        </p>
        <InputNumber
          id="accredited-voters"
          size="large"
          placeholder="Enter number of accredited voters"
          type="number"
          className="w-full mt-2"
          value={formData.accreditedVoters}
          onChange={handleFormInputChange("accreditedVoters", "static")}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="spoiled-ballots"
        >
          Total Number of Spoiled Ballot Papers{" "}
          <span className="text-error-600">*</span>
        </label>
        <p>
          Kindly manually input the total number of spoiled ballot papers from
          the uploaded evidence.
        </p>
        <InputNumber
          id="spoiled-ballots"
          size="large"
          placeholder="Enter number of spoiled ballot papers"
          type="number"
          className="w-full mt-2"
          value={formData.spoiledBallotPapers}
          onChange={handleFormInputChange("spoiledBallotPapers", "static")}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="rejected-ballots"
        >
          Total Number of Rejected Ballots{" "}
          <span className="text-error-600">*</span>
        </label>
        <p>
          Kindly manually input the total number of rejected ballots from the
          uploaded evidence.
        </p>
        <InputNumber
          id="rejected-ballots"
          size="large"
          placeholder="Enter number of rejected ballots"
          type="number"
          className="w-full mt-2"
          value={formData.rejectedPapers}
          onChange={handleFormInputChange("rejectedPapers", "static")}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="used-ballot-ballots"
        >
          Total Number of Used Ballot Papers{" "}
          <span className="text-error-600">*</span>
        </label>
        <p>
          Kindly manually input the total number of used ballot papers from the
          uploaded evidence.
        </p>
        <InputNumber
          id="used-ballot-ballots"
          size="large"
          placeholder="Enter number of used ballot papers"
          type="number"
          className="w-full mt-2"
          value={formData.usedBallotPapers}
          onChange={handleFormInputChange("usedBallotPapers", "static")}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label className="text-sm font-medium text-gray-700">
          Upload Visual Results <span className="text-error-600">*</span>
        </label>
        <p>
          Kindly upload signed result sheets and/or video of cumulative result
          announcement.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="election-result-picture"
          >
            Signed Result Sheets <span className="text-error-600">*</span>
          </label>
          <Dragger
            id="election-result-picture"
            style={{ background: "white" }}
            {...resultPictureUploadProps}
          >
            <div className="grid mb-2 place-items-center">
              <UploadIcon fileType={resultPicture?.type as any} />
            </div>
            {resultPicture ? (
              <p className="flex flex-col gap-1 text-gray-700">
                <span className="text-sm font-semibold text-brand-600">
                  {resultPicture.name}
                </span>
                <span className="text-xs text-gray-700">
                  {formatNumber.fileSize(resultPicture.size || 0)}
                </span>
              </p>
            ) : (
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold text-brand-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="mb-4 text-xs text-gray-400">
                  PNG or JPG • Max. 5MB
                </p>

                <div className="flex items-center gap-2 my-4">
                  <hr className="flex-1 border-gray-100" />
                  <span className="text-xs font-medium text-gray-400">OR</span>
                  <hr className="flex-1 border-gray-100" />
                </div>

                <Button
                  className="text-sm font-semibold"
                  size="large"
                  type="primary"
                >
                  Browse Files
                </Button>
              </div>
            )}
          </Dragger>
          <p className="text-xs font-light text-error-600">
            The picture uploaded must be a signed result sheet for the election
            of your polling unit.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="election-result-video"
          >
            Video of Cumulative Result Announcement{" "}
            {userDetails.isObserverInPollingUnit && (
              <span className="text-error-600">*</span>
            )}
          </label>
          <Dragger
            id="election-result-video"
            style={{ background: "white", height: "100%" }}
            {...resultVideoUploadProps}
          >
            <div className="grid mb-2 place-items-center">
              <UploadIcon fileType={resultVideo?.type as any} />
            </div>
            {resultVideo ? (
              <p className="flex flex-col gap-1 text-gray-700">
                <span className="text-sm font-semibold text-brand-600">
                  {resultVideo.name || "No video uploaded"}
                </span>
                <span className="text-xs text-gray-700">
                  {formatNumber.fileSize(resultVideo.size || 0)}
                </span>
              </p>
            ) : (
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold text-brand-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="mb-4 text-xs text-gray-400">MP4 • Max. 100MB</p>

                <div className="flex items-center gap-2 my-4">
                  <hr className="flex-1 border-gray-100" />
                  <span className="text-xs font-medium text-gray-400">OR</span>
                  <hr className="flex-1 border-gray-100" />
                </div>

                <Button
                  className="text-sm font-semibold"
                  size="large"
                  type="primary"
                >
                  Browse Files
                </Button>
              </div>
            )}
          </Dragger>
          <p className="text-xs font-light text-error-600">
            Video must contain vocal proof of date, time and place to validate
            the video as authentic and verifiable
            {!userDetails.isObserverInPollingUnit && " (Optional Upload)"}.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label className="text-sm font-medium text-gray-700">
          Upload Manual Results <span className="text-error-600">*</span>
        </label>
        <p>Kindly manually upload the result from the uploaded evidence.</p>

        {politicalPartyResults.length > 0 ? (
          <div className="grid gap-5 my-4 lg:grid-cols-2 xl:grid-cols-3">
            {politicalPartyResults.map((result, index) => (
              <InputNumber
                size="large"
                placeholder="Enter vote count"
                key={result.party}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                addonBefore={
                  <div className="flex gap-2 items-center pr-4">
                    <Image
                      width={20}
                      height={20}
                      alt={`${result.party} Logo`}
                      src={
                        getPartyLogo(result.party) ||
                        "/assets/party/default.png"
                      }
                      className="rounded"
                    />{" "}
                    <span>{result.party}</span>
                  </div>
                }
                addonAfter={
                  <button
                    onClick={() => {
                      setPoliticalPartyResults((prev) => {
                        const newResults = [...prev];
                        newResults.splice(index, 1);
                        return newResults;
                      });
                    }}
                  >
                    <Trash className="text-gray-400" variant="Bold" size={16} />
                  </button>
                }
                type="number"
                value={result.count}
                onChange={(value) => {
                  setPoliticalPartyResults((prev) => {
                    const newResults = [...prev];
                    newResults[index].count = Math.max(0, value || 0);
                    return newResults;
                  });
                }}
              />
            ))}
            <div className="flex items-center justify-between gap-3 rounded-lg border border-brand-200 bg-brand-25 px-4 py-3 lg:col-span-2 xl:col-span-3">
              <span className="text-sm font-medium text-gray-700">
                Total Party Votes
              </span>
              <span className="text-base font-semibold text-brand-600">
                {formatNumber.commas(
                  politicalPartyResults.reduce(
                    (sum, party) => sum + (Number(party.count) || 0),
                    0
                  )
                )}
              </span>
            </div>
          </div>
        ) : (
          <p className="py-4 text-sm text-center text-gray-500">
            No Parties Added
          </p>
        )}

        <Button
          type="text"
          className="mx-auto w-fit"
          onClick={() => setAddPoliticalPartyModal(true)}
        >
          <span className="font-semibold text-brand-600">Add more Parties</span>
        </Button>
        <p className="text-error-400 text-xs text-center">
          It is compulsory that you manually enter the vote count for each party
          as shown in the result sheet for your polling unit.
        </p>
        <Modal
          title="Add Political Party"
          open={addPoliticalPartyModal}
          onCancel={() => setAddPoliticalPartyModal(false)}
          footer={null}
          centered
        >
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              handleAddPoliticalParty();
              e.preventDefault();
            }}
          >
            <p className="text-gray-500">
              Please manually enter a political party
            </p>
            <div className="grid gap-2">
              <label htmlFor="party-name" className="text-sm font-medium">
                Party Name <span className="text-error-600">*</span>
              </label>
              <AppSelect
                id="party-name"
                options={election.politicalParties
                  .filter(
                    (party) =>
                      !politicalPartyResults.some(
                        (result) => result.party === party.code
                      )
                  )
                  .map((party) => ({
                    value: party.code,
                    label: `${party.name} (${party.code})`,
                  }))}
                value={partyFormData.partyName}
                onChange={(event) => {
                  setPartyFormData({ partyName: event.target.value });
                }}
              />
              <Button type="primary" block size="large" htmlType="submit">
                Confirm
              </Button>
            </div>
          </form>
        </Modal>
      </div>

      {isEditMode && (
        <React.Fragment>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="sentiment-analysis-voter-intimidation"
            >
              Were there instances of voter intimidation in your polling unit
              today? <span className="text-error-600">*</span>
            </label>
            <Select
              id="sentiment-analysis-voter-intimidation"
              placeholder="Select from dropdown"
              size="large"
              options={binarySelectOptions}
              value={formData.voterIntimidation}
              onChange={handleFormInputChange("voterIntimidation", "static")}
            />
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="sentiment-analysis-vote-buying"
            >
              Did you observe instances of vote buying in your polling unit
              today? <span className="text-error-600">*</span>
            </label>
            <Select
              id="sentiment-analysis-vote-buying"
              placeholder="Select from dropdown"
              size="large"
              options={binarySelectOptions}
              value={formData.voteBuying}
              onChange={handleFormInputChange("voteBuying", "static")}
            />
          </div>

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
              onChange={handleFormInputChange("voteRating", "static")}
            />
          </div>
        </React.Fragment>
      )}

      <div className="flex flex-col gap-3 mt-4 conditions">
        <div className="flex gap-2 md:items-center">
          <div>
            <Checkbox
              checked={formData.isInfoAccurate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isInfoAccurate: e.target.checked,
                }))
              }
            />
          </div>
          <p className="text-sm text-gray-700">
            I hereby affirm that the information submitted is accurate,
            peer-reviewed and can be used to fact-check the information
            submitted by the observer in my polling unit.
          </p>
        </div>
        <div className="flex gap-2 md:items-center">
          <div>
            <Checkbox
              checked={formData.isAgreedToTerms}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isAgreedToTerms: e.target.checked,
                }))
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
        htmlType="button"
        onClick={handleFormSubmit}
        loading={
          isEditMode
            ? electionState.status.updateElectionResult === "pending"
            : electionState.status.uploadElectionResult === "pending"
        }
      >
        {isEditMode
          ? "Update Results"
          : searchParams.get("flag")
            ? "Submit Results and Flag"
            : "Submit Results"}
      </Button>

      <SentimentAnalysisModal
        open={surveyFormOpen}
        setOpen={setSurveyFormOpen}
        formData={formData}
        setFormData={setFormData as any}
        submitPrimaryForm={uploadResult}
      />
    </form>
  );
}
