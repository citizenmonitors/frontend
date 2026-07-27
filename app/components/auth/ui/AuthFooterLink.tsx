import Link from "next/link";
import React from "react";

type AuthFooterLinkProps = {
  prompt: string;
  linkText: string;
  href: string;
};

export default function AuthFooterLink({ prompt, linkText, href }: AuthFooterLinkProps) {
  return (
    <p className="text-sm text-gray-500 text-center mt-6">
      {prompt}{" "}
      <Link href={href} className="font-medium text-brand-500 hover:text-brand-600 hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
