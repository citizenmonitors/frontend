import React from "react";
import ProgressBar from "@/app/components/auth/signup/ProgressBar";
import SuggestionPopup from "@/app/components/shared/SuggestionPopup";
import { resourceVideos } from "@/app/components/landing/resources/data";


type SignupFormLayoutProps = {
  title: string;
  children: React.ReactNode;
};
export default function SignupFormLayout({ title, children }: SignupFormLayoutProps) {
  return (
    <React.Fragment>
      <h2 className="font-league font-semibold text-gray-700 text-xl md:text-[32px] mb-3 md:mb-4 text-center">
        {title}
      </h2>
      <ProgressBar />
      <p className="max-w-[640px] text-xs md:text-sm text-brand-500 text-center mb-6 md:mb-8">
        Please note: Once you proceed to the next stage, changes cannot be reversed,
        restarting will be required for changes.
      </p>
      {children}
    </React.Fragment>
  );
}
