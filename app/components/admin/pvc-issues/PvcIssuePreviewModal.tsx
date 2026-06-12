"use client";

import { getPvcIssueLabel } from "@/app/data/pvcIssues";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import {
  clearPvcIssueReport,
  getPvcIssueReport,
} from "@/app/redux/admin-features/pvcIssuesSlice";
import { showAlert } from "@/app/redux/features/alertSlice";
import formatString from "@/app/utils/formatString";
import { Button, Modal, Spin } from "antd";
import { CloseSquare } from "iconsax-react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect } from "react";

type PvcIssuePreviewModalProps = {
  open: boolean;
  onClose: () => void;
  reportId: string | null;
};

export default function PvcIssuePreviewModal({
  open,
  onClose,
  reportId,
}: PvcIssuePreviewModalProps) {
  const dispatch = useAppDispatch();
  const pvcIssuesState = useAppSelector((state) => state.adminPvcIssues);
  const reportDetails = pvcIssuesState.report;

  function closeModal() {
    dispatch(clearPvcIssueReport());
    onClose();
  }

  useEffect(() => {
    if (reportId) {
      dispatch(getPvcIssueReport(reportId));
    }
  }, [reportId]);

  useEffect(() => {
    if (pvcIssuesState.status.fetchReport === "rejected") {
      dispatch(
        showAlert({
          message: pvcIssuesState.error.message || "Failed to load report details.",
          type: "error",
        })
      );
      closeModal();
    }
  }, [pvcIssuesState.status.fetchReport]);

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      footer={null}
      width={720}
      closeIcon={<CloseSquare size={24} className="text-gray-500" />}
      title={
        <span className="font-league text-lg font-semibold text-gray-800">
          PVC Issue Report
        </span>
      }
    >
      {pvcIssuesState.status.fetchReport === "pending" || !reportDetails ? (
        <div className="grid min-h-[240px] place-items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid gap-5 text-sm text-gray-700">
          <div className="grid gap-4 md:grid-cols-2">
            <DetailItem label="Full Name" value={reportDetails.fullName} />
            <DetailItem label="Phone Number" value={reportDetails.phoneNumber} />
            <DetailItem label="Email" value={reportDetails.email || "—"} />
            <DetailItem
              label="Submitted On"
              value={moment(reportDetails.createdAt).format("DD MMM YYYY, hh:mm A")}
            />
            <DetailItem
              label="State"
              value={formatString.normalCase(reportDetails.state)}
            />
            <DetailItem
              label="LGA"
              value={formatString.normalCase(reportDetails.lga)}
            />
            <DetailItem label="Polling Unit" value={reportDetails.pollingUnit} />
            <DetailItem
              label="Issue Type"
              value={getPvcIssueLabel(reportDetails.issueType)}
            />
          </div>

          {reportDetails.otherIssueDetail && (
            <DetailItem
              label="Other Issue Description"
              value={reportDetails.otherIssueDetail}
            />
          )}

          <DetailItem
            label="Description"
            value={reportDetails.description}
            multiline
          />

          <div className="grid gap-2">
            <p className="font-medium text-gray-800">Evidence</p>
            {reportDetails.evidence?.length ? (
              <ul className="grid gap-2">
                {reportDetails.evidence.map((file) => (
                  <li key={file.url}>
                    <Link
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline break-all"
                    >
                      {file.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No evidence uploaded.</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="primary" onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function DetailItem({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="grid gap-1">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      {multiline ? (
        <p className="whitespace-pre-wrap leading-relaxed">{value}</p>
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
}