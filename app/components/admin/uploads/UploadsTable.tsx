import { useAppSelector } from "@/app/hooks/redux";
import { AdminElectionUpload } from "@/app/redux/types";
import formatString from "@/app/utils/formatString";
import { Button, Dropdown, Empty, Table, TableColumnsType, Tooltip } from "antd";
import { ArrowLeft, ArrowRight, Eye, Trash } from "iconsax-react";
import React, { useState } from "react";
import { v4 } from "uuid";
import TruncateTooltip from "../../shared/TruncateTooltip";
import moment from "moment";
import DotsVertical from "@/public/assets/dots-vertical.svg";
import Image from "next/image";
import DeleteUploadModal from "./DeleteUploadModal";
import UploadPreviewModal from "./UploadPreviewModal";
import RoleTag from "../../shared/RoleTag";

type UploadsTableProps = {
  filteredUploads: Array<AdminElectionUpload>;
};

export default function UploadsTable({ filteredUploads }: UploadsTableProps) {
  const uploadState = useAppSelector((state) => state.adminUpload);
  const [deleteUploadModalData, setDeleteUploadModalData] =
    useState<AdminElectionUpload | null>(null);
  const [viewUploadModalData, setViewUploadModalData] =
    useState<AdminElectionUpload | null>(null);

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
      title: "State",
      dataIndex: "state",
      key: 4,
      sorter: (a: any, b: any) => (a.state > b.state ? 1 : -1),
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
      time: moment(upload.createdAt).format("DD/MM/YYYY, hh:mmA"),
      type: upload.resultUploaded,
      verification: (
        <div className="w-full flex justify-center">
          <RoleTag key={upload.role} role={upload.role} />
        </div>
      ),
      actions: (
        <div>
          <Dropdown
            menu={{
              items: [
                {
                  label: "View Result",
                  key: "1",
                  icon: <Eye size={18} />,
                  className: "w-[150px]",
                  onClick: () => {
                    setViewUploadModalData(upload);
                  },
                },
                {
                  label: "Delete Result",
                  key: "2",
                  icon: <Trash size={18} />,
                  danger: true,
                  className: "w-[150px]",
                  onClick: () => {
                    setDeleteUploadModalData(upload);
                  },
                },
              ],
            }}
            placement="bottomRight"
          >
            <Button type="text" className="px-1">
              <Image src={DotsVertical} alt="menu toggle" />
            </Button>
          </Dropdown>
        </div>
      ),
    };
  });

  return (
    <React.Fragment>
      <UploadPreviewModal
        open={!!viewUploadModalData}
        setOpen={setViewUploadModalData}
        upload={viewUploadModalData}
      />
      <DeleteUploadModal
        open={!!deleteUploadModalData}
        setOpen={setDeleteUploadModalData}
        upload={deleteUploadModalData}
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
        loading={
          uploadState.status.fetchUploads === "pending" ||
          uploadState.status.deleteUpload === "pending"
        }
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
