"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { canUploadElectionData } from "@/app/utils/userRoleAccess";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useRoleUploadGuard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const role = userState.details?.role;

  useEffect(() => {
    if (!role || canUploadElectionData(role)) return;

    dispatch(
      showAlert({
        message: "Public viewers cannot upload election results or incident reports.",
        type: "error",
      })
    );
    router.replace("/portal/dashboard");
  }, [role, dispatch, router]);
}
