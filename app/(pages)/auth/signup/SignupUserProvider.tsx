"use client";
import { readSignupDraft } from "@/app/data/signupDraft";
import { User } from "@/app/redux/types";
import React, { useEffect, useState } from "react";

type SignupUserContextType = {
  currentUser: Partial<User>;
  updateCurrentUser: (user: Partial<User>) => void;
};

export const SignupUserContext = React.createContext<SignupUserContextType>({
  currentUser: {},
  updateCurrentUser: () => {},
});

export const SignupUserProvider = ({ children }: any) => {
  // Always start empty on server and client to avoid hydration mismatch.
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});

  useEffect(() => {
    const draft = readSignupDraft();
    if (!draft) return;

    setCurrentUser((prev) => ({
      ...prev,
      ...(draft.email && !prev.email ? { email: draft.email } : {}),
      ...(draft.firstName && !prev.firstName ? { firstName: draft.firstName } : {}),
      ...(draft.lastName && !prev.lastName ? { lastName: draft.lastName } : {}),
    }));
  }, []);

  function updateCurrentUser(user: Partial<User>) {
    setCurrentUser((prev) => ({
      ...prev,
      ...user,
    }));
  }

  return (
    <SignupUserContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </SignupUserContext.Provider>
  );
};
