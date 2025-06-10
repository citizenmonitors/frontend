"use client";
import { Alert } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import AlertIcon from "../components/shared/AlertIcon";
import { Add } from "iconsax-react";
import { clearAlert } from "../redux/features/alertSlice";

function GlobalAlertProvider({ children }: any) {
  const dispatch = useAppDispatch();
  const alertState = useAppSelector((state) => state.alert);

  const [visible, setVisible] = useState<boolean>(false);
  const [alertTimeoutID, setAlertTimeoutID] = useState<NodeJS.Timeout | undefined>();

  const [alertProps, setAlertProps] = useState({
    message: alertState.message,
    type: alertState.type,
  });

  useEffect(() => {
    if (alertState.message) {
      const alertTimeout = Math.min(7000, Math.max(2000, alertState.message.length * 50));

      setVisible(false);
      clearTimeout(alertTimeoutID);

      requestAnimationFrame(() => {
        setAlertProps({
          message: alertState.message,
          type: alertState.type,
        });
        setVisible(true);
        const newAlertTimeoutID = setTimeout(() => {
          setVisible(false);
          dispatch(clearAlert());
        }, alertTimeout);
        setAlertTimeoutID(newAlertTimeoutID);
      });
    }
  }, [alertState.id]);

  const alertStyles: Record<typeof alertState.type, any> = {
    error: {
      "--alert-color": "#B42318",
      "--alert-border-color": "#FDA29B",
      "--alert-bg-color": "#FFFBFA",
    },
    success: {
      "--alert-color": "#027A48",
      "--alert-border-color": "#6CE9A6",
      "--alert-bg-color": "#F6FEF9",
    },
    info: {
      "--alert-color": "#344054",
      "--alert-border-color": "#D0D5DD",
      "--alert-bg-color": "#FCFCFD",
    },
    warning: {
      "--alert-color": "#B54708",
      "--alert-border-color": "#FEC848",
      "--alert-bg-color": "#FFFCF5",
    },
  };

  return (
    <React.Fragment>
      <Alert
        {...alertProps}
        showIcon
        closable
        icon={
          <span className="p-1">
            <AlertIcon type={alertState.type} />
          </span>
        }
        closeIcon={<Add className="rotate-45" />}
        afterClose={() => setVisible(false)}
        style={alertStyles[alertState.type]}
        className={`fixed top-0 left-1/2 -translate-x-1/2 duration-300 transition-all gap-2 font-semibold border-none bg-[var(--alert-bg-color)] ring-1 ring-[var(--alert-border-color)] text-[var(--alert-color)] rounded-[12px] w-[calc(100%-48px)] md:w-auto items-center z-[9999] ${
          visible ? "translate-y-3 opacity-100" : "-translate-y-16 opacity-0"
        }`}
      />
      {children}
    </React.Fragment>
  );
}

export default GlobalAlertProvider;
