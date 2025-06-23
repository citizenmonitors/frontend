import { resetPasswordMetadata } from "@/app/metadata";
import React from "react";

export const metadata = resetPasswordMetadata;

export default function ResetPassword({
  children,
}: {
  children: React.ReactNode;
}) {
  return <React.Fragment>{children}</React.Fragment>;
}
