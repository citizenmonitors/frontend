import { forgotPasswordMetadata } from "@/app/metadata";
import React from "react";

export const metadata = forgotPasswordMetadata;

export default function ForgotPassword({
  children,
}: {
  children: React.ReactNode;
}) {
  return <React.Fragment>{children}</React.Fragment>;
}
