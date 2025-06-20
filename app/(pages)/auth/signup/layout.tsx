import React from "react";
import { SignupUserProvider } from "./SignupUserProvider";
import { Metadata } from "next";
import { signupMetadata } from "@/app/metadata";

export const metadata: Metadata = signupMetadata;

function SignUpLayout({ children }: any) {
  return (
    <React.Fragment>
      <SignupUserProvider>{children}</SignupUserProvider>
    </React.Fragment>
  );
}

export default SignUpLayout;
