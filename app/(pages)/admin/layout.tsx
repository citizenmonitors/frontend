"use client";
import DashboardLoading from "@/app/components/portal/layout/DashboardLoading";
import LogoFlat from "@/app/components/shared/svg/LogoFlat";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useScreenDimensions from "@/app/hooks/useScreenDimensions";
import useSessionValidate from "@/app/hooks/useSessionValidate";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminRoutes } from "@/app/data/admin";
import Link from "next/link";
import SideBarLinkDesktop from "@/app/components/portal/layout/SidebarLinkDesktop";
import DashboardTime from "@/app/components/portal/layout/DashboardTime";
import Notifications from "@/app/components/admin/dashboard/Notifications";
import DashboardProfile from "@/app/components/portal/layout/DashboardProfile";
import { v4 } from "uuid";
import "./admin.css";

export default function AdminLayout({ children }: { children: any }) {
  useSessionValidate();
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const router = useRouter();
  const pathName = usePathname();
  const screenDimensions = useScreenDimensions();

  if (userState.status.validateSession !== "fulfilled") return <DashboardLoading />;
  const isAdmin = ["admin", "super-admin"].includes(userDetails?.role);
  if (!isAdmin) router.replace("/portal/dashboard");
  

  if (screenDimensions.width && screenDimensions.width < 1024)
    return (
      <div className="p-4 min-h-screen grid">
        <article className="max-w-sm p-3 ring-1 flex flex-col gap-3 items-center ring-gray-300 rounded-lg m-auto">
          <LogoFlat size={32} />
          <h2 className="text-lg font-medium leading-tight font-league text-brand-500 text-center">
            Visit desktop to access admin features and tools.
          </h2>
        </article>
      </div>
    );

  const adminLinks = adminRoutes;
  const mobileLinks = adminRoutes.slice(0, 5);

  return (
    <main
      id="admin-content"
      className="dashboard h-[calc(100dvh-143px)] md:h-[100dvh] mt-[65px] md:mt-0 w-screen relative overflow-y-scroll scroll-smooth"
    >
      {/* Desktop Navigation Bar */}
      <nav
        className={`
        dashboard-sidebar
        hidden md:flex flex-col place-items-center absolute left-0
        h-full w-[256px] p-5 border-r border-gray-200 bg-white
      `}
      >
        <Link href={"/"} className="logo mb-[48px]">
          <LogoFlat size={34} />
        </Link>

        <ul className="grid w-full main-links">
          {adminLinks.map((link) =>
            link.title ? (
              <SideBarLinkDesktop key={link.title} link={link} pathName={pathName} />
            ) : (
              <hr key={v4()} className="w-full my-1 border-gray-200" />
            )
          )}
        </ul>
      </nav>

      {/* Mobile Navigation Bar */}
      <nav
        className={`
        dashboard-sidebar-mobile
        ring-1 ring-gray-200 fixed w-full bottom-0 bg-white z-20
        md:hidden pt-3 pb-5
      `}
      >
        <ul className="flex justify-between w-[calc(100%-64px)] min-w-[280px] max-w-[320px] mx-auto overflow-hidden dashboard-sidebar-links">
          {mobileLinks.map((link) => (
            <li key={link.title}>
              <Link
                href={link.href}
                className={`
                    flex flex-col items-center gap-1
                    ${
                      pathName === link.href
                        ? link.title === "Live"
                          ? "text-error-500"
                          : "text-brand-500"
                        : "text-gray-400"
                    }
                  `}
              >
                <link.icon
                  size={24}
                  variant={pathName === link.href ? "Bold" : "Linear"}
                />
                <span className="text-xs font-medium whitespace-nowrap">
                  {link.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content Container */}
      <div
        className={`dashboard-content md:ml-[256px] bg-white md:bg-gray-100 pt-4 pb-16 px-6 md:py-7 md:px-8  text-gray-500 md:overflow-y-scroll md:h-full md:pt-[calc(78px+28px)]`}
      >
        <header className="dashboard-header py-4 px-6 md:px-8 flex gap-5 items-center justify-end border-b border-gray-200 fixed top-0 left-0 md:left-[256px] bg-white w-full md:w-[calc(100%-256px)] z-10">
          <Link href={"/"} className="block mr-auto logo md:hidden">
            <LogoFlat size={32} />
          </Link>
          <DashboardTime />
          <Notifications />
          <DashboardProfile />
        </header>
        {children}
      </div>
    </main>
  );
}
