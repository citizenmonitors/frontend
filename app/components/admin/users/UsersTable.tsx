import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { User } from "@/app/redux/types";
import React, { useState } from "react";
import RoleTag from "../../shared/RoleTag";
import moment from "moment";
import formatString from "@/app/utils/formatString";
import { ArrowLeft, ArrowRight, Eye, Trash } from "iconsax-react";
import { Button, Dropdown, Empty, Table, TableColumnsType } from "antd";
import DotsVertical from "@/public/assets/dots-vertical.svg";
import TruncateTooltip from "../../shared/TruncateTooltip";
import Image from "next/image";
import DeleteUserModal from "./DeleteUserModal";
import UserPreviewModal from "./UserPreviewModal";
import { AdminTableUser } from "@/app/redux/admin-features/userSlice";

type UsersTableProps = {
  filteredUsers: Array<AdminTableUser>;
};

export default function UsersTable({ filteredUsers }: UsersTableProps) {
  const userState = useAppSelector((state) => state.adminUser);
  const dispatch = useAppDispatch();
  const [deleteUserModalData, setDeleteUserModalData] = useState<AdminTableUser | null>(
    null
  );
  const [viewUserModalData, setViewUserModalData] = useState<Pick<
    AdminTableUser,
    "_id"
  > | null>(null);

  const dataSource = filteredUsers.map((user) => {
    return {
      key: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: <TruncateTooltip length={24}>{user.email}</TruncateTooltip>,
      verification: (
        <div className="w-full flex justify-center">
          <RoleTag
            key={user.role}
            role={user.role}
            options={{ pendingObserverVerification: user.pendingObserverVerification }}
          />
        </div>
      ),
      time: moment(user.createdAt).format("DD/MM/YYYY, hh:mm A"),
      state: formatString.normalCase(user.state),
      gender: formatString.normalCase(user.gender),
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
                    setViewUserModalData(user);
                  },
                },
                {
                  label: "Delete Account",
                  key: "2",
                  icon: <Trash size={18} />,
                  danger: true,
                  className: "w-[150px]",
                  onClick: () => {
                    setDeleteUserModalData(user);
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

  const columns: TableColumnsType<(typeof dataSource)[0]> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email > b.email ? 1 : -1),
    },
    {
      title: "Verification",
      dataIndex: "verification",
      key: "verification",
      sorter: (a: any, b: any) => (a.verification.key > b.verification.key ? 1 : -1),
    },
    {
      title: "Registration Date",
      dataIndex: "time",
      key: "time",
      sorter: (a, b) => {
        const timeA = moment(a.time, "DD/MM/YYYY, hh:mm A").valueOf();
        const timeB = moment(b.time, "DD/MM/YYYY, hh:mm A").valueOf();
        return timeA > timeB ? 1 : -1;
      },
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      sorter: (a, b) => (a.state > b.state ? 1 : -1),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      sorter: (a, b) => (a.gender > b.gender ? 1 : -1),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: "80px",
      align: "center",
    },
  ];

  return (
    <React.Fragment>
      <UserPreviewModal
        open={!!viewUserModalData}
        setOpen={setViewUserModalData}
        user={viewUserModalData}
      />
      <DeleteUserModal
        open={!!deleteUserModalData}
        setOpen={setDeleteUserModalData}
        user={deleteUserModalData}
      />
      <Table
        locale={{
          emptyText: (
            <span className="flex justify-center max-w-sm mx-auto">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No users are available."
              />
            </span>
          ),
        }}
        dataSource={dataSource}
        columns={columns}
        rowClassName={"text-gray-500 hover:cursor-pointer"}
        loading={
          userState.status.fetchUsers === "pending" ||
          userState.status.deleteUser === "pending"
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
