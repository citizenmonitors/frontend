"use client";

import React from "react";
import { Button } from "antd";

type Props = {
  useLocalTime: boolean;
  onToggle: (useLocal: boolean) => void;
};

export default function TimeZoneToggle({ useLocalTime, onToggle }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500">Show times in:</span>
      <Button
        type={!useLocalTime ? "primary" : "default"}
        size="small"
        onClick={() => onToggle(false)}
      >
        WAT
      </Button>
      <Button
        type={useLocalTime ? "primary" : "default"}
        size="small"
        onClick={() => onToggle(true)}
      >
        My local time
      </Button>
    </div>
  );
}
