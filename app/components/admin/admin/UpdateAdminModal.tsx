import { Button, Checkbox, DatePicker, Input, Modal, Radio, Spin, Tooltip } from "antd";
import { CloseSquare, InfoCircle } from "iconsax-react";
import React, { SetStateAction, useEffect } from "react";
import UserProfileCard from "../../shared/UserProfileCard";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { AdminPermissions, UserRole } from "@/app/redux/types";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import {
  AdminCardAdmin,
  clearAdmin,
  getAdminById,
  getAdmins,
  updateAdmin,
} from "@/app/redux/admin-features/adminSlice";

type UpdateAdminModalProps = {
  open: boolean;
  admin: AdminCardAdmin | null;
  setOpen: React.Dispatch<SetStateAction<AdminCardAdmin | null>>;
};

export default function UpdateAdminModal({
  admin,
  open,
  setOpen,
}: UpdateAdminModalProps) {
  const adminState = useAppSelector((state) => state.adminAdmin);

  useEffect(() => {
    if (open && admin) {
      dispatch(getAdminById(admin));
    }
  }, [open]);

  const dispatch = useAppDispatch();
  const loading = !adminState.admin.config;

  const initialFormData = {
    role: "admin" as UserRole,
    permissions: {
      createElection: true,
      updateElection: true,
      deleteElection: true,
      createActiveElection: false,
      updateActiveElection: false,
      deleteActiveElection: false,
      viewUsers: false,
      viewUser: false,
      deleteUser: false,
      approveObserver: false,
      downgradeObserver: false,
      deleteObserver: true,
      getAdmins: false,
      viewResult: false,
      viewResults: false,
      deleteResult: false,
      restoreFlagged: false,
      deleteFlagged: false,
    } as Record<AdminPermissions, boolean>,
  };
  const allPermissions = Object.keys(initialFormData.permissions) as AdminPermissions[];

  const { formData, handleFormInputChange, setFormData } =
    useFormHandler(initialFormData);

  function closeModal() {
    setOpen(null);
    dispatch(clearAdmin());
  }

  function handleUpdateAdmin() {
    if (admin) {
      dispatch(
        updateAdmin({
          adminId: admin._id,
          role: formData.role,
          permissions: formData.permissions,
        })
      );
    }
  }

  useEffect(() => {
    if (adminState.status.updateAdmin === "fulfilled") {
      dispatch(
        showAlert({
          message: "Admin Configuration updated successfully.",
          type: "success",
        })
      );
      dispatch(getAdmins());
      closeModal();
    }
    if (adminState.status.updateAdmin === "rejected") {
      dispatch(
        showAlert({
          message: adminState.error.message || "Something went wrong",
          type: "error",
        })
      );
    }
  }, [adminState.status.updateAdmin]);

  useEffect(() => {
    if (adminState.admin.config) {
      setFormData({
        role: adminState.admin.config.role,
        permissions: adminState.admin.config.permissions,
      });
    }
  }, [adminState.admin.config]);

  function handleCheckPermission(permission: AdminPermissions) {
    return (e: CheckboxChangeEvent) => {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          permissions: {
            ...prevFormData.permissions,
            [permission]: e.target.checked,
          },
        };
      });
    };
  }

  useEffect(() => {
    if (formData.role === "super-admin") {
      const superAdminPermissions = allPermissions.reduce((acc, permission) => {
        return {
          ...acc,
          [permission]: true,
        };
      }, {} as Record<AdminPermissions, boolean>);
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          permissions: superAdminPermissions,
        };
      });
    }
  }, [formData.role]);

  useEffect(() => {
    const allPermissionsChecked = allPermissions.every((permission) => {
      return formData.permissions[permission];
    });
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        role: allPermissionsChecked ? "super-admin" : "admin",
      };
    });
  }, [formData.permissions]);

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      footer={null}
      width={590}
      closeIcon={<CloseSquare size={24} className="text-gray-500" />}
      centered
      classNames={{
        content: "!max-h-[calc(100svh-120px)] overflow-y-scroll relative",
        header: "!text-brand-500",
      }}
    >
      {!loading && admin ? (
        <React.Fragment>
          <UserProfileCard
            user={{
              ...admin,
              pendingObserverVerification: false,
            }}
          />

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 font-league">
              Update Admin Configuration
            </h3>
          </div>

          <form
            id="admin-invite-form"
            action=""
            className="grid grid-cols-2 gap-2 w-full text-gray-700"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="mt col-span-2">
              <h3 className="text-lg font-semibold text-brand-500 font-league">
                Access Control
              </h3>
            </div>

            <div className="grid gap-[6px] col-start-1 col-span-2">
              <label
                htmlFor="admin-access"
                className="text-sm font-medium text-center md:text-left"
              >
                Access Type <span className="text-error-600">*</span>
              </label>
              <Radio.Group
                name="admin-access"
                onChange={handleFormInputChange("role")}
                value={formData.role}
                size="large"
                className="flex justify-between"
              >
                <Radio
                  value={"admin"}
                  disabled={allPermissions.every((p) => formData.permissions[p])}
                  className="font-light flex-1"
                >
                  Admin
                </Radio>
                <Radio value={"super-admin"} className="font-light flex-1">
                  Super Admin
                </Radio>
              </Radio.Group>
            </div>

            <div className="mt-4 col-span-2">
              <h3 className="text-lg font-semibold text-brand-500 font-league">
                Configuration Settings
              </h3>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-center md:text-left mb-1">
                Elections <span className="text-error-600">*</span>
              </h4>
              <ul className="flex flex-col gap-1">
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.createActiveElection}
                    onChange={handleCheckPermission("createActiveElection")}
                  />
                  Create Election
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.updateActiveElection}
                    onChange={handleCheckPermission("updateActiveElection")}
                  />
                  Update Election
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.deleteActiveElection}
                    onChange={handleCheckPermission("deleteActiveElection")}
                  />
                  Delete Election
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-center md:text-left mb-1">
                User Uploads <span className="text-error-600">*</span>
              </h4>
              <ul className="flex flex-col gap-1">
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.viewResults}
                    onChange={handleCheckPermission("viewResults")}
                  />
                  View Uploads
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.viewResult}
                    onChange={handleCheckPermission("viewResult")}
                  />
                  View Upload Details
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.deleteResult}
                    onChange={handleCheckPermission("deleteResult")}
                  />
                  Delete Uploads
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-center md:text-left mb-1">
                User Verification <span className="text-error-600">*</span>
              </h4>
              <ul className="flex flex-col gap-1">
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.approveObserver}
                    onChange={handleCheckPermission("approveObserver")}
                  />
                  Approve Volunteer to Observer
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.downgradeObserver}
                    onChange={handleCheckPermission("downgradeObserver")}
                  />
                  Downgrade Observer to Volunteer
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-center md:text-left mb-1">
                Flagged User Uploads <span className="text-error-600">*</span>
              </h4>
              <ul className="flex flex-col gap-1">
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.restoreFlagged}
                    onChange={handleCheckPermission("restoreFlagged")}
                  />
                  Restore Flagged Upload
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.deleteFlagged}
                    onChange={handleCheckPermission("deleteFlagged")}
                  />
                  Delete Flagged Upload
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-center md:text-left mb-1">
                Users & Admins <span className="text-error-600">*</span>
              </h4>
              <ul className="flex flex-col gap-1">
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.viewUsers}
                    onChange={handleCheckPermission("viewUsers")}
                  />
                  View Users
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.viewUser}
                    onChange={handleCheckPermission("viewUser")}
                  />
                  View User Details
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.deleteUser}
                    onChange={handleCheckPermission("deleteUser")}
                  />
                  Delete User
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.getAdmins}
                    onChange={handleCheckPermission("getAdmins")}
                  />
                  View Admin(s)
                </li>
              </ul>
            </div>

            {/* <div>
              <h4 className="text-sm font-medium text-center md:text-left mb-1">
                Election Types <span className="text-error-600">*</span>
              </h4>
              <ul className="flex flex-col gap-1">
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.createElection}
                    onChange={handleCheckPermission("createElection")}
                  />
                  Create Election Type
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.updateElection}
                    onChange={handleCheckPermission("updateElection")}
                  />
                  Update Election Type
                </li>
                <li className="flex gap-3">
                  <Checkbox
                    checked={formData.permissions.deleteElection}
                    onChange={handleCheckPermission("deleteElection")}
                  />
                  Delete Election Type
                </li>
              </ul>
            </div> */}

            <Button
              type="primary"
              size="large"
              className="group/signup-stage-two-submit font-medium flex gap-[1ch] items-center justify-center col-span-2 mb-3"
              onClick={handleUpdateAdmin}
              loading={adminState.status.updateAdmin === "pending"}
            >
              <span>Update Configuration</span>
            </Button>
          </form>
        </React.Fragment>
      ) : (
        <div className="flex items-center justify-center h-96">
          <Spin />
        </div>
      )}
    </Modal>
  );
}
