"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { createPodcast } from "@/app/redux/admin-features/outboxSlice";
import { showAlert } from "@/app/redux/features/alertSlice";
import { Button, Input, Select } from "antd";
import React, { useEffect } from "react";

const { TextArea } = Input;

type BroadcastFormData = {
  recipients: string[];
  title: string;
  content: string;
};

export default function NewBroadcastForm() {
  const dispatch = useAppDispatch();
  const outboxState = useAppSelector((state) => state.adminOutbox);

  const initialFormState: BroadcastFormData = {
    recipients: [],
    title: "",
    content: "",
  };

  const { formData, handleFormInputChange } = useFormHandler<BroadcastFormData>(initialFormState);

  const recipientOptions = [
    { label: "All Users", value: "all" },
    { label: "Observers", value: "observer" },
    { label: "Volunteers", value: "volunteer" },
    { label: "Admins", value: "admin" },
    { label: "Super Admins", value: "super-admin" },
  ];

  const handleRecipientChange = (values: string[]) => {
    const lastSelected = values[values.length - 1];
    
    if (lastSelected === "all") {
      // If "All Users" was selected, only keep "all"
      handleFormInputChange("recipients", "static")(["all"]);
    } else if (values.includes("all")) {
      // If another option was selected and "all" was previously selected,
      // remove "all" and keep only the new selection
      const filteredValues = values.filter(v => v !== "all");
      handleFormInputChange("recipients", "static")(filteredValues);
    } else {
      // Normal case: just update with the selected values
      handleFormInputChange("recipients", "static")(values);
    }
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.recipients.length) {
      dispatch(
        showAlert({
          type: "error",
          message: "Please select at least one recipient group.",
        })
      );
      return;
    }

    if (!formData.title.trim()) {
      dispatch(
        showAlert({
          type: "error",
          message: "Title cannot be empty.",
        })
      );
      return;
    }

    if (!formData.content.trim()) {
      dispatch(
        showAlert({
          type: "error",
          message: "Content cannot be empty.",
        })
      );
      return;
    }

    dispatch(createPodcast(formData));
  }

  useEffect(() => {
    const status = outboxState.status.createPodcast;

    if (status === "rejected") {
      dispatch(
        showAlert({
          message: outboxState.error.message || "Failed to send broadcast message.",
          type: "error",
        })
      );
    }

    if (status === "fulfilled") {
      dispatch(
        showAlert({
          message: "Broadcast message sent successfully.",
          type: "success",
        })
      );
    }
  }, [outboxState.status.createPodcast]);

  return (
    <form
      className="grid gap-7 w-full mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-[6px]">
        <label htmlFor="broadcast-recipients" className="text-sm font-medium text-gray-700">
          Choose recipient(s) <span className="text-error-500">*</span>
        </label>
        <Select
          id="broadcast-recipients"
          mode="multiple"
          placeholder="Select recipient groups"
          options={recipientOptions}
          className="w-full"
          value={formData.recipients}
          onChange={handleRecipientChange}
          size="large"
          maxTagCount="responsive"
        />
      </div>

      <div className="grid gap-[6px]">
        <label htmlFor="broadcast-title" className="text-sm font-medium text-gray-700">
          Title <span className="text-error-500">*</span>
        </label>
        <Input
          id="broadcast-title"
          placeholder="Enter broadcast title"
          size="large"
          value={formData.title}
          onChange={handleFormInputChange("title")}
        />
      </div>

      <div className="grid gap-[6px]">
        <label htmlFor="broadcast-content" className="text-sm font-medium text-gray-700">
          Content <span className="text-error-500">*</span>
        </label>
        <TextArea
          id="broadcast-content"
          placeholder="Enter broadcast content"
          className="resize-none"
          size="large"
          rows={8}
          value={formData.content}
          onChange={handleFormInputChange("content")}
        />
      </div>

      <div className="flex flex-col gap-2 justify-end">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="w-full md:w-auto px-8"
          loading={outboxState.status.createPodcast === "pending"}
        >
          Send Message
        </Button>
      </div>
    </form>
  );
}