"use client";
import Image from "next/image";
import React, { useState } from "react";
import Hamburger from "@/public/assets/hamburger.svg";
import HamburgerClose from "@/public/assets/hamburger-close.svg";
import { primaryLinks, topLinks } from "@/app/data/navigation";
import { v4 } from "uuid";
import { Button, Dropdown } from "antd";
import Link from "next/link";
import { ArrowDown2 } from "iconsax-react";
import Logo from "../shared/svg/Logo";
import LogoFlat from "../shared/svg/LogoFlat";
import { usePathname } from "next/navigation";
import getRootPath from "@/app/utils/getRootPath";
import useSoftSession from "@/app/hooks/useSoftSession";

function PrimaryNavigation() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const toggleMobileNavigation = () => setMobileNavigationOpen((prev) => !prev);
  const pathName = usePathname();
  const rootPathName = getRootPath(pathName);
  const { isAuthenticated, dashboardHref } = useSoftSession();

  const lgLinks = new Set([0, 1, 2, 3, 4, 5, 6]);
  const mdLinks = new Set([0, 1, 2, 7]);

  const authActions = isAuthenticated ? (
    <>
      <Link href={dashboardHref} className="w-full max-w-[200px] mx-auto">
        <Button size="large" type="primary" className="lg:h-[55px] lg:px-6">
          Dashboard
        </Button>
      </Link>
    </>
  ) : (
    <>
      <Link href={"/auth/login"} className="w-full max-w-[200px] mx-auto">
        <Button size="large" className="lg:h-[55px] lg:px-6">
          Login
        </Button>
      </Link>
      <Link href={"/auth/signup"} className="w-full max-w-[200px] mx-auto">
        <Button size="large" className="lg:h-[55px] lg:px-6" type="primary">
          Sign up
        </Button>
      </Link>
    </>
  );

  const mobileAuthActions = isAuthenticated ? (
    <Link href={dashboardHref} className="w-[90%] mx-auto">
      <Button block size="large" type="primary" className="text-sm h-[48px]">
        Dashboard
      </Button>
    </Link>
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
        <Link href={"/"} className="mr-4">
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

        <ul className="hidden md:flex">
          {primaryLinks.map((link, linkIndex) =>
            link.subMenu ? (
              <li
                key={v4()}
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
                            {item.name}
                          </Button>
                        </Link>
                      ),
                      key: v4(),
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
                key={v4()}
                className={`${!lgLinks.has(linkIndex) ? "lg:hidden" : ""} ${
                  !mdLinks.has(linkIndex) ? "md:hidden lg:block" : ""
                }`}
              >
                <Link className="flex" href={link.href} tabIndex={-1}>
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
                    {link.name}
                  </Button>
                </Link>
              </li>
            )
          )}
        </ul>
        <div className="auth-buttons hidden md:flex gap-4 ml-auto">{authActions}</div>

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
            className={`h-full ml-auto w-1/2 min-w-[188px] p-4 md:hidden z-50 bg-white flex flex-col transition-transform ${
              mobileNavigationOpen ? "translate-x-0" : "translate-x-1/2"
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
                link.subMenu ? (
                  <li key={v4()} className="flex py-2 last:hidden">
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: link.subMenu.map((item) => ({
                          label: (
                            <Link href={item.href}>
                              <Button size="large" block type="text">
                                {item.name}
                              </Button>
                            </Link>
                          ),
                          key: v4(),
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
                  <li key={v4()} className="last:hidden">
                    <Link className="flex" href={link.href} tabIndex={-1}>
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
                        {link.name}
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
