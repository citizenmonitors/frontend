"use client";
import VerificationDisplay from "@/app/components/admin/verification/VerificationDisplay";
import { useAppSelector } from "@/app/hooks/redux";
import React from "react";

export default function AwaitingVerification() {
  const { pendingVerificationUsers } = useAppSelector((state) => state.adminVerification);
  
  return <VerificationDisplay users={pendingVerificationUsers} />;
}
