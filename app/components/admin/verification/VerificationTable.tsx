import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { User } from "@/app/redux/types";
import React, { useEffect, useState } from "react";
import RoleTag from "../../shared/RoleTag";
import moment from "moment";
import formatString from "@/app/utils/formatString";
import { ArrowLeft, ArrowRight, Eye, Trash } from "iconsax-react";
import { Button, Dropdown, Empty, Table, TableColumnsType, Tooltip } from "antd";
import DotsVertical from "@/public/assets/dots-vertical.svg";
import TruncateTooltip from "../../shared/TruncateTooltip";
import Image from "next/image";
import { AdminTableUser, clearUser } from "@/app/redux/admin-features/userSlice";
import UserPreviewModal from "../users/UserPreviewModal";
import DeleteUserModal from "../users/DeleteUserModal";
import { getVerifiedUsers } from "@/app/redux/admin-features/verificationSlice";
import ApproveUserModal from "./ApproveUserModal";
import DowngradeUserModal from "./DowngradeUserModal";

type UsersTableProps = {
  filteredUsers: Array<AdminTableUser>;
};

export default function VerificationTable({ filteredUsers }: UsersTableProps) {
  const userState = useAppSelector((state) => state.adminUser);
  const verificationState = useAppSelector((state) => state.adminVerification);
  const dispatch = useAppDispatch();
  const [viewUserModalData, setViewUserModalData] = useState<any>(null);
  const [deleteUserModalData, setDeleteUserModalData] = useState<AdminTableUser | null>(
    null
  );
  const [approveUserModalData, setApproveUserModalData] = useState<AdminTableUser | null>(
    null
  );
  const [downgradeUserModalData, setDowngradeUserModalData] =
    useState<AdminTableUser | null>(null);

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
      time: moment(user.createdAt).format("DD/MM/YYYY, hh:mmA"),
      state: formatString.normalCase(user.state),
      gender: formatString.normalCase(user.gender),
      actions: (
        <div>
          <Tooltip title="View Profile" mouseEnterDelay={0.5}>
            <Button
              type="text"
              className="px-1"
              onClick={() => {
                setViewUserModalData(user);
              }}
            >
              <Eye size={18} className="text-gray-500" variant="Bold" />
            </Button>
          </Tooltip>
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
			defaultSortOrder: "descend",
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

  useEffect(() => {
    if (userState.status.deleteUser === "fulfilled") {
      dispatch(getVerifiedUsers());
    }
  }, [userState.status.deleteUser]);

  return (
    <React.Fragment>
      <DowngradeUserModal
        open={!!downgradeUserModalData}
        setOpen={setDowngradeUserModalData}
        user={downgradeUserModalData}
      />
      <ApproveUserModal
        open={!!approveUserModalData}
        setOpen={setApproveUserModalData}
        user={approveUserModalData}
      />
      <DeleteUserModal
        open={!!deleteUserModalData}
        setOpen={setDeleteUserModalData}
        user={deleteUserModalData}
      />
      <UserPreviewModal
        open={!!viewUserModalData}
        setOpen={setViewUserModalData}
        user={viewUserModalData}
        footer={
          <React.Fragment>
            {viewUserModalData?.pendingObserverVerification ? (
              <Button
                key={"confirm"}
                type="primary"
                className="text-sm"
                size="large"
                onClick={() => {
                  setApproveUserModalData(viewUserModalData);
                  setViewUserModalData(null);
                  dispatch(clearUser());
                }}
              >
                Verify Profile
              </Button>
            ) : (
              <Button
                key={"confirm"}
                type="primary"
                className="text-sm"
                size="large"
                onClick={() => {
                  setDowngradeUserModalData(viewUserModalData);
                  setViewUserModalData(null);
                  dispatch(clearUser());
                }}
              >
                Downgrade Account
              </Button>
            )}
            <Button
              key={"confirm"}
              type="text"
              className="ring-1 ring-error-500 !text-error-500 bg-error-50 hover:!bg-error-500 hover:!text-white text-sm transition-all"
              size="large"
              onClick={() => {
                setDeleteUserModalData(viewUserModalData);
                setViewUserModalData(null);
                dispatch(clearUser());
              }}
            >
              Delete Account
            </Button>
          </React.Fragment>
        }
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
          verificationState.status.fetchUsers === "pending" ||
          userState.status.fetchUser === "pending"
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
