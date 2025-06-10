import { useAppSelector } from "@/app/hooks/redux";
import { Button } from "antd";
import {
  ArrowRight,
  DocumentText,
  DocumentText1,
  Notification1,
  NotificationBing,
  NotificationStatus,
} from "iconsax-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";

const dummyData = {
  events: [
    {
      title: "145 Pending Approvals for Taraba State.",
      createdAt: Date.now(),
      type: "presidential",
    },
    {
      title: "1 result uploaded from Alimosho LGA.",
      createdAt: Date.now() - 35 * 60 * 1000,
      type: "lagos-state-gubernatorial",
    },
    {
      title: "5 Results uploaded for Lagos State.",
      createdAt: Date.now() - 60 * 60 * 1000,
      type: "presidential",
    },
  ],
};
export default function ActivityNotifications() {
  const router = useRouter();
  const activityState = useAppSelector((state) => state.activity);
  const activityNotifications = activityState.activityNotifications;
  function viewPollingUnitUploads() {
    router.push("/portal/polling-unit-uploads");
  }

  return (
    <div className="py-4 md:p-4 flex flex-col h-full">
      <header className="flex items-center gap-2 mb-4">
        <NotificationStatus variant="Bold" className="text-bluegray-600" size={20} />
        <h3 className="text-sm text-gray-700 md:text-lg">Notifications</h3>
      </header>

      {activityNotifications.length ? (
        <ul className="flex flex-col gap-4 mb-4 flex-1 max-h-[225px] overflow-y-scroll">
          {activityNotifications.map((noti, index) => (
            <li className="relative flex gap-2" key={index}>
              <div className="grid rounded-full w-9 h-9 bg-brand-500 place-items-center">
                <DocumentText1 className="text-white" size={20} />
              </div>

              <div className="flex flex-col gap-1">
                <header className="text-gray-700 leading-[1.1]">{noti.body}</header>
                <div className="flex flex-col text-sm text-gray-500">
                  <span className="font-medium">{noti.info}</span>
                  <span>{moment(noti.createdAt).fromNow()}</span>
                </div>
              </div>
              <div className="w-[1px] bg-brand-300 h-[calc(100%-42px)] absolute top-[42px] left-[18px]" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="w-full flex flex-col justify-center items-center flex-1">
          <NotificationBing size={64} variant="TwoTone" className="text-brand-600" />
          <h3 className="font-league font-medium text-center text-gray-500 mt-2">
            You currently have no notifications
          </h3>
        </div>
      )}

      <Button
        size="large"
        block
        className="flex items-center justify-center gap-1"
        onClick={viewPollingUnitUploads}
      >
        View Your Polling Unit Results
        <ArrowRight size={18} />
      </Button>
    </div>
  );
}
