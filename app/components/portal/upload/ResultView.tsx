import ElectionIcon from "@/app/components/shared/ElectionIcon";
import UploadIcon from "@/app/components/shared/UploadIcon";
import { binarySelectOptions, ratingSelectOptions } from "@/app/data/form";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearElectionUploadData,
  deleteElectionResult,
} from "@/app/redux/features/electionSlice";
import { Button, InputNumber, Modal, Select, UploadFile, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { MessageEdit, Trash } from "iconsax-react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import acceptedFileTypes from "../../../data/acceptedFileTypes";
import formatNumber from "@/app/utils/formatNumber";
import getElectionName from "@/app/utils/getElectionName";
import Image from "next/image";
import partyInfo from "@/app/data/partyInfo";

type ResultViewProps = {
  setMode: React.Dispatch<React.SetStateAction<"upload" | "view" | "edit">>;
};

export default function ResultView({ setMode }: ResultViewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id }: { id: string } = useParams();
  const electionState = useAppSelector((state) => state.election);
  const userState = useAppSelector((state) => state.user.details!);
  const election = electionState.electionData.election!;
  const electionResult = electionState.electionData.result!;
  const electionYear = moment(election.startDate).format("YYYY");

  const [resultPicture] = React.useState<UploadFile>({
    uid: electionResult.resultPicture._id,
    name: electionResult.resultPicture.name,
    type: electionResult.resultPicture.type,
    size: electionResult.resultPicture.size,
    status: "done",
  });
  const [resultVideo] = React.useState<UploadFile>(
    electionResult.resultVideo
      ? {
          uid: electionResult.resultVideo._id,
          name: electionResult.resultVideo.name,
          type: electionResult.resultVideo.type,
          size: electionResult.resultVideo.size,
          status: "done",
        }
      : ({} as any)
  );

  const resultPictureUploadProps: UploadProps = {
    name: "resultPicture",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    accept: acceptedFileTypes.resultPicture,
    fileList: [resultPicture],
    disabled: true,
  };
  const resultVideoUploadProps: UploadProps = {
    name: "resultVideo",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    accept: acceptedFileTypes.resultVideo,
    fileList: [resultVideo],
    disabled: true,
  };

  const [deleteResultModal, setDeleteResultModal] = React.useState(false);
  function handleDeleteResult() {
    dispatch(deleteElectionResult({ electionId: election._id }));
  }

  React.useEffect(() => {
    if (electionState.status.deleteElectionResult === "fulfilled") {
      setDeleteResultModal(false);
      dispatch(
        showAlert({
          message: "Result has been deleted.",
          type: "success",
        })
      );
      dispatch(clearElectionUploadData());
      router.replace(`/portal/uploads`);
    } else if (electionState.status.deleteElectionResult === "rejected") {
      dispatch(
        showAlert({
          message: electionState.error.message || "An error occurred",
          type: "error",
        })
      );
    }
  }, [electionState.status.deleteElectionResult]);

  const actionButtons = (
    <div className="action-buttons flex flex-col md:flex-row gap-3 items-center">
      <Button
        type="primary"
        size="large"
        className="flex items-center gap-2 w-full md:w-auto justify-center"
        onClick={() => {
          router.replace(`/portal/uploads/result/${id}?mode=edit`);
          setMode("edit");
        }}
      >
        <MessageEdit size={18} /> Edit
      </Button>
      <Button
        type="primary"
        size="large"
        className="flex items-center gap-2 w-full md:w-auto justify-center"
        danger
        onClick={() => setDeleteResultModal(true)}
      >
        <Trash size={18} /> Delete
      </Button>
    </div>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 mt-6">
      <header className="flex gap-4 md:items-center">
        <ElectionIcon electionType={election.electionType} />{" "}
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-sm">
          {electionYear} {getElectionName(election, "detailed", userState)} Elections
        </h2>
        <div className="ml-auto hidden md:block">{actionButtons}</div>
      </header>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label className="text-sm font-medium text-gray-700" htmlFor="accredited-voters">
          Total Number of Accredited Voters <span className="text-error-600">*</span>
        </label>
        <p>
          Kindly manually input the total number of accredited voters from the uploaded
          evidence.
        </p>
        <InputNumber
          id="accredited-voters"
          size="large"
          placeholder="Enter number of accredited voters"
          type="number"
          className="w-full mt-2"
          value={electionResult.accreditedVoters || 0}
          disabled
          style={{ background: "white", borderRadius: "8px" }}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label className="text-sm font-medium text-gray-700" htmlFor="spoiled-ballots">
          Total Number of Spoiled Ballot Papers <span className="text-error-600">*</span>
        </label>
        <p>
          Kindly manually input the total number of spoiled ballot papers from the
          uploaded evidence.
        </p>
        <InputNumber
          id="spoiled-ballots"
          size="large"
          placeholder="Enter number of spoiled ballot papers"
          type="number"
          className="w-full mt-2"
          value={electionResult.spoiledBallotPapers || 0}
          disabled
          style={{ background: "white", borderRadius: "8px" }}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label className="text-sm font-medium text-gray-700" htmlFor="rejected-ballots">
          Total Number of Rejected Ballots <span className="text-error-600">*</span>
        </label>
        <p>
          Kindly manually input the total number of rejected ballots from the uploaded
          evidence.
        </p>
        <InputNumber
          id="rejected-ballots"
          size="large"
          placeholder="Enter number of rejected ballots"
          type="number"
          className="w-full mt-2"
          value={electionResult.rejectedPapers || 0}
          disabled
          style={{ background: "white", borderRadius: "8px" }}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label className="text-sm font-medium text-gray-700" htmlFor="used-ballot-ballots">
          Total Number of Used Ballot Papers <span className="text-error-600">*</span>
        </label>
        <p>
          Kindly manually input the total number of used ballot papers from the uploaded
          evidence.
        </p>
        <InputNumber
          id="used-ballot-ballots"
          size="large"
          placeholder="Enter number of used ballot papers"
          type="number"
          className="w-full mt-2"
          value={electionResult.usedBallotPapers}
          disabled
          style={{ background: "white", borderRadius: "8px" }}
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
            style={{ background: "white", borderRadius: "8px" }}
            {...resultPictureUploadProps}
          >
            <div className="grid place-items-center mb-2">
              <UploadIcon fileType={resultPicture?.type as any} />
            </div>
            {resultPicture ? (
              <p className="text-gray-700 flex flex-col gap-1">
                <span className="text-sm font-semibold text-brand-600">
                  {resultPicture.name}
                </span>
                <span className="text-gray-700 text-xs">
                  {formatNumber.fileSize(resultPicture.size || 0)}
                </span>
              </p>
            ) : (
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold text-brand-600">Click to upload</span> or
                  drag and drop
                </p>
                <p className="text-xs text-gray-400 mb-4">PNG or JPG • Max. 5MB</p>

                <div className="flex gap-2 items-center my-4">
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
          <p className="text-xs text-error-600 font-light">
            The picture uploaded must be a signed result sheet for the election of your
            polling unit.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="election-result-video"
          >
            Video of Cumulative Result Announcement
          </label>
          <Dragger
            id="election-result-video"
            style={{ background: "white", height: "100%" }}
            {...resultVideoUploadProps}
          >
            <div className="grid place-items-center mb-2">
              <UploadIcon fileType={resultVideo?.type as any} />
            </div>
            {resultVideo ? (
              <p className="text-gray-700 flex flex-col gap-1">
                <span className="text-sm font-semibold text-brand-600">
                  {resultVideo.name || "No video uploaded"}
                </span>
                <span className="text-gray-700 text-xs">
                  {formatNumber.fileSize(resultVideo.size || 0)}
                </span>
              </p>
            ) : (
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold text-brand-600">Click to upload</span> or
                  drag and drop
                </p>
                <p className="text-xs text-gray-400 mb-4">MP4 • Max. 100MB</p>

                <div className="flex gap-2 items-center my-4">
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
          <p className="text-xs text-error-600 font-light">
            Video must contain vocal proof of date, time and place to validate the video
            as authentic and verifiable (Optional Upload).
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <label className="text-sm font-medium text-gray-700">
          Upload Manual Results <span className="text-error-600">*</span>
        </label>
        <p>Kindly manually upload the result from the uploaded evidence.</p>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 my-4">
          {electionResult.partiesVotes.map((result) => (
            <InputNumber
              size="large"
              placeholder="Enter vote count"
              key={result.party}
              value={result.count}
              addonBefore={
                <div className="flex gap-2 items-center pr-4">
                  <Image
                    width={20}
                    height={20}
                    alt={`${result.party} Logo`}
                    src={partyInfo[result.party]?.logo || "/assets/party/default.png"}
                    className="rounded"
                  />{" "}
                  <span>{result.party}</span>
                </div>
              }
              disabled
              style={{ background: "white", borderRadius: "8px" }}
            />
          ))}
        </div>
      </div>

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
          value={electionResult.voterIntimidation}
          options={binarySelectOptions}
          disabled
          style={{ background: "white", borderRadius: "8px" }}
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
          value={electionResult.voteBuying}
          options={binarySelectOptions}
          disabled
          style={{ background: "white", borderRadius: "8px" }}
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
          value={electionResult.voteRating}
          options={ratingSelectOptions}
          disabled
          style={{ background: "white", borderRadius: "8px" }}
        />
      </div>

      <div className="md:hidden">{actionButtons}</div>

      <Modal
        open={deleteResultModal}
        title="Delete Result"
        centered
        onCancel={() => setDeleteResultModal(false)}
        footer={[
          <Button
            key={"cancel"}
            size="large"
            type="text"
            className="text-gray-500"
            onClick={() => setDeleteResultModal(false)}
          >
            Cancel
          </Button>,
          <Button
            key={"delete"}
            danger
            type="primary"
            onClick={handleDeleteResult}
            loading={electionState.status.deleteElectionResult === "pending"}
          >
            Delete
          </Button>,
        ]}
      >
        <p className="text-sm text-gray-500 text-center">
          Are you sure you want to delete the result for{" "}
          <span className="text-brand-600 font-medium whitespace-nowrap">
            {electionYear} {getElectionName(election)} Elections
          </span>
          ?
        </p>
      </Modal>
    </form>
  );
}
