"use client";

import {
  AdminPulseReport,
  apiErrorMessage,
  fetchPulseReports,
  PulseReportStatus,
  resolvePulseReport,
} from "@/app/data/adminContentApi";
import { useAppDispatch } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { formatPulseDateTime } from "@/app/utils/pulseUtils";
import { Button, Image, Input, Modal, Segmented, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useCallback, useEffect, useState } from "react";

const REASON_LABELS: Record<string, string> = {
  spam: "Spam",
  harassment: "Harassment",
  hate: "Hate",
  violence: "Violence",
  sexual: "Sexual",
  misinformation: "Misinformation",
  other: "Other",
};

const STATUS_COLORS: Record<string, string> = {
  open: "orange",
  dismissed: "default",
  removed: "red",
};

const PAGE_SIZE = 20;

export default function PulseReportsDisplay() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<PulseReportStatus>("open");
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState<AdminPulseReport[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState<{
    report: AdminPulseReport;
    action: "remove" | "dismiss";
  } | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchPulseReports({ status, page, limit: PAGE_SIZE });
      setReports(result.reports);
      setTotal(result.total);
    } catch (error) {
      dispatch(
        showAlert({ message: apiErrorMessage(error, "Couldn't load reports."), type: "error" })
      );
    } finally {
      setLoading(false);
    }
  }, [status, page, dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitAction() {
    if (!acting) return;
    setSubmitting(true);
    try {
      await resolvePulseReport(acting.report.id, acting.action, note);
      dispatch(
        showAlert({
          message:
            acting.action === "remove"
              ? "Content removed and its reports closed."
              : "Reports on this content dismissed.",
          type: "success",
        })
      );
      setActing(null);
      setNote("");
      load();
    } catch (error) {
      dispatch(
        showAlert({ message: apiErrorMessage(error, "Couldn't update the report."), type: "error" })
      );
    } finally {
      setSubmitting(false);
    }
  }

  const columns: ColumnsType<AdminPulseReport> = [
    {
      title: "Reported content",
      key: "content",
      render: (_, report) => (
        <div className="max-w-[360px]">
          <p className="mb-1 text-xs text-gray-500">
            <span className="capitalize">{report.contentType}</span>
            {report.snapshot.authorName ? ` by ${report.snapshot.authorName}` : ""}
            {!report.contentExists ? (
              <Tag className="ml-2" color="default">
                Deleted
              </Tag>
            ) : null}
          </p>
          <p className="line-clamp-4 whitespace-pre-wrap break-words text-sm text-gray-800">
            {report.snapshot.body || <em className="text-gray-400">No text</em>}
          </p>
          {report.snapshot.imageUrl ? (
            <Image
              src={report.snapshot.imageUrl}
              alt=""
              width={96}
              className="mt-2 rounded-md object-cover"
            />
          ) : null}
        </div>
      ),
    },
    {
      title: "Reason",
      key: "reason",
      render: (_, report) => (
        <div className="max-w-[220px]">
          <Tag color="volcano">{REASON_LABELS[report.reason] ?? report.reason}</Tag>
          {report.details ? (
            <p className="mt-1 text-xs text-gray-600">{report.details}</p>
          ) : null}
          {report.openReportsOnContent > 1 ? (
            <p className="mt-1 text-xs font-semibold text-error-600">
              {report.openReportsOnContent} open reports on this content
            </p>
          ) : null}
        </div>
      ),
    },
    {
      title: "Reported user",
      key: "reportedUser",
      render: (_, report) =>
        report.reportedUser ? (
          <div className="text-sm">
            <p className="font-medium text-gray-800">{report.reportedUser.name}</p>
            <p className="text-xs text-gray-500">{report.reportedUser.email}</p>
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Reporter",
      key: "reporter",
      render: (_, report) =>
        report.reporter ? (
          <div className="text-sm">
            <p className="text-gray-800">{report.reporter.name}</p>
            <p className="text-xs text-gray-500">{report.reporter.email}</p>
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Reported",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value?: string) => (
        <span className="whitespace-nowrap text-xs">{formatPulseDateTime(value) || "—"}</span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, report) => (
        <div>
          <Tag color={STATUS_COLORS[report.status] ?? "default"} className="capitalize">
            {report.status}
          </Tag>
          {report.note ? <p className="mt-1 text-xs text-gray-500">{report.note}</p> : null}
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_, report) =>
        report.status === "open" ? (
          <div className="flex flex-col gap-2">
            <Button
              danger
              size="small"
              disabled={!report.contentExists}
              onClick={() => setActing({ report, action: "remove" })}
            >
              Remove
            </Button>
            <Button size="small" onClick={() => setActing({ report, action: "dismiss" })}>
              Dismiss
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="rounded-lg bg-white p-4 ring-1 ring-gray-200 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Segmented
          value={status}
          onChange={(value) => {
            setStatus(value as PulseReportStatus);
            setPage(1);
          }}
          options={[
            { label: "Open", value: "open" },
            { label: "Removed", value: "removed" },
            { label: "Dismissed", value: "dismissed" },
            { label: "All", value: "all" },
          ]}
        />
        <Button onClick={load} loading={loading}>
          Refresh
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={reports}
        loading={loading}
        scroll={{ x: 1000 }}
        locale={{ emptyText: status === "open" ? "No open reports." : "No reports." }}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          onChange: setPage,
        }}
      />

      <Modal
        open={Boolean(acting)}
        title={acting?.action === "remove" ? "Remove this content?" : "Dismiss these reports?"}
        okText={acting?.action === "remove" ? "Remove content" : "Dismiss"}
        okButtonProps={{ danger: acting?.action === "remove", loading: submitting }}
        onOk={submitAction}
        onCancel={() => {
          setActing(null);
          setNote("");
        }}
        destroyOnClose
      >
        <p className="mb-3 text-sm text-gray-600">
          {acting?.action === "remove"
            ? `This deletes the ${acting.report.contentType} for everyone and closes every open report on it.`
            : "The content stays up and every open report on it is closed."}
        </p>
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Internal note (optional)"
          rows={3}
        />
      </Modal>
    </div>
  );
}
