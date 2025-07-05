import acceptedFileTypes from "@/app/data/acceptedFileTypes";
import { DetailedResult } from "@/app/redux/types";
import Dragger from "antd/es/upload/Dragger";
import moment from "moment";
import React, { useState } from "react";
import UploadIcon from "./UploadIcon";
import formatNumber from "@/app/utils/formatNumber";
import { Image as AntImage, Button, InputNumber } from "antd";
import partyInfo from "@/app/data/partyInfo";

export default function ResultDetails({ upload }: { upload: DetailedResult }) {
  const [previewImageVisible, setPreviewImageVisible] = useState(false);

  return (
    <section className="grid gap-3 mb-8">
      <div className="grid gap-2">
        <h3 className="font-league font-semibold text-xl leading-tight">
          Date & Time Election Started
        </h3>

        <p className="text-gray-500">{`${moment(upload.createdAt).format(
          "MMM Do YYYY"
        )}, ${upload.timeBegan || "---"}`}</p>
      </div>

      <div className="grid gap-2">
        <h3 className="font-league font-semibold text-xl leading-tight">
          Total Number of Accredited Voters
        </h3>

        <p className="text-gray-500">
          {upload.partiesVotes.reduce((acc, prev) => acc + prev.count, 0)}
        </p>
      </div>

      <div className="grid gap-2">
        <h3 className="font-league font-semibold text-xl leading-tight">
          Total Number of Spoiled Ballot Papers
        </h3>

        <p className="text-gray-500">{upload.spoiledBallotPapers}</p>
      </div>
      <div className="grid gap-2">
        <h3 className="font-league font-semibold text-xl leading-tight">
          Total Number of Rejected Ballots
        </h3>

        <p className="text-gray-500">{upload.rejectedPapers}</p>
      </div>
      <div className="grid gap-2">
        <h3 className="font-league font-semibold text-xl leading-tight">
          Total Number of Used Ballot Papers
        </h3>

        <p className="text-gray-500">{upload.usedBallotPapers}</p>
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
                  uid: upload.resultPicture._id,
                  name: upload.resultPicture.name,
                  type: upload.resultPicture.type,
                  size: upload.resultPicture.size,
                  status: "done",
                },
              ]}
              disabled={true}
            >
              <div className="grid place-items-center mb-2">
                <UploadIcon fileType={upload.resultPicture?.type as any} />
              </div>
              <p className="text-gray-700 flex flex-col gap-1">
                <span className="text-sm font-semibold text-brand-600">
                  {upload.resultPicture.name}
                </span>
                <span className="text-gray-700 text-xs">
                  {formatNumber.fileSize(upload.resultPicture.size || 0)}
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
                items={[upload.resultPicture.url || "/assets/uploads/file-empty.svg"]}
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
                upload.resultVideo
                  ? [
                      {
                        uid: upload.resultVideo?._id,
                        name: upload.resultVideo?.name,
                        type: upload.resultVideo?.type,
                        size: upload.resultVideo?.size,
                        status: "done",
                      },
                    ]
                  : [{} as any]
              }
              disabled={true}
            >
              <div className="grid place-items-center mb-2">
                <UploadIcon fileType={upload.resultVideo?.type as any} />
              </div>
              <p className="text-gray-700 flex flex-col gap-1">
                <span className="text-sm font-semibold text-brand-600">
                  {upload.resultVideo?.name || "No video uploaded"}
                </span>
                <span className="text-gray-700 text-xs">
                  {formatNumber.fileSize(upload.resultVideo?.size || 0)}
                </span>
              </p>
            </Dragger>
            <div className="flex gap-2 justify-between">
              {upload.resultVideo?.name
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

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
          {upload.partiesVotes.map((result) => (
            <InputNumber
              size="large"
              placeholder="Enter vote count"
              key={result.party}
              value={result.count}
              addonBefore={
                <div className="flex gap-2 items-center pr-4">
                  <AntImage
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
    </section>
  );
}
