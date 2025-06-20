import React from "react";
import { Metadata } from "next";
import { loginMetadata } from "@/app/metadata";

export const metadata: Metadata = loginMetadata;

function LoginLayout({ children }: any) {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}

export default LoginLayout;
