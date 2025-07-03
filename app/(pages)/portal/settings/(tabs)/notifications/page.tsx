"use client";
import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { clearUserStatus, updateAccount } from "@/app/redux/features/userSlice";
import { User } from "@/app/redux/types";
import { Button, Checkbox, notification } from "antd";
import React, { useEffect, useMemo } from "react";

function Notifications() {
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const dispatch = useAppDispatch();

  const { formData, setFormData } = useFormHandler({
    inboxNotifications: userDetails.notifications.email.inbox,
    electionNotifications: userDetails.notifications.email.election,
    newsletterNotifications: userDetails.notifications.email.newsletter,
  });

  const isChangesMade = useMemo(() => {
    const existingUserNotifications = {
      inboxNotifications: userDetails.notifications.email.inbox,
      electionNotifications: userDetails.notifications.email.election,
      newsletterNotifications: userDetails.notifications.email.newsletter,
    };

    return (
      JSON.stringify(existingUserNotifications) !== JSON.stringify(formData)
    );
  }, [formData]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isChangesMade) {
      dispatch(
        showAlert({
          message: "No changes made to notification settings.",
          type: "warning",
        })
      );
      return;
    }

    const updatedNotifications: Partial<User> = {
      notifications: {
        email: {
          inbox: formData.inboxNotifications,
          election: formData.electionNotifications,
          newsletter: formData.newsletterNotifications,
        },
      },
    };

    // Dispatch action to update user account with new notification settings
    dispatch(updateAccount(updatedNotifications));
  }

  useEffect(() => {
    if (userState.status.updateAccount === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message!,
          type: "error",
        })
      );
    }

    if (userState.status.updateAccount === "fulfilled") {
      dispatch(
        showAlert({
          message: "Notification settings updated successfully.",
          type: "success",
        })
      );
      dispatch(clearUserStatus(["updateAccount"]));
    }
  }, [userState.status.updateAccount]);

  return (
    <React.Fragment>
      <SettingsHeader>Notifications</SettingsHeader>
      <div
        id="settings-coverage-details"
        className="py-6 bg-white md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[736px] mx-auto"
      >
        <h3 className="font-league text-xl md:text-display-xs lg:text-display-sm text-brand-500 text-center font-semibold mb-1 leading-tight">
          Notification Preferences
        </h3>
        <p className="text-gray-500 text-sm text-center mb-8 max-w-screen-xs mx-auto">
          Manage your notification preferences to stay updated on important
          events and activities.
        </p>

        <div className="flex justify-between items-center">
          <span className="text-brand-500 font-medium text-sm mb-3">
            Email Notifications
          </span>
        </div>
        <form
          className="grid grid-cols-2 gap-4"
          action=""
          onSubmit={handleSubmit}
        >
          <div className="grid gap-[6px] col-span-2 md:col-span-1 place-content-center md:place-content-start">
            <label
              htmlFor="notification-inbox"
              className="text-sm font-medium w-[220px]"
            >
              Inbox <span className="text-error-600">*</span>
            </label>
            <Checkbox
              id="notification-inbox"
              checked={formData.inboxNotifications}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  inboxNotifications: e.target.checked,
                }));
              }}
            >
              <span className="text-gray-500">Receive Inbox Messages</span>
            </Checkbox>
          </div>
          <div className="grid gap-[6px] col-span-2 md:col-span-1 place-content-center md:place-content-start">
            <label
              htmlFor="notification-elections"
              className="text-sm font-medium w-[220px]"
            >
              Elections <span className="text-error-600">*</span>
            </label>
            <Checkbox
              id="notification-elections"
              checked={formData.electionNotifications}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  electionNotifications: e.target.checked,
                }));
              }}
            >
              <span className="text-gray-500">
                Receive Live Election Updates
              </span>
            </Checkbox>
          </div>
          <div className="grid gap-[6px] col-span-2 md:col-span-1 place-content-center md:place-content-start">
            <label
              htmlFor="notification-newsletter"
              className="text-sm font-medium w-[220px]"
            >
              Newsletter <span className="text-error-600">*</span>
            </label>
            <Checkbox
              id="notification-newsletter"
              checked={formData.newsletterNotifications}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  newsletterNotifications: e.target.checked,
                }));
              }}
            >
              <span className="text-gray-500">Receive Weekly Newsletters</span>
            </Checkbox>
          </div>

          <Button
            type="primary"
            size="large"
            className="group/coverage-update-stage-three-submit font-medium flex gap-[1ch] items-center justify-center col-span-2 mt-6"
            htmlType="submit"
            loading={userState.status.updateAccount === "pending"}
          >
            Update
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
}

export default Notifications;
