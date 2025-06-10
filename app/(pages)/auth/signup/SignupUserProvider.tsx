"use client";
import { User } from "@/app/redux/types";
import React, { useState } from "react";

type SignupUserContextType = {
  currentUser: Partial<User>;
  updateCurrentUser: (user: Partial<User>) => void;
};
export const SignupUserContext = React.createContext<SignupUserContextType>({
  currentUser: {},
  updateCurrentUser: () => {},
});

export const SignupUserProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  function updateCurrentUser(user: Partial<User>) {
    setCurrentUser({
      ...currentUser,
      ...user,
    });
  }

  return (
    <SignupUserContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </SignupUserContext.Provider>
  );
};
