import { User } from "@/app/redux/types";
import formatString from "@/app/utils/formatString";
import getUserRole from "@/app/utils/getUserRole";
import { Profile } from "iconsax-react";
import Image from "next/image";
import React from "react";
import RoleTag from "./RoleTag";

type UserProfileCardProps = {
  user: Pick<
    User,
    "firstName" | "lastName" | "profileImage" | "role" | "pendingObserverVerification"
  >;
};

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div id="user-profile-card" className="flex items-center gap-3 mb-4">
      <div className="user-card-profile h-[32px] w-[32px] md:h-[44px] md:w-[44px] grid place-content-center rounded-full bg-gradient-to-b from-brand-600 to-brand-500 text-white">
        {user.profileImage ? (
          <Image
            src={user.profileImage.url}
            alt={user.firstName[0] + user.lastName[0]}
            width={44}
            height={44}
            className="rounded-full w-full h-full"
          />
        ) : (
          <Profile size={24} />
        )}
      </div>
      <div className="user-card-info hidden md:flex flex-col">
        <span className="text-gray-700 font-medium flex gap-1">
          {formatString.normalCase([user.firstName, user.lastName])}{" "}
          {getUserRole(user).icon}
        </span>
        <RoleTag
          role={user.role}
          options={{
            pendingObserverVerification: user.pendingObserverVerification,
          }}
        />
      </div>
    </div>
  );
}
