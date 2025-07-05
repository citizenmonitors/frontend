import ElectionIcon from "@/app/components/shared/ElectionIcon";
import UploadIcon from "@/app/components/shared/UploadIcon";
import { useAppDispatch } from "@/app/hooks/redux";
import { getPollingUnitResults } from "@/app/redux/features/electionSlice";
import { PollingUnitReport, PollingUnitResult } from "@/app/redux/types";
import pluralize from "@/app/utils/pluralize";
import { Button, Image as AntImage, Input, InputNumber, Modal, Select } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { CloseSquare, Flag, Like1 } from "iconsax-react";
import moment from "moment";
import React, { SetStateAction, useState } from "react";
import acceptedFileTypes from "../../../data/acceptedFileTypes";
import getElectionName from "@/app/utils/getElectionName";
import formatNumber from "@/app/utils/formatNumber";
import partyInfo from "@/app/data/partyInfo";
import Image from "next/image";

type PollingUnitUploadPreviewModalProps = {
  togglePollingUnitUploadFlagModal: (
    pollingUnitUpload?: PollingUnitReport | PollingUnitResult
  ) => void;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  upload: PollingUnitReport | PollingUnitResult;
};
export default function PollingUnitUploadPreviewModal({
  togglePollingUnitUploadFlagModal,
  open,
  setOpen,
  upload,
}: PollingUnitUploadPreviewModalProps) {
  const dataType = (upload as any).partiesVotes ? "result" : "report";
  const dispatch = useAppDispatch();
  const [previewImageVisible, setPreviewImageVisible] = useState(false);

  function handleFlag() {
    if (!upload.flagged) {
      setOpen(false);
      togglePollingUnitUploadFlagModal(upload);
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={950}
      closeIcon={<CloseSquare size={24} className="text-gray-500" />}
      centered
      classNames={{ content: "!max-h-[calc(100svh-120px)] overflow-y-scroll" }}
    >
      <header className="flex gap-4 md:items-center mb-9">
        <ElectionIcon electionType={upload.electionType} />{" "}
        <h2 className="font-league text-xl text-gray-700 font-semibold leading-[1.1] lg:text-display-xs mr-4">
          {upload.electionYear} {getElectionName(upload.election)}{" "}
          {dataType === "report" && "Incident Report"}
        </h2>
      </header>

      {dataType === "report" ? (
        <React.Fragment>
          <section className="grid gap-3 mb-8">
            <h3 className="font-league font-semibold text-xl leading-tight">Incident</h3>

            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="election-report-incident"
              >
                Selected Incident
              </label>
              <Select
                id="election-report-incident"
                placeholder="Select an Incident"
                size="large"
                value={(upload as PollingUnitReport).selectIncident}
                disabled
                style={{ background: "white", borderRadius: "8px" }}
              />
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="election-report-note"
              >
                Incident Note
              </label>
              <Input.TextArea
                id="election-report-note"
                size="large"
                placeholder="Kindly provide more context here."
                value={(upload as PollingUnitReport).incidentNote}
                disabled
                style={{ background: "white", borderRadius: "8px" }}
              />
            </div>

            <h3 className="font-league font-semibold text-xl leading-tight mt-6">
              Visual Evidence
            </h3>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="election-report-pictures"
                >
                  Pictures
                </label>
                <Dragger
                  id="election-report-pictures"
                  style={{ background: "white", borderRadius: "8px" }}
                  name="incidentPictures"
                  accept={acceptedFileTypes.incidentReportPicture}
                  showUploadList={false}
                  fileList={(upload as PollingUnitReport).incidentPictures.map(
                    (picture) => ({
                      uid: picture._id,
                      name: picture.name,
                      type: picture.type,
                      size: picture.size,
                      status: "done",
                    })
                  )}
                  disabled={true}
                >
                  <div className="grid mb-2 place-items-center">
                    <UploadIcon
                      fileType={
                        (upload as PollingUnitReport).incidentPictures.at(-1)?.type as any
                      }
                    />
                  </div>
                  <p className="flex flex-col gap-1 text-gray-700">
                    <span className="text-sm font-semibold text-brand-600">
                      {(upload as PollingUnitReport).incidentPictures.at(-1)!.name}
                    </span>
                    <span className="text-xs text-gray-700">
                      {formatNumber.fileSize(
                        (upload as PollingUnitReport).incidentPictures.at(-1)!.size || 0
                      )}
                    </span>
                  </p>
                </Dragger>
                <div className="flex gap-2 justify-between">
                  {`${pluralize(
                    (upload as PollingUnitReport).incidentPictures.length,
                    "Incident Picture",
                    "Incident Pictures"
                  )} Uploaded`}
                  <AntImage.PreviewGroup
                    preview={{
                      visible: previewImageVisible,
                      onVisibleChange: (v) => setPreviewImageVisible(v),
                    }}
                    items={(upload as PollingUnitReport).incidentPictures.map(
                      (f) => f.url || "/assets/uploads/file-empty.svg"
                    )}
                  >
                    <Button
                      size="small"
                      type="text"
                      className="w-fit !text-brand-500"
                      onClick={() => setPreviewImageVisible(true)}
                    >
                      View upload
                    </Button>
                  </AntImage.PreviewGroup>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="election-report-video"
                >
                  Evidence
                </label>
                <Dragger
                  id="election-report-video"
                  style={{ background: "white", height: "100%" }}
                  name={"incidentVideo"}
                  accept={acceptedFileTypes.incidentReportVideo}
                  showUploadList={false}
                  className="h-full"
                  fileList={(upload as PollingUnitReport).incidentVideos.map((video) => ({
                    uid: video._id,
                    name: video.name,
                    type: video.type,
                    size: video.size,
                    status: "done",
                  }))}
                  disabled={true}
                >
                  <div className="grid mb-2 place-items-center">
                    <UploadIcon
                      fileType={
                        (upload as PollingUnitReport).incidentVideos.at(-1)?.type as any
                      }
                    />
                  </div>
                  <p className="flex flex-col gap-1 text-gray-700">
                    <span className="text-sm font-semibold text-brand-600">
                      {(upload as PollingUnitReport).incidentVideos.at(-1)?.name ||
                        "Video File"}
                    </span>
                    <span className="text-xs text-gray-700">
                      {formatNumber.fileSize(
                        (upload as PollingUnitReport).incidentVideos.at(-1)?.size || 0
                      )}
                    </span>
                  </p>
                </Dragger>
                {`${pluralize(
                  (upload as PollingUnitReport).incidentVideos.length,
                  "Incident Video",
                  "Incident Videos"
                )} Uploaded`}
              </div>
            </div>
          </section>
          <div className={`grid gap-3 ${upload.flagged ? "grid-cols-1" : "grid-cols-2"}`}>
            {!upload.flagged && (
              <Button
                className="flex items-center justify-center"
                size="large"
                icon={<Like1 variant={upload.agreed ? "Bold" : "Linear"} />}
                onClick={() => {
                  setOpen(false);
                  dispatch(
                    getPollingUnitResults({
                      actionProps: {
                        action: "agree",
                        dataType: "incident",
                        electionId: upload.electionId,
                      },
                    })
                  );
                }}
              >
                {upload.agreed ? "Agreed" : "Agree"}
              </Button>
            )}
            <Button
              className="flex items-center justify-center !text-error-600 !border-error-600 hover:!bg-error-100"
              size="large"
              icon={<Flag variant={upload.flagged ? "Bold" : "Linear"} />}
              onClick={handleFlag}
            >
              {upload.flagged ? "Flagged" : "Flag"}
            </Button>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <section className="grid gap-3 mb-8">
            <div className="grid gap-2">
              <h3 className="font-league font-semibold text-xl leading-tight">
                Date & Time Election Started
              </h3>

              <p className="text-gray-500">{`${moment(upload.uploadedAt).format(
                "MMM Do YYYY"
              )}, ${(upload as PollingUnitResult).timeBegan || "---"}`}</p>
            </div>

            <div className="grid gap-2">
              <h3 className="font-league font-semibold text-xl leading-tight">
                Total Number of Accredited Voters
              </h3>

              <p className="text-gray-500">
                {(upload as PollingUnitResult).partiesVotes.reduce(
                  (acc, prev) => acc + prev.count,
                  0
                )}
              </p>
            </div>

            <div className="grid gap-2">
              <h3 className="font-league font-semibold text-xl leading-tight">
                Visual Results
              </h3>

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
                    name={"resultPicture"}
                    multiple={false}
                    maxCount={1}
                    showUploadList={false}
                    accept={acceptedFileTypes.resultPicture}
                    fileList={[
                      {
                        uid: (upload as PollingUnitResult).resultPicture._id,
                        name: (upload as PollingUnitResult).resultPicture.name,
                        type: (upload as PollingUnitResult).resultPicture.type,
                        size: (upload as PollingUnitResult).resultPicture.size,
                        status: "done",
                      },
                    ]}
                    disabled={true}
                  >
                    <div className="grid place-items-center mb-2">
                      <UploadIcon
                        fileType={
                          (upload as PollingUnitResult).resultPicture?.type as any
                        }
                      />
                    </div>
                    <p className="text-gray-700 flex flex-col gap-1">
                      <span className="text-sm font-semibold text-brand-600">
                        {(upload as PollingUnitResult).resultPicture.name}
                      </span>
                      <span className="text-gray-700 text-xs">
                        {formatNumber.fileSize(
                          (upload as PollingUnitResult).resultPicture.size || 0
                        )}
                      </span>
                    </p>
                  </Dragger>
                  <div className="flex gap-2 justify-between">
                    1 Result Picture Uploaded
                    <AntImage.PreviewGroup
                      preview={{
                        visible: previewImageVisible,
                        onVisibleChange: (v) => setPreviewImageVisible(v),
                      }}
                      items={[
                        (upload as PollingUnitResult).resultPicture.url ||
                          "/assets/uploads/file-empty.svg",
                      ]}
                    >
                      <Button
                        size="small"
                        type="text"
                        className="w-fit !text-brand-500"
                        onClick={() => setPreviewImageVisible(true)}
                      >
                        View upload
                      </Button>
                    </AntImage.PreviewGroup>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="election-result-video"
                  >
                    Video of Cumulative Result Announcement{" "}
                    <span className="text-error-600">*</span>
                  </label>
                  <Dragger
                    id="election-result-video"
                    style={{ background: "white", height: "100%" }}
                    name={"resultVideo"}
                    multiple={false}
                    maxCount={1}
                    showUploadList={false}
                    accept={acceptedFileTypes.resultVideo}
                    fileList={
                      (upload as PollingUnitResult).resultVideo
                        ? [
                            {
                              uid: (upload as PollingUnitResult).resultVideo?._id,
                              name: (upload as PollingUnitResult).resultVideo?.name,
                              type: (upload as PollingUnitResult).resultVideo?.type,
                              size: (upload as PollingUnitResult).resultVideo?.size,
                              status: "done",
                            },
                          ]
                        : [{} as any]
                    }
                    disabled={true}
                  >
                    <div className="grid place-items-center mb-2">
                      <UploadIcon
                        fileType={(upload as PollingUnitResult).resultVideo?.type as any}
                      />
                    </div>
                    <p className="text-gray-700 flex flex-col gap-1">
                      <span className="text-sm font-semibold text-brand-600">
                        {(upload as PollingUnitResult).resultVideo?.name ||
                          "No video uploaded"}
                      </span>
                      <span className="text-gray-700 text-xs">
                        {formatNumber.fileSize(
                          (upload as PollingUnitResult).resultVideo?.size || 0
                        )}
                      </span>
                    </p>
                  </Dragger>
                  <div className="flex gap-2 justify-between">
                    {(upload as PollingUnitResult).resultVideo?.name
                      ? "1 Result Video Uploaded"
                      : "No Result Video Uploaded"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <h3 className="font-league font-semibold text-xl leading-tight">
                Manual Results
              </h3>

              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 my-4">
                {(upload as PollingUnitResult).partiesVotes.map((result) => (
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
                          src={
                            partyInfo[result.party]?.logo || "/assets/party/default.png"
                          }
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
          </section>
          <div className="grid grid-cols-2 gap-3">
            {!upload.flagged && (
              <Button
                className="flex items-center justify-center"
                size="large"
                icon={<Like1 variant={upload.agreed ? "Bold" : "Linear"} />}
                onClick={() => {
                  setOpen(false);
                  dispatch(
                    getPollingUnitResults({
                      actionProps: {
                        action: "agree",
                        dataType: "election",
                        electionId: upload.electionId,
                      },
                    })
                  );
                }}
              >
                {upload.agreed ? "Agreed" : "Agree"}
              </Button>
            )}
            <Button
              className="flex items-center justify-center !text-error-600 !border-error-600 hover:!bg-error-100"
              style={{ gridColumn: upload.flagged ? "span 2" : "span 1" }}
              size="large"
              icon={<Flag variant={upload.flagged ? "Bold" : "Linear"} />}
              onClick={handleFlag}
            >
              {upload.flagged ? "Flagged" : "Flag"}
            </Button>
          </div>
        </React.Fragment>
      )}
    </Modal>
  );
}
