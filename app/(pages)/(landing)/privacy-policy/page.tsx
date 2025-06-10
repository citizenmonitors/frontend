import LandingLayout from "@/app/components/landing/_layout";
import { ListItem, privacyPolicy } from "@/app/data/landing";
import { ArrowRight2 } from "iconsax-react";
import Link from "next/link";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <LandingLayout>
      <div className="container py-6 md:py-10 lg:py-12" id="privacy-policy">
      <header className="flex items-center gap-1 text-sm sticky lg:static top-[88px] md:top-[73px] bg-white z-20 py-2 md:hidden mb-4 text-gray-700 px-[2px]">
        <Link href={"/"}>Home</Link>
        <ArrowRight2 size={18} className="text-brand-500" />
        <Link href={`/privacy-policy`} className="text-brand-500">
          Privacy Policy
        </Link>
      </header>

        <header className="text-display-sm lg:text-display-lg font-league text-center leading-tight tracking-tight font-bold mb-4 md:mb-8 lg:text-left uppercase">
          <h1 className="text-brand-500">PRIVACY POLICY:</h1>
        </header>

        <section>
          {privacyPolicy.map((item, itemIndex) => {
            const isParagraphSection = typeof item.content[0] === "string";

            return (
              <article className="mb-10" key={item.title}>
                <h2 className="font-league font-semibold text-[20px] text-gray-700 mb-4">
                  {item.title}
                </h2>
                {isParagraphSection ? (
                  item.content.map((paragraph, paragraphIndex) => (
                    <p
                      key={paragraphIndex}
                      className="text-sm lg:text-base text-gray-500"
                      dangerouslySetInnerHTML={{ __html: paragraph as string }}
                    />
                  ))
                ) : (
                  <ul className="text-sm lg:text-base text-gray-500 flex flex-col gap-4">
                    {item.content.map((subItem, subItemIndex) => (
                      <li key={subItemIndex}>
                        <span className="font-semibold text-gray-700">
                          {itemIndex + 1}.{subItemIndex + 1}{" "}
                          {(subItem as ListItem).title &&
                            (subItem as ListItem).title + " :"}
                        </span>{" "}
                        {(subItem as ListItem).description}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
          <p className="text-sm lg:text-base text-gray-500">
            By using the Citizen Monitors platform, you consent to the collection, use,
            and processing of your data as described in this Privacy Policy.
          </p>
        </section>
      </div>
    </LandingLayout>
  );
}
