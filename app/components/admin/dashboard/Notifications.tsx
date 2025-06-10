import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
} from "@/app/redux/admin-features/notificationSlice";
import { AdminNotification } from "@/app/redux/types";
import formatNumber from "@/app/utils/formatNumber";
import { Button, Pagination, Popover } from "antd";
import {
  CloseSquare,
  DocumentText1,
  DocumentUpload,
  NotificationBing,
  Profile2User,
} from "iconsax-react";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const isAdmin = ["admin", "super-admin"].includes(userDetails?.role);
  const { notifications } = useAppSelector((state) => state.adminNotification);
  const isUnread = notifications.some((n) => !n.read);
  const unreadCount = notifications.filter((m) => !m.read).length;

  useEffect(() => {
    if (!isAdmin) return;
    dispatch(getNotifications());
  }, [isAdmin]);

  return (
    <Popover
      open={open}
      content={
        <NotificationsContent
          open={open}
          setOpen={setOpen}
          notifications={notifications}
        />
      }
      trigger="click"
      onOpenChange={(newOpen) => setOpen(newOpen)}
      overlayInnerStyle={{
        padding: 0,
        width: 400,
        maxWidth: "100%",
        border: "1px solid #D0D5DD",
      }}
    >
      <Button type="text" className="p-1 relative">
        <NotificationBing
          size={24}
          variant={open ? "Bold" : "Linear"}
          className={open ? "text-brand-500" : "text-gray-700"}
        />
        {isUnread && (
          <div className="absolute -top-1 -right-2 min-w-4 h-4 bg-error-500 rounded-full grid place-content-center px-1">
            <span className="text-white text-[10px] font-semibold">{unreadCount}</span>
          </div>
        )}
      </Button>
    </Popover>
  );
}

type NotificationsContentProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: AdminNotification[];
};
function NotificationsContent({
  open,
  setOpen,
  notifications,
}: NotificationsContentProps) {
  const [mode, setMode] = useState<"all" | "unread">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => (mode === "unread" ? !n.read : true));
  }, [notifications, mode, currentPage]);

  const pageFilteredNotifications = useMemo(() => {
    const startingPage = (currentPage - 1) * pageSize;
    const endingPage = startingPage + pageSize;
    return filteredNotifications.slice(startingPage, endingPage);
  }, [filteredNotifications, currentPage]);

  return (
    <React.Fragment>
      <header className="py-4 md:py-6 px-6 md:px-8 flex justify-between border-b border-gray-300">
        <h2 className="flex items-center gap-2">
          <span className="text-gray-900 text-xl font-semibold leading-[1.5]">
            Notifications
          </span>
          <span className="text-sm bg-gray-100 text-gray-500 font-medium rounded py-1 px-3">
            {formatNumber.limit(notifications.length, 99)}
          </span>
        </h2>

        <button
          className="text-gray-500 hover:text-gray-700 transition-all"
          onClick={() => setOpen(false)}
        >
          <CloseSquare size={24} />
        </button>
      </header>

      <div className="py-3 md:py-4 px-6 md:px-8 flex justify-center border-b border-gray-200">
        <div className="buttons flex gap-2 p-[6px] border border-gray-100 bg-gray-50 rounded-lg w-fit">
          <Button
            type="text"
            className={`font-semibold ${
              mode === "all" ? "!bg-white shadow text-gray-700" : ""
            }`}
            onClick={() => {
              setCurrentPage(1);
              setMode("all");
            }}
          >
            All
          </Button>
          <Button
            type="text"
            className={`font-semibold ${
              mode === "unread" ? "!bg-white shadow text-gray-700" : "text-gray-500"
            }`}
            onClick={() => {
              setCurrentPage(1);
              setMode("unread");
            }}
          >
            Unread
            <span className="text-sm bg-gray-200 text-gray-500 font-medium rounded-full ml-2 px-2">
              {formatNumber.limit(notifications.filter((n) => !n.read).length, 99)}
            </span>
          </Button>
        </div>
      </div>

      {pageFilteredNotifications.length < 0 ? (
        <div className="text-sm my-6 text-gray-500 text-center">Nothing here.</div>
      ) : (
        pageFilteredNotifications.map((n) => (
          <NotificationCard key={v4()} notification={n} />
        ))
      )}

      <div className="notifications-pagination py-3 px-4 grid place-items-center">
        <Pagination
          pageSize={pageSize}
          current={currentPage}
          onChange={(newPage) => setCurrentPage(newPage)}
          total={filteredNotifications.length}
        />
      </div>
    </React.Fragment>
  );
}

type NotificationCardProps = {
  notification: AdminNotification;
};
function NotificationCard({ notification }: NotificationCardProps) {
  const dispatch = useAppDispatch();
  const notificationIconMap: Record<AdminNotification["type"], React.ReactNode> = {
    "result-upload": <DocumentUpload size={24} />,
    verification: <Profile2User size={24} />,
  };
  const defaultIcon = <DocumentText1 size={24} />;
  let markingRead = false;
  let deleting = false;

  function handleNotificationRead() {
    markingRead = true;
    dispatch(markNotificationAsRead(notification._id));
  }

  function handleNotificationDelete() {
    deleting = true;
    dispatch(deleteNotification(notification._id));
  }

  return (
    <article className="py-4 md:py-6 px-6 md:px-8 flex flex-col sm:flex-row gap-4 border-b border-gray-200">
      <div className="notification-icon w-12 h-12 bg-brand-25 text-brand-600 grid place-items-center rounded-lg self-center sm:self-start">
        {notificationIconMap[notification.type] || defaultIcon}
      </div>
      <div className="notification-content flex-1">
        <header className="flex gap-4">
          <h3 className="text-gray-900 flex-1">{notification.body}</h3>
          {!notification.read ? (
            <span className="w-3 h-3 bg-error-500 rounded-full self-center" />
          ) : null}
        </header>

        <time dateTime={notification.createdAt} className="text-sm text-gray-500">
          {moment(notification.createdAt).fromNow()}
        </time>

        <div className="actions flex justify-center sm:justify-start gap-4 mt-2">
          {!notification.read && (
            <Button
              type={"primary"}
              className={`py-1 px-2`}
              onClick={handleNotificationRead}
              loading={markingRead}
            >
              Mark as Read
            </Button>
          )}

          <Button
            type={"text"}
            className={`py-1 px-2 !text-error-600 hover:!bg-error-50`}
            onClick={handleNotificationDelete}
            loading={deleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}
