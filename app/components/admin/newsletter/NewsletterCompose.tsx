"use client";

import { ArticlePreview } from "@/app/components/admin/news-insights/NewsInsightsAdmin";
import {
  apiErrorMessage,
  NewsletterPreview,
  NewsletterRecipient,
  previewNewsletter,
  sendNewsletter,
  SendNewsletterResult,
} from "@/app/data/adminContentApi";
import { newsInsightHref } from "@/app/data/newsInsightsApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  Alert,
  Button,
  DatePicker,
  Input,
  Modal,
  Result,
  Select,
  Spin,
  Steps,
  Switch,
  Tabs,
} from "antd";
import { Dayjs } from "dayjs";
import Link from "next/link";
import React, { useState } from "react";

const PASTE_EXAMPLE = `Subject: Can INEC Conduct Credible Elections in 2027?
Dear Citizen Monitors,
Every election comes with promises of change...

Warm regards,
Citizen Monitors.`;

const RECIPIENT_OPTIONS: Array<{ value: NewsletterRecipient; label: string }> = [
  { value: "all", label: "Everyone" },
  { value: "observer", label: "Observers" },
  { value: "volunteer", label: "Volunteers" },
  { value: "public-viewer", label: "Public viewers" },
  { value: "admin", label: "Admins" },
  { value: "super-admin", label: "Super admins" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterCompose() {
  const dispatch = useAppDispatch();
  const adminEmail = useAppSelector((state) => state.user.details?.email);
  const [step, setStep] = useState(0);
  const [paste, setPaste] = useState("");
  const [preview, setPreview] = useState<NewsletterPreview | null>(null);
  const [previewedPaste, setPreviewedPaste] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Test send
  const [testEmails, setTestEmails] = useState<string[]>(adminEmail ? [adminEmail] : []);
  const [testPublish, setTestPublish] = useState(false);

  // Live send
  const [recipients, setRecipients] = useState<NewsletterRecipient[]>(["all"]);
  const [sendEmail, setSendEmail] = useState(true);
  const [livePublish, setLivePublish] = useState(true);
  const [schedule, setSchedule] = useState(false);
  const [scheduleAt, setScheduleAt] = useState<Dayjs | null>(null);

  const [sending, setSending] = useState<"test" | "live" | null>(null);
  const [result, setResult] = useState<(SendNewsletterResult & { isTest: boolean }) | null>(null);

  const hasSubject = /^\s*subject:/i.test(paste);
  const draft = { paste };

  async function handlePreview() {
    if (!paste.trim()) return;
    setLoadingPreview(true);
    try {
      const data = await previewNewsletter(draft);
      setPreview(data);
      setPreviewedPaste(paste);
      setStep(1);
    } catch (error) {
      dispatch(
        showAlert({ message: apiErrorMessage(error, "Couldn't build the preview."), type: "error" })
      );
    } finally {
      setLoadingPreview(false);
    }
  }

  async function runSend(kind: "test" | "live") {
    setSending(kind);
    try {
      const data = await sendNewsletter(
        draft,
        kind === "test"
          ? { isTest: true, testEmails, publishAsNewsInsight: testPublish }
          : {
              isTest: false,
              recipients: recipients.includes("all") ? "all" : recipients,
              sendEmail,
              publishAsNewsInsight: livePublish,
              ...(schedule && scheduleAt
                ? { scheduleTime: scheduleAt.format("YYYY-MM-DDTHH:mm") }
                : {}),
            }
      );
      if (kind === "test") {
        dispatch(showAlert({ message: data.message || "Test sent.", type: "success" }));
        if (testPublish) setResult({ ...data, isTest: true });
      } else {
        setResult({ ...data, isTest: false });
      }
    } catch (error) {
      dispatch(
        showAlert({ message: apiErrorMessage(error, "Couldn't send the newsletter."), type: "error" })
      );
    } finally {
      setSending(null);
    }
  }

  function confirmLive() {
    const who = recipients.includes("all")
      ? "everyone with email newsletters turned on"
      : RECIPIENT_OPTIONS.filter((o) => recipients.includes(o.value))
          .map((o) => o.label.toLowerCase())
          .join(", ");
    const actions = [
      sendEmail ? `email ${who}` : null,
      livePublish ? "publish a public News & Insight article" : null,
      "post to the app inbox",
    ].filter(Boolean);
    Modal.confirm({
      title: schedule ? "Schedule this newsletter?" : "Send this newsletter now?",
      content: (
        <div className="grid gap-2 text-sm">
          <p>
            <strong>{preview?.newsletter.subject}</strong>
          </p>
          <p>
            This will {actions.join(", ")}
            {schedule && scheduleAt ? ` on ${scheduleAt.format("D MMM YYYY, h:mm a")} (Lagos time)` : ""}.
          </p>
          <p className="font-semibold text-error-600">It can&apos;t be undone.</p>
        </div>
      ),
      okText: schedule ? "Schedule" : "Send now",
      okButtonProps: { danger: true },
      onOk: () => {
        runSend("live");
      },
    });
  }

  function startOver() {
    setStep(0);
    setPaste("");
    setPreview(null);
    setPreviewedPaste("");
    setResult(null);
    setSchedule(false);
    setScheduleAt(null);
  }

  const testEmailsValid = testEmails.length > 0 && testEmails.every((e) => EMAIL_PATTERN.test(e));
  const liveValid =
    (sendEmail ? recipients.length > 0 : livePublish) &&
    (!schedule || (scheduleAt && scheduleAt.isAfter(new Date())));

  if (result && !result.isTest) {
    return (
      <div className="rounded-lg bg-white p-6 ring-1 ring-gray-200">
        <Result
          status="success"
          title={result.message}
          subTitle={
            <div className="grid gap-1">
              {result.scheduleTime ? <span>Scheduled for {result.scheduleTime}</span> : null}
              {result.totalRecipients != null ? (
                <span>{result.totalRecipients.toLocaleString()} recipients</span>
              ) : null}
              {result.newsInsightPublished && result.newsInsightSlug ? (
                <Link href={newsInsightHref(result.newsInsightSlug)} target="_blank" className="text-brand-600">
                  View the published article
                </Link>
              ) : null}
            </div>
          }
          extra={<Button onClick={startOver}>Write another</Button>}
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 ring-1 ring-gray-200 md:p-6">
      <Steps
        current={step}
        className="mb-6"
        onChange={(next) => {
          if (next < step) setStep(next);
        }}
        items={[{ title: "Paste draft" }, { title: "Preview" }, { title: "Send" }]}
      />

      {step === 0 ? (
        <div className="grid gap-4">
          <p className="text-sm text-gray-600">
            Paste the whole draft. Put the subject on the first line as{" "}
            <code className="rounded bg-gray-100 px-1">Subject: …</code>. The sign-off is
            removed automatically; the email footer adds it back.
          </p>
          <Input.TextArea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder={PASTE_EXAMPLE}
            autoSize={{ minRows: 14, maxRows: 30 }}
          />
          {paste.trim() && !hasSubject ? (
            <Alert type="warning" showIcon message="The first line should start with “Subject:”. Without it the preview will fail." />
          ) : null}
          <div className="flex justify-end">
            <Button type="primary" size="large" disabled={!paste.trim()} loading={loadingPreview} onClick={handlePreview}>
              Preview
            </Button>
          </div>
        </div>
      ) : null}

      {step === 1 && preview ? (
        <div className="grid gap-4">
          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email · {preview.newsletter.subject}
              </p>
              {/* Empty sandbox: no scripts, forms or navigation from the email HTML */}
              <iframe
                title="Email preview"
                sandbox=""
                srcDoc={preview.newsletter.html}
                className="h-[70vh] w-full rounded-lg border border-gray-200 bg-white"
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                News &amp; Insight article
              </p>
              <ArticlePreview
                title={preview.newsInsight.title}
                excerpt={preview.newsInsight.excerpt}
                content={preview.newsInsight.content}
                imageUrl={preview.newsInsight.heroImageUrl || preview.newsInsight.thumbnailUrl}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button onClick={() => setStep(0)}>Edit draft</Button>
            <Button type="primary" size="large" onClick={() => setStep(2)}>
              Continue to send
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 && preview ? (
        <Spin
          spinning={sending === "live"}
          tip="Sending… large lists can take a few minutes. Keep this page open."
        >
          {previewedPaste !== paste ? (
            <Alert className="mb-4" type="warning" showIcon message="The draft changed after the preview. Preview it again before sending." />
          ) : null}
          <Tabs
            items={[
              {
                key: "test",
                label: "Send a test",
                children: (
                  <div className="grid max-w-xl gap-4">
                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Test recipients</label>
                      <Select
                        mode="tags"
                        value={testEmails}
                        onChange={(values) => setTestEmails(values.map((v) => v.trim()).filter(Boolean))}
                        tokenSeparators={[",", " "]}
                        placeholder="you@example.com"
                        open={false}
                        status={testEmails.length && !testEmailsValid ? "error" : undefined}
                      />
                      <p className="text-xs text-gray-500">Only these addresses get the email. No app notifications are sent.</p>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Also publish as a News &amp; Insight article</p>
                        <p className="text-xs text-gray-500">Leave off for tests.</p>
                      </div>
                      <Switch checked={testPublish} onChange={setTestPublish} />
                    </div>
                    {testPublish ? (
                      <Alert type="warning" showIcon message="This publishes a real, public article even though it's a test." />
                    ) : null}
                    <div>
                      <Button
                        type="primary"
                        disabled={!testEmailsValid || previewedPaste !== paste}
                        loading={sending === "test"}
                        onClick={() => runSend("test")}
                      >
                        Send test
                      </Button>
                    </div>
                  </div>
                ),
              },
              {
                key: "live",
                label: "Send live",
                children: (
                  <div className="grid max-w-xl gap-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Send email</p>
                        <p className="text-xs text-gray-500">Turn off to only publish the article.</p>
                      </div>
                      <Switch checked={sendEmail} onChange={setSendEmail} />
                    </div>
                    {sendEmail ? (
                      <div className="grid gap-1">
                        <label className="text-sm font-medium text-gray-700">Recipients</label>
                        <Select
                          mode="multiple"
                          value={recipients}
                          options={RECIPIENT_OPTIONS}
                          onChange={(values: NewsletterRecipient[]) => {
                            // "Everyone" replaces specific roles, and vice versa
                            const added = values.find((v) => !recipients.includes(v));
                            setRecipients(
                              added === "all" ? ["all"] : values.filter((v) => v !== "all")
                            );
                          }}
                        />
                        <p className="text-xs text-gray-500">
                          Only users with email newsletters turned on are emailed.
                        </p>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Publish as a News &amp; Insight article</p>
                        <p className="text-xs text-gray-500">Appears on the website and app.</p>
                      </div>
                      <Switch checked={livePublish} onChange={setLivePublish} />
                    </div>
                    <div className="grid gap-2 rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Schedule for later</p>
                          <p className="text-xs text-gray-500">Times are Lagos time (WAT).</p>
                        </div>
                        <Switch checked={schedule} onChange={setSchedule} />
                      </div>
                      {schedule ? (
                        <>
                          <DatePicker
                            showTime={{ format: "HH:mm" }}
                            format="D MMM YYYY, HH:mm"
                            value={scheduleAt}
                            onChange={setScheduleAt}
                            disabledDate={(d) => d.isBefore(new Date(), "day")}
                          />
                          <p className="text-xs text-warning-600">
                            Scheduled sends are kept in server memory. A server restart before the
                            time cancels them.
                          </p>
                        </>
                      ) : null}
                    </div>
                    <div>
                      <Button
                        type="primary"
                        danger
                        size="large"
                        disabled={!liveValid || previewedPaste !== paste}
                        loading={sending === "live"}
                        onClick={confirmLive}
                      >
                        {schedule ? "Schedule newsletter" : "Send newsletter"}
                      </Button>
                    </div>
                  </div>
                ),
              },
            ]}
          />
          <div className="mt-6">
            <Button onClick={() => setStep(1)}>Back to preview</Button>
          </div>
        </Spin>
      ) : null}

      {result?.isTest && result.newsInsightSlug ? (
        <Alert
          className="mt-4"
          type="info"
          showIcon
          message={
            <span>
              The test also published an article:{" "}
              <Link href={newsInsightHref(result.newsInsightSlug)} target="_blank" className="text-brand-600">
                view it
              </Link>
              .
            </span>
          }
        />
      ) : null}
    </div>
  );
}
