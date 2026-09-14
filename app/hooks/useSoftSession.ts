"use client";

import { cookieData } from "@/app/data/cookieData";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { validateSession } from "@/app/redux/features/userSlice";
import Cookies from "js-cookie";
import { useEffect } from "react";

/**
 * Hydrate the logged-in user on public pages without forcing login.
 * Session cookie is shared with the portal — this just loads Redux user state.
 */
export default function useSoftSession() {
  const dispatch = useAppDispatch();
  const details = useAppSelector((state) => state.user.details);
  const status = useAppSelector((state) => state.user.status.validateSession);
  const hasCookie = typeof window !== "undefined" && Boolean(Cookies.get(cookieData.login.name));

  useEffect(() => {
    if (!Cookies.get(cookieData.login.name)) return;
    if (status === "pending" || status === "fulfilled") return;
    dispatch(validateSession());
  }, [dispatch, status]);

  const isAdmin =
    !!details?.role && ["admin", "super-admin"].includes(details.role);

  return {
    user: details,
    isAuthenticated: Boolean(details),
    isSessionPending:
      hasCookie && (status === "pending" || status === "not started"),
    dashboardHref: isAdmin ? "/admin/dashboard" : "/portal/dashboard",
  };
}
