import Image from "next/image";
import Link from "next/link";
import React from "react";
import AppStoreDownload from "@/public/assets/app-store-download.svg";
import PlayStoreDownload from "@/public/assets/play-store-download.svg";
import { email, socials } from "@/app/data/links";
import Logo from "../shared/svg/Logo";
import { topLinks } from "@/app/data/navigation";

const exploreLinks = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/#about" },
  { name: "Collation", href: "/collation" },
  { name: "Pulse", href: "/pulse" },
];

const learnLinks = [
  { name: "Insights", href: "/insights" },
  { name: "Press", href: "/press" },
  { name: "Resources", href: "/resources" },
  { name: "Donate", href: "/donate" },
];

function Footer() {
  const [emailName, emailDomain] = email.split("@");

  return (
    <div className="footer-container bg-brand-900 text-white">
      <footer className="mx-auto w-full max-w-[1180px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
          <header className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="inline-flex items-center">
              <Logo size={48} mode="light" />
            </Link>
            <h2 className="mt-4 font-league text-xl font-semibold leading-snug md:text-2xl">
              Crowdsourcing Electoral Data For Public Good.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              Track collation, share Pulse updates, and keep a public record of
              what happens at the polling unit.
            </p>
          </header>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 lg:col-span-5"
          >
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-200">
                Explore
              </p>
              <ul className="grid gap-2">
                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-200">
                Learn
              </p>
              <ul className="grid gap-2">
                {learnLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-200">
                Info
              </p>
              <ul className="grid gap-2">
                {topLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <section className="md:col-span-12 lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-200">
              Contact
            </p>
            <p className="mt-3 text-sm text-white/80">
              Reach us at{" "}
              <Link
                href={`mailto:${email}`}
                className="font-medium text-brand-200 underline underline-offset-2 hover:text-white"
              >
                {emailName}
                <span>@</span>
                {emailDomain}
              </Link>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Image src={AppStoreDownload} alt="Download on the App Store" />
              <Image src={PlayStoreDownload} alt="Get it on Google Play" />
            </div>
          </section>
        </div>

        <section className="mt-10 flex flex-col items-center justify-between gap-5 rounded-xl bg-brand-800 px-5 py-4 sm:flex-row sm:px-6 md:mt-12">
          <ul className="flex gap-2">
            {socials.map((social) => (
              <li key={social.name}>
                <Link
                  href={social.href}
                  className="grid h-9 w-9 place-items-center rounded-full bg-brand-900 transition-colors hover:bg-brand-700"
                  aria-label={social.name}
                >
                  <Image src={social.icon} alt="" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-center text-sm text-white/70">
            ©{new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">Citizen Monitors.</span>{" "}
            All rights reserved.
          </p>
        </section>
      </footer>
    </div>
  );
}

export default Footer;
