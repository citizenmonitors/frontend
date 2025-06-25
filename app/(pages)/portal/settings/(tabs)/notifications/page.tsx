"use client";
import SettingsHeader from '@/app/components/portal/settings/SettingsHeader';
import { useAppDispatch } from '@/app/hooks/redux';
import useFormHandler from '@/app/hooks/useFormHandler';
import { showAlert } from '@/app/redux/features/alertSlice';
import { Button, Checkbox } from 'antd';
import React, { useMemo } from 'react'

function Notifications() {
  const dispatch = useAppDispatch();
  const dummyUserNotifications = {
    emailNotifications: false,
    inboxNotifications: false,
    electionNotifications: false,
    newsletterNotifications: false,
  };

  const { formData, setFormData } = useFormHandler({
    emailNotifications: dummyUserNotifications.emailNotifications,
    inboxNotifications: dummyUserNotifications.inboxNotifications,
    electionNotifications: dummyUserNotifications.electionNotifications,
    newsletterNotifications: dummyUserNotifications.newsletterNotifications,
  });

  const isChangesMade = useMemo(() => {
    const currentNotiSettings = {
      emailNotifications: dummyUserNotifications.emailNotifications,
      inboxNotifications: dummyUserNotifications.inboxNotifications,
      electionNotifications: dummyUserNotifications.electionNotifications,
      newsletterNotifications: dummyUserNotifications.newsletterNotifications,
    };

    return JSON.stringify(currentNotiSettings) !== JSON.stringify(formData);
  }, [formData, dummyUserNotifications]);

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

    // Dispatch action to update notification settings
    // dispatch(updateNotificationSettings(formData));
  }


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
          Manage your notification preferences to stay updated on important events and activities.
        </p>
        <form className="grid grid-cols-2 gap-4" action="" onSubmit={handleSubmit}>
          <div className="grid gap-[6px] col-span-2 md:col-span-1 place-content-center">
            <label
              htmlFor="notification-emails"
              className="text-sm font-medium w-[220px]"
            >
              Emails{" "}
              <span className="text-error-600">*</span>
            </label>
            <Checkbox
              id="notification-emails"
              checked={formData.emailNotifications}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  emailNotifications: e.target.checked,
                }));
              }}
            >
              <span className="text-gray-500">
                Receive Email Notifications</span>
            </Checkbox>
          </div>
          <div className="grid gap-[6px] col-span-2 md:col-span-1 place-content-center">
            <label
              htmlFor="notification-inbox"
              className="text-sm font-medium w-[220px]"
            >
              Inbox{" "}
              <span className="text-error-600">*</span>
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
              <span className="text-gray-500">
                Receive Inbox Messages</span>
            </Checkbox>
          </div>
          <div className="grid gap-[6px] col-span-2 md:col-span-1 place-content-center">
            <label
              htmlFor="notification-elections"
              className="text-sm font-medium w-[220px]"
            >
              Elections{" "}
              <span className="text-error-600">*</span>
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
                Receive Election Notifications</span>
            </Checkbox>
          </div>
          <div className="grid gap-[6px] col-span-2 md:col-span-1 place-content-center">
            <label
              htmlFor="notification-newsletter"
              className="text-sm font-medium w-[220px]"
            >
              Newsletter{" "}
              <span className="text-error-600">*</span>
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
              <span className="text-gray-500">
                Receive Weekly Newsletters</span>
            </Checkbox>
          </div>

          <Button
            type="primary"
            size="large"
            className="group/coverage-update-stage-three-submit font-medium flex gap-[1ch] items-center justify-center col-span-2 mt-6"
            htmlType="submit"
          >
            Update
          </Button>
        </form>
      </div>
    </React.Fragment>
  )
}

export default Notifications;