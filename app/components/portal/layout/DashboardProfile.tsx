"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useLogout from "@/app/hooks/useLogout";
import formatString from "@/app/utils/formatString";
import getUserRole from "@/app/utils/getUserRole";
import { Button, Dropdown } from "antd";
import useToken from "antd/es/theme/useToken";
import { Logout, Messages1, Profile, Setting2 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import TruncateTooltip from "../../shared/TruncateTooltip";
import RoleTag from "../../shared/RoleTag";
import { getPodcasts } from "@/app/redux/features/inboxSlice";

const DashboardProfile = () => {
  const router = useRouter();
  const logout = useLogout();
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const inboxState = useAppSelector((state) => state.inbox);
  const isUnreadMessages = inboxState.podcasts.some((m) => !m.read);
  const unreadCount = inboxState.podcasts.filter((m) => !m.read).length;

  const isAdmin = ["admin", "super-admin"].includes(userDetails.role);
  const baseURL = isAdmin ? "/admin" : "/portal";

  const dropdownItems = [
    {
      key: "profile",
      label: "View Profile",
      icon: <Profile size={20} />,
      onClick: () => router.push(`${baseURL}/settings/profile`),
    },
    ...(!isAdmin
      ? [
          {
            key: "inbox",
            label: (
              <div className="w-full flex justify-between items-center gap-2">
                Inbox
                {isUnreadMessages && (
                  <div className="min-w-4 h-4 bg-error-500 rounded-full grid place-content-center px-1">
                    <span className="text-white text-[10px] font-semibold">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
            ),
            icon: <Messages1 size={20} />,
            onClick: () => router.push(`${baseURL}/inbox`),
          },
        ]
      : []),
    {
      key: "settings",
      label: "Settings",
      icon: <Setting2 size={20} />,
      onClick: () => router.push(`${baseURL}/settings`),
    },
    {
      key: "logout",
      label: "Logout",
      icon: <Logout size={20} />,
      danger: true,
      onClick: () => {
        logout();
      },
    },
  ];

  const [_, token] = useToken();
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    padding: token.paddingXS,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPodcasts());
  }, []);


  return (
    <>
      <Dropdown
        menu={{ items: dropdownItems }}
        arrow
        placement="bottomRight"
        dropdownRender={(menu) => (
          <div style={contentStyle}>
            <div className="user-card-info flex flex-col p-2">
              <span className="text-gray-700 font-medium flex gap-1">
                {formatString.normalCase([userDetails.firstName, userDetails.lastName])}{" "}
              </span>
              <span className="text-sm text-gray-500">{userDetails.email}</span>
              <span className="mt-1 -ml-1">
                <RoleTag
                  role={userDetails.role}
                  options={{
                    pendingObserverVerification: userDetails.pendingObserverVerification,
                  }}
                />
              </span>
            </div>
            {!["observer", "admin", "super-admin"].includes(userDetails.role) && (
              <>
                <hr className="my-2" />
                <Link href={"/portal/settings/verify"}>
                  <Button
                    type="primary"
                    block
                    size="middle"
                    className="!text-sm min-w-[180px]"
                  >
                    Upgrade Account
                  </Button>
                </Link>
              </>
            )}
            <hr className="my-2" />
            {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
          </div>
        )}
      >
        <div className="user-card flex items-center gap-2 cursor-pointer relative">
        {isUnreadMessages && !isAdmin && (
            <div className="absolute -top-1 -right-2.5 w-2 h-2 bg-error-500 rounded-full grid place-content-center px-1"/>
          )}
          <div className="user-card-profile h-[32px] w-[32px] md:h-[44px] md:w-[44px] grid place-content-center rounded-full bg-gradient-to-b from-brand-600 to-brand-500 text-white">
            
            {userDetails.profileImage ? (
              <Image
                src={userDetails.profileImage.url}
                alt={userDetails.firstName[0] + userDetails.lastName[0]}
                width={44}
                height={44}
                className="rounded-full w-full h-full"
              />
            ) : (
              <Profile size={24} />
            )}
          </div>
          <div className="user-card-info flex flex-col">
            <span className="text-gray-700 font-medium flex items-center gap-1">
              <TruncateTooltip length={10}>
                {formatString.normalCase([userDetails.firstName])}
              </TruncateTooltip>
              {getUserRole(userDetails).icon}
            </span>
            <span
              className={`text-sm ${
                userDetails.role === "super-admin" ? "text-brand-500" : "text-gray-500"
              }`}
            >
              {getUserRole(userDetails).name}
            </span>
          </div>
        </div>
      </Dropdown>
    </>
  );
};

export default DashboardProfile;
