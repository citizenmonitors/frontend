import { Tooltip } from "antd";
import React from "react";

export default function TruncateTooltip({
  children,
  length = 15,
}: {
  children: string;
  length?: number;
}) {
  return children.length > length ? (
    <Tooltip title={children}>
      <React.Fragment>{children.slice(0, length)}...</React.Fragment>
    </Tooltip>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );
}
