"use client";
import LogoFlat from "@/app/components/shared/svg/LogoFlat";
import { Button } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const tabs = [
  { name: "Newsletter", href: "/newsletter" },
  { name: "News & Insight", href: "/newsletter/news-insights" },
];

export default function NewsletterShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  async function logout() {
    setLeaving(true);
    await fetch("/api/newsletter/logout", { method: "POST" }).catch(() => null);
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/newsletter" className="flex items-center" aria-label="Newsletter home">
            <LogoFlat size={28} />
          </Link>
          <nav className="order-3 flex w-full gap-1 sm:order-none sm:w-auto">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    active ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:inline">{username}</span>
            <Button onClick={logout} loading={leaving}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
}
