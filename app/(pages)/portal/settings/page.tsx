"use client";
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { ArrowRight2, Logout, Trash } from "iconsax-react";
import useLogout from "@/app/hooks/useLogout";
import { getSettingsRoutes } from "@/app/data/portal";
import Link from "next/link";
import DeleteAccountModal from "../../../components/portal/settings/DeleteAccountModal";
import { useAppSelector } from "@/app/hooks/redux";
import { useDispatch } from "react-redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import PremiumAd from "../../../components/portal/ads/PremiumAd";

export default function Settings() {
  const dispatch = useDispatch();
  const logout = useLogout();
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const visibleSettingsRoutes = getSettingsRoutes(userDetails.role);

  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  useEffect(() => {
    if (userState.status.deleteAccount === "fulfilled") {
      dispatch(
        showAlert({
          message: "Account deleted successfully.",
          type: "success",
        })
      );
      logout();
    }
  }, [userState.status.deleteAccount]);

  return (
    <React.Fragment>
      <header className="mb-2 md:hidden">
        <h2 className="font-league text-display-sm text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Settings
        </h2>
      </header>
      <div className="grid">
        <div id="settings-routes" className="mt-4 mb-6">
          {visibleSettingsRoutes.map((route, index) => (
            <React.Fragment key={route.route}>
              <Link href={route.route} tabIndex={-1}>
                <Button
                  type="text"
                  size="large"
                  className="flex justify-between items-center py-0 h-12 text-gray-500 hover:text-gray-700"
                  block
                >
                  <span>{route.name}</span>
                  <ArrowRight2 size={16} />
                </Button>
              </Link>
              {index < visibleSettingsRoutes.length - 1 && (
                <hr className="border-gray-200 md:border-gray-300" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div id="settings-actions" className="grid gap-1 mb-8">
          <Button
            type="text"
            size="large"
            className="flex gap-2 items-center py-0 text-gray-500 hover:text-gray-700 font-medium"
            block
            onClick={logout}
          >
            <Logout size={18} />
            <span>Logout</span>
          </Button>
          <Button
            type="text"
            size="large"
            className="flex gap-2 items-center py-0  text-error-500 hover:!text-white hover:!bg-error-600 font-medium"
            block
            onClick={() => setDeleteAccountModalOpen(true)}
          >
            <Trash size={18} variant="Bold" />
            <span>Delete Account</span>
          </Button>
          <DeleteAccountModal
            open={deleteAccountModalOpen}
            setOpen={setDeleteAccountModalOpen}
          />
        </div>

        <div className="md:hidden">
          <PremiumAd />
        </div>
      </div>
    </React.Fragment>
  );
}
