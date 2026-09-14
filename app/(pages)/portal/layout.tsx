"use client";
import React, { useMemo } from "react";
import useSessionValidate from "@/app/hooks/useSessionValidate";
import { usePathname, useRouter } from "next/navigation";
import DashboardTime from "@/app/components/portal/layout/DashboardTime";
import DashboardProfile from "@/app/components/portal/layout/DashboardProfile";
import DashboardLoading from "@/app/components/portal/layout/DashboardLoading";
import { useAppSelector } from "@/app/hooks/redux";
import Link from "next/link";
import { dashboardRoutes } from "@/app/data/portal";
import LogoFlat from "@/app/components/shared/svg/LogoFlat";
import PremiumAd from "@/app/components/portal/ads/PremiumAd";
import SideBarLinkDesktop from "@/app/components/portal/layout/SidebarLinkDesktop";
import { v4 } from "uuid";
import "./portal.css";
import { HeartCircle, Messages, Messages1 } from "iconsax-react";
import { Button, Tooltip } from "antd";
import Support from "@/app/components/shared/svg/Support";

function PortalLayout({ children }: any) {
  useSessionValidate();
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const pathName = usePathname();
  const router = useRouter();
  const messagesOpen = useMemo(() => pathName === "/portal/inbox", [pathName]);
  const inboxState = useAppSelector((state) => state.inbox);
  const isUnreadMessages = inboxState.podcasts.some((m) => !m.read);
  const unreadCount = inboxState.podcasts.filter((m) => !m.read).length;

  if (userState.status.validateSession !== "fulfilled") return <DashboardLoading />;
  const isAdmin = ["admin", "super-admin"].includes(userDetails?.role);
  if (isAdmin) router.replace("/admin/dashboard");

  const dashboardLinks = dashboardRoutes;
  const mobileNavTitles = ["Home", "Elections", "Records", "Calendar", "Live"];
  const mobileLinks = dashboardRoutes.filter((l) => mobileNavTitles.includes(l.title));

  return (
    <main
      id="portal-content"
      className="dashboard h-[calc(100dvh-156px)] md:h-[100dvh] mt-[78px] md:mt-0 w-screen relative overflow-y-scroll scroll-smooth"
    >
      {/* Desktop Side Bar */}
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
          {dashboardLinks.map((link) =>
            link.title ? (
              <SideBarLinkDesktop key={link.title} link={link} pathName={pathName} />
            ) : (
              <hr key={v4()} className="w-full my-1 border-gray-200" />
            )
          )}
        </ul>

        <div className="mt-auto w-full">
          <PremiumAd />
        </div>
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
                      pathName === link.href || pathName.startsWith(`${link.href}/`)
                        ? link.title === "Live"
                          ? "text-error-500"
                          : "text-brand-500"
                        : "text-gray-400"
                    }
                  `}
              >
                <link.icon
                  size={24}
                  variant={
                    pathName === link.href || pathName.startsWith(`${link.href}/`)
                      ? "Bold"
                      : "Linear"
                  }
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
        className={`dashboard-content md:ml-[256px] bg-white md:bg-gray-100 pt-4 pb-16 px-6 md:py-7 md:px-8 text-gray-500 md:overflow-y-scroll md:h-full md:pt-[calc(78px+28px)]`}
      >
        <header className="dashboard-header py-4 px-6 md:px-8 flex gap-5 items-center justify-end border-b border-gray-200 fixed top-0 left-0 md:left-[256px] bg-white w-full md:w-[calc(100%-256px)] z-10">
          <Link href={"/"} className="block mr-auto logo md:hidden">
            <LogoFlat size={28} />
          </Link>
          <DashboardTime />

          <div className="flex items-center gap-2">
            <Tooltip
              title="Inbox"
              placement="bottom"
              overlayInnerStyle={{ fontSize: "14px" }}
            >
              <Link href={"/portal/inbox"} className="hidden md:block">
                <Button
                  type="text"
                  className="h-10 w-10 grid place-content-center rounded-lg relative"
                >
                  <Messages1
                    variant={messagesOpen ? "Bulk" : "Linear"}
                    size={28}
                    className={`${messagesOpen ? "text-brand-500" : "text-gray-700"}`}
                  />
                  {isUnreadMessages && (
                    <div className="absolute -top-1 -right-2 min-w-4 h-4 bg-error-500 rounded-full grid place-content-center px-1">
                      <span className="text-white text-[10px] font-semibold">
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </Button>
              </Link>
            </Tooltip>
            <div className="w-[6px] h-[6px] rounded-full bg-gray-700 hidden md:block"></div>
            <Tooltip
              title="Support"
              placement="bottom"
              overlayInnerStyle={{ fontSize: "14px" }}
            >
              <Link href={"/resources/support"}>
                <Button
                  type="text"
                  className="h-10 w-10 grid place-content-center rounded-lg text-gray-700"
                >
                  <Support size={28} />
                </Button>
              </Link>
            </Tooltip>
          </div>
          <DashboardProfile />
        </header>
        {children}
      </div>
    </main>
  );
}

export default PortalLayout;
