"use client";

import {
  apiErrorMessage,
  createNewsInsight,
  fetchAdminNewsInsights,
} from "@/app/data/adminContentApi";
import { NewsInsightArticle, newsInsightHref } from "@/app/data/newsInsightsApi";
import { useAppDispatch } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { sanitizeHtml } from "@/app/utils/sanitizeHtml";
import {
  Button,
  DatePicker,
  Drawer,
  Image,
  Input,
  Modal,
  Radio,
  Switch,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { Add } from "iconsax-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 30;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

type ImageSource = "file" | "url";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  slug: "",
  publishedAt: null as Dayjs | null,
  isPublished: true,
  notifySubscribers: true,
  thumbnailSource: "url" as ImageSource,
  thumbnailFile: null as File | null,
  thumbnailUrl: "",
  heroSource: "url" as ImageSource,
  heroFile: null as File | null,
  heroUrl: "",
};

function formatDate(value?: string) {
  return value ? dayjs(value).format("D MMM YYYY, h:mm a") : "—";
}

export default function NewsInsightsAdmin() {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<NewsInsightArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  // Notify defaults to the publish switch until the admin changes it
  const [notifyTouched, setNotifyTouched] = useState(false);
  const [preview, setPreview] = useState<NewsInsightArticle | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAdminNewsInsights(page, PAGE_SIZE);
      setItems(result.items);
      setTotal(result.total);
    } catch (error) {
      dispatch(
        showAlert({ message: apiErrorMessage(error, "Couldn't load articles."), type: "error" })
      );
    } finally {
      setLoading(false);
    }
  }, [page, dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function pickFile(file: File | undefined, key: "thumbnailFile" | "heroFile") {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      dispatch(showAlert({ message: "Please choose an image file.", type: "error" }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      dispatch(showAlert({ message: "Images must be 15 MB or smaller.", type: "error" }));
      return;
    }
    update(key, file);
  }

  const hasThumbnail =
    form.thumbnailSource === "file" ? Boolean(form.thumbnailFile) : /^https:\/\//.test(form.thumbnailUrl.trim());
  const canSave = form.title.trim() && form.content.trim() && hasThumbnail;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const article = await createNewsInsight({
        title: form.title,
        content: form.content,
        excerpt: form.excerpt,
        slug: form.slug,
        publishedAt: form.publishedAt ? form.publishedAt.toISOString() : undefined,
        isPublished: form.isPublished,
        notifySubscribers: form.notifySubscribers,
        thumbnailFile: form.thumbnailSource === "file" ? form.thumbnailFile : null,
        thumbnailUrl: form.thumbnailSource === "url" ? form.thumbnailUrl : undefined,
        heroImageFile: form.heroSource === "file" ? form.heroFile : null,
        heroImageUrl: form.heroSource === "url" && form.heroUrl.trim() ? form.heroUrl : undefined,
      });
      dispatch(
        showAlert({
          message: article.isPublished ? "Article published." : "Article saved as unpublished.",
          type: "success",
        })
      );
      setCreating(false);
      setForm(emptyForm);
      setNotifyTouched(false);
      setPage(1);
      load();
    } catch (error) {
      dispatch(
        showAlert({ message: apiErrorMessage(error, "Couldn't create the article."), type: "error" })
      );
    } finally {
      setSaving(false);
    }
  }

  const columns: ColumnsType<NewsInsightArticle> = [
    {
      title: "",
      key: "thumb",
      width: 88,
      render: (_, a) =>
        a.thumbnailUrl ? (
          <Image src={a.thumbnailUrl} alt="" width={72} height={48} className="rounded object-cover" />
        ) : null,
    },
    {
      title: "Title",
      key: "title",
      render: (_, a) => (
        <div className="max-w-[420px]">
          <button
            type="button"
            className="text-left font-medium text-gray-800 hover:text-brand-600"
            onClick={() => setPreview(a)}
          >
            {a.title}
          </button>
          <p className="text-xs text-gray-500">/{a.slug}</p>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, a) =>
        a.isPublished ? <Tag color="green">Published</Tag> : <Tag>Unpublished</Tag>,
    },
    {
      title: "Published",
      key: "publishedAt",
      render: (_, a) => <span className="whitespace-nowrap text-xs">{formatDate(a.publishedAt)}</span>,
    },
    {
      title: "Engagement",
      key: "engagement",
      render: (_, a) => (
        <span className="whitespace-nowrap text-xs">
          {a.likesCount} likes · {a.commentsCount} comments
        </span>
      ),
    },
    {
      title: "",
      key: "link",
      render: (_, a) =>
        a.isPublished && a.slug ? (
          <Link href={newsInsightHref(a.slug)} target="_blank" className="text-xs text-brand-600">
            View live
          </Link>
        ) : null,
    },
  ];

  function imageField(
    label: string,
    required: boolean,
    source: ImageSource,
    setSource: (s: ImageSource) => void,
    file: File | null,
    fileKey: "thumbnailFile" | "heroFile",
    url: string,
    setUrl: (u: string) => void
  ) {
    return (
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">
          {label} {required ? <span className="text-error-500">*</span> : <span className="text-gray-400">(optional)</span>}
        </label>
        <Radio.Group value={source} onChange={(e) => setSource(e.target.value)} size="small">
          <Radio.Button value="url">Image URL</Radio.Button>
          <Radio.Button value="file">Upload file</Radio.Button>
        </Radio.Group>
        {source === "url" ? (
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            status={url && !/^https:\/\//.test(url.trim()) ? "error" : undefined}
          />
        ) : (
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => pickFile(e.target.files?.[0], fileKey)}
            />
            {file ? <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</span> : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 ring-1 ring-gray-200 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{total} articles, including unpublished</p>
        <Button
          type="primary"
          className="!flex !items-center gap-1"
          icon={<Add size={18} />}
          onClick={() => setCreating(true)}
        >
          New article
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={items}
        loading={loading}
        scroll={{ x: 900 }}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          onChange: setPage,
        }}
      />

      <Drawer
        open={creating}
        onClose={() => setCreating(false)}
        width={1100}
        title="New News & Insight article"
        destroyOnClose
        extra={
          <Button type="primary" disabled={!canSave} loading={saving} onClick={handleSave}>
            {form.isPublished ? "Publish" : "Save unpublished"}
          </Button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid content-start gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">
                Title <span className="text-error-500">*</span>
              </label>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">
                Excerpt <span className="text-gray-400">(optional, shown on cards)</span>
              </label>
              <Input.TextArea
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">
                Content (HTML) <span className="text-error-500">*</span>
              </label>
              <Input.TextArea
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                autoSize={{ minRows: 10, maxRows: 24 }}
                className="font-mono !text-xs"
                placeholder="<p>Write the article as HTML…</p>"
              />
            </div>
            {imageField(
              "Thumbnail",
              true,
              form.thumbnailSource,
              (s) => update("thumbnailSource", s),
              form.thumbnailFile,
              "thumbnailFile",
              form.thumbnailUrl,
              (u) => update("thumbnailUrl", u)
            )}
            {imageField(
              "Hero image",
              false,
              form.heroSource,
              (s) => update("heroSource", s),
              form.heroFile,
              "heroFile",
              form.heroUrl,
              (u) => update("heroUrl", u)
            )}
            <p className="-mt-2 text-xs text-gray-500">
              If file uploads fail (image storage down), host the image elsewhere and paste its URL.
            </p>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">
                Slug <span className="text-gray-400">(optional, made from the title)</span>
              </label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                }
                placeholder="can-inec-conduct-credible-elections"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">
                Publish date <span className="text-gray-400">(optional, defaults to now)</span>
              </label>
              <DatePicker
                showTime
                value={form.publishedAt}
                onChange={(value) => update("publishedAt", value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <p className="text-sm font-medium text-gray-800">Published</p>
                <p className="text-xs text-gray-500">Unpublished articles are only visible here.</p>
              </div>
              <Switch
                checked={form.isPublished}
                onChange={(checked) => {
                  update("isPublished", checked);
                  if (!notifyTouched) update("notifySubscribers", checked);
                }}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <p className="text-sm font-medium text-gray-800">Notify app users</p>
                <p className="text-xs text-gray-500">Sends an app notification about this article.</p>
              </div>
              <Switch
                checked={form.notifySubscribers}
                onChange={(checked) => {
                  setNotifyTouched(true);
                  update("notifySubscribers", checked);
                }}
              />
            </div>
          </div>

          <div className="lg:sticky lg:top-0 lg:self-start">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Preview</p>
            <ArticlePreview
              title={form.title}
              excerpt={form.excerpt}
              content={form.content}
              imageUrl={
                form.heroSource === "url" && form.heroUrl
                  ? form.heroUrl
                  : form.thumbnailSource === "url"
                    ? form.thumbnailUrl
                    : null
              }
            />
          </div>
        </div>
      </Drawer>

      <Modal
        open={Boolean(preview)}
        onCancel={() => setPreview(null)}
        footer={null}
        width={760}
        title={preview?.isPublished ? "Published article" : "Unpublished article"}
      >
        {preview ? (
          <ArticlePreview
            title={preview.title}
            excerpt={preview.excerpt}
            content={preview.content}
            imageUrl={preview.heroImageUrl || preview.thumbnailUrl}
          />
        ) : null}
      </Modal>
    </div>
  );
}

export function ArticlePreview({
  title,
  excerpt,
  content,
  imageUrl,
}: {
  title: string;
  excerpt?: string;
  content: string;
  imageUrl?: string | null;
}) {
  return (
    <article className="max-h-[75vh] overflow-y-auto rounded-lg border border-gray-200 bg-white p-5">
      {imageUrl && /^https?:\/\//.test(imageUrl) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="mb-4 max-h-64 w-full rounded-lg object-cover" />
      ) : null}
      <h1 className="font-league text-display-xs font-semibold leading-tight text-gray-800">
        {title || <span className="text-gray-300">Article title</span>}
      </h1>
      {excerpt ? <p className="mt-2 text-gray-500">{excerpt}</p> : null}
      <div
        className="news-insight-content mt-4"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    </article>
  );
}
