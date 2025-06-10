"use client";
import RegisteredUsers from "@/app/components/admin/users/graphs/RegisteredUsers";
import UserInfo from "@/app/components/admin/users/graphs/UserInfo";
import UsersDisplay from "@/app/components/admin/users/UsersDisplay";
import React from "react";

export default function Users() {
  return (
    <div>
      <header className="flex gap-3 md:items-center mb-1 md:mb-2">
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Users
        </h2>
      </header>

      <div id="first-row" className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-5 md:mb-7">
        <RegisteredUsers />
        <UserInfo />
      </div>

      <UsersDisplay />
    </div>
  );
}
