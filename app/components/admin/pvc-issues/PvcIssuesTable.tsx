"use client";

import { getPvcIssueLabel } from "@/app/data/pvcIssues";
import { AdminTablePvcIssue } from "@/app/redux/admin-features/pvcIssuesSlice";
import formatString from "@/app/utils/formatString";
import { Button, Dropdown, Empty, Table, TableColumnsType } from "antd";
import { ArrowLeft, ArrowRight, Eye } from "iconsax-react";
import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";
import DotsVertical from "@/public/assets/dots-vertical.svg";
import TruncateTooltip from "../../shared/TruncateTooltip";
import PvcIssuePreviewModal from "./PvcIssuePreviewModal";

type PvcIssuesTableProps = {
  filteredReports: Array<AdminTablePvcIssue>;
};

export default function PvcIssuesTable({ filteredReports }: PvcIssuesTableProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const dataSource = filteredReports.map((report) => ({
    key: report.id,
    name: report.fullName,
    phone: report.phoneNumber,
    state: formatString.normalCase(report.state),
    lga: formatString.normalCase(report.lga),
    issueType: (
      <TruncateTooltip length={42}>
        {getPvcIssueLabel(report.issueType)}
      </TruncateTooltip>
    ),
    time: moment(report.createdAt).format("DD/MM/YYYY, hh:mmA"),
    actions: (
      <Dropdown
        menu={{
          items: [
            {
              label: "View Report",
              key: "view",
              icon: <Eye size={18} />,
              className: "w-[150px]",
              onClick: () => setSelectedReportId(report.id),
            },
          ],
        }}
        placement="bottomRight"
      >
        <Button type="text" className="px-1">
          <Image src={DotsVertical} alt="menu" />
        </Button>
      </Dropdown>
    ),
  }));

  const columns: TableColumnsType<(typeof dataSource)[number]> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "LGA", dataIndex: "lga", key: "lga" },
    { title: "Issue Type", dataIndex: "issueType", key: "issueType" },
    { title: "Submitted", dataIndex: "time", key: "time" },
    { title: "", dataIndex: "actions", key: "actions", width: 60 },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          itemRender: (_, type, originalElement) => {
            if (type === "prev") {
              return (
                <Button type="text" className="flex items-center gap-1">
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </Button>
              );
            }
            if (type === "next") {
              return (
                <Button type="text" className="flex items-center gap-1">
                  <span>Next</span>
                  <ArrowRight size={16} />
                </Button>
              );
            }
            return originalElement;
          },
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No PVC issue reports found"
            />
          ),
        }}
        scroll={{ x: true }}
      />

      <PvcIssuePreviewModal
        open={!!selectedReportId}
        onClose={() => setSelectedReportId(null)}
        reportId={selectedReportId}
      />
    </>
  );
}