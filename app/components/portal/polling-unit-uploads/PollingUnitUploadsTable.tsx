import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { getPollingUnitResults } from "@/app/redux/features/electionSlice";
import { PollingUnitReport, PollingUnitResult } from "@/app/redux/types";
import getElectionName from "@/app/utils/getElectionName";
import formatString from "@/app/utils/formatString";
import { Button, Empty, Table, TableColumnsType, Tooltip } from "antd";
import { ArrowLeft, ArrowRight, Flag, Like1 } from "iconsax-react";
import moment from "moment";
import React from "react";
import { v4 } from "uuid";

export default function PollingUnitUploadsTable({
  togglePollingUnitUploadFlagModal,
  filteredPollingUnitUploads,
  togglePreviewModal,
}: {
  togglePollingUnitUploadFlagModal: (
    pollingUnitUpload?: PollingUnitReport | PollingUnitResult
  ) => void;
  filteredPollingUnitUploads: Array<PollingUnitReport | PollingUnitResult>;
  togglePreviewModal: (modalInfo?: PollingUnitReport | PollingUnitResult) => void;
}) {
  const dispatch = useAppDispatch();
  const electionState = useAppSelector((state) => state.election);
  const userDetails = useAppSelector((state) => state.user.details!);

  type ColumnType = {
    key: React.Key;
    election: string;
    pollingUnit: string;
    electionYear: string;
    time: string;
    type: string;
  };
  const columns: TableColumnsType<ColumnType> = [
    {
      title: "Election",
      dataIndex: "election",
      key: 1,
      sorter: (a: any, b: any) => (a.election > b.election ? 1 : -1),
    },
    {
      title: "Polling Unit",
      dataIndex: "pollingUnit",
      key: 2,
      sorter: (a: any, b: any) => (a.pollingUnit > b.pollingUnit ? 1 : -1),
    },
    {
      title: "Election Year",
      dataIndex: "electionYear",
      key: 3,
      // responsive: ["md"],
      sorter: (a: any, b: any) => (a.electionYear > b.electionYear ? 1 : -1),
    },
    {
      title: "Uploaded",
      dataIndex: "time",
      key: 4,
      // responsive: ["md"],
      sorter: (a: any, b: any) => (a.time > b.time ? 1 : -1),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: 5,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: 6,
      width: "80px",
      align: "center",
    },
  ];

  const dataSource = filteredPollingUnitUploads.map((upload) => {
    function handleFlag() {
      if (!upload.flagged) {
        togglePollingUnitUploadFlagModal(upload);
      }
    }

    return {
      key: v4(),
      election: upload.electionName,
      pollingUnit: formatString.normalCase(upload.pollingUnit).toUpperCase(),
      electionYear: upload.electionYear,
      time: moment(upload.uploadedAt || Date.now()).format("YYYY/MM/DD hh:mmA"),
      type: (upload as any).partiesVotes ? "Election Result" : "Incident Report",
      actions: (
        <div className="flex gap-[2px] items-center">
          <Button
            type="text"
            className="text-gray-500 font-semibold text-xs"
            onClick={() => {
              togglePreviewModal(upload);
            }}
          >
            View
          </Button>
          <div className="w-[6px] h-[6px] bg-gray-300 rounded-full " />
          {!upload.flagged && (
            <React.Fragment>
              <Tooltip title={upload.agreed ? "Agreed" : "Agree"} className="text-sm">
                <Button
                  type="text"
                  className="!text-brand-600 py-1 px-2 font-semibold text-xs flex gap-[2px] items-center"
                  onClick={() => {
                    dispatch(
                      getPollingUnitResults({
                        actionProps: {
                          action: "agree",
                          dataType: (upload as any).partiesVotes
                            ? "election"
                            : "incident",
                          electionId: upload.electionId,
                        },
                      })
                    );
                  }}
                >
                  <Like1 size={16} variant={upload.agreed ? "Bold" : "Linear"} />
                </Button>
              </Tooltip>
              <div className="w-[6px] h-[6px] bg-gray-300 rounded-full" />
            </React.Fragment>
          )}
          <Tooltip title={upload.flagged ? "Flagged" : "Flag"} className="text-sm">
            <Button
              type="text"
              className="!text-error-500 py-1 px-2 text-xs flex gap-1 items-center"
              onClick={handleFlag}
            >
              <Flag size={16} variant={upload.flagged ? "Bold" : "Linear"} />
              {upload.flagged ? "Flagged" : ""}
            </Button>
          </Tooltip>
        </div>
      ),
    };
  });

  return (
    <Table
      locale={{
        emptyText: (
          <span className="flex justify-center max-w-sm mx-auto">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No data is available for your polling unit as there’s currently no accredited observer for your polling unit. You can upgrade now to become the accredited observer for your polling unit."
            />
          </span>
        ),
      }}
      dataSource={dataSource}
      columns={columns}
      rowClassName={"text-gray-500 hover:cursor-pointer"}
      loading={electionState.status.fetchPollingUnitResults === "pending"}
      className="bg-white ring-1 rounded-lg overflow-hidden ring-gray-300 hidden lg:block"
      pagination={{
        pageSize: 5,
        showSizeChanger: false,
        hideOnSinglePage: true,
        nextIcon: (
          <Button
            type="text"
            className="text-gray-700 font-semibold flex gap-2 items-center ring-gray-300 ring-1"
          >
            Next <ArrowRight size={16} />
          </Button>
        ),
        position: ["bottomCenter"],
        prevIcon: (
          <Button
            type="text"
            className="text-gray-700 font-semibold flex gap-2 items-center ring-gray-300 ring-1"
          >
            <ArrowLeft size={16} /> Prev
          </Button>
        ),
        className: "px-4",
      }}
    />
  );
}
