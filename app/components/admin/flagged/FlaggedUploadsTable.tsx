import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { AdminFlaggedUpload } from "@/app/redux/types";
import formatString from "@/app/utils/formatString";
import { Button, Empty, Table, TableColumnsType, Tooltip } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { v4 } from "uuid";
import TruncateTooltip from "../../shared/TruncateTooltip";
import RoleTag from "../../shared/RoleTag";
import { ArrowLeft, ArrowRight, Eye, Flag } from "iconsax-react";
import FlaggedUploadPreviewModal from "./FlaggedUploadPreviewModal";

type FlaggedUploadsTableProps = {
  filteredUploads: Array<AdminFlaggedUpload>;
};

export default function FlaggedUploadsTable({
  filteredUploads,
}: FlaggedUploadsTableProps) {
  const flaggedUploadState = useAppSelector((state) => state.adminFlaggedUpload);
  const dispatch = useAppDispatch();
  const [viewFlaggedUploadModalData, setViewFlaggedUploadModalData] =
    useState<AdminFlaggedUpload | null>(null);

  const columns: TableColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: 1,
      sorter: (a: any, b: any) => (a.name > b.name ? 1 : -1),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: 2,
      sorter: (a: any, b: any) => (a.email > b.email ? 1 : -1),
    },
    {
      title: "Election",
      dataIndex: "election",
      key: 3,
      sorter: (a: any, b: any) => (a.election > b.election ? 1 : -1),
    },
    {
      title: "Priority",
      dataIndex: "hidden",
      key: 10,
      sorter: (a: any, b: any) => (a.hidden > b.hidden ? 1 : -1),
    },
    {
      title: "State",
      dataIndex: "state",
      key: 4,
      sorter: (a: any, b: any) => (a.state > b.state ? 1 : -1),
    },
    {
      title: "Polling Unit",
      dataIndex: "pollingUnit",
      key: 9,
      sorter: (a: any, b: any) => (a.pollingUnit > b.pollingUnit ? 1 : -1),
    },
    {
      title: "Upload Date",
      dataIndex: "time",
			defaultSortOrder: "descend",
      key: 5,
      sorter: (a: any, b: any) => {
        const timeA = moment(a.time, "DD/MM/YYYY, hh:mm A").valueOf();
        const timeB = moment(b.time, "DD/MM/YYYY, hh:mm A").valueOf();
        return timeA > timeB ? 1 : -1;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: 6,
      sorter: (a: any, b: any) => (a.type > b.type ? 1 : -1),
    },
    {
      title: "Verification",
      dataIndex: "verification",
      key: 7,
      sorter: (a, b) => (a.verification.key > b.verification.key ? 1 : -1),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: 8,
      width: "80px",
      align: "center",
    },
  ];

  const dataSource = filteredUploads.map((upload) => {
    return {
      key: v4(),
      name: formatString.normalCase([upload.firstName, upload.lastName]),
      email: <TruncateTooltip length={24}>{upload.email}</TruncateTooltip>,
      election: formatString.kebabToNormalCase(upload.election, true),
      state: formatString.normalCase(upload.state),
      pollingUnit: upload.pollingUnit.toUpperCase(),
      time: moment(upload.createdAt).format("DD/MM/YYYY, hh:mmA"),
      type: upload.resultUploaded,
      hidden: (
        <div className="flex justify-center">
          {upload.hidden ? (
            <Tooltip title={`${upload.priorityLevel}% Flagged`}>
              <Flag key={1} className="text-error-600" size={16} variant="Bold" />
            </Tooltip>
          ) : (
            <Tooltip title={`${upload.priorityLevel}% Flagged`}>
              <Flag key={2} className="text-gray-300" size={16} variant="Bold" />
            </Tooltip>
          )}
        </div>
      ),
      verification: (
        <div className="w-full flex justify-center">
          <RoleTag key={upload.role} role={upload.role} />
        </div>
      ),
      actions: (
        <div>
          <Tooltip title="Review Result" mouseEnterDelay={0.5}>
            <Button
              type="text"
              className="px-1"
              onClick={() => {
                setViewFlaggedUploadModalData(upload);
              }}
            >
              <Eye size={18} className="text-gray-500" variant="Bold" />
            </Button>
          </Tooltip>
        </div>
      ),
    };
  });

  return (
    <React.Fragment>
      <FlaggedUploadPreviewModal
        open={!!viewFlaggedUploadModalData}
        setOpen={setViewFlaggedUploadModalData}
        upload={viewFlaggedUploadModalData}
      />
      <Table
        locale={{
          emptyText: (
            <span className="flex justify-center max-w-sm mx-auto">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No uploads are available."
              />
            </span>
          ),
        }}
        dataSource={dataSource}
        columns={columns}
        rowClassName={"text-gray-500 hover:cursor-pointer"}
        loading={flaggedUploadState.status.fetchFlaggedUploads === "pending"}
        className="bg-white ring-1 rounded-lg overflow-y-scroll ring-gray-300 hidden lg:block"
        pagination={{
          pageSize: 10,
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
    </React.Fragment>
  );
}
