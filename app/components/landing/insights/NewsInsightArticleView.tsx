"use client";

import PulseLoginModal from "@/app/components/portal/pulse/PulseLoginModal";
import { cookieData } from "@/app/data/cookieData";
import {
  createNewsInsightComment,
  deleteNewsInsightComment,
  fetchNewsInsight,
  fetchNewsInsightComments,
  NewsInsightArticle,
  NewsInsightComment,
  toggleNewsInsightCommentLike,
  toggleNewsInsightLike,
  updateNewsInsightComment,
} from "@/app/data/newsInsightsApi";
import { apiErrorMessage } from "@/app/data/adminContentApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { validateSession } from "@/app/redux/features/userSlice";
import { formatPulseTimeAgo } from "@/app/utils/pulseUtils";
import { sanitizeHtml } from "@/app/utils/sanitizeHtml";
import { Button, Checkbox, Dropdown, Input, Modal, Skeleton, Switch } from "antd";
import dayjs from "dayjs";
import { ArrowRight2, Heart, More, Profile } from "iconsax-react";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function NewsInsightArticleView({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.user.details);
  const sessionStatus = useAppSelector((state) => state.user.status.validateSession);
  const [article, setArticle] = useState<NewsInsightArticle | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [comments, setComments] = useState<NewsInsightComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editAnonymous, setEditAnonymous] = useState(false);
  // Admins can delete any comment (but only edit their own)
  const isAdmin = ["admin", "super-admin"].includes(userDetails?.role ?? "");
  const [savingEdit, setSavingEdit] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  // Restore the session (if any) so likes reflect the signed-in user
  useEffect(() => {
    if (!Cookies.get(cookieData.login.name)) return;
    if (sessionStatus === "pending" || sessionStatus === "fulfilled") return;
    dispatch(validateSession());
  }, [dispatch, sessionStatus]);

  useEffect(() => {
    let cancelled = false;
    fetchNewsInsight(slug)
      .then((data) => !cancelled && setArticle(data))
      .catch(() => !cancelled && setNotFound(true));
    return () => {
      cancelled = true;
    };
  }, [slug, userDetails?.email]);

  // Comments need a signed-in user
  useEffect(() => {
    if (!article?.id || !userDetails) return;
    setCommentsLoading(true);
    fetchNewsInsightComments(article.id)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));
  }, [article?.id, userDetails]);

  function requireAuth(message: string) {
    if (userDetails) return true;
    setLoginMessage(message);
    setLoginOpen(true);
    return false;
  }

  async function handleLike() {
    if (!article || !requireAuth("Sign in to like this article.")) return;
    setLiking(true);
    try {
      const next = await toggleNewsInsightLike(article);
      setArticle({ ...article, ...next });
    } catch (error) {
      dispatch(showAlert({ message: apiErrorMessage(error, "Couldn't like this article."), type: "error" }));
    } finally {
      setLiking(false);
    }
  }

  async function handleComment() {
    if (!article || !body.trim() || !requireAuth("Sign in to comment.")) return;
    setPosting(true);
    try {
      const comment = await createNewsInsightComment(article.id, body, anonymous);
      setComments((prev) => [comment, ...prev]);
      setArticle({ ...article, commentsCount: article.commentsCount + 1 });
      setBody("");
    } catch (error) {
      dispatch(showAlert({ message: apiErrorMessage(error, "Couldn't post your comment."), type: "error" }));
    } finally {
      setPosting(false);
    }
  }

  async function handleCommentLike(comment: NewsInsightComment) {
    if (!article || !requireAuth("Sign in to like comments.")) return;
    try {
      const next = await toggleNewsInsightCommentLike(article.id, comment);
      setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, ...next } : c)));
    } catch (error) {
      dispatch(showAlert({ message: apiErrorMessage(error, "Couldn't like this comment."), type: "error" }));
    }
  }

  function editChanges(comment: NewsInsightComment) {
    return {
      ...(editBody.trim() !== comment.body.trim() ? { body: editBody } : {}),
      ...(editAnonymous !== comment.usedAnonymous ? { useAnonymousDisplay: editAnonymous } : {}),
    };
  }

  async function saveEdit(comment: NewsInsightComment) {
    const changes = editChanges(comment);
    if (!article || !editBody.trim() || Object.keys(changes).length === 0) return;
    setSavingEdit(true);
    try {
      const updated = await updateNewsInsightComment(article.id, comment.id, changes);
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? {
                ...c,
                ...updated,
                // Keep fields the edit response may leave out
                id: c.id,
                body: updated.body || editBody.trim(),
                authorName: updated.authorName !== "Citizen" ? updated.authorName : c.authorName,
                // Anonymous comments return a null avatar on purpose
                avatarUrl: updated.usedAnonymous ? null : updated.avatarUrl ?? c.avatarUrl,
                createdAt: updated.createdAt ?? c.createdAt,
                // editedAt is only set when the text changes
                editedAt: updated.editedAt ?? (changes.body !== undefined ? new Date().toISOString() : c.editedAt),
                isOwnedByCurrentUser: true,
              }
            : c
        )
      );
      setEditingId(null);
    } catch (error) {
      dispatch(showAlert({ message: apiErrorMessage(error, "Couldn't update your comment."), type: "error" }));
    } finally {
      setSavingEdit(false);
    }
  }

  function confirmDelete(comment: NewsInsightComment) {
    if (!article) return;
    const articleId = article.id;
    Modal.confirm({
      title: "Delete this comment?",
      content: comment.isOwnedByCurrentUser
        ? "This can't be undone."
        : "You're deleting another user's comment as an admin. This can't be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteNewsInsightComment(articleId, comment.id);
          setComments((prev) => prev.filter((c) => c.id !== comment.id));
          setArticle((prev) =>
            prev ? { ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) } : prev
          );
        } catch (error: any) {
          // Already gone: drop it from the screen
          if (error?.response?.status === 404) {
            setComments((prev) => prev.filter((c) => c.id !== comment.id));
            return;
          }
          dispatch(showAlert({ message: apiErrorMessage(error, "Couldn't delete this comment."), type: "error" }));
        }
      },
    });
  }

  if (notFound) {
    return (
      <div className="grid min-h-[50vh] place-content-center">
        <p className="text-center text-sm text-gray-500">
          We couldn&apos;t find the Insight you are looking for.
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container max-w-3xl py-10">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  const heroImage = article.heroImageUrl || article.thumbnailUrl;

  return (
    <div className="container max-w-3xl">
      <nav className="flex items-center gap-1 py-4 text-sm text-gray-700 lg:mt-8">
        <Link href="/">Home</Link>
        <ArrowRight2 size={18} />
        <Link href="/insights">Insights</Link>
        <ArrowRight2 size={18} className="text-brand-500" />
        <span className="truncate text-brand-500">{article.title}</span>
      </nav>

      <header className="mb-6">
        <p className="mb-2 font-league text-sm font-bold uppercase text-brand-500">News &amp; Insight</p>
        <h1 className="font-league text-display-sm font-semibold leading-tight text-gray-800 lg:text-display-base">
          {article.title}
        </h1>
        {article.publishedAt ? (
          <p className="mt-2 text-sm text-gray-500">{dayjs(article.publishedAt).format("D MMMM YYYY")}</p>
        ) : null}
      </header>

      {heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImage} alt="" className="mb-8 max-h-[420px] w-full rounded-xl object-cover" />
      ) : null}

      <div
        className="news-insight-content"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
      />

      <div className="my-8 flex items-center gap-4 border-y border-gray-200 py-4">
        <button
          type="button"
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:bg-error-50 ${
            article.isLikedByCurrentUser ? "text-error-500" : "text-gray-600"
          }`}
        >
          <Heart size={20} variant={article.isLikedByCurrentUser ? "Bold" : "Linear"} />
          {article.likesCount} {article.likesCount === 1 ? "like" : "likes"}
        </button>
        <span className="text-sm text-gray-500">
          {article.commentsCount} {article.commentsCount === 1 ? "comment" : "comments"}
        </span>
      </div>

      <section className="mb-16">
        <h2 className="mb-4 font-league text-xl font-semibold text-gray-800">Comments</h2>

        {userDetails ? (
          commentsLoading ? (
            <div className="mb-6">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          ) : comments.length === 0 ? (
            <p className="mb-6 text-sm text-gray-500">No comments yet. Start the conversation.</p>
          ) : (
            <ul className="mb-6 grid gap-4">
              {/* Oldest first, so new comments land just above the comment box */}
              {[...comments].reverse().map((comment) => (
                <li key={comment.id} className="flex gap-3 border-b border-gray-100 pb-4 last:border-0">
                  <div className="grid h-9 w-9 shrink-0 place-content-center overflow-hidden rounded-full border border-brand-200 bg-brand-25">
                    {comment.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={comment.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Profile size={18} className="text-brand-500" variant="Bold" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold text-gray-800">{comment.authorName}</p>
                      <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                        {formatPulseTimeAgo(comment.createdAt)}
                        {comment.editedAt ? " · Edited" : ""}
                        {(comment.isOwnedByCurrentUser || isAdmin) && editingId !== comment.id ? (
                          <Dropdown
                            trigger={["click"]}
                            menu={{
                              items: [
                                ...(comment.isOwnedByCurrentUser
                                  ? [
                                      {
                                        key: "edit",
                                        label: "Edit",
                                        onClick: () => {
                                          setEditingId(comment.id);
                                          setEditBody(comment.body);
                                          setEditAnonymous(comment.usedAnonymous);
                                        },
                                      },
                                    ]
                                  : []),
                                {
                                  key: "delete",
                                  label: "Delete",
                                  danger: true,
                                  onClick: () => confirmDelete(comment),
                                },
                              ],
                            }}
                          >
                            <button
                              type="button"
                              className="grid h-7 w-7 place-content-center rounded-full text-gray-400 hover:bg-gray-100"
                              aria-label="Comment options"
                            >
                              <More size={16} />
                            </button>
                          </Dropdown>
                        ) : null}
                      </span>
                    </div>
                    {editingId === comment.id ? (
                      <div className="mt-2 grid gap-2">
                        <Input.TextArea
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          autoSize={{ minRows: 2, maxRows: 6 }}
                          maxLength={3000}
                          autoFocus
                        />
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Checkbox
                            className="mr-auto"
                            checked={editAnonymous}
                            onChange={(e) => setEditAnonymous(e.target.checked)}
                          >
                            <span className="text-xs text-gray-600">Comment anonymously</span>
                          </Checkbox>
                          <Button size="small" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            type="primary"
                            loading={savingEdit}
                            disabled={!editBody.trim() || Object.keys(editChanges(comment)).length === 0}
                            onClick={() => saveEdit(comment)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-600">{comment.body}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCommentLike(comment)}
                      className={`mt-2 flex items-center gap-1 text-xs ${
                        comment.isLikedByCurrentUser ? "text-error-500" : "text-gray-400 hover:text-error-500"
                      }`}
                    >
                      <Heart size={14} variant={comment.isLikedByCurrentUser ? "Bold" : "Linear"} />
                      {comment.likesCount}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : null}

        {userDetails ? (
          <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <Input.TextArea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts"
              autoSize={{ minRows: 2, maxRows: 6 }}
              maxLength={3000}
              className="!bg-white"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <Switch size="small" checked={anonymous} onChange={setAnonymous} />
                Comment anonymously
              </label>
              <Button type="primary" loading={posting} disabled={!body.trim()} onClick={handleComment}>
                Comment
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
            <button
              type="button"
              className="font-semibold text-brand-600"
              onClick={() => requireAuth("Sign in to read and write comments.")}
            >
              Sign in
            </button>{" "}
            to read and join the conversation.
          </div>
        )}
      </section>

      <PulseLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => setLoginOpen(false)}
        contextMessage={loginMessage}
      />
    </div>
  );
}
