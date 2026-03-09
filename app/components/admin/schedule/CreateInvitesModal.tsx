"use client";

import React, { useState } from "react";
import { Modal, Button, Input } from "antd";
import { createInvites, inviteLinkForToken, type CreateInvitesResponse } from "@/app/data/admin-speaker-slots-api";
import { Copy } from "iconsax-react";

type Props = {
  open: boolean;
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
};

function getTokensFromResponse(data: CreateInvitesResponse): string[] {
  if (data.tokens && Array.isArray(data.tokens)) return data.tokens;
  if (data.invites && Array.isArray(data.invites)) {
    return data.invites.map((i) => i.token).filter(Boolean);
  }
  if (data.token) return [data.token];
  return [];
}

export default function CreateInvitesModal({ open, eventId, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState("");
  const [inviteLinks, setInviteLinks] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setInviteLinks([]);
    try {
      const data = await createInvites(eventId, {
        count: count >= 1 ? count : undefined,
        expiresAt: expiresAt.trim() || undefined,
      });
      const tokens = getTokensFromResponse(data);
      const links = tokens.map((token) => inviteLinkForToken(token));
      setInviteLinks(links);
      if (links.length === 0) onSuccess();
    } catch {
      alert("Failed to create invites.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (link: string, index: number) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      alert("Could not copy.");
    }
  };

  const handleClose = () => {
    setInviteLinks([]);
    onSuccess();
    onClose();
  };

  const showResults = inviteLinks.length > 0;

  return (
    <Modal
      title={showResults ? "Invite links – share with speakers" : "Create invites"}
      open={open}
      onCancel={handleClose}
      footer={
        showResults
          ? [<Button key="done" type="primary" onClick={handleClose}>Done</Button>]
          : [
              <Button key="cancel" onClick={handleClose}>Cancel</Button>,
              <Button key="create" type="primary" loading={loading} onClick={handleSubmit}>
                Create
              </Button>,
            ]
      }
    >
      {showResults ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Copy the full link below to share with speakers. Each link can be used to pick one slot.
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {inviteLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                <code className="text-xs flex-1 truncate" title={link}>{link}</code>
                <Button
                  size="small"
                  icon={<Copy size={14} />}
                  onClick={() => handleCopy(link, i)}
                >
                  {copiedIndex === i ? "Copied" : "Copy"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of invites</label>
            <Input
              type="number"
              min={1}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expires at (optional)</label>
            <Input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
