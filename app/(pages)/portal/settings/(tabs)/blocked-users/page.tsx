"use client";

import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import { fetchPulseBlocks, unblockPulseUser } from "@/app/data/pulseApi";
import { useAppDispatch } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { getPulsePosts } from "@/app/redux/features/pulseSlice";
import { PulseBlock } from "@/app/redux/types";
import { formatPulseTimeAgo } from "@/app/utils/pulseUtils";
import { Button, Spin } from "antd";
import { Profile } from "iconsax-react";
import React, { useEffect, useState } from "react";

export default function BlockedUsers() {
  const dispatch = useAppDispatch();
  const [blocks, setBlocks] = useState<PulseBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPulseBlocks()
      .then(setBlocks)
      .catch((err) =>
        setError(err?.response?.data?.message || "Couldn't load blocked users.")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleUnblock(block: PulseBlock) {
    setUnblockingId(block.id);
    try {
      await unblockPulseUser(block.id);
      setBlocks((prev) => prev.filter((b) => b.id !== block.id));
      dispatch(showAlert({ message: `${block.displayName} unblocked.`, type: "success" }));
      // Their posts can show again
      dispatch(getPulsePosts({ force: true }));
    } catch (err: any) {
      dispatch(
        showAlert({
          message: err?.response?.data?.message || "Could not unblock. Please try again.",
          type: "error",
        })
      );
    } finally {
      setUnblockingId(null);
    }
  }

  return (
    <React.Fragment>
      <SettingsHeader>Blocked Users</SettingsHeader>
      <div className="mx-auto w-full max-w-[736px] rounded-lg bg-white px-3 py-6 ring-1 ring-gray-300 md:px-8 md:py-8">
        <h3 className="mb-1 text-center font-league text-xl font-semibold leading-tight text-brand-500 md:text-display-xs lg:text-display-sm">
          Blocked Users
        </h3>
        <p className="mb-6 text-center text-sm text-gray-500">
          People you&apos;ve blocked on Pulse. You don&apos;t see each other&apos;s posts,
          reposts or comments.
        </p>

        {loading ? (
          <div className="grid place-content-center py-10">
            <Spin />
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-error-600">{error}</p>
        ) : blocks.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            You haven&apos;t blocked anyone.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {blocks.map((block) => (
              <li key={block.id} className="flex items-center gap-3 py-3">
                <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full border border-gray-200 bg-brand-25">
                  <Profile size={18} className="text-brand-500" variant="Bold" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-800">{block.displayName}</p>
                  {block.blockedAt ? (
                    <p className="text-xs text-gray-500">
                      Blocked {formatPulseTimeAgo(block.blockedAt)}
                    </p>
                  ) : null}
                </div>
                <Button
                  loading={unblockingId === block.id}
                  onClick={() => handleUnblock(block)}
                >
                  Unblock
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </React.Fragment>
  );
}
