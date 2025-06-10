import React from "react";
import { SignupUserProvider } from "./SignupUserProvider";

function SignUpLayout({ children }: any) {
  return (
    <React.Fragment>
      <SignupUserProvider>{children}</SignupUserProvider>
    </React.Fragment>
  );
}

export default SignUpLayout;
