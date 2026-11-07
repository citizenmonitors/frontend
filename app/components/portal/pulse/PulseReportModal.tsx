"use client";

import { PulseReportReason } from "@/app/redux/types";
import { Button, Input, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";

const REASONS: Array<{ value: PulseReportReason; label: string }> = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate", label: "Hate speech" },
  { value: "violence", label: "Violence or threats" },
  { value: "sexual", label: "Sexual content" },
  { value: "misinformation", label: "False or misleading information" },
  { value: "other", label: "Something else" },
];

type PulseReportModalProps = {
  open: boolean;
  /** "post" or "comment", used in the copy */
  kind: "post" | "comment";
  onClose: () => void;
  onSubmit: (reason: PulseReportReason, details?: string) => Promise<void>;
};

export default function PulseReportModal({
  open,
  kind,
  onClose,
  onSubmit,
}: PulseReportModalProps) {
  const [reason, setReason] = useState<PulseReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setReason(null);
      setDetails("");
      setSubmitting(false);
    }
  }, [open]);

  async function handleSubmit() {
    if (!reason) return;
    setSubmitting(true);
    try {
      await onSubmit(reason, details);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={460}
      centered
      destroyOnClose
      title={<span className="font-league text-lg">Report {kind}</span>}
    >
      <div className="grid gap-4">
        <p className="text-sm text-gray-500">
          Why are you reporting this {kind}? It will be hidden for you, and our team
          will review it.
        </p>
        <Radio.Group
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="!grid gap-2"
        >
          {REASONS.map((item) => (
            <Radio key={item.value} value={item.value}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
        <Input.TextArea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add details (optional)"
          rows={3}
          maxLength={1000}
        />
        <Button
          type="primary"
          danger
          size="large"
          block
          disabled={!reason}
          loading={submitting}
          onClick={handleSubmit}
        >
          Submit report
        </Button>
      </div>
    </Modal>
  );
}
