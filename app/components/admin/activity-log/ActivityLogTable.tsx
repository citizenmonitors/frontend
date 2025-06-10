import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { AdminTableActivity } from "@/app/redux/admin-features/activityLogSlice";
import { Button, Dropdown, Empty, Table, TableColumnsType } from "antd";
import React, { useState } from "react";
import { v4 } from "uuid";
import TruncateTooltip from "../../shared/TruncateTooltip";
import formatString from "@/app/utils/formatString";
import RoleTag from "../../shared/RoleTag";
import moment from "moment";
import { ArrowLeft, ArrowRight, Eye } from "iconsax-react";
import Image from "next/image";
import DotsVertical from "@/public/assets/dots-vertical.svg";
import UserPreviewModal from "../users/UserPreviewModal";

type ActivityLogTableProps = {
  filteredActivities: Array<AdminTableActivity["admin"]>;
};

function ActivityLogTable({ filteredActivities }: ActivityLogTableProps) {
  const activityLogState = useAppSelector((state) => state.adminActivityLog);
  const [viewUserModalData, setViewUserModalData] = useState<{ _id: string } | null>(
    null
  );

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
      title: "Action Performed",
      dataIndex: "action",
      key: 3,
      width: '200px'
    },
    {
      title: "Time",
      dataIndex: "time",
      key: 4,
      sorter: (a: any, b: any) => {
        const timeA = moment(a.time, "DD/MM/YYYY, hh:mm A").valueOf();
        const timeB = moment(b.time, "DD/MM/YYYY, hh:mm A").valueOf();
        return timeA > timeB ? 1 : -1;
      },
    },
    {
      title: "Verification",
      dataIndex: "verification",
      key: 5,
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

  const dataSource = filteredActivities.map((activity) => {
    return {
      key: v4(),
      name: formatString.normalCase([activity.firstName, activity.lastName]),
      email: <TruncateTooltip length={24}>{activity.email}</TruncateTooltip>,
      verification: (
        <div className="w-full flex justify-center">
          <RoleTag key={activity.role} role={activity.role} />
        </div>
      ),
      action: activity.action,
      time: moment(activity.timeCreated).format("DD/MM/YYYY, hh:mm A"),
      actions: (
        <div>
          <Dropdown
            menu={{
              items: [
                {
                  label: "View Profile",
                  key: "1",
                  icon: <Eye size={18} />,
                  className: "w-[150px]",
                  onClick: () => {
                    // Fetch Actual User
                    setViewUserModalData({ _id: activity._id });
                  },
                },
              ],
            }}
            placement="bottomRight"
          >
            <Button type="text" className="px-1">
              <Image src={DotsVertical} alt="menu" />
            </Button>
          </Dropdown>
        </div>
      ),
    };
  });

  return (
    <React.Fragment>
      <UserPreviewModal
        open={!!viewUserModalData}
        setOpen={setViewUserModalData}
        user={viewUserModalData}
      />
      <Table
        locale={{
          emptyText: (
            <span className="flex justify-center max-w-sm mx-auto">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No activities has happened recently."
              />
            </span>
          ),
        }}
        dataSource={dataSource}
        columns={columns}
        rowClassName={"text-gray-500 hover:cursor-pointer"}
        loading={activityLogState.status.fetchActivities === "pending"}
        className="bg-white ring-1 rounded-lg overflow-y-scroll ring-gray-300 hidden lg:block"
        pagination={{
          pageSize: 8,
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

export default ActivityLogTable;
