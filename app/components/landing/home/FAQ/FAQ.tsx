import React from "react";
import FAQCollapse from "./FAQCollapse";
import { SmsEdit } from "iconsax-react";
import { email } from "@/app/data/links";
import Link from "next/link";
import "./FAQ.css";


function FAQ() {
  return (
    <div id="faq" className="faq-container">
      <section className="container py-8 md:py-[60px] lg:px-16 xl:px-24">
        <header className="mb-4 sm:mb-8 md:mb-10">
          <h2 className="font-league font-bold text-brand-500 text-display-sm sm:text-display-base md:text-display-lg text-center">
            FAQ<span className="text-gray-700">.</span>
          </h2>
          <p className="text-gray-500 text-center sm:text-lg md:text-xl">
            Have questions? We're here to help
          </p>
        </header>
        <FAQCollapse />
        <div className="faq-contact mt-12 sm:mt-8 md:mt-10 grid text-gray-500">
          <h3 className="font-semibold md:text-xl text-gray-700 text-center mb-1">
            Still have questions?
          </h3>
          <p className="md:text-xl text-center mb-8">Reach out to us via mail.</p>
          <div className="[--size:42px] md:[--size:52px] h-[var(--size)] w-[var(--size)] rounded-full bg-brand-25 grid-center mx-auto mb-4">
            <SmsEdit size={24} className="text-brand-500" variant="Linear" />
          </div>
          <h3 className="font-semibold md:text-xl text-gray-700 text-center mb-1">
            Email
          </h3>
          <p className="text-sm md:text-base text-center mb-2 md:mb-4">
            We're always ready to help.
          </p>

          <Link
            href={`mailto:${email}`}
            className="text-sm md:text-base text-center mx-auto font-medium text-brand-500 hover:underline transition-colors"
            target="_blank"
          >
            {email}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default FAQ;
