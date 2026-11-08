"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Hamburger from "@/public/assets/hamburger.svg";
import HamburgerClose from "@/public/assets/hamburger-close.svg";
import { primaryLinks, topLinks } from "@/app/data/navigation";
import { Button, Dropdown } from "antd";
import Link from "next/link";
import { ArrowDown2 } from "iconsax-react";
import Logo from "../shared/svg/Logo";
import LogoFlat from "../shared/svg/LogoFlat";
import { usePathname } from "next/navigation";
import getRootPath from "@/app/utils/getRootPath";
import useSoftSession from "@/app/hooks/useSoftSession";
import DashboardProfile from "@/app/components/portal/layout/DashboardProfile";

/** Link label with a small brand-colour dot for newly rolled-out features */
function LinkLabel({ name, isNew }: { name: string; isNew?: boolean }) {
  if (!isNew) return <>{name}</>;
  return (
    <span className="relative inline-flex">
      {name}
      <span
        className="absolute -right-2.5 -top-0.5 h-2 w-2 animate-bounce rounded-full bg-red-500 ring-2 ring-white motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span className="sr-only"> (new)</span>
    </span>
  );
}

function PrimaryNavigation() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const toggleMobileNavigation = () => setMobileNavigationOpen((prev) => !prev);
  const pathName = usePathname();
  const rootPathName = getRootPath(pathName);
  const { isAuthenticated, dashboardHref } = useSoftSession();

  useEffect(() => {
    if (!mobileNavigationOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileNavigationOpen]);

  const lgLinks = new Set([0, 1, 2, 3, 4, 5, 6]);
  const mdLinks = new Set([0, 1, 2, 7]);

  const authActions = isAuthenticated ? (
    <div className="flex items-center gap-3 lg:gap-4">
      <Link href={dashboardHref}>
        <Button size="large" type="primary" className="lg:h-[55px] lg:px-6">
          Dashboard
        </Button>
      </Link>
      <DashboardProfile />
    </div>
  ) : (
    <>
      <Link href={"/auth/login"} className="shrink-0">
        <Button size="large" className="lg:h-[55px] lg:px-6">
          Login
        </Button>
      </Link>
      <Link href={"/auth/signup"} className="shrink-0">
        <Button size="large" className="lg:h-[55px] lg:px-6" type="primary">
          Sign up
        </Button>
      </Link>
    </>
  );

  const mobileAuthActions = isAuthenticated ? (
    <div className="flex w-[90%] flex-col gap-4 mx-auto">
      <Link href={dashboardHref}>
        <Button block size="large" type="primary" className="text-sm h-[48px]">
          Dashboard
        </Button>
      </Link>
      <div className="flex justify-center">
        <DashboardProfile />
      </div>
    </div>
  ) : (
    <>
      <Link href={"/auth/login"} className="w-[90%] mx-auto">
        <Button block size="large" className="text-sm h-[48px]">
          Login
        </Button>
      </Link>
      <Link href={"/auth/signup"} className="w-[90%] mx-auto">
        <Button block size="large" type="primary" className="text-sm h-[48px]">
          Sign up
        </Button>
      </Link>
    </>
  );

  return (
    <div
      className="primary-nav-container grid-center md:border-b border-gray-200 md:shadow-sm sticky top-0 bg-white to-white/0 z-50"
      style={{ background: mobileNavigationOpen ? "white" : undefined }}
    >
      <nav className="container py-6 md:py-3 flex items-center">
        {/* Logo and auth sides share equal width so the menu sits in the true centre */}
        <Link href={"/"} className="mr-4 md:flex md:flex-1 md:basis-0">
          <div className="logo-container md:hidden">
            <Logo size={40} />
          </div>
          <div className="logo-container hidden md:block lg:hidden">
            <Logo size={48} />
          </div>
          <div className="logo-container hidden lg:block">
            <Logo size={57} />
          </div>
        </Link>

        <ul className="hidden md:flex md:shrink-0 md:justify-center">
          {primaryLinks.map((link, linkIndex) =>
            link.hidden ? null : link.subMenu ? (
              <li
                key={link.name}
                className={`${!lgLinks.has(linkIndex) ? "lg:hidden" : ""} ${
                  !mdLinks.has(linkIndex) ? "md:hidden lg:block" : ""
                }`}
              >
                <Dropdown
                  menu={{
                    items: link.subMenu.map((item) => ({
                      label: (
                        <Link href={item.href}>
                          <Button
                            size="large"
                            block
                            type="text"
                            disabled={item.comingSoon}
                            className={
                              item.highlight ? "text-brand-500" : "hover:!text-brand-500"
                            }
                          >
                            <LinkLabel name={item.name} isNew={item.isNew} />
                          </Button>
                        </Link>
                      ),
                      key: item.href,
                    })),
                  }}
                  arrow
                  placement="bottom"
                >
                  <Button
                    block
                    type="text"
                    className="flex gap-[.6ch] items-center justify-center hover:!bg-white hover:!text-brand-500 text-gray-800 text-base"
                  >
                    {link.name}
                    <ArrowDown2 variant="Linear" size={16} />
                  </Button>
                </Dropdown>
              </li>
            ) : (
              <li
                key={link.name}
                className={`${!lgLinks.has(linkIndex) ? "lg:hidden" : ""} ${
                  !mdLinks.has(linkIndex) ? "md:hidden lg:block" : ""
                }`}
              >
                <Link className="flex" href={link.href}>
                  <Button
                    block
                    type="text"
                    className={`hover:!bg-white hover:!text-brand-500 text-base ${
                      (link.href === "/#home" && rootPathName === "/") ||
                      rootPathName === link.href
                        ? "text-brand-500"
                        : "text-gray-800"
                    }`}
                    disabled={link.comingSoon}
                  >
                    <LinkLabel name={link.name} isNew={link.isNew} />
                  </Button>
                </Link>
              </li>
            )
          )}
        </ul>
        <div className="auth-buttons hidden md:flex md:flex-1 md:basis-0 md:justify-end gap-4 ml-auto md:ml-4">
          {authActions}
        </div>

        {/* Mobile Navigation */}
        <button
          className="md:hidden ml-auto h-[36px] w-[36px] flex items-center justify-end"
          aria-label={mobileNavigationOpen ? "Close Primary Menu" : "Open Primary Menu"}
          aria-controls="primary-nav-mobile"
          aria-expanded={mobileNavigationOpen}
          onClick={toggleMobileNavigation}
        >
          <Image src={Hamburger} alt="Open" />
        </button>
        <div
          id="primary-nav-mobile-container"
          className={`fixed left-0 top-0 h-full w-full bg-black/20 backdrop-blur transition-all ${
            mobileNavigationOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              toggleMobileNavigation();
            }
          }}
        >
          <nav
            id="primary-nav-mobile"
            className={`ml-auto flex h-full min-h-0 w-[min(88vw,20rem)] flex-col overflow-y-auto overscroll-contain p-4 md:hidden z-50 bg-white transition-transform ${
              mobileNavigationOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Button
              type="text"
              className="rounded-full mx-auto h-12 w-12 p-0 grid place-content-center mb-1"
              onClick={toggleMobileNavigation}
            >
              <Image src={HamburgerClose} alt="Close" />
            </Button>
            <div className="logo-container mx-auto mb-3 xs:hidden">
              <LogoFlat size={28} />
            </div>
            <div className="logo-container mx-auto mb-4 hidden xs:block">
              <LogoFlat size={32} />
            </div>
            <ul className="flex flex-col gap-3 mb-4">
              {primaryLinks.map((link) =>
                link.hidden ? null : link.subMenu ? (
                  <li key={link.name} className="flex py-2 last:hidden">
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: link.subMenu.map((item) => ({
                          label: (
                            <Link href={item.href}>
                              <Button size="large" block type="text">
                                <LinkLabel name={item.name} isNew={item.isNew} />
                              </Button>
                            </Link>
                          ),
                          key: item.href,
                        })),
                      }}
                      arrow
                      placement="bottom"
                    >
                      <Button
                        block
                        size="large"
                        type="text"
                        className="flex gap-[.75ch] items-center justify-center hover:!bg-white hover:!text-brand-500 text-gray-800 text-sm h-[40px]"
                      >
                        {link.name}
                        <ArrowDown2 variant="Linear" size={16} />
                      </Button>
                    </Dropdown>
                  </li>
                ) : (
                  <li key={link.name} className="last:hidden">
                    <Link className="flex" href={link.href}>
                      <Button
                        block
                        size="large"
                        type="text"
                        className={`hover:!bg-white hover:!text-brand-500 text-sm h-[40px] ${
                          (link.href === "/#home" && rootPathName === "/") ||
                          rootPathName === link.href
                            ? "text-brand-500"
                            : "text-gray-800"
                        }`}
                        disabled={link.comingSoon}
                      >
                        <LinkLabel name={link.name} isNew={link.isNew} />
                      </Button>
                    </Link>
                  </li>
                )
              )}
            </ul>
            <div className="auth-buttons flex flex-col gap-4 mb-[30px]">
              {mobileAuthActions}
            </div>
            <ul className="flex flex-col items-center gap-6 text-sm">
              {topLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </nav>
    </div>
  );
}

export default PrimaryNavigation;
