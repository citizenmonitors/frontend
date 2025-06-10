import { Button, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AppStoreDownload from "@/public/assets/app-store-download.svg";
import PlayStoreDownload from "@/public/assets/play-store-download.svg";
import { Sms } from "iconsax-react";
import { email, socials } from "@/app/data/links";
import Logo from "../shared/svg/Logo";
import { primaryLinks } from "@/app/data/navigation";

function Footer() {
  const [emailName, emailDomain] = email.split("@");
  return (
    <div className="footer-container bg-brand-900 text-white grid-center">
      <footer className="container py-8 lg:py-10">
        <div className="footer-content flex flex-col lg:flex-row gap-8">
          <header className="lg:max-w-[450px] text-center lg:text-left">
            <h2 className="font-league font-semibold text-lg md:text-display-sm leading-tight mb-3">
              Crowdsourcing Electoral Data For Public Good.
            </h2>
            <ul className="flex flex-row flex-wrap justify-center lg:justify-start gap-4 mt-6 mb-3 md:mb-0">
              {primaryLinks.map((link) => (
                <li className="grid" key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 py-1 sm:py-2 px-4 md:pl-0"
                    style={{
                      opacity: link.comingSoon ? 0.5 : 1,
                      pointerEvents: link.comingSoon ? "none" : undefined,
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </header>
          <section className="lg:ml-auto">
            {/* TODO: Add subscription <form className="flex flex-col lg:flex-row mb-8 gap-3 items-center">
              <label htmlFor="subscribe-input" className="sr-only">
                Subscribe
              </label>
              <Input
                type="email"
                size="large"
                id="subscribe-input"
                placeholder="Email Address"
                prefix={<Sms size={20} className="text-gray-500 mr-1" />}
              />
              <Button
                type="primary"
                size="large"
                className="bg-brand-700 hover:!bg-brand-600 w-fit"
              >
                Subscribe
              </Button>
            </form> */}
            <p className="text-sm text-center lg:text-right">
              Reach out to us:{" "}
              <Link
                href={`mailto:${email}`}
                className="text-brand-200 underline hover:text-brand-400 transition-colors"
              >
                {emailName}
                <span className="text-brand-200">@</span>
                {emailDomain}
              </Link>
            </p>
            <div className="app-links flex gap-3 justify-center mt-6 lg:justify-end">
              <Image src={AppStoreDownload} alt="download on the app store" />
              <Image src={PlayStoreDownload} alt="download on the play store" />
            </div>
          </section>
        </div>
        <section className="bg-brand-800 rounded-lg flex flex-col lg:flex-row lg:justify-between items-center gap-6 mt-8 md:mt-16 px-4 py-5 lg:px-10">
          <ul className="footer-socials flex gap-2">
            {socials.map((social) => (
              <li key={social.name}>
                <Link
                  href={social.href}
                  className="h-8 w-8 bg-brand-900 rounded-full grid place-items-center hover:bg-brand-700 transition-colors"
                >
                  <Image src={social.icon} alt={social.name} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="text-sm md:text-base text-center flex flex-col lg:flex-row gap-1">
            <p>
              ©2024 <span className="font-semibold">Citizen Monitors.</span>
            </p>
            <p>All Rights Reserved.</p>
          </div>
          <span className="block xl:hidden">
            <Logo size={44} mode="light" />
          </span>
          <span className="hidden xl:block">
            <Logo size={60} mode="light" />
          </span>
        </section>
      </footer>
    </div>
  );
}

export default Footer;
