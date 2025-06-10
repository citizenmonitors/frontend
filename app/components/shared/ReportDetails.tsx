import { DetailedIncident } from '@/app/redux/types'
import formatNumber from '@/app/utils/formatNumber'
import pluralize from '@/app/utils/pluralize'
import { Image as AntImage, Button, Input, InputNumber, Select } from "antd";
import Dragger from 'antd/es/upload/Dragger'
import React, { useState } from 'react'
import UploadIcon from './UploadIcon'
import acceptedFileTypes from '@/app/data/acceptedFileTypes'

export default function ReportDetails({ report }: { report: DetailedIncident  }) {
  const [previewImageVisible, setPreviewImageVisible] = useState(false);

  return (
    <section className="grid gap-3 mb-8">
    <h3 className="font-league font-semibold text-xl leading-tight">
      Incident
    </h3>

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
        value={report.selectIncident}
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
        value={report.incidentNote}
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
          fileList={report.incidentPictures.map(
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
                report.incidentPictures.at(-1)?.type as any
              }
            />
          </div>
          <p className="flex flex-col gap-1 text-gray-700">
            <span className="text-sm font-semibold text-brand-600">
              {report.incidentPictures.at(-1)!.name}
            </span>
            <span className="text-xs text-gray-700">
              {formatNumber.fileSize(
                report.incidentPictures.at(-1)!.size || 0
              )}
            </span>
          </p>
        </Dragger>
        <div className="flex gap-2 justify-between">
          {`${pluralize(
            report.incidentPictures.length,
            "Incident Picture",
            "Incident Pictures"
          )} Uploaded`}
          <AntImage.PreviewGroup
            preview={{
              visible: previewImageVisible,
              onVisibleChange: (v) => setPreviewImageVisible(v),
            }}
            items={report.incidentPictures.map(
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
          fileList={report.incidentVideos.map((video) => ({
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
                report.incidentVideos.at(-1)?.type as any
              }
            />
          </div>
          <p className="flex flex-col gap-1 text-gray-700">
            <span className="text-sm font-semibold text-brand-600">
              {report.incidentVideos.at(-1)?.name ||
                "Video File"}
            </span>
            <span className="text-xs text-gray-700">
              {formatNumber.fileSize(
                report.incidentVideos.at(-1)?.size || 0
              )}
            </span>
          </p>
        </Dragger>
        {`${pluralize(
          report.incidentVideos.length,
          "Incident Video",
          "Incident Videos"
        )} Uploaded`}
      </div>
    </div>
  </section>
  )
}
