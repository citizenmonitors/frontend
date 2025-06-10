import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { validateSession } from "../redux/features/userSlice";
import { showAlert } from "../redux/features/alertSlice";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import useLogout from "./useLogout";
import { cookieData } from "../data/cookieData";

type sessionValidateOptions = {
  success?: {
    redirect: string;
    alert: {
      message: string;
      type: "success" | "error" | "warning" | "info";
    }
  }
  reject?: {
    redirect: string;
    alert: {
      message: string;
      type: "success" | "error" | "warning" | "info";
    }
  }
}

export default function useSessionValidate(options?: sessionValidateOptions) {
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const logout = useLogout();
  const router = useRouter();
  const providedOptions = options;

  useEffect(() => {
    dispatch(validateSession());
  }, []);

  useEffect(() => {
    const status = userState.status.validateSession;

    if (status === 'fulfilled') {
      if (providedOptions) {
        if (options.success) {
          dispatch(showAlert(options.success.alert));
          router.replace(options.success.redirect);
        }
      }
    }

    if (status === 'rejected') {
      if (providedOptions) {
        if (options.reject) {
          dispatch(showAlert(options.reject.alert));
          router.replace(options.reject.redirect);
        }
      } else if (Cookies.get(cookieData.login.name)) {
        dispatch(showAlert({
          message: "Session expired. Please log in.",
          type: "warning"
        }));
        logout();
      } else {
        dispatch(showAlert({
          message: "Please log in.",
          type: "warning"
        }));
        router.replace("/auth/login");
      }
    }

  }, [userState.status.validateSession]);
}